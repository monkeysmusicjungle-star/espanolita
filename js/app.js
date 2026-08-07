// ¡Españolita! — main app: views, quizzes, placement, songs.
"use strict";

const $ = sel => document.querySelector(sel);
const APP = $("#app");

const VOCAB_BY_ID = Object.fromEntries(VOCAB.map(v => [v.id, v]));
const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR.map(g => [g.id, g]));

function esc(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function shuffle(a){ a = a.slice(); for (let i = a.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function sample(arr, n){ return shuffle(arr).slice(0, n); }

// English-only interface. L() kept for minimal-diff internal use — nl arg is unused.
function L(en){ return en; }
function tr(v){ return v.en; }
function trEx(v){ return v.exEn; }
function why(g){ return g.wEn; }

/* ---------------- Router ---------------- */
let currentView = "home";
let inPlanFlow = null;
function go(view, arg){
  currentView = view;
  window.scrollTo(0, 0);
  const views = { home: viewHome, practice: () => startSession(), speak: viewSpeak, songs: viewSongs,
                  song: viewSong, addsong: viewAddSong, settings: viewSettings,
                  crossword: viewCrossword, translate: viewTranslate, ai: viewAI, talk: viewTalk,
                  course: viewCourse };
  (views[view] || viewHome)(arg);
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("active", b.dataset.v === view));
}

function navBar(){
  return `<nav class="nav">
    <button data-v="home" onclick="go('home')"><span>🏠</span>Home</button>
    <button data-v="practice" onclick="go('practice')"><span>🎯</span>Practice</button>
    <button data-v="speak" onclick="go('speak')"><span>🎤</span>Speak</button>
    <button data-v="songs" onclick="go('songs')"><span>🎵</span>Songs</button>
  </nav>`;
}

/* ---------------- First run: set straight to A2, no test ---------------- */
function setupA2English(){
  State.data.lang = "en";
  State.data.band = 1; // A2
  // A1 is marked "assumed known" so it still resurfaces for refreshing later.
  VOCAB.filter(v => v.lv === "A1").forEach((v, idx) => {
    State.data.introduced.push(v.id);
    State.data.items[v.id] = { ease: 2.5, ivl: 20 + (idx % 40), due: todayNum() + 3 + (idx % 40), reps: 1, lapses: 0 };
  });
  State.data.onboarded = true;
  State.save();
  APP.innerHTML = `
  <div class="screen center">
    <div class="hero">🎉</div>
    <h1>You're set to level A2</h1>
    <p class="sub">The app adapts as you learn — get things right and it speeds up, struggle and it repeats more. Here's your daily plan.</p>
    <button class="btn big" onclick="go('home')">See today's plan →</button>
  </div>`;
}

/* ---------------- Daily plan ---------------- */
const PLAN_STEPS = [
  { key: "warmup",   icon: "🔁", title: "Warm-up review", time: "~8 min" },
  { key: "newwords", icon: "✨", title: "New words",       time: "~7 min" },
  { key: "grammar",  icon: "📖", title: "Grammar quiz",    time: "~5 min" },
  { key: "speak",    icon: "🎤", title: "Speaking practice", time: "~5 min" },
  { key: "song",     icon: "🎵", title: "Song time",       time: "~5 min" }
];
function ensurePlanToday(){
  const t = new Date().toISOString().slice(0, 10);
  const d = State.data;
  if (!d.plan || d.plan.date !== t){
    d.plan = { date: t, steps: { warmup: false, newwords: false, grammar: false, speak: false, song: false } };
    State.save();
  }
  return d.plan;
}
function completePlanStep(step){
  ensurePlanToday().steps[step] = true;
  State.addXP(5); State.save();
  inPlanFlow = null;
  go("home");
}
function pickTodaysSongId(){
  const bands = ["A1", "A2", "B1"];
  const pool = SONGS.filter(s => bands.indexOf(s.lv) <= State.data.band);
  const list = pool.length ? pool : SONGS;
  const day = Math.floor(Date.now() / 86400000);
  return list[day % list.length].id;
}
function startPlanStep(step){
  if (step === "speak"){ inPlanFlow = "speak"; currentView = "speak"; return viewSpeak(); }
  if (step === "song"){ inPlanFlow = "song"; currentView = "song"; return viewSong(pickTodaysSongId(), "sing"); }
  return startSession(step);
}

/* ---------------- Home (index) ---------------- */
function viewHome(){
  const d = State.data;
  const plan = ensurePlanToday();
  const learned = SRS.learnedCount();
  const weak = SRS.weakest(4).map(id => VOCAB_BY_ID[id]).filter(Boolean);
  const doneCount = PLAN_STEPS.filter(s => plan.steps[s.key]).length;
  APP.innerHTML = `
  <div class="screen">
    <header class="top">
      <div><h1>¡Hola! 👋</h1><p class="sub">Level <b>${SRS.levelLabel()}</b></p></div>
      <button class="gear" onclick="go('settings')">⚙️</button>
    </header>
    <div class="tiles">
      <div class="tile"><b>🔥 ${d.streak.count}</b><span>day streak</span></div>
      <div class="tile"><b>⭐ ${d.xp}</b><span>XP</span></div>
      <div class="tile"><b>📚 ${learned}</b><span>words known</span></div>
    </div>

    <button class="btn big talkbtn" onclick="go('talk')">🗣️ Hands-free speaking tutor</button>
    <button class="btn big coursebtn" onclick="go('course')">📘 5-Week Fluency Course (2 hrs/day)</button>

    <div class="card">
      <h3>Today's 30-Minute Plan (${doneCount}/5)</h3>
      <div class="progress"><div style="width:${(doneCount / 5) * 100}%"></div></div>
      ${PLAN_STEPS.map(s => `
        <button class="planrow ${plan.steps[s.key] ? "done" : ""}" onclick="startPlanStep('${s.key}')">
          <span class="pi">${plan.steps[s.key] ? "✅" : s.icon}</span>
          <span class="pt"><b>${s.title}</b><span class="sub">${s.time}</span></span>
          <span class="arrow">›</span>
        </button>`).join("")}
      ${doneCount === 5 ? `<p class="sub center">🎉 All done for today — amazing work!</p>` : ""}
    </div>

    <h3 class="indexTitle">Or choose freely</h3>
    <div class="indexGrid">
      <button onclick="go('practice')">🎯<br>Vocabulary</button>
      <button onclick="go('speak')">🎤<br>Speaking</button>
      <button onclick="go('songs')">🎵<br>Songs</button>
      <button onclick="startSession('grammar')">📖<br>Grammar drill</button>
      <button onclick="go('crossword')">🧩<br>Crossword</button>
      <button onclick="go('translate')">🔄<br>Translate</button>
      <button onclick="go('ai')">🤖<br>AI Tutor</button>
    </div>

    ${weak.length ? `<div class="card">
      <h3>💪 Your tricky words</h3>
      ${weak.map(v => `<div class="row"><b>${esc(v.es)}</b><span class="sub">${esc(tr(v))}</span></div>`).join("")}
      <p class="sub">These come back extra often until they stick.</p>
    </div>` : ""}
  </div>${navBar()}`;
}

/* ---------------- Practice session ---------------- */
let session = null;

function startSession(mode){
  const queue = [];
  let planStep = null;

  if (mode === "warmup"){
    planStep = "warmup";
    sample(SRS.dueItems(), 10).forEach(id => queue.push({ kind: id.startsWith("g") ? "grammar" : "quiz", id }));
    if (!queue.length) SRS.nextNewWords(3).forEach(v => queue.push({ kind: "intro", id: v.id }));
  } else if (mode === "newwords"){
    planStep = "newwords";
    SRS.nextNewWords(6).forEach(v => queue.push({ kind: "intro", id: v.id }));
  } else if (mode === "grammar"){
    planStep = "grammar";
    const d = State.data, t = todayNum();
    const dueG = GRAMMAR.filter(g => d.items[g.id] && d.items[g.id].due <= t);
    const freshG = GRAMMAR.filter(g => !d.items[g.id] && ["A1", "A2", "B1"].indexOf(g.lv) <= d.band);
    sample([...dueG, ...freshG], 6).forEach(g => queue.push({ kind: "grammar", id: g.id }));
  } else {
    // Free practice: reviews first, then new words if there's room.
    sample(SRS.dueItems(), 12).forEach(id => queue.push({ kind: id.startsWith("g") ? "grammar" : "quiz", id }));
    const newCount = queue.length < 6 ? 4 : 0;
    SRS.nextNewWords(newCount).forEach(v => queue.push({ kind: "intro", id: v.id }));
  }

  if (!queue.length){
    APP.innerHTML = `<div class="screen center"><div class="hero">🌴</div>
      <h1>All done for now!</h1>
      <p class="sub">No reviews due. Come back later, or practice speaking or songs!</p>
      <button class="btn big" onclick="go('speak')">🎤 Practice speaking</button>
      <button class="btn big ghost" onclick="go('home')">Home</button></div>${navBar()}`;
    return;
  }
  session = { queue: shuffle(queue), i: 0, right: 0, wrong: 0, sinceGrammar: 0, xpStart: State.data.xp,
              planStep, mixGrammar: !planStep };
  nextCard();
}

function nextCard(){
  const s = session;
  // Grammar pop-up every 5 answers (only during free/warmup practice).
  if (s.mixGrammar && s.sinceGrammar >= 5){
    s.sinceGrammar = 0;
    const g = pickGrammar();
    if (g) return renderGrammar(g, true);
  }
  if (s.i >= s.queue.length) return endSession();
  const item = s.queue[s.i++];
  if (item.kind === "intro") return renderIntro(VOCAB_BY_ID[item.id]);
  if (item.kind === "grammar") return renderGrammar(GRAMMAR_BY_ID[item.id], false);
  renderQuiz(VOCAB_BY_ID[item.id]);
}

function pickGrammar(){
  const bands = ["A1", "A2", "B1"];
  const d = State.data, t = todayNum();
  const due = GRAMMAR.filter(g => d.items[g.id] && d.items[g.id].due <= t);
  if (due.length) return sample(due, 1)[0];
  const fresh = GRAMMAR.filter(g => !d.items[g.id] && bands.indexOf(g.lv) <= d.band);
  return fresh.length ? sample(fresh, 1)[0] : null;
}

/* --- intro card: meet a new word --- */
function renderIntro(v){
  APP.innerHTML = `
  <div class="screen">
    ${sessionBar()}
    <div class="card center">
      <p class="tag new">✨ ${L("NEW WORD","NIEUW WOORD")}</p>
      <h2 class="word">${esc(v.es)} <button class="say" onclick="Speech.say('${esc(v.es)}')">🔊</button></h2>
      <p class="meaning">${esc(tr(v))}</p>
      <div class="example">
        <p class="es">${esc(v.ex)} <button class="say" onclick="Speech.say('${esc(v.ex)}')">🔊</button></p>
        <p class="sub">${esc(trEx(v))}</p>
      </div>
      <button class="btn big" onclick="introDone('${v.id}')">${L("Got it →","Snap ik →")}</button>
    </div>
  </div>`;
  Speech.say(v.es);
}
function introDone(id){
  SRS.introduce(id);
  // Immediately quiz it once so it enters memory actively.
  renderQuiz(VOCAB_BY_ID[id], true);
}

/* --- vocab quiz card (multiple types) --- */
function renderQuiz(v, fresh){
  const types = fresh ? ["mc"] : ["mc", "mcRev", "type", "listen", "gap"];
  const type = sample(types, 1)[0];
  session.currentAnswered = false;

  if (type === "mc" || type === "gap"){
    const isGap = type === "gap" && v.ex.toLowerCase().includes(v.es.split(" ")[0].toLowerCase().replace(/^(el|la|los|las)\s/,""));
    let prompt, opts, correct;
    if (isGap){
      const bare = v.es.replace(/^(el|la|los|las)\s/, "");
      const rx = new RegExp(bare.split(" ")[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      prompt = `<p class="es big-es">${esc(v.ex).replace(rx, "＿＿＿")}</p><p class="sub">${esc(trEx(v))}</p>`;
      correct = v.es;
      opts = shuffle([v.es, ...sample(VOCAB.filter(x => x.id !== v.id && x.lv === v.lv), 3).map(x => x.es)]);
    } else {
      prompt = `<h2 class="word">${esc(v.es)} <button class="say" onclick="Speech.say('${esc(v.es)}')">🔊</button></h2>`;
      correct = tr(v);
      opts = shuffle([tr(v), ...sample(VOCAB.filter(x => x.id !== v.id), 3).map(tr)]);
    }
    APP.innerHTML = `<div class="screen">${sessionBar()}
      <div class="card center">${prompt}
      ${opts.map(o => `<button class="btn opt" onclick="answerMC('${v.id}', this, ${fresh ? "true" : "false"})" data-t="${esc(o)}" data-c="${esc(correct)}">${esc(o)}</button>`).join("")}
      </div><div id="fb"></div></div>`;
    if (!isGap) Speech.say(v.es);
    return;
  }

  if (type === "mcRev"){
    const opts = shuffle([v.es, ...sample(VOCAB.filter(x => x.id !== v.id), 3).map(x => x.es)]);
    APP.innerHTML = `<div class="screen">${sessionBar()}
      <div class="card center">
      <h2 class="word">${esc(tr(v))}</h2>
      <p class="sub">${L("Which Spanish word is this?","Welk Spaans woord is dit?")}</p>
      ${opts.map(o => `<button class="btn opt" onclick="answerMC('${v.id}', this, false)" data-t="${esc(o)}" data-c="${esc(v.es)}">${esc(o)}</button>`).join("")}
      </div><div id="fb"></div></div>`;
    return;
  }

  if (type === "listen"){
    APP.innerHTML = `<div class="screen">${sessionBar()}
      <div class="card center">
      <p class="tag">👂 ${L("LISTEN","LUISTER")}</p>
      <button class="say bigsay" onclick="Speech.say('${esc(v.es)}')">🔊</button>
      <p class="sub">${L("Type what you hear (in Spanish)","Typ wat je hoort (in het Spaans)")}</p>
      <input id="tin" class="tin" autocomplete="off" autocapitalize="off" placeholder="…">
      <button class="btn big" onclick="answerType('${v.id}', 'es')">${L("Check","Controleer")}</button>
      </div><div id="fb"></div></div>`;
    Speech.say(v.es);
    $("#tin").focus();
    return;
  }

  // type: translate into Spanish by typing (spelling practice!)
  APP.innerHTML = `<div class="screen">${sessionBar()}
    <div class="card center">
    <p class="tag">✏️ ${L("SPELLING","SPELLING")}</p>
    <h2 class="word">${esc(tr(v))}</h2>
    <p class="sub">${L("Type it in Spanish","Typ het in het Spaans")}</p>
    <input id="tin" class="tin" autocomplete="off" autocapitalize="off" placeholder="…">
    <div class="accents">${["á","é","í","ó","ú","ñ","ü","¿","¡"].map(c => `<button onclick="insertChar('${c}')">${c}</button>`).join("")}</div>
    <button class="btn big" onclick="answerType('${v.id}', 'es')">${L("Check","Controleer")}</button>
    </div><div id="fb"></div></div>`;
  $("#tin").focus();
}

function insertChar(c){ const i = $("#tin"); i.value += c; i.focus(); }

function answerMC(id, btn, fresh){
  if (session.currentAnswered) return;
  session.currentAnswered = true;
  const ok = btn && btn.dataset.t === btn.dataset.c;
  document.querySelectorAll(".opt").forEach(b => {
    if (b.dataset.t === b.dataset.c) b.classList.add("right");
    else if (b === btn) b.classList.add("wrong");
    b.disabled = true;
  });
  grade(id, ok, fresh);
}

function answerType(id, mode){
  if (session.currentAnswered) return;
  const v = VOCAB_BY_ID[id];
  const raw = ($("#tin").value || "").trim();
  if (!raw) return;
  session.currentAnswered = true;
  const target = v.es;
  const exact = raw.toLowerCase() === target.toLowerCase();
  const near = Speech.norm(raw) === Speech.norm(target)
    || Speech.norm(raw) === Speech.norm(target.replace(/^(el|la|los|las)\s/, ""));
  const ok = exact || near;
  let note = "";
  if (ok && !exact) note = `<p class="sub">✍️ ${L("Watch the details:","Let op de details:")} <b>${esc(target)}</b></p>`;
  grade(id, ok, false, note);
}

function grade(id, ok, fresh, extraNote){
  const v = VOCAB_BY_ID[id];
  if (!fresh) SRS.answer(id, ok); else { State.touchStreak(); State.addXP(5); State.save(); }
  if (ok) session.right++; else session.wrong++;
  session.sinceGrammar++;
  // Wrong answers on non-fresh items: put them back at the end of the queue.
  if (!ok && !fresh) session.queue.push({ kind: "quiz", id });
  const fb = $("#fb");
  fb.innerHTML = `<div class="fbx ${ok ? "good" : "bad"}">
    <b>${ok ? "✅ ¡Muy bien!" : "❌ " + esc(v.es) + " = " + esc(tr(v))}</b>
    ${extraNote || ""}
    <p class="es small">${esc(v.ex)} <button class="say" onclick="Speech.say('${esc(v.ex)}')">🔊</button></p>
    <button class="btn big" onclick="nextCard()">${L("Continue","Verder")} →</button>
  </div>`;
  if (!ok) Speech.say(v.es);
  fb.scrollIntoView({ behavior: "smooth" });
}

/* --- grammar pop-up --- */
function renderGrammar(g, popup){
  session.currentAnswered = false;
  APP.innerHTML = `<div class="screen">${sessionBar()}
    <div class="card center grammar">
    <p class="tag pop">${popup ? "⚡ " + L("POP QUIZ!","POP-QUIZ!") : "📖 " + L("GRAMMAR","GRAMMATICA")}</p>
    <h2 class="gq">${esc(g.q)}</h2>
    ${g.opts.map((o, i) => `<button class="btn opt" onclick="answerGrammar('${g.id}', ${i}, this)">${esc(o)}</button>`).join("")}
    </div><div id="fb"></div></div>`;
}
function answerGrammar(id, i, btn){
  if (session.currentAnswered) return;
  session.currentAnswered = true;
  const g = GRAMMAR_BY_ID[id];
  const ok = i === g.a;
  document.querySelectorAll(".opt").forEach((b, bi) => {
    if (bi === g.a) b.classList.add("right");
    else if (b === btn) b.classList.add("wrong");
    b.disabled = true;
  });
  SRS.answer(id, ok);
  if (ok) session.right++; else session.wrong++;
  $("#fb").innerHTML = `<div class="fbx ${ok ? "good" : "bad"}">
    <b>${ok ? "✅ ¡Exacto!" : "❌ " + esc(g.opts[g.a])}</b>
    <p class="sub">💡 ${esc(why(g))}</p>
    <button class="btn big" onclick="nextCard()">${L("Continue","Verder")} →</button></div>`;
  $("#fb").scrollIntoView({ behavior: "smooth" });
}

function sessionBar(){
  const s = session;
  const total = s.queue.length;
  return `<div class="sessiontop">
    <button class="back" onclick="go('home')">← Exit</button>
    <div class="progress"><div style="width:${Math.min(100, (s.i / Math.max(1,total)) * 100)}%"></div></div>
  </div>`;
}

function endSession(){
  const s = session;
  const earned = State.data.xp - s.xpStart;
  const total = s.right + s.wrong;
  const pct = total ? Math.round((s.right / total) * 100) : 100;
  if (s.planStep){
    ensurePlanToday().steps[s.planStep] = true;
    State.save();
  }
  APP.innerHTML = `<div class="screen center">
    <div class="hero">${pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "🌱"}</div>
    <h1>${pct >= 80 ? "Fantastic!" : pct >= 50 ? "Nice work!" : "Keep going!"}</h1>
    <div class="tiles">
      <div class="tile"><b>${s.right}/${total}</b><span>correct</span></div>
      <div class="tile"><b>+${earned}</b><span>XP</span></div>
      <div class="tile"><b>🔥 ${State.data.streak.count}</b><span>streak</span></div>
    </div>
    ${s.planStep
      ? `<button class="btn big" onclick="go('home')">✅ Back to today's plan</button>`
      : `<button class="btn big" onclick="go('practice')">Another round 🔁</button>
         <button class="btn big ghost" onclick="go('home')">Done for now</button>`}
  </div>${navBar()}`;
}

/* ---------------- Speak (pronunciation) ---------------- */
let speakPhrase = null;
function pickSpeakPhrase(){
  const d = State.data;
  const pool = d.introduced.map(id => VOCAB_BY_ID[id]).filter(Boolean);
  const v = pool.length ? sample(pool, 1)[0] : sample(VOCAB.filter(x => x.lv === "A1"), 1)[0];
  return { es: v.ex, tr: trEx(v) };
}
function viewSpeak(next){
  if (next !== "keep" || !speakPhrase) speakPhrase = pickSpeakPhrase();
  const hasRec = Speech.hasRecognition();
  APP.innerHTML = `<div class="screen">
    <h1>🎤 Say it like a Spaniard</h1>
    <div class="card center">
      <p class="es big-es" id="sp-target">${esc(speakPhrase.es)}</p>
      <p class="sub">${esc(speakPhrase.tr)}</p>
      <div class="speakrow">
        <button class="btn" onclick="Speech.say(document.getElementById('sp-target').textContent)">🔊 Listen</button>
        <button class="btn" onclick="Speech.say(document.getElementById('sp-target').textContent, 0.6)">🐢 Slow</button>
      </div>
      ${hasRec
        ? `<button class="btn big rec" id="recbtn" onclick="startListen()">🎙️ Now you — tap & speak</button>`
        : `<button class="btn big rec" id="recbtn" onclick="toggleRecord()">🎙️ Record yourself</button>`}
      <div id="sp-result"></div>
    </div>
    <button class="btn ghost" onclick="viewSpeak()">Next phrase →</button>
    ${inPlanFlow === "speak" ? `<button class="btn big" onclick="completePlanStep('speak')">✅ Mark speaking practice done</button>` : ""}
  </div>${navBar()}`;
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("active", b.dataset.v === "speak"));
}

function startListen(){
  const btn = $("#recbtn");
  btn.textContent = "👂 " + L("Listening…","Ik luister…");
  btn.classList.add("live");
  Speech.listen(alts => {
    btn.classList.remove("live");
    btn.innerHTML = "🎙️ " + L("Try again","Nog een keer");
    const res = Speech.compare(speakPhrase.es, alts);
    const pct = Math.round(res.score * 100);
    if (res.score >= 0.99) { State.addXP(15); } else if (res.score >= 0.7) { State.addXP(8); }
    State.touchStreak(); State.save();
    $("#sp-result").innerHTML = `
      <div class="fbx ${pct >= 70 ? "good" : "bad"}">
        <b>${pct >= 99 ? "🌟 ¡Perfecto!" : pct >= 70 ? "👍 ¡Casi! " + pct + "%" : "💪 " + pct + "%"}</b>
        <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p>
        <p class="sub">${L("I heard:","Ik hoorde:")} “${esc(alts[0] || "")}”</p>
        ${pct < 99 ? `<p class="sub">${L("Red words: listen again and repeat just those.","Rode woorden: luister nog eens en herhaal alleen die.")}</p>` : ""}
      </div>`;
  }, err => {
    btn.classList.remove("live");
    btn.innerHTML = "🎙️ " + L("Tap & speak","Tik & spreek");
    $("#sp-result").innerHTML = `<p class="sub center">${
      err === "not-allowed"
        ? L("Please allow microphone access in your browser.","Geef de browser toegang tot je microfoon.")
        : L("I didn't catch that — try again a bit louder.","Ik heb het niet verstaan — probeer het iets luider.")}</p>`;
  });
}

let recording = false;
async function toggleRecord(){
  const btn = $("#recbtn");
  if (!recording){
    try {
      await Recorder.start();
      recording = true;
      btn.textContent = "⏹️ " + L("Stop","Stop");
      btn.classList.add("live");
    } catch(e){
      $("#sp-result").innerHTML = `<p class="sub center">${L("Please allow microphone access.","Geef toegang tot je microfoon.")}</p>`;
    }
  } else {
    recording = false;
    btn.classList.remove("live");
    btn.innerHTML = "🎙️ " + L("Record again","Opnieuw opnemen");
    const url = await Recorder.stop();
    State.touchStreak(); State.addXP(5); State.save();
    $("#sp-result").innerHTML = `
      <div class="fbx good">
        <p class="sub">${L("Compare yourself with the model:","Vergelijk jezelf met het voorbeeld:")}</p>
        <audio controls src="${url}" style="width:100%"></audio>
        <button class="btn" onclick="Speech.say(document.getElementById('sp-target').textContent)">🔊 ${L("Model","Voorbeeld")}</button>
      </div>`;
  }
}

/* ---------------- Songs ---------------- */
function allSongs(){ return [...SONGS, ...State.data.userSongs]; }

// Built-in pop songs ship without lyrics (copyright); the user pastes them once.
function effSong(id){
  const s = allSongs().find(x => x.id === id);
  if (!s) return null;
  const lines = (s.lines && s.lines.length) ? s.lines
    : ((State.data.songLyrics || {})[s.id] || []);
  return { ...s, lines };
}

// Translate song lines Spanish→English one by one (free MyMemory service).
async function translateLinesToEn(lines, statusEl){
  for (let i = 0; i < lines.length; i++){
    if (lines[i].en) continue;
    if (statusEl) statusEl.textContent = `Translating… ${i + 1}/${lines.length}`;
    try {
      const res = await fetch("https://api.mymemory.translated.net/get?q=" +
        encodeURIComponent(lines[i].es) + "&langpair=es|en");
      const data = await res.json();
      const en = (data.responseData && data.responseData.translatedText || "").trim();
      if (en && !/QUERY LENGTH|INVALID|NO QUERY/i.test(en)) lines[i].en = en;
    } catch(e){ break; }
  }
  return lines;
}

async function saveBuiltinLyrics(id){
  const lyrics = ($("#lyr-in").value || "").trim();
  if (!lyrics) return;
  if (!State.data.songLyrics) State.data.songLyrics = {};
  const lines = lyrics.split(/\n+/).map(t => t.trim()).filter(Boolean).map(es => ({ es }));
  State.data.songLyrics[id] = lines;
  State.save();
  const btn = document.querySelector(".card .btn.big");
  await translateLinesToEn(lines, btn);
  State.save();
  viewSong(id);
}

// For songs whose lyrics were saved before translations existed.
async function songAddTranslations(id){
  const stored = (State.data.songLyrics || {})[id] ||
    (State.data.userSongs.find(s => s.id === id) || {}).lines;
  if (!stored) return;
  await translateLinesToEn(stored, $("#trbtn"));
  State.save();
  viewSong(id, "read");
}

function viewSongs(){
  const d = State.data;
  APP.innerHTML = `<div class="screen">
    <h1>🎵 ${L("Songs","Liedjes")}</h1>
    <p class="sub">${L("Learn Spanish the fun way — through music.","Leer Spaans op de leukste manier — met muziek.")}</p>
    ${allSongs().map(s => `
      <button class="card songcard" onclick="go('song', '${esc(s.id)}')">
        <b>${esc(s.title)}</b>
        <span class="sub">${esc(s.artist)} · ${esc(s.lv || "")} ${s.kind === "folk" ? "· 🎻" : "· 🎧"}</span>
      </button>`).join("")}
    <button class="btn big ghost" onclick="go('addsong')">➕ ${L("Add your own song (e.g. Flaca, Hoy…)","Voeg je eigen liedje toe (bijv. Flaca, Hoy…)")}</button>
  </div>${navBar()}`;
}

let songMode = "read";
function viewSong(id, mode){
  const s = effSong(id);
  if (!s) return go("songs");
  songMode = mode || "read";
  const vid = State.data.songVideos[s.id] || s.vid;
  const about = s.aboutEn || "";
  const hasLyrics = s.lines.length > 0;
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('songs')">← Songs</button>
    <h1>${esc(s.title)}</h1>
    <p class="sub">${esc(s.artist)}</p>
    ${vid
      ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(vid)}" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`
      : `<div class="card center">
           <p class="sub">🎬 Paste a YouTube link of this song to play it right here:</p>
           <input id="ytin" class="tin" placeholder="https://youtube.com/watch?v=…">
           <button class="btn" onclick="saveVideo('${esc(s.id)}')">Save</button>
         </div>`}
    ${about ? `<p class="sub">${esc(about)}</p>` : ""}
    ${hasLyrics ? `
    <div class="modes">
      <button class="${songMode === "read" ? "on" : ""}" onclick="viewSong('${esc(s.id)}','read')">📖 Read</button>
      <button class="${songMode === "gaps" ? "on" : ""}" onclick="viewSong('${esc(s.id)}','gaps')">🕳️ Gaps</button>
      <button class="${songMode === "sing" ? "on" : ""}" onclick="viewSong('${esc(s.id)}','sing')">🎤 Sing</button>
    </div>
    <div id="songbody"></div>` : `
    <div class="card">
      <p><b>🎼 One-time step:</b> the lyrics are copyrighted, so the app can't include them — but you can! Search for
      “${esc(s.title)} ${esc(s.artist)} letra” on a lyrics website, copy the text, and paste it below. All exercises unlock automatically.</p>
      <textarea id="lyr-in" class="tin" rows="9" placeholder="Paste the lyrics here…"></textarea>
      <button class="btn big" onclick="saveBuiltinLyrics('${esc(s.id)}')">Save lyrics</button>
    </div>`}
  </div>${navBar()}`;
  if (!hasLyrics) return;
  if (songMode === "read") renderSongRead(s);
  if (songMode === "gaps") renderSongGaps(s);
  if (songMode === "sing") renderSongSing(s, 0);
}

function saveVideo(id){
  const url = ($("#ytin").value || "").trim();
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (m){ State.data.songVideos[id] = m[1]; State.save(); viewSong(id, songMode); }
  else $("#ytin").placeholder = L("Hmm, that doesn't look like a YouTube link","Hmm, dat lijkt geen YouTube-link");
}

function renderSongRead(s){
  const missingEn = s.lines.some(l => !l.en);
  $("#songbody").innerHTML =
    (missingEn ? `<button class="btn ghost" id="trbtn" onclick="songAddTranslations('${esc(s.id)}')">🔤 Add English translations</button>` : "") +
    s.lines.map((l, i) => `
    <div class="songline">
      <p class="es">${esc(l.es)} <button class="say" onclick="Speech.say(effSong('${esc(s.id)}').lines[${i}].es)">🔊</button></p>
      ${l.en ? `<p class="sub">${esc(l.en)}</p>` : ""}
    </div>`).join("");
}

let gapState = null;
function renderSongGaps(s){
  // Blank out ~1 in 4 content words.
  const stop = new Set(["el","la","los","las","un","una","de","del","que","y","a","en","es","me","te","se","mi","tu","su","no","con","por","al","lo","les"]);
  const lines = s.lines.map(l => l.es.split(" "));
  const blanks = [];
  lines.forEach((ws, li) => ws.forEach((w, wi) => {
    const clean = Speech.norm(w);
    if (clean && clean.length > 2 && !stop.has(clean)) blanks.push({ li, wi, w: clean });
  }));
  const chosen = sample(blanks, Math.max(3, Math.floor(blanks.length / 4)));
  gapState = { s, lines, chosen, filled: 0 };
  const bank = shuffle(chosen.map(b => b.w));
  $("#songbody").innerHTML = `
    <p class="sub">${L("Play the song and tap the missing words in order!","Speel het liedje af en tik de ontbrekende woorden in de juiste volgorde!")}</p>
    <div class="card" id="gaplines">${lines.map((ws, li) => `<p class="es">${
      ws.map((w, wi) => {
        const hit = chosen.findIndex(b => b.li === li && b.wi === wi);
        return hit >= 0 ? `<span class="gap" id="gap-${hit}">＿＿＿</span>` : esc(w);
      }).join(" ")}</p>`).join("")}
    </div>
    <div class="bank" id="bank">${bank.map(w => `<button class="btn chip" onclick="fillGap(this)" data-w="${esc(w)}">${esc(w)}</button>`).join("")}</div>
    <div id="fb"></div>`;
}
function fillGap(btn){
  const g = gapState;
  const w = btn.dataset.w;
  // Next unfilled gap in reading order:
  const order = g.chosen.map((b, i) => ({ ...b, i })).sort((a, b2) => a.li - b2.li || a.wi - b2.wi);
  const next = order.find(b => !b.done);
  if (!next) return;
  if (w === next.w){
    g.chosen[next.i].done = true;
    const el = $("#gap-" + next.i);
    el.textContent = g.lines[next.li][next.wi];
    el.classList.add("done");
    btn.remove();
    g.filled++;
    if (g.filled === g.chosen.length){
      State.addXP(20); State.touchStreak(); State.save();
      $("#fb").innerHTML = `<div class="fbx good"><b>🎉 ¡Canción completa! +20 XP</b></div>`;
    }
  } else {
    btn.classList.add("wrong");
    setTimeout(() => btn.classList.remove("wrong"), 500);
  }
}

function renderSongSing(s, i){
  if (i >= s.lines.length){
    State.addXP(25); State.touchStreak(); State.save();
    $("#songbody").innerHTML = `<div class="fbx good center"><b>🌟 You sang the whole song! +25 XP</b></div>
      ${inPlanFlow === "song" ? `<button class="btn big" onclick="completePlanStep('song')">✅ Mark song practice done</button>` : ""}`;
    return;
  }
  const l = s.lines[i];
  const hasRec = Speech.hasRecognition();
  $("#songbody").innerHTML = `
    <p class="sub center">Line ${i + 1}/${s.lines.length}</p>
    <div class="card center">
      <p class="es big-es" id="sing-target">${esc(l.es)}</p>
      ${l.en ? `<p class="sub">${esc(l.en)}</p>` : ""}
      <div class="speakrow">
        <button class="btn" onclick="Speech.say(document.getElementById('sing-target').textContent)">🔊</button>
        <button class="btn" onclick="Speech.say(document.getElementById('sing-target').textContent, 0.6)">🐢</button>
        ${hasRec ? `<button class="btn rec" onclick="singListen('${esc(s.id)}', ${i})">🎙️</button>` : ""}
      </div>
      <div id="sp-result"></div>
      <button class="btn big" onclick="renderSongSing(effSong('${esc(s.id)}'), ${i + 1})">Next line →</button>
      ${inPlanFlow === "song" ? `<button class="btn ghost" onclick="completePlanStep('song')">✅ Done for today</button>` : ""}
    </div>`;
  Speech.say(l.es);
}
function singListen(id, i){
  const s = effSong(id);
  const l = s.lines[i];
  $("#sp-result").innerHTML = `<p class="sub">👂 ${L("Listening…","Ik luister…")}</p>`;
  Speech.listen(alts => {
    const res = Speech.compare(l.es, alts);
    const pct = Math.round(res.score * 100);
    if (res.score >= 0.7){ State.addXP(5); State.save(); }
    $("#sp-result").innerHTML = `<div class="fbx ${pct >= 70 ? "good" : "bad"}">
      <b>${pct >= 99 ? "🌟 ¡Perfecto!" : pct + "%"}</b>
      <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p></div>`;
  }, () => { $("#sp-result").innerHTML = `<p class="sub">${L("Didn't catch it — try again!","Niet verstaan — probeer opnieuw!")}</p>`; });
}

/* ---------------- Add song ---------------- */
function viewAddSong(){
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('songs')">← ${L("Songs","Liedjes")}</button>
    <h1>➕ ${L("Add a song","Liedje toevoegen")}</h1>
    <p class="sub">${L(
      "Copy the lyrics from a lyrics website (or the booklet) and paste them below — one line per sung line. The app builds all exercises automatically.",
      "Kopieer de songtekst van een lyrics-website (of het boekje) en plak hem hieronder — één regel per gezongen regel. De app maakt alle oefeningen automatisch.")}</p>
    <div class="card">
      <input id="s-title" class="tin" placeholder="${L("Title (e.g. Flaca)","Titel (bijv. Flaca)")}">
      <input id="s-artist" class="tin" placeholder="${L("Artist (e.g. Andrés Calamaro)","Artiest (bijv. Andrés Calamaro)")}">
      <input id="s-video" class="tin" placeholder="${L("YouTube link (optional)","YouTube-link (optioneel)")}">
      <textarea id="s-lyrics" class="tin" rows="10" placeholder="${L("Paste the lyrics here…","Plak hier de songtekst…")}"></textarea>
      <button class="btn big" onclick="saveSong()">${L("Save song","Liedje opslaan")}</button>
    </div>
  </div>${navBar()}`;
}
async function saveSong(){
  const title = ($("#s-title").value || "").trim();
  const lyrics = ($("#s-lyrics").value || "").trim();
  if (!title || !lyrics) return;
  const id = "u_" + Date.now();
  const lines = lyrics.split(/\n+/).map(t => t.trim()).filter(Boolean).map(es => ({ es }));
  const btn = document.querySelector(".card .btn.big");
  await translateLinesToEn(lines, btn);
  State.data.userSongs.push({ id, kind: "user", title, artist: ($("#s-artist").value || "").trim() || "—", lines });
  const url = ($("#s-video").value || "").trim();
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (m) State.data.songVideos[id] = m[1];
  State.save();
  go("song", id);
}

/* ---------------- Settings ---------------- */
function viewSettings(){
  const d = State.data;
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>⚙️ Settings</h1>
    <div class="card">
      <h3>Voice</h3>
      <button class="btn" onclick="Speech.say('¡Hola! Me encanta ayudarte con tu español.')">🔊 Test the Spanish voice</button>
    </div>
    <div class="card">
      <h3>Progress</h3>
      <p class="sub">${SRS.learnedCount()} words known · ${d.xp} XP · level ${SRS.levelLabel()}</p>
      <button class="btn danger" onclick="if(confirm('Really erase ALL progress?')){localStorage.removeItem('espanolita_v1');location.reload();}">🗑️ Reset everything</button>
    </div>
    <p class="sub center">¡Españolita! v1 · made with ❤️</p>
  </div>${navBar()}`;
}

/* ---------------- PIN lock ---------------- */
// Deterrent lock, not bank-grade security: keeps strangers who find the URL out.
// The device remembers a successful unlock, so the owner types it only once.
const PIN_HASH = 2086133284;
function pinHash(s){ let h = 5381; for (const c of s) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0; return h; }

let pinEntry = "";
function viewPinLock(){
  pinEntry = "";
  APP.innerHTML = `
  <div class="screen center pinlock">
    <div class="hero">🔒</div>
    <h1>¡Españolita!</h1>
    <p class="sub">Enter your PIN to unlock</p>
    <div class="pindots" id="pindots">${renderPinDots()}</div>
    <div class="pinpad">
      ${[1,2,3,4,5,6,7,8,9].map(n => `<button onclick="pinPress('${n}')">${n}</button>`).join("")}
      <span></span>
      <button onclick="pinPress('0')">0</button>
      <button class="pinback" onclick="pinBackspace()">⌫</button>
    </div>
  </div>`;
}
function renderPinDots(){
  return [0,1,2,3].map(i => `<span class="${i < pinEntry.length ? "fill" : ""}"></span>`).join("");
}
function pinPress(d){
  if (pinEntry.length >= 4) return;
  pinEntry += d;
  $("#pindots").innerHTML = renderPinDots();
  if (pinEntry.length === 4){
    if (pinHash(pinEntry) === PIN_HASH){
      localStorage.setItem("espanolita_unlocked", "yes");
      boot();
    } else {
      const dots = $("#pindots");
      dots.classList.add("shake");
      setTimeout(() => { pinEntry = ""; dots.classList.remove("shake"); dots.innerHTML = renderPinDots(); }, 500);
    }
  }
}
function pinBackspace(){
  pinEntry = pinEntry.slice(0, -1);
  $("#pindots").innerHTML = renderPinDots();
}

/* ---------------- Boot ---------------- */
function boot(){
  if (!State.data.onboarded) setupA2English();
  else go("home");
}
window.addEventListener("DOMContentLoaded", () => {
  State.load();
  Speech.init();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  if (localStorage.getItem("espanolita_unlocked") === "yes") boot();
  else viewPinLock();
});
