// Hands-free speaking tutor: put the phone down, it prompts you to say a
// sentence, listens, tells you what to fix, and auto-advances A1 → B2.
"use strict";

const TALK = { running: false, seq: 0, rec: null, queue: [], drill: null, attempt: 0, noHear: 0,
               right: 0, wrong: 0, xpStart: 0, mode: "think", missWords: {}, lastTricky: [], level: "auto" };
const TALK_BANDS = ["A1", "A2", "B1", "B2"];
// Slower for easier levels; speeds up as she climbs toward B2 over the weeks.
const TALK_RATE = { A1: 0.68, A2: 0.76, B1: 0.85, B2: 0.92 };

// Keep the screen awake so Android doesn't suspend the microphone when you
// put the phone down. Wake locks drop when the page is hidden, so re-acquire
// on return.
let talkWakeLock = null;
async function talkAcquireWake(){
  try { if ("wakeLock" in navigator) talkWakeLock = await navigator.wakeLock.request("screen"); } catch(e){}
}
function talkReleaseWake(){
  try { if (talkWakeLock){ talkWakeLock.release(); talkWakeLock = null; } } catch(e){}
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && TALK.running && !talkWakeLock) talkAcquireWake();
});

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
    u.rate = rate || 0.9;
    u.pitch = lang.indexOf("es") === 0 ? 1.08 : 1;
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
function talkSetLevel(l){
  TALK.level = l;
  State.data.speakLevel = l;
  State.save();
  viewTalk();
}

function viewTalk(){
  if (!TALK.level) TALK.level = State.data.speakLevel || "auto";
  const band = TALK_BANDS[State.data.speakBand || 0];
  const mastered = DRILLS.filter(d => (State.data.items[d.id] || {}).ivl >= 3).length;
  const sel = TALK.level;
  const levels = ["auto", "A1", "A2", "B1", "B2"];
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>🗣️ Hands-free speaking tutor</h1>
    <div class="card">
      <p><b>Put your phone down and just talk.</b> I say a sentence, you say it back in Spanish,
      and I help you fix it — no tapping. Lots of repetition, and it only speeds up once you've really got it.</p>
      <p class="sub">Auto level now: <b>${band}</b> · ${mastered} sentences mastered</p>
    </div>
    <div class="card">
      <h3>Choose your level</h3>
      <div class="levelrow">
        ${levels.map(l => `<button class="levelchip ${sel === l ? "on" : ""}" onclick="talkSetLevel('${l}')">${l === "auto" ? "Auto ✨" : l}</button>`).join("")}
      </div>
      <p class="sub">${sel === "auto"
        ? "Auto starts easy (A1) and moves up to B2 only when you've mastered each level — with lots of easier review mixed in."
        : "Locked to <b>" + sel + "</b> — you'll stay here (with a little easier review) until you switch."}</p>
    </div>
    <div class="card">
      <h3>How to practise</h3>
      <p class="sub">🧠 <b>Think mode</b> — I ask in English, you say it in Spanish yourself.</p>
      <button class="btn big rec" onclick="talkStart('think')">🧠 Think in Spanish</button>
      <p class="sub">🔁 <b>Repeat mode</b> — see &amp; hear the Spanish, then say it. Best for starting out.</p>
      <button class="btn big ghost" onclick="talkStart('repeat')">🔁 See &amp; repeat</button>
    </div>
    <p class="sub center">Works best in Chrome on Android. Tap <b>Allow</b> for the microphone. The screen stays awake, so set the phone down. Tap <b>Stop</b> anytime.</p>
  </div>${navBar()}`;
}

/* ---------- Session control ---------- */
function talkStart(mode){
  TALK.mode = mode || TALK.mode || "think";
  TALK.level = TALK.level || State.data.speakLevel || "auto";
  TALK.running = true;
  TALK.seq++;
  talkAcquireWake();
  TALK.right = 0; TALK.wrong = 0; TALK.xpStart = State.data.xp; TALK.missWords = {};
  TALK.queue = talkBuildQueue();
  talkNext();
}

// Which levels this session draws from, and the "new-words" target level.
function talkBands(){
  const lvl = TALK.level || "auto";
  if (lvl === "auto"){
    const max = State.data.speakBand || 0;
    return { bands: TALK_BANDS.slice(0, max + 1), target: TALK_BANDS[max] };
  }
  const i = TALK_BANDS.indexOf(lvl);
  return { bands: i > 0 ? [TALK_BANDS[i - 1], lvl] : [lvl], target: lvl };
}

function talkBuildQueue(){
  const t = todayNum();
  const { bands, target } = talkBands();
  // Review-heavy: due sentences within the chosen band(s) come first...
  const due = Object.keys(State.data.items)
    .filter(id => id.startsWith("d") && State.data.items[id].due <= t)
    .map(id => DRILL_BY_ID[id]).filter(d => d && bands.indexOf(d.lv) >= 0);
  // ...plus only a few genuinely new sentences from the target level.
  const fresh = DRILLS.filter(d => d.lv === target && !State.data.items[d.id]).slice(0, 4);
  // A little easier-level review so it keeps circling back to simpler things.
  const easier = shuffle(DRILLS.filter(d => bands.indexOf(d.lv) >= 0 && bands.indexOf(d.lv) < bands.length - 1
    && State.data.items[d.id])).slice(0, 4);
  const q = shuffle([...sample(due, 12), ...easier, ...fresh]);
  return q.length ? q : shuffle(DRILLS.filter(d => d.lv === target)).slice(0, 8);
}

function talkStop(){
  TALK.running = false;
  TALK.seq++;
  talkReleaseWake();
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

// Gentle A1→B2 progression: only move up once you've truly MASTERED most of the
// current band (got them right several times, ivl>=3) — not just seen them.
// A locked level never auto-advances.
function talkAdvanceBand(){
  if ((TALK.level || "auto") !== "auto") return;
  let b = State.data.speakBand || 0;
  if (b >= 3) return;
  const cur = DRILLS.filter(d => d.lv === TALK_BANDS[b]);
  const mastered = cur.filter(d => (State.data.items[d.id] || {}).ivl >= 3).length;
  if (mastered / cur.length >= 0.8){ State.data.speakBand = b + 1; State.save(); }
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

  // Speak the cue, then start listening. Easier levels are read more slowly.
  const r = TALK_RATE[d.lv] || 0.85;
  talkStatus("🔊 Speaking…", "");
  if (show){
    // Repeat mode: say it slowly twice so she can really hear it before repeating.
    talkSpeak(d.es, "es-ES", () => {
      if (TALK.seq !== mySeq) return;
      talkSpeak(d.es, "es-ES", () => { if (TALK.seq === mySeq) talkListen(); }, r);
    }, r);
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
    if (err === "not-allowed" || err === "service-not-allowed"){
      talkStatus("🚫 Please allow the microphone, then press Start again.", "bad");
      TALK.running = false;
      talkReleaseWake();
      return;
    }
    // Transient (silence, screen sleep/wake, brief network) — keep the loop
    // alive by re-listening a few times before offering a one-tap resume.
    TALK.noHear++;
    if (TALK.noHear <= 4){
      talkStatus("👂 Still listening… say it now", "live");
      setTimeout(() => { if (TALK.seq === mySeq && TALK.running) talkListen(); }, 500);
      return;
    }
    talkStatus("Paused — tap to keep going.", "");
    document.getElementById("talk-fb").innerHTML =
      `<button class="btn big rec" onclick="TALK.noHear=0;talkAcquireWake();talkListen()">🎙️ Resume</button>
       <button class="btn ghost" onclick="talkNext()">Next sentence →</button>`;
  });
}

function talkGrade(alts){
  const d = TALK.drill;
  const res = Speech.compare(d.es, alts);
  const pct = Math.round(res.score * 100);
  const heard = alts[0] || "";
  const mySeq = TALK.seq;

  // Remember every word that slipped — even on a pass — for end-of-lesson coaching.
  const origWords = d.es.split(/\s+/).map(w => w.replace(/[¿?¡!.,;:]/g, ""));
  res.words.forEach((w, i) => {
    if (!w.ok){
      const e = TALK.missWords[w.w] || (TALK.missWords[w.w] = { count: 0, word: origWords[i] || w.w });
      e.count++;
    }
  });

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

function talkSayTricky(){
  if (TALK.lastTricky.length) talkSpeak(TALK.lastTricky.join(", "), "es-ES", null, 0.62);
}

function talkEnd(stopped){
  TALK.running = false;
  talkReleaseWake();
  const earned = State.data.xp - TALK.xpStart;
  // Words to practise: the ones missed most this session (small slips included).
  let tricky = Object.values(TALK.missWords).sort((a, b) => b.count - a.count);
  tricky = (tricky.filter(e => e.count >= 2).length ? tricky.filter(e => e.count >= 2) : tricky).slice(0, 6);
  TALK.lastTricky = tricky.map(e => e.word);

  APP.innerHTML = `<div class="screen center">
    <div class="hero">🗣️</div>
    <h1>${stopped ? "Session ended" : "¡Bien hecho!"}</h1>
    <div class="tiles">
      <div class="tile"><b>${TALK.right}</b><span>said well</span></div>
      <div class="tile"><b>+${earned}</b><span>XP</span></div>
      <div class="tile"><b>${TALK_BANDS[State.data.speakBand || 0]}</b><span>level</span></div>
    </div>
    ${TALK.lastTricky.length ? `<div class="card">
      <h3>🎯 Words to practise</h3>
      <p class="sub">These tripped you up a little. Here they are — tap to hear them slowly and repeat each one.</p>
      <p class="wordchips">${TALK.lastTricky.map(w => `<span class="miss">${esc(w)}</span>`).join(" ")}</p>
      <button class="btn" onclick="talkSayTricky()">🔊 Say them slowly</button>
    </div>` : `<p class="sub center">✨ No trouble words this time — lovely and clear!</p>`}
    <p class="sub center">Come back tomorrow — the sentences you found hard will return until they feel easy.</p>
    <button class="btn big rec" onclick="talkStart()">▶️ Keep going</button>
    <button class="btn big ghost" onclick="go('home')">Done for now</button>
  </div>${navBar()}`;
  if (TALK.lastTricky.length) setTimeout(talkSayTricky, 700);
}
