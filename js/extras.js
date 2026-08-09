// Extras: crossword, English→Spanish translator, AI tutor chat.
"use strict";

/* ================= Crossword ================= */
let xw = null;

function xwCandidates(){
  // Draw from a broad pool (A1–B1) so puzzles vary a lot; single-word answers only.
  const src = VOCAB.filter(v => v.lv === "A1" || v.lv === "A2" || v.lv === "B1");
  const seen = new Set();
  const out = [];
  for (const v of shuffle(src)){
    const bare = v.es.replace(/^(el|la|los|las|un|una)\s+/i, "").split(/[\s,\/]/)[0];
    const ans = Speech.norm(bare).replace(/\s/g, "").toUpperCase();
    if (ans.length < 3 || ans.length > 11 || seen.has(ans) || !/^[A-Z]+$/.test(ans)) continue;
    seen.add(ans);
    out.push({ ans, clue: v.en, es: v.es });
  }
  return out;
}

function buildCrossword(){
  const SIZE = 21;
  // Randomly pick a subset each time (then sort for placement) so every puzzle differs.
  const cands = sample(xwCandidates(), 18).sort((a, b) => b.ans.length - a.ans.length);
  const cells = {};
  const words = [];
  const key = (r, c) => r + "," + c;

  const canPlace = (ans, r, c, dir) => {
    const dr = dir === "down" ? 1 : 0, dc = dir === "across" ? 1 : 0;
    if (r < 0 || c < 0 || r + dr * (ans.length - 1) >= SIZE || c + dc * (ans.length - 1) >= SIZE) return false;
    if (cells[key(r - dr, c - dc)] || cells[key(r + dr * ans.length, c + dc * ans.length)]) return false;
    let crosses = 0;
    for (let i = 0; i < ans.length; i++){
      const rr = r + dr * i, cc = c + dc * i;
      const ex = cells[key(rr, cc)];
      if (ex){
        if (ex !== ans[i]) return false;
        crosses++;
      } else {
        if (dir === "across" && (cells[key(rr - 1, cc)] || cells[key(rr + 1, cc)])) return false;
        if (dir === "down" && (cells[key(rr, cc - 1)] || cells[key(rr, cc + 1)])) return false;
      }
    }
    return words.length === 0 || crosses > 0;
  };

  const put = (w, r, c, dir) => {
    const dr = dir === "down" ? 1 : 0, dc = dir === "across" ? 1 : 0;
    for (let i = 0; i < w.ans.length; i++) cells[key(r + dr * i, c + dc * i)] = w.ans[i];
    words.push({ ...w, r, c, dir, done: false });
  };

  for (const w of cands){
    if (words.length >= 8) break;
    if (!words.length){
      put(w, Math.floor(SIZE / 2), Math.floor((SIZE - w.ans.length) / 2), "across");
      continue;
    }
    let spot = null;
    outer:
    for (const p of shuffle(words)){
      const pdr = p.dir === "down" ? 1 : 0, pdc = p.dir === "across" ? 1 : 0;
      for (let i = 0; i < p.ans.length; i++){
        for (let j = 0; j < w.ans.length; j++){
          if (p.ans[i] !== w.ans[j]) continue;
          const rr = p.r + pdr * i, cc = p.c + pdc * i;
          const dir = p.dir === "across" ? "down" : "across";
          const r = dir === "down" ? rr - j : rr;
          const c = dir === "across" ? cc - j : cc;
          if (canPlace(w.ans, r, c, dir)){ spot = { r, c, dir }; break outer; }
        }
      }
    }
    if (spot) put(w, spot.r, spot.c, spot.dir);
  }

  // Crop to bounding box and number the words.
  let rMin = 99, rMax = 0, cMin = 99, cMax = 0;
  for (const k in cells){
    const [r, c] = k.split(",").map(Number);
    rMin = Math.min(rMin, r); rMax = Math.max(rMax, r);
    cMin = Math.min(cMin, c); cMax = Math.max(cMax, c);
  }
  for (const w of words){ w.r -= rMin; w.c -= cMin; }
  const rows = rMax - rMin + 1, cols = cMax - cMin + 1;
  words.sort((a, b) => a.r - b.r || a.c - b.c);
  let n = 0;
  const numAt = {};
  for (const w of words){
    const k = w.r + "," + w.c;
    w.num = numAt[k] || (numAt[k] = ++n);
  }
  xw = { words, rows, cols, active: 0 };
}

function xwSolvedCells(){
  const s = {};
  for (const w of xw.words){
    if (!w.done) continue;
    const dr = w.dir === "down" ? 1 : 0, dc = w.dir === "across" ? 1 : 0;
    for (let i = 0; i < w.ans.length; i++) s[(w.r + dr * i) + "," + (w.c + dc * i)] = w.ans[i];
  }
  return s;
}

function viewCrossword(fresh){
  if (!xw || fresh === true) buildCrossword();
  const grid = {};
  const starts = {};
  for (const w of xw.words){
    const dr = w.dir === "down" ? 1 : 0, dc = w.dir === "across" ? 1 : 0;
    for (let i = 0; i < w.ans.length; i++) grid[(w.r + dr * i) + "," + (w.c + dc * i)] = true;
    const sk = w.r + "," + w.c;
    if (!starts[sk]) starts[sk] = w.num;
  }
  const solved = xwSolvedCells();
  const act = xw.words[xw.active];
  const actCells = new Set();
  if (act && !act.done){
    const dr = act.dir === "down" ? 1 : 0, dc = act.dir === "across" ? 1 : 0;
    for (let i = 0; i < act.ans.length; i++) actCells.add((act.r + dr * i) + "," + (act.c + dc * i));
  }
  const doneCount = xw.words.filter(w => w.done).length;

  let gridHtml = "";
  for (let r = 0; r < xw.rows; r++){
    for (let c = 0; c < xw.cols; c++){
      const k = r + "," + c;
      if (!grid[k]){ gridHtml += `<div class="xwcell empty"></div>`; continue; }
      gridHtml += `<div class="xwcell ${solved[k] ? "solved" : ""} ${actCells.has(k) ? "active" : ""}">
        ${starts[k] ? `<i>${starts[k]}</i>` : ""}${solved[k] || ""}</div>`;
    }
  }

  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>🧩 Crossword</h1>
    <p class="sub">Spanish words, English clues — all words you've learned. (${doneCount}/${xw.words.length})</p>
    <div class="xwgrid" style="--cols:${xw.cols}">${gridHtml}</div>
    ${doneCount === xw.words.length
      ? `<div class="fbx good center"><b>🎉 ¡Crucigrama completo! +20 XP</b></div>
         <button class="btn big" onclick="viewCrossword(true)">New puzzle 🔁</button>`
      : `
    <div class="card">
      ${xw.words.map((w, i) => `
        <button class="cluerow ${w.done ? "done" : ""} ${i === xw.active ? "on" : ""}" onclick="xwPick(${i})">
          <b>${w.num} ${w.dir === "across" ? "→" : "↓"}</b> ${esc(w.clue)} <span class="sub">(${w.ans.length})</span>
          ${w.done ? " ✅" : ""}
        </button>`).join("")}
    </div>
    ${act && !act.done ? `
    <div class="card center">
      <p class="sub">${act.num} ${act.dir === "across" ? "→ across" : "↓ down"}: <b>${esc(act.clue)}</b> (${act.ans.length} letters)</p>
      <input id="xwin" class="tin" autocomplete="off" autocapitalize="off" placeholder="…">
      <div class="accents"><button onclick="document.getElementById('xwin').value+='ñ';document.getElementById('xwin').focus()">ñ</button></div>
      <button class="btn big" onclick="xwCheck()">Check</button>
      <button class="btn ghost small" onclick="xwReveal()">Show answer</button>
      <div id="xwfb"></div>
    </div>` : ""}
    <button class="btn ghost" onclick="viewCrossword(true)">New puzzle 🔁</button>`}
  </div>${navBar()}`;
  const inp = document.getElementById("xwin");
  if (inp) inp.onkeydown = e => { if (e.key === "Enter") xwCheck(); };
}

function xwPick(i){
  if (xw.words[i].done) return;
  xw.active = i;
  viewCrossword();
  const inp = document.getElementById("xwin");
  if (inp) inp.focus();
}

function xwNextOpen(){
  const i = xw.words.findIndex(w => !w.done);
  if (i >= 0) xw.active = i;
}

function xwCheck(){
  const w = xw.words[xw.active];
  const guess = Speech.norm(document.getElementById("xwin").value || "").replace(/\s/g, "").toUpperCase();
  if (!guess) return;
  if (guess === w.ans){
    w.done = true;
    State.addXP(4); State.touchStreak();
    if (xw.words.every(x => x.done)) State.addXP(20);
    State.save();
    Speech.say(w.es);
    xwNextOpen();
    viewCrossword();
  } else {
    const fb = document.getElementById("xwfb");
    fb.innerHTML = `<p class="sub">❌ Not quite — try again! (Hint: it starts with <b>${w.ans[0]}</b>)</p>`;
  }
}

function xwReveal(){
  const w = xw.words[xw.active];
  w.done = true;
  State.save();
  Speech.say(w.es);
  xwNextOpen();
  viewCrossword();
}

/* ================= Translator ================= */
let trBusy = false;

function viewTranslate(){
  const hasRec = Speech.hasRecognition();
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>🔄 Say it in Spanish</h1>
    <p class="sub">Say or type something in English — hear how a Spaniard would say it, then practice saying it yourself.</p>
    <div class="card center">
      ${hasRec ? `<button class="btn big rec" id="tr-mic" onclick="trListen()">🎙️ Speak English</button>
      <p class="sub">or type it:</p>` : ""}
      <input id="tr-in" class="tin" placeholder="e.g. Where is the beach?">
      <button class="btn big" onclick="trGo()">Translate →</button>
      <div id="tr-out"></div>
    </div>
    <p class="sub center">Free translation by MyMemory · needs internet</p>
  </div>${navBar()}`;
  const inp = document.getElementById("tr-in");
  inp.onkeydown = e => { if (e.key === "Enter") trGo(); };
}

function trListen(){
  const btn = document.getElementById("tr-mic");
  btn.textContent = "👂 Listening…";
  btn.classList.add("live");
  Speech.listen(alts => {
    btn.classList.remove("live");
    btn.textContent = "🎙️ Speak English";
    document.getElementById("tr-in").value = alts[0] || "";
    trGo();
  }, () => {
    btn.classList.remove("live");
    btn.textContent = "🎙️ Speak English";
    document.getElementById("tr-out").innerHTML = `<p class="sub">I didn't catch that — try again!</p>`;
  }, "en-US");
}

async function trGo(){
  if (trBusy) return;
  const text = (document.getElementById("tr-in").value || "").trim();
  if (!text) return;
  const out = document.getElementById("tr-out");
  out.innerHTML = `<p class="sub">Translating…</p>`;
  trBusy = true;
  try {
    const res = await fetch("https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) + "&langpair=en|es");
    const data = await res.json();
    const es = (data.responseData && data.responseData.translatedText || "").trim();
    if (!es) throw new Error("empty");
    State.addXP(2); State.touchStreak(); State.save();
    out.innerHTML = `
      <div class="fbx good">
        <p class="es big-es" id="tr-es">${esc(es)}</p>
        <p class="sub">“${esc(text)}”</p>
        <div class="speakrow">
          <button class="btn" onclick="Speech.say(document.getElementById('tr-es').textContent)">🔊 Listen</button>
          <button class="btn" onclick="Speech.say(document.getElementById('tr-es').textContent, 0.6)">🐢 Slow</button>
        </div>
        ${Speech.hasRecognition() ? `<button class="btn big rec" id="tr-say" onclick="trPractice()">🎙️ Now you say it</button>` : ""}
        <div id="tr-score"></div>
      </div>`;
    Speech.say(es);
  } catch(e){
    out.innerHTML = `<p class="sub">😕 Translation didn't work — check your internet and try again.</p>`;
  }
  trBusy = false;
}

function trPractice(){
  const target = document.getElementById("tr-es").textContent;
  const btn = document.getElementById("tr-say");
  btn.textContent = "👂 Listening…"; btn.classList.add("live");
  Speech.listen(alts => {
    btn.classList.remove("live"); btn.textContent = "🎙️ Try again";
    const res = Speech.compare(target, alts);
    const pct = Math.round(res.score * 100);
    if (res.score >= 0.7){ State.addXP(5); State.save(); }
    document.getElementById("tr-score").innerHTML = `
      <b>${pct >= 99 ? "🌟 ¡Perfecto!" : pct >= 70 ? "👍 " + pct + "%" : "💪 " + pct + "%"}</b>
      <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p>`;
  }, () => {
    btn.classList.remove("live"); btn.textContent = "🎙️ Try again";
    document.getElementById("tr-score").innerHTML = `<p class="sub">Didn't catch it — try again!</p>`;
  });
}

/* ================= AI Tutor ================= */
const AI_KEY_STORE = "espanolita_api_key";
const AI_SYSTEM = `You are Lola, a warm and playful Spanish tutor inside a learning app.
Your student is Sonja, an adult learner at level A2 whose interface language is English.
Rules:
- Reply mostly in simple Spanish (A2 level: present tense, simple past, common words).
- After each Spanish sentence, add the English translation in parentheses.
- Keep replies SHORT: 2 to 4 sentences, then ask her one simple question back to keep the conversation going.
- If she makes a mistake, gently correct it first: show the wrong part, the right form, and a one-line English explanation.
- Stay encouraging and fun. Use an emoji now and then.
- Talk about everyday topics: food, travel, family, music, plans, feelings.`;

let aiMessages = [];
let aiBusy = false;

function aiKey(){ return localStorage.getItem(AI_KEY_STORE) || ""; }

function viewAI(){
  if (!aiKey()) return viewAISetup();
  APP.innerHTML = `<div class="screen aichat">
    <div class="top">
      <button class="back" onclick="go('home')">← Home</button>
      <button class="gear" title="Change key" onclick="aiForgetKey()">🔑</button>
    </div>
    <h1>🤖 Chat with Lola</h1>
    <p class="sub">Your AI Spanish tutor — she corrects you and keeps the chat going. Uses your own AI key.</p>
    <div id="ai-log" class="ailog">
      ${aiMessages.length ? "" : `<div class="aib bot">¡Hola Sonja! 👋 Soy Lola. (Hi Sonja! I'm Lola.)<br>¿Cómo estás hoy? (How are you today?)</div>`}
    </div>
    <div class="airow">
      ${Speech.hasRecognition() ? `<button class="btn rec" id="ai-mic" onclick="aiListen()">🎙️</button>` : ""}
      <input id="ai-in" class="tin" placeholder="Escribe en español…" autocomplete="off">
      <button class="btn" id="ai-send" onclick="aiSend()">➤</button>
    </div>
  </div>${navBar()}`;
  renderAILog();
  const inp = document.getElementById("ai-in");
  inp.onkeydown = e => { if (e.key === "Enter") aiSend(); };
}

function viewAISetup(){
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>🤖 AI Tutor setup</h1>
    <div class="card">
      <p>The AI tutor is powered by Claude and needs your own AI key — a kind of personal password that connects the app to the AI. It costs a few cents per conversation, paid to Anthropic (the AI company), not to this app.</p>
      <p><b>One-time setup:</b></p>
      <p class="sub">1. Go to <b>console.anthropic.com</b> and create an account<br>
      2. Add a small credit (e.g. $5 — lasts a long time)<br>
      3. Create an API key and copy it (it starts with <b>sk-ant-</b>)<br>
      4. Paste it below — it is saved only on this device, never shared</p>
      <input id="ai-key-in" class="tin" placeholder="sk-ant-…" autocomplete="off">
      <button class="btn big" onclick="aiSaveKey()">Save key</button>
      <p class="sub" id="ai-key-fb"></p>
    </div>
  </div>${navBar()}`;
}

function aiSaveKey(){
  const k = (document.getElementById("ai-key-in").value || "").trim();
  if (!k.startsWith("sk-ant-")){
    document.getElementById("ai-key-fb").textContent = "Hmm — the key should start with sk-ant-. Copy it again from console.anthropic.com.";
    return;
  }
  localStorage.setItem(AI_KEY_STORE, k);
  viewAI();
}

function aiForgetKey(){
  if (confirm("Remove your AI key from this device?")){
    localStorage.removeItem(AI_KEY_STORE);
    aiMessages = [];
    viewAISetup();
  }
}

function renderAILog(){
  const log = document.getElementById("ai-log");
  if (!log) return;
  log.innerHTML = `<div class="aib bot">¡Hola Sonja! 👋 Soy Lola. (Hi Sonja! I'm Lola.)<br>¿Cómo estás hoy? (How are you today?)</div>` +
    aiMessages.map(m => m.role === "user"
      ? `<div class="aib me">${esc(m.content)}</div>`
      : `<div class="aib bot">${esc(m.content).replace(/\n/g, "<br>")}
           <button class="say" onclick="aiSay(this)">🔊</button></div>`).join("") +
    (aiBusy ? `<div class="aib bot thinking">…</div>` : "");
  log.scrollTop = log.scrollHeight;
}

function aiSay(btn){
  // Speak only the Spanish: strip the English parts in parentheses.
  const text = btn.parentElement.textContent.replace(/\([^)]*\)/g, "").replace(/🔊/g, "");
  Speech.say(text);
}

function aiListen(){
  const btn = document.getElementById("ai-mic");
  btn.classList.add("live");
  Speech.listen(alts => {
    btn.classList.remove("live");
    document.getElementById("ai-in").value = alts[0] || "";
  }, () => btn.classList.remove("live"));
}

async function aiSend(){
  if (aiBusy) return;
  const inp = document.getElementById("ai-in");
  const text = (inp.value || "").trim();
  if (!text) return;
  inp.value = "";
  aiMessages.push({ role: "user", content: text });
  aiBusy = true;
  renderAILog();
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": aiKey(),
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        system: AI_SYSTEM,
        messages: aiMessages.slice(-20)
      })
    });
    const data = await res.json();
    if (!res.ok){
      const msg = res.status === 401
        ? "Your AI key doesn't seem to work — tap 🔑 above to enter it again."
        : (data.error && data.error.message) || "Something went wrong — try again.";
      throw new Error(msg);
    }
    const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    aiMessages.push({ role: "assistant", content: reply || "…" });
    State.addXP(3); State.touchStreak(); State.save();
  } catch(e){
    aiMessages.push({ role: "assistant", content: "😕 " + (e.message || "No connection — check your internet.") });
  }
  aiBusy = false;
  renderAILog();
}
