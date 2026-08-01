// Extras: crossword, translator (EN/ES→Vietnamese), AI tutor chat.
"use strict";

/* ================= Crossword ================= */
let xw = null;

function xwCandidates(){
  const pool = State.data.introduced.map(id => VOCAB_BY_ID[id]).filter(Boolean);
  const src = pool.length >= 12 ? pool : VOCAB.filter(v => v.lv === "A1" || v.lv === "A2");
  const seen = new Set();
  const out = [];
  for (const v of shuffle(src)){
    if (v.vi.includes("?")) continue;
    const ans = Speech.norm(v.vi).replace(/\s/g, "").toUpperCase(); // tone-free, no spaces
    if (ans.length < 3 || ans.length > 10 || seen.has(ans) || !/^[A-Z]+$/.test(ans)) continue;
    seen.add(ans);
    out.push({ ans, clue: tr(v), vi: v.vi });
  }
  return out;
}

function buildCrossword(){
  const SIZE = 21;
  const cands = xwCandidates().sort((a, b) => b.ans.length - a.ans.length);
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
  const grid = {}, starts = {};
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
    <button class="back" onclick="go('home')">← ${L("Home","Inicio")}</button>
    <h1>🧩 ${L("Crossword","Crucigrama")}</h1>
    <p class="sub">${L("Vietnamese words (no tones needed), clues in your language.","Palabras vietnamitas (sin tonos), pistas en tu idioma.")} (${doneCount}/${xw.words.length})</p>
    <div class="xwgrid" style="--cols:${xw.cols}">${gridHtml}</div>
    ${doneCount === xw.words.length
      ? `<div class="fbx good center"><b>🎉 ${L("Puzzle complete!","¡Crucigrama completo!")} +20 XP</b></div>
         <button class="btn big" onclick="viewCrossword(true)">${L("New puzzle","Nuevo")} 🔁</button>`
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
      <p class="sub">${act.num} ${act.dir === "across" ? "→" : "↓"}: <b>${esc(act.clue)}</b> (${act.ans.length} ${L("letters","letras")})</p>
      <input id="xwin" class="tin" autocomplete="off" autocapitalize="off" placeholder="…">
      <button class="btn big" onclick="xwCheck()">${L("Check","Comprobar")}</button>
      <button class="btn ghost small" onclick="xwReveal()">${L("Show answer","Ver respuesta")}</button>
      <div id="xwfb"></div>
    </div>` : ""}
    <button class="btn ghost" onclick="viewCrossword(true)">${L("New puzzle","Nuevo")} 🔁</button>`}
  </div>${navBar()}`;
  const inp = document.getElementById("xwin");
  if (inp) inp.onkeydown = e => { if (e.key === "Enter") xwCheck(); };
}

function xwPick(i){
  if (xw.words[i].done) return;
  xw.active = i; viewCrossword();
  const inp = document.getElementById("xwin"); if (inp) inp.focus();
}
function xwNextOpen(){ const i = xw.words.findIndex(w => !w.done); if (i >= 0) xw.active = i; }

function xwCheck(){
  const w = xw.words[xw.active];
  const guess = Speech.norm(document.getElementById("xwin").value || "").replace(/\s/g, "").toUpperCase();
  if (!guess) return;
  if (guess === w.ans){
    w.done = true;
    State.addXP(4); State.touchStreak();
    if (xw.words.every(x => x.done)) State.addXP(20);
    State.save();
    Speech.say(w.vi);
    xwNextOpen(); viewCrossword();
  } else {
    document.getElementById("xwfb").innerHTML =
      `<p class="sub">❌ ${L("Not quite — try again!","¡Casi! Inténtalo de nuevo.")} (${L("starts with","empieza con")} <b>${w.ans[0]}</b>)</p>`;
  }
}
function xwReveal(){
  const w = xw.words[xw.active];
  w.done = true; State.save();
  Speech.say(w.vi);
  xwNextOpen(); viewCrossword();
}

/* ================= Translator ================= */
let trBusy = false;

function viewTranslate(){
  const hasRec = Speech.hasRecognition();
  const srcName = L("English","español");
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← ${L("Home","Inicio")}</button>
    <h1>🔄 ${L("Say it in Vietnamese","Dilo en vietnamita")}</h1>
    <p class="sub">${L("Say or type something — hear it in Vietnamese, then practice saying it.",
      "Di o escribe algo — escúchalo en vietnamita y practica decirlo.")}</p>
    <div class="card center">
      ${hasRec ? `<button class="btn big rec" id="tr-mic" onclick="trListen()">🎙️ ${L("Speak English","Habla español")}</button>
      <p class="sub">${L("or type it:","o escríbelo:")}</p>` : ""}
      <input id="tr-in" class="tin" placeholder="${L("e.g. Where is the market?","p. ej. ¿Dónde está el mercado?")}">
      <button class="btn big" onclick="trGo()">${L("Translate","Traducir")} →</button>
      <div id="tr-out"></div>
    </div>
    <p class="sub center">${L("Free translation by MyMemory · needs internet","Traducción gratuita de MyMemory · necesita internet")}</p>
  </div>${navBar()}`;
  const inp = document.getElementById("tr-in");
  inp.onkeydown = e => { if (e.key === "Enter") trGo(); };
}

function trListen(){
  const btn = document.getElementById("tr-mic");
  btn.textContent = "👂 " + L("Listening…","Escuchando…"); btn.classList.add("live");
  const lang = State.data.lang === "es" ? "es-ES" : "en-US";
  Speech.listen(alts => {
    btn.classList.remove("live"); btn.textContent = "🎙️ " + L("Speak English","Habla español");
    document.getElementById("tr-in").value = alts[0] || "";
    trGo();
  }, () => {
    btn.classList.remove("live"); btn.textContent = "🎙️ " + L("Speak English","Habla español");
    document.getElementById("tr-out").innerHTML = `<p class="sub">${L("I didn't catch that — try again!","No lo capté — inténtalo de nuevo.")}</p>`;
  }, lang);
}

async function trGo(){
  if (trBusy) return;
  const text = (document.getElementById("tr-in").value || "").trim();
  if (!text) return;
  const out = document.getElementById("tr-out");
  out.innerHTML = `<p class="sub">${L("Translating…","Traduciendo…")}</p>`;
  trBusy = true;
  const src = State.data.lang === "es" ? "es" : "en";
  try {
    const res = await fetch("https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) + "&langpair=" + src + "|vi");
    const data = await res.json();
    const vi = (data.responseData && data.responseData.translatedText || "").trim();
    if (!vi) throw new Error("empty");
    State.addXP(2); State.touchStreak(); State.save();
    out.innerHTML = `
      <div class="fbx good">
        <p class="es big-es" id="tr-vi">${esc(vi)}</p>
        <p class="sub">“${esc(text)}”</p>
        <div class="speakrow">
          <button class="btn" onclick="Speech.say(document.getElementById('tr-vi').textContent)">🔊 ${L("Listen","Escucha")}</button>
          <button class="btn" onclick="Speech.say(document.getElementById('tr-vi').textContent, 0.6)">🐢 ${L("Slow","Lento")}</button>
        </div>
        ${Speech.hasRecognition() ? `<button class="btn big rec" id="tr-say" onclick="trPractice()">🎙️ ${L("Now you say it","Ahora dilo tú")}</button>` : ""}
        <div id="tr-score"></div>
      </div>`;
    Speech.say(vi);
  } catch(e){
    out.innerHTML = `<p class="sub">😕 ${L("Translation didn't work — check your internet and try again.","La traducción falló — revisa tu internet e inténtalo de nuevo.")}</p>`;
  }
  trBusy = false;
}

function trPractice(){
  const target = document.getElementById("tr-vi").textContent;
  const btn = document.getElementById("tr-say");
  btn.textContent = "👂 " + L("Listening…","Escuchando…"); btn.classList.add("live");
  Speech.listen(alts => {
    btn.classList.remove("live"); btn.textContent = "🎙️ " + L("Try again","Otra vez");
    const res = Speech.compare(target, alts);
    const pct = Math.round(res.score * 100);
    if (res.score >= 0.6){ State.addXP(5); State.save(); }
    document.getElementById("tr-score").innerHTML = `
      <b>${pct >= 99 ? "🌟 " + L("Perfect!","¡Perfecto!") : "👍 " + pct + "%"}</b>
      <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p>`;
  }, () => {
    btn.classList.remove("live"); btn.textContent = "🎙️ " + L("Try again","Otra vez");
    document.getElementById("tr-score").innerHTML = `<p class="sub">${L("Didn't catch it — try again!","No lo capté — inténtalo de nuevo.")}</p>`;
  });
}

/* ================= AI Tutor ================= */
const AI_KEY_STORE = "tiengviet_api_key";
function aiSystem(){
  const helpLang = State.data.lang === "es" ? "Spanish" : "English";
  return `You are Mai, a warm and playful Vietnamese tutor inside a learning app.
Your student is a beginner (level A1-A2) whose help language is ${helpLang}.
Rules:
- Reply mostly in simple Vietnamese (A1-A2: short sentences, common words, Northern/Hanoi standard).
- After each Vietnamese sentence, add the ${helpLang} translation in parentheses.
- Keep replies SHORT: 2 to 3 sentences, then ask one simple question back to keep the chat going.
- If the student makes a mistake, gently correct it: show the wrong part, the right form, and a one-line ${helpLang} explanation.
- Stay encouraging and fun. Use an emoji now and then.
- Talk about everyday topics: food, family, travel, work, feelings, plans.`;
}

let aiMessages = [];
let aiBusy = false;
function aiKey(){ return localStorage.getItem(AI_KEY_STORE) || ""; }

function aiGreeting(){
  return L("Xin chào! 👋 Tôi là Mai. (Hi! I'm Mai.)<br>Hôm nay bạn thế nào? (How are you today?)",
           "Xin chào! 👋 Tôi là Mai. (¡Hola! Soy Mai.)<br>Hôm nay bạn thế nào? (¿Cómo estás hoy?)");
}

function viewAI(){
  if (!aiKey()) return viewAISetup();
  APP.innerHTML = `<div class="screen aichat">
    <div class="top">
      <button class="back" onclick="go('home')">← ${L("Home","Inicio")}</button>
      <button class="gear" title="Key" onclick="aiForgetKey()">🔑</button>
    </div>
    <h1>🤖 ${L("Chat with Mai","Chatea con Mai")}</h1>
    <p class="sub">${L("Your AI Vietnamese tutor — she corrects you and keeps the chat going. Uses your own AI key.",
      "Tu tutora de vietnamita con IA — te corrige y mantiene la conversación. Usa tu propia clave de IA.")}</p>
    <div id="ai-log" class="ailog"></div>
    <div class="airow">
      ${Speech.hasRecognition() ? `<button class="btn rec" id="ai-mic" onclick="aiListen()">🎙️</button>` : ""}
      <input id="ai-in" class="tin" placeholder="${L("Write in Vietnamese…","Escribe en vietnamita…")}" autocomplete="off">
      <button class="btn" id="ai-send" onclick="aiSend()">➤</button>
    </div>
  </div>${navBar()}`;
  renderAILog();
  const inp = document.getElementById("ai-in");
  inp.onkeydown = e => { if (e.key === "Enter") aiSend(); };
}

function viewAISetup(){
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← ${L("Home","Inicio")}</button>
    <h1>🤖 ${L("AI Tutor setup","Configurar tutor IA")}</h1>
    <div class="card">
      <p>${L("The AI tutor is powered by Claude and needs your own AI key — a kind of personal password that connects the app to the AI. It costs a few cents per conversation, paid to Anthropic, not to this app.",
        "El tutor con IA funciona con Claude y necesita tu propia clave de IA — una especie de contraseña personal que conecta la app con la IA. Cuesta unos céntimos por conversación, se paga a Anthropic, no a esta app.")}</p>
      <p><b>${L("One-time setup:","Configuración única:")}</b></p>
      <p class="sub">${L("1. Go to console.anthropic.com and create an account<br>2. Add a small credit (e.g. $5 — lasts a long time)<br>3. Create an API key and copy it (starts with sk-ant-)<br>4. Paste it below — saved only on this device",
        "1. Ve a console.anthropic.com y crea una cuenta<br>2. Añade un pequeño crédito (p. ej. $5 — dura mucho)<br>3. Crea una clave API y cópiala (empieza con sk-ant-)<br>4. Pégala abajo — se guarda solo en este dispositivo")}</p>
      <input id="ai-key-in" class="tin" placeholder="sk-ant-…" autocomplete="off">
      <button class="btn big" onclick="aiSaveKey()">${L("Save key","Guardar clave")}</button>
      <p class="sub" id="ai-key-fb"></p>
    </div>
  </div>${navBar()}`;
}

function aiSaveKey(){
  const k = (document.getElementById("ai-key-in").value || "").trim();
  if (!k.startsWith("sk-ant-")){
    document.getElementById("ai-key-fb").textContent =
      L("Hmm — the key should start with sk-ant-. Copy it again from console.anthropic.com.",
        "Mmm — la clave debe empezar con sk-ant-. Cópiala de nuevo desde console.anthropic.com.");
    return;
  }
  localStorage.setItem(AI_KEY_STORE, k);
  viewAI();
}
function aiForgetKey(){
  if (confirm(L("Remove your AI key from this device?","¿Quitar tu clave de IA de este dispositivo?"))){
    localStorage.removeItem(AI_KEY_STORE);
    aiMessages = [];
    viewAISetup();
  }
}

function renderAILog(){
  const log = document.getElementById("ai-log");
  if (!log) return;
  log.innerHTML = `<div class="aib bot">${aiGreeting()}</div>` +
    aiMessages.map(m => m.role === "user"
      ? `<div class="aib me">${esc(m.content)}</div>`
      : `<div class="aib bot">${esc(m.content).replace(/\n/g, "<br>")}
           <button class="say" onclick="aiSay(this)">🔊</button></div>`).join("") +
    (aiBusy ? `<div class="aib bot thinking">…</div>` : "");
  log.scrollTop = log.scrollHeight;
}
function aiSay(btn){
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
  aiBusy = true; renderAILog();
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
        system: aiSystem(),
        messages: aiMessages.slice(-20)
      })
    });
    const data = await res.json();
    if (!res.ok){
      const msg = res.status === 401
        ? L("Your AI key doesn't seem to work — tap 🔑 above to enter it again.",
            "Tu clave de IA no funciona — toca 🔑 arriba para introducirla de nuevo.")
        : (data.error && data.error.message) || L("Something went wrong — try again.","Algo salió mal — inténtalo de nuevo.");
      throw new Error(msg);
    }
    const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    aiMessages.push({ role: "assistant", content: reply || "…" });
    State.addXP(3); State.touchStreak(); State.save();
  } catch(e){
    aiMessages.push({ role: "assistant", content: "😕 " + (e.message || L("No connection — check your internet.","Sin conexión — revisa tu internet.")) });
  }
  aiBusy = false; renderAILog();
}
