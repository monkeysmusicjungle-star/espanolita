// Hands-free speaking tutor: put the phone down, it prompts you to say a
// sentence, listens, tells you what to fix, and auto-advances A1 → B2.
"use strict";

const TALK = { running: false, seq: 0, rec: null, queue: [], drill: null, attempt: 0, noHear: 0,
               right: 0, wrong: 0, xpStart: 0, mode: "think" };
const TALK_BANDS = ["A1", "A2", "B1", "B2"];

// Speak in a given language with a callback when done (with a safety timeout,
// because some phones don't fire 'onend' reliably).
function talkSpeak(text, lang, cb, rate){
  let done = false;
  const finish = () => { if (done) return; done = true; cb && cb(); };
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    if (lang.indexOf("es") === 0 && Speech.voice) u.voice = Speech.voice;
    u.rate = rate || 0.92;
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.speak(u);
    setTimeout(finish, Math.min(12000, 1800 + text.length * 110));
  } catch(e){ finish(); }
}

function talkStatus(msg, cls){
  const el = document.getElementById("talk-status");
  if (el){ el.textContent = msg; el.className = "talkstatus " + (cls || ""); }
}

/* ---------- Intro screen ---------- */
function viewTalk(){
  const band = TALK_BANDS[State.data.speakBand || 0];
  const mastered = DRILLS.filter(d => (State.data.items[d.id] || {}).ivl >= 3).length;
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>🗣️ Hands-free speaking tutor</h1>
    <div class="card">
      <p><b>Put your phone down and just talk.</b> I'll ask you to say a sentence in Spanish,
      listen, and help you fix it — automatically, no tapping. It gets harder as you improve,
      from A1 all the way to B2.</p>
      <p class="sub">Your level now: <b>${band}</b> · ${mastered} sentences mastered</p>
    </div>
    <div class="card">
      <h3>Choose how you practise</h3>
      <p class="sub">🧠 <b>Think mode</b> — I ask in English, you say it in Spanish yourself. Builds real fluency.</p>
      <button class="btn big rec" onclick="talkStart('think')">🧠 Think in Spanish (recommended)</button>
      <p class="sub">🔁 <b>Repeat mode</b> — see the Spanish and say it. Good for new or tricky sentences.</p>
      <button class="btn big ghost" onclick="talkStart('repeat')">🔁 See & repeat</button>
    </div>
    <p class="sub center">Works best in Chrome on Android. When it asks, tap <b>Allow</b> for the microphone. Tap <b>Stop</b> anytime.</p>
  </div>${navBar()}`;
}

/* ---------- Session control ---------- */
function talkStart(mode){
  TALK.mode = mode || TALK.mode || "think";
  TALK.running = true;
  TALK.seq++;
  TALK.right = 0; TALK.wrong = 0; TALK.xpStart = State.data.xp;
  TALK.queue = talkBuildQueue();
  talkNext();
}

function talkBuildQueue(){
  const t = todayNum();
  const due = Object.keys(State.data.items)
    .filter(id => id.startsWith("d") && State.data.items[id].due <= t)
    .map(id => DRILL_BY_ID[id]).filter(Boolean);
  let band = State.data.speakBand || 0;
  const fresh = [];
  while (fresh.length < 8 && band < TALK_BANDS.length){
    const pool = DRILLS.filter(d => d.lv === TALK_BANDS[band] && !State.data.items[d.id]);
    for (const d of pool){ if (fresh.length >= 8) break; fresh.push(d); }
    if (fresh.length < 8) band++;
  }
  const q = shuffle([...sample(due, 12), ...fresh]);
  return q.length ? q : shuffle(DRILLS.filter(d => d.lv === TALK_BANDS[State.data.speakBand || 0])).slice(0, 8);
}

function talkStop(){
  TALK.running = false;
  TALK.seq++;
  try { speechSynthesis.cancel(); } catch(e){}
  try { if (TALK.rec) TALK.rec.abort(); } catch(e){}
  talkEnd(true);
}

function talkNext(){
  if (!TALK.running) return;
  if (!TALK.queue.length) return talkEnd(false);
  TALK.drill = TALK.queue.shift();
  TALK.attempt = 0;
  TALK.noHear = 0;
  SRS.ensure(TALK.drill.id);
  talkAdvanceBand();
  talkPrompt();
}

// A1→B2 progression: move up once ~80% of the current band has been practiced.
function talkAdvanceBand(){
  let b = State.data.speakBand || 0;
  if (b >= 3) return;
  const cur = DRILLS.filter(d => d.lv === TALK_BANDS[b]);
  const seen = cur.filter(d => State.data.items[d.id]).length;
  if (seen / cur.length >= 0.8){ State.data.speakBand = b + 1; State.save(); }
}

/* ---------- One drill ---------- */
function talkPrompt(retry){
  if (!TALK.running) return;
  const d = TALK.drill;
  const show = TALK.mode === "repeat";   // repeat: show Spanish · think: produce from English
  const mySeq = TALK.seq;

  APP.innerHTML = `<div class="screen talk">
    <div class="sessiontop">
      <button class="back" onclick="talkStop()">■ Stop</button>
      <div class="progress"><div style="width:${100 * TALK.right / Math.max(1, TALK.right + TALK.wrong + TALK.queue.length + 1)}%"></div></div>
    </div>
    <p class="sub center">${d.lv} · ${retry ? "Try again" : (show ? "Say this in Spanish" : "How do you say this in Spanish?")}</p>
    <div class="card center">
      ${show
        ? `<p class="es big-es">${esc(d.es)}</p><p class="sub">${esc(d.en)}</p>`
        : `<p class="meaning">${esc(d.en)}</p><p class="sub">🧠 say it in Spanish</p>`}
      <div class="talkmic" id="talk-mic">🎙️</div>
      <p class="talkstatus" id="talk-status">…</p>
      <div id="talk-fb"></div>
    </div>
    <button class="btn ghost" onclick="talkSkip()">Skip →</button>
  </div>${navBar()}`;

  // Speak the cue, then start listening.
  talkStatus("🔊 Speaking…", "");
  if (show){
    talkSpeak(d.es, "es-ES", () => { if (TALK.seq === mySeq) talkListen(); });
  } else {
    talkSpeak("In Spanish, say. " + d.en, "en-US", () => { if (TALK.seq === mySeq) talkListen(); });
  }
}

function talkListen(){
  if (!TALK.running) return;
  const mySeq = TALK.seq;
  const mic = document.getElementById("talk-mic");
  if (mic) mic.classList.add("live");
  talkStatus("👂 Listening… say it now", "live");
  TALK.rec = Speech.listen(alts => {
    if (TALK.seq !== mySeq || !TALK.running) return;
    if (mic) mic.classList.remove("live");
    talkGrade(alts);
  }, err => {
    if (TALK.seq !== mySeq || !TALK.running) return;
    if (mic) mic.classList.remove("live");
    if (err === "not-allowed"){
      talkStatus("🚫 Please allow the microphone, then press Start again.", "bad");
      TALK.running = false;
      return;
    }
    // Didn't hear anything.
    TALK.noHear++;
    if (TALK.noHear >= 2){
      talkStatus("Paused — I couldn't hear you.", "");
      document.getElementById("talk-fb").innerHTML =
        `<button class="btn big" onclick="talkListen()">🎙️ I'm ready, listen again</button>
         <button class="btn ghost" onclick="talkNext()">Next sentence →</button>`;
      return;
    }
    talkSpeak("I didn't hear you. Try again.", "en-US", () => { if (TALK.seq === mySeq) talkListen(); });
  });
}

function talkGrade(alts){
  const d = TALK.drill;
  const res = Speech.compare(d.es, alts);
  const pct = Math.round(res.score * 100);
  const heard = alts[0] || "";
  const mySeq = TALK.seq;

  if (res.score >= 0.6){
    TALK.right++;
    SRS.answer(d.id, true);
    talkAdvanceBand();
    document.getElementById("talk-fb").innerHTML = `<div class="fbx good">
      <b>${pct >= 99 ? "🌟 ¡Perfecto!" : "✅ ¡Muy bien! " + pct + "%"}</b>
      <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p></div>`;
    talkStatus("✅ Correct!", "good");
    talkSpeak("¡Muy bien!", "es-ES", () => { if (TALK.seq === mySeq) talkNext(); });
    return;
  }

  // Wrong: explain which words, replay the model, retry (up to 3 attempts).
  TALK.attempt++;
  const missed = res.words.filter(w => !w.ok).map(w => w.w);
  const tips = talkWordTips(missed);
  document.getElementById("talk-fb").innerHTML = `<div class="fbx bad">
    <b>Almost — ${pct}%</b>
    <p class="sub">I heard: “${esc(heard)}”</p>
    <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p>
    <p class="sub">The sentence: <b>${esc(d.es)}</b></p>
    ${tips ? `<p class="sub">Focus on: ${tips}</p>` : ""}</div>`;

  if (TALK.attempt >= 3){
    TALK.wrong++;
    SRS.answer(d.id, false);
    talkStatus("Let's move on — you'll see this again.", "");
    talkSpeak("La frase es: " + d.es, "es-ES", () => {
      if (TALK.seq === mySeq) talkSpeak("Let's move on.", "en-US", () => { if (TALK.seq === mySeq) talkNext(); });
    }, 0.75);
  } else {
    talkStatus("🔁 Listen and try again", "");
    talkSpeak("Casi. Escucha. " + d.es, "es-ES", () => { if (TALK.seq === mySeq) talkPrompt(true); }, 0.72);
  }
}

// Short explanation for missed words, using the vocab list when possible.
function talkWordTips(missed){
  if (!missed.length) return "";
  const bag = {};
  for (const v of VOCAB){
    const key = Speech.norm(v.es).replace(/^(el|la|los|las)\s/, "");
    bag[key] = v.en;
  }
  const tips = [];
  for (const w of missed.slice(0, 3)){
    tips.push(bag[w] ? `<b>${esc(w)}</b> (${esc(bag[w])})` : `<b>${esc(w)}</b>`);
  }
  return tips.join(", ");
}

function talkSkip(){
  if (!TALK.running) return;
  TALK.wrong++;
  SRS.answer(TALK.drill.id, false);
  TALK.seq++;               // invalidate any pending callbacks
  TALK.running = true;
  try { speechSynthesis.cancel(); } catch(e){}
  try { if (TALK.rec) TALK.rec.abort(); } catch(e){}
  talkNext();
}

function talkEnd(stopped){
  TALK.running = false;
  const earned = State.data.xp - TALK.xpStart;
  const total = TALK.right + TALK.wrong;
  APP.innerHTML = `<div class="screen center">
    <div class="hero">🗣️</div>
    <h1>${stopped ? "Session ended" : "¡Bien hecho!"}</h1>
    <div class="tiles">
      <div class="tile"><b>${TALK.right}</b><span>said well</span></div>
      <div class="tile"><b>+${earned}</b><span>XP</span></div>
      <div class="tile"><b>${TALK_BANDS[State.data.speakBand || 0]}</b><span>level</span></div>
    </div>
    <p class="sub center">Come back tomorrow — the sentences you found hard will return until they feel easy.</p>
    <button class="btn big rec" onclick="talkStart()">▶️ Keep going</button>
    <button class="btn big ghost" onclick="go('home')">Done for now</button>
  </div>${navBar()}`;
}
