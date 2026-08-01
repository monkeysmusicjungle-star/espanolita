// Tiếng Việt! — main app: views, quizzes, daily plan. Interface EN or ES.
"use strict";

const $ = sel => document.querySelector(sel);
const APP = $("#app");

const VOCAB_BY_ID = Object.fromEntries(VOCAB.map(v => [v.id, v]));
const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR.map(g => [g.id, g]));

function esc(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function shuffle(a){ a = a.slice(); for (let i = a.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }
function sample(arr, n){ return shuffle(arr).slice(0, n); }

// Interface language: English or Spanish.
function L(en, es){ return State.data.lang === "es" ? es : en; }
function tr(v){ return State.data.lang === "es" ? v.es : v.en; }
function trEx(v){ return State.data.lang === "es" ? v.exEs : v.exEn; }
function why(g){ return State.data.lang === "es" ? g.wEs : g.wEn; }

/* ---------------- Router ---------------- */
let currentView = "home";
let inPlanFlow = null;
function go(view, arg){
  currentView = view;
  window.scrollTo(0, 0);
  const views = { home: viewHome, practice: () => startSession(), speak: viewSpeak,
                  settings: viewSettings, crossword: viewCrossword, translate: viewTranslate, ai: viewAI };
  (views[view] || viewHome)(arg);
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("active", b.dataset.v === view));
}

function navBar(){
  return `<nav class="nav">
    <button data-v="home" onclick="go('home')"><span>🏠</span>${L("Home","Inicio")}</button>
    <button data-v="practice" onclick="go('practice')"><span>🎯</span>${L("Practice","Práctica")}</button>
    <button data-v="speak" onclick="go('speak')"><span>🎤</span>${L("Speak","Hablar")}</button>
    <button data-v="ai" onclick="go('ai')"><span>🤖</span>${L("Chat","Chat")}</button>
  </nav>`;
}

/* ---------------- Onboarding: pick interface language ---------------- */
function viewOnboarding(){
  APP.innerHTML = `
  <div class="screen center">
    <div class="hero">🇻🇳</div>
    <h1>Tiếng Việt!</h1>
    <p class="sub">Learn Vietnamese · Aprende vietnamita</p>
    <div class="card">
      <h3>Show help & translations in… / Ayuda y traducciones en…</h3>
      <button class="btn big" onclick="setLang('en')">🇬🇧 English</button>
      <button class="btn big ghost" onclick="setLang('es')">🇪🇸 Español</button>
    </div>
  </div>`;
}
function setLang(lang){
  State.data.lang = lang;
  State.data.band = 0; // start at A1 — Vietnamese from scratch
  State.data.onboarded = true;
  State.save();
  APP.innerHTML = `
  <div class="screen center">
    <div class="hero">🎉</div>
    <h1>${L("Let's begin at A1","Empecemos en A1")}</h1>
    <p class="sub">${L("You'll learn Vietnamese step by step, with lots of repetition so it sticks. Here's your daily plan.",
      "Aprenderás vietnamita paso a paso, con mucha repetición para que se quede. Aquí está tu plan diario.")}</p>
    <button class="btn big" onclick="go('home')">${L("See today's plan →","Ver el plan de hoy →")}</button>
  </div>`;
}

/* ---------------- Daily plan ---------------- */
const PLAN_STEPS = [
  { key: "warmup",   icon: "🔁", title: ["Warm-up review","Repaso"],        time: "~8 min" },
  { key: "newwords", icon: "✨", title: ["New words","Palabras nuevas"],    time: "~10 min" },
  { key: "grammar",  icon: "📖", title: ["Grammar quiz","Cuestionario"],    time: "~6 min" },
  { key: "speak",    icon: "🎤", title: ["Speaking practice","Pronunciación"], time: "~6 min" }
];
function ensurePlanToday(){
  const t = new Date().toISOString().slice(0, 10);
  const d = State.data;
  if (!d.plan || d.plan.date !== t){
    d.plan = { date: t, steps: { warmup: false, newwords: false, grammar: false, speak: false } };
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
function startPlanStep(step){
  if (step === "speak"){ inPlanFlow = "speak"; currentView = "speak"; return viewSpeak(); }
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
      <div><h1>Xin chào! 👋</h1><p class="sub">${L("Level","Nivel")} <b>${SRS.levelLabel()}</b></p></div>
      <button class="gear" onclick="go('settings')">⚙️</button>
    </header>
    <div class="tiles">
      <div class="tile"><b>🔥 ${d.streak.count}</b><span>${L("day streak","días seguidos")}</span></div>
      <div class="tile"><b>⭐ ${d.xp}</b><span>XP</span></div>
      <div class="tile"><b>📚 ${learned}</b><span>${L("words known","palabras")}</span></div>
    </div>

    <div class="card">
      <h3>${L("Today's 30-Minute Plan","Plan de 30 minutos de hoy")} (${doneCount}/4)</h3>
      <div class="progress"><div style="width:${(doneCount / 4) * 100}%"></div></div>
      ${PLAN_STEPS.map(s => `
        <button class="planrow ${plan.steps[s.key] ? "done" : ""}" onclick="startPlanStep('${s.key}')">
          <span class="pi">${plan.steps[s.key] ? "✅" : s.icon}</span>
          <span class="pt"><b>${L(s.title[0], s.title[1])}</b><span class="sub">${s.time}</span></span>
          <span class="arrow">›</span>
        </button>`).join("")}
      ${doneCount === 4 ? `<p class="sub center">🎉 ${L("All done for today — amazing work!","¡Todo hecho por hoy, excelente!")}</p>` : ""}
    </div>

    <h3 class="indexTitle">${L("Or choose freely","O elige libremente")}</h3>
    <div class="indexGrid">
      <button onclick="go('practice')">🎯<br>${L("Vocabulary","Vocabulario")}</button>
      <button onclick="go('speak')">🎤<br>${L("Speaking","Hablar")}</button>
      <button onclick="startSession('grammar')">📖<br>${L("Grammar","Gramática")}</button>
      <button onclick="go('crossword')">🧩<br>${L("Crossword","Crucigrama")}</button>
      <button onclick="go('translate')">🔄<br>${L("Translate","Traducir")}</button>
      <button onclick="go('ai')">🤖<br>${L("AI Tutor","Tutor IA")}</button>
    </div>

    ${weak.length ? `<div class="card">
      <h3>💪 ${L("Your tricky words","Tus palabras difíciles")}</h3>
      ${weak.map(v => `<div class="row"><b>${esc(v.vi)}</b><span class="sub">${esc(tr(v))}</span></div>`).join("")}
      <p class="sub">${L("These come back extra often until they stick.","Estas vuelven más a menudo hasta que se queden.")}</p>
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
    sample(SRS.dueItems(), 12).forEach(id => queue.push({ kind: id.startsWith("g") ? "grammar" : "quiz", id }));
    const newCount = queue.length < 6 ? 4 : 0;
    SRS.nextNewWords(newCount).forEach(v => queue.push({ kind: "intro", id: v.id }));
  }

  if (!queue.length){
    APP.innerHTML = `<div class="screen center"><div class="hero">🌴</div>
      <h1>${L("All done for now!","¡Todo hecho por ahora!")}</h1>
      <p class="sub">${L("No reviews due. Come back later, or practice speaking!","No hay repasos pendientes. Vuelve luego, o practica hablar.")}</p>
      <button class="btn big" onclick="go('speak')">🎤 ${L("Practice speaking","Practicar pronunciación")}</button>
      <button class="btn big ghost" onclick="go('home')">${L("Home","Inicio")}</button></div>${navBar()}`;
    return;
  }
  session = { queue: shuffle(queue), i: 0, right: 0, wrong: 0, sinceGrammar: 0, xpStart: State.data.xp,
              planStep, mixGrammar: !planStep };
  nextCard();
}

function nextCard(){
  const s = session;
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

/* --- intro card --- */
function renderIntro(v){
  APP.innerHTML = `
  <div class="screen">
    ${sessionBar()}
    <div class="card center">
      <p class="tag new">✨ ${L("NEW WORD","PALABRA NUEVA")}</p>
      <h2 class="word">${esc(v.vi)} <button class="say" onclick="Speech.say('${esc(v.vi)}')">🔊</button></h2>
      <p class="meaning">${esc(tr(v))}</p>
      <div class="example">
        <p class="es">${esc(v.ex)} <button class="say" onclick="Speech.say('${esc(v.ex)}')">🔊</button></p>
        <p class="sub">${esc(trEx(v))}</p>
      </div>
      <button class="btn big" onclick="introDone('${v.id}')">${L("Got it →","Entendido →")}</button>
    </div>
  </div>`;
  Speech.say(v.vi);
}
function introDone(id){
  SRS.introduce(id);
  renderQuiz(VOCAB_BY_ID[id], true);
}

/* --- vocab quiz --- */
function renderQuiz(v, fresh){
  const types = fresh ? ["mc"] : ["mc", "mcRev", "type", "listen"];
  const type = sample(types, 1)[0];
  session.currentAnswered = false;

  if (type === "mc"){
    const opts = shuffle([tr(v), ...sample(VOCAB.filter(x => x.id !== v.id), 3).map(tr)]);
    APP.innerHTML = `<div class="screen">${sessionBar()}
      <div class="card center">
      <h2 class="word">${esc(v.vi)} <button class="say" onclick="Speech.say('${esc(v.vi)}')">🔊</button></h2>
      ${opts.map(o => `<button class="btn opt" onclick="answerMC('${v.id}', this, ${fresh ? "true" : "false"})" data-t="${esc(o)}" data-c="${esc(tr(v))}">${esc(o)}</button>`).join("")}
      </div><div id="fb"></div></div>`;
    Speech.say(v.vi);
    return;
  }

  if (type === "mcRev"){
    const opts = shuffle([v.vi, ...sample(VOCAB.filter(x => x.id !== v.id), 3).map(x => x.vi)]);
    APP.innerHTML = `<div class="screen">${sessionBar()}
      <div class="card center">
      <h2 class="word">${esc(tr(v))}</h2>
      <p class="sub">${L("Which Vietnamese word is this?","¿Qué palabra vietnamita es esta?")}</p>
      ${opts.map(o => `<button class="btn opt" onclick="answerMC('${v.id}', this, false)" data-t="${esc(o)}" data-c="${esc(v.vi)}">${esc(o)}</button>`).join("")}
      </div><div id="fb"></div></div>`;
    return;
  }

  if (type === "listen"){
    APP.innerHTML = `<div class="screen">${sessionBar()}
      <div class="card center">
      <p class="tag">👂 ${L("LISTEN","ESCUCHA")}</p>
      <button class="say bigsay" onclick="Speech.say('${esc(v.vi)}')">🔊</button>
      <p class="sub">${L("Type what you hear (in Vietnamese)","Escribe lo que oyes (en vietnamita)")}</p>
      <input id="tin" class="tin" autocomplete="off" autocapitalize="off" placeholder="…">
      <button class="btn big" onclick="answerType('${v.id}')">${L("Check","Comprobar")}</button>
      </div><div id="fb"></div></div>`;
    Speech.say(v.vi);
    $("#tin").focus();
    return;
  }

  // type: translate into Vietnamese by typing
  APP.innerHTML = `<div class="screen">${sessionBar()}
    <div class="card center">
    <p class="tag">✏️ ${L("SPELLING","ESCRITURA")}</p>
    <h2 class="word">${esc(tr(v))}</h2>
    <p class="sub">${L("Type it in Vietnamese (tones optional)","Escríbelo en vietnamita (tonos opcionales)")}</p>
    <input id="tin" class="tin" autocomplete="off" autocapitalize="off" placeholder="…">
    <button class="btn big" onclick="answerType('${v.id}')">${L("Check","Comprobar")}</button>
    </div><div id="fb"></div></div>`;
  $("#tin").focus();
}

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

function answerType(id){
  if (session.currentAnswered) return;
  const v = VOCAB_BY_ID[id];
  const raw = ($("#tin").value || "").trim();
  if (!raw) return;
  session.currentAnswered = true;
  const exact = raw.toLowerCase() === v.vi.toLowerCase();
  // Tone-insensitive acceptance so beginners aren't blocked by diacritics.
  const near = Speech.norm(raw) === Speech.norm(v.vi);
  const ok = exact || near;
  let note = "";
  if (ok && !exact) note = `<p class="sub">✍️ ${L("With tones:","Con tonos:")} <b>${esc(v.vi)}</b></p>`;
  grade(id, ok, false, note);
}

function grade(id, ok, fresh, extraNote){
  const v = VOCAB_BY_ID[id];
  if (!fresh) SRS.answer(id, ok); else { State.touchStreak(); State.addXP(5); State.save(); }
  if (ok) session.right++; else session.wrong++;
  session.sinceGrammar++;
  if (!ok && !fresh) session.queue.push({ kind: "quiz", id });
  const fb = $("#fb");
  fb.innerHTML = `<div class="fbx ${ok ? "good" : "bad"}">
    <b>${ok ? "✅ " + L("Great!","¡Genial!") : "❌ " + esc(v.vi) + " = " + esc(tr(v))}</b>
    ${extraNote || ""}
    <p class="es small">${esc(v.ex)} <button class="say" onclick="Speech.say('${esc(v.ex)}')">🔊</button></p>
    <button class="btn big" onclick="nextCard()">${L("Continue","Continuar")} →</button>
  </div>`;
  if (!ok) Speech.say(v.vi);
  fb.scrollIntoView({ behavior: "smooth" });
}

/* --- grammar pop-up --- */
function renderGrammar(g, popup){
  session.currentAnswered = false;
  APP.innerHTML = `<div class="screen">${sessionBar()}
    <div class="card center grammar">
    <p class="tag pop">${popup ? "⚡ " + L("POP QUIZ!","¡PREGUNTA!") : "📖 " + L("GRAMMAR","GRAMÁTICA")}</p>
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
    <b>${ok ? "✅ " + L("Exactly!","¡Exacto!") : "❌ " + esc(g.opts[g.a])}</b>
    <p class="sub">💡 ${esc(why(g))}</p>
    <button class="btn big" onclick="nextCard()">${L("Continue","Continuar")} →</button></div>`;
  $("#fb").scrollIntoView({ behavior: "smooth" });
}

function sessionBar(){
  const s = session;
  const total = s.queue.length;
  return `<div class="sessiontop">
    <button class="back" onclick="go('home')">← ${L("Exit","Salir")}</button>
    <div class="progress"><div style="width:${Math.min(100, (s.i / Math.max(1,total)) * 100)}%"></div></div>
  </div>`;
}

function endSession(){
  const s = session;
  const earned = State.data.xp - s.xpStart;
  const total = s.right + s.wrong;
  const pct = total ? Math.round((s.right / total) * 100) : 100;
  if (s.planStep){ ensurePlanToday().steps[s.planStep] = true; State.save(); }
  APP.innerHTML = `<div class="screen center">
    <div class="hero">${pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "🌱"}</div>
    <h1>${pct >= 80 ? L("Fantastic!","¡Fantástico!") : pct >= 50 ? L("Nice work!","¡Bien hecho!") : L("Keep going!","¡Sigue así!")}</h1>
    <div class="tiles">
      <div class="tile"><b>${s.right}/${total}</b><span>${L("correct","correctas")}</span></div>
      <div class="tile"><b>+${earned}</b><span>XP</span></div>
      <div class="tile"><b>🔥 ${State.data.streak.count}</b><span>${L("streak","racha")}</span></div>
    </div>
    ${s.planStep
      ? `<button class="btn big" onclick="go('home')">✅ ${L("Back to today's plan","Volver al plan de hoy")}</button>`
      : `<button class="btn big" onclick="go('practice')">${L("Another round","Otra ronda")} 🔁</button>
         <button class="btn big ghost" onclick="go('home')">${L("Done for now","Listo por ahora")}</button>`}
  </div>${navBar()}`;
}

/* ---------------- Speak ---------------- */
let speakPhrase = null;
function pickSpeakPhrase(){
  const d = State.data;
  const pool = d.introduced.map(id => VOCAB_BY_ID[id]).filter(Boolean);
  const v = pool.length ? sample(pool, 1)[0] : sample(VOCAB.filter(x => x.lv === "A1"), 1)[0];
  return { vi: v.ex, tr: trEx(v) };
}
function viewSpeak(next){
  if (next !== "keep" || !speakPhrase) speakPhrase = pickSpeakPhrase();
  const hasRec = Speech.hasRecognition();
  APP.innerHTML = `<div class="screen">
    <h1>🎤 ${L("Say it like a local","Dilo como un local")}</h1>
    <div class="card center">
      <p class="es big-es" id="sp-target">${esc(speakPhrase.vi)}</p>
      <p class="sub">${esc(speakPhrase.tr)}</p>
      <div class="speakrow">
        <button class="btn" onclick="Speech.say(document.getElementById('sp-target').textContent)">🔊 ${L("Listen","Escucha")}</button>
        <button class="btn" onclick="Speech.say(document.getElementById('sp-target').textContent, 0.6)">🐢 ${L("Slow","Lento")}</button>
      </div>
      ${hasRec
        ? `<button class="btn big rec" id="recbtn" onclick="startListen()">🎙️ ${L("Now you — tap & speak","Ahora tú — toca y habla")}</button>`
        : `<button class="btn big rec" id="recbtn" onclick="toggleRecord()">🎙️ ${L("Record yourself","Grábate")}</button>`}
      <div id="sp-result"></div>
    </div>
    <button class="btn ghost" onclick="viewSpeak()">${L("Next phrase","Siguiente frase")} →</button>
    ${inPlanFlow === "speak" ? `<button class="btn big" onclick="completePlanStep('speak')">✅ ${L("Mark speaking done","Marcar como hecho")}</button>` : ""}
  </div>${navBar()}`;
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("active", b.dataset.v === "speak"));
}

function startListen(){
  const btn = $("#recbtn");
  btn.textContent = "👂 " + L("Listening…","Escuchando…");
  btn.classList.add("live");
  Speech.listen(alts => {
    btn.classList.remove("live");
    btn.innerHTML = "🎙️ " + L("Try again","Otra vez");
    const res = Speech.compare(speakPhrase.vi, alts);
    const pct = Math.round(res.score * 100);
    if (res.score >= 0.99) { State.addXP(15); } else if (res.score >= 0.6) { State.addXP(8); }
    State.touchStreak(); State.save();
    $("#sp-result").innerHTML = `
      <div class="fbx ${pct >= 60 ? "good" : "bad"}">
        <b>${pct >= 99 ? "🌟 " + L("Perfect!","¡Perfecto!") : pct >= 60 ? "👍 " + pct + "%" : "💪 " + pct + "%"}</b>
        <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p>
        <p class="sub">${L("I heard:","Oí:")} “${esc(alts[0] || "")}”</p>
        <p class="sub">${L("Tones aren't scored — focus on the sounds.","Los tonos no se puntúan — céntrate en los sonidos.")}</p>
      </div>`;
  }, err => {
    btn.classList.remove("live");
    btn.innerHTML = "🎙️ " + L("Tap & speak","Toca y habla");
    $("#sp-result").innerHTML = `<p class="sub center">${
      err === "not-allowed"
        ? L("Please allow microphone access in your browser.","Permite el acceso al micrófono en tu navegador.")
        : L("I didn't catch that — try again a bit louder.","No lo capté — inténtalo un poco más alto.")}</p>`;
  });
}

let recording = false;
async function toggleRecord(){
  const btn = $("#recbtn");
  if (!recording){
    try {
      await Recorder.start();
      recording = true;
      btn.textContent = "⏹️ " + L("Stop","Parar");
      btn.classList.add("live");
    } catch(e){
      $("#sp-result").innerHTML = `<p class="sub center">${L("Please allow microphone access.","Permite el acceso al micrófono.")}</p>`;
    }
  } else {
    recording = false;
    btn.classList.remove("live");
    btn.innerHTML = "🎙️ " + L("Record again","Grabar otra vez");
    const url = await Recorder.stop();
    State.touchStreak(); State.addXP(5); State.save();
    $("#sp-result").innerHTML = `
      <div class="fbx good">
        <p class="sub">${L("Compare yourself with the model:","Compárate con el ejemplo:")}</p>
        <audio controls src="${url}" style="width:100%"></audio>
        <button class="btn" onclick="Speech.say(document.getElementById('sp-target').textContent)">🔊 ${L("Model","Ejemplo")}</button>
      </div>`;
  }
}

/* ---------------- Settings ---------------- */
function viewSettings(){
  const d = State.data;
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← ${L("Home","Inicio")}</button>
    <h1>⚙️ ${L("Settings","Ajustes")}</h1>
    <div class="card">
      <h3>${L("Help language","Idioma de ayuda")}</h3>
      <button class="btn ${d.lang === "en" ? "" : "ghost"}" onclick="State.data.lang='en';State.save();viewSettings()">🇬🇧 English</button>
      <button class="btn ${d.lang === "es" ? "" : "ghost"}" onclick="State.data.lang='es';State.save();viewSettings()">🇪🇸 Español</button>
    </div>
    <div class="card">
      <h3>${L("Voice","Voz")}</h3>
      <button class="btn" onclick="Speech.say('Xin chào, rất vui được gặp bạn.')">🔊 ${L("Test the Vietnamese voice","Probar la voz vietnamita")}</button>
      <p class="sub">${L("If you hear nothing, your device has no Vietnamese voice installed yet.","Si no oyes nada, tu dispositivo aún no tiene voz vietnamita instalada.")}</p>
    </div>
    <div class="card">
      <h3>${L("Progress","Progreso")}</h3>
      <p class="sub">${SRS.learnedCount()} ${L("words known","palabras")} · ${d.xp} XP · ${L("level","nivel")} ${SRS.levelLabel()}</p>
      <button class="btn danger" onclick="if(confirm('${L("Really erase ALL progress?","¿Borrar TODO el progreso?")}')){localStorage.removeItem('tiengviet_v1');location.reload();}">🗑️ ${L("Reset everything","Reiniciar todo")}</button>
    </div>
    <p class="sub center">Tiếng Việt! · ${L("made with","hecho con")} ❤️</p>
  </div>${navBar()}`;
}

/* ---------------- Boot ---------------- */
window.addEventListener("DOMContentLoaded", () => {
  State.load();
  Speech.init();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  if (!State.data.onboarded) viewOnboarding();
  else go("home");
});
