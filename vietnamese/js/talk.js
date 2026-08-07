// Hands-free Vietnamese speaking tutor + microphone/voice diagnostic.
"use strict";

const TALK = { running: false, seq: 0, rec: null, queue: [], drill: null, attempt: 0, noHear: 0,
               right: 0, wrong: 0, xpStart: 0, recMode: false };
const TALK_BANDS = ["A1", "A2"];

// Keep the screen awake so the phone doesn't suspend the mic when set down.
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

function talkSpeak(text, lang, cb, rate){
  let done = false;
  const finish = () => { if (done) return; done = true; cb && cb(); };
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    if (lang.indexOf("vi") === 0 && Speech.voice) u.voice = Speech.voice;
    u.rate = rate || 0.9;
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

/* ================= Mic / voice diagnostic ================= */
function viewMicCheck(){
  const rec = Speech.hasRecognition();
  const voice = Speech.hasVoice();
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← ${L("Home","Inicio")}</button>
    <h1>🔧 ${L("Check mic & voice","Comprobar micro y voz")}</h1>
    <div class="card">
      <div class="row"><b>${L("Speech recognition","Reconocimiento de voz")}</b>
        <span>${rec ? "✅ " + L("available","disponible") : "❌ " + L("not available","no disponible")}</span></div>
      <div class="row"><b>${L("Vietnamese voice","Voz vietnamita")}</b>
        <span id="voice-state">${voice ? "✅ " + L("installed","instalada") : "❌ " + L("not found","no encontrada")}</span></div>
    </div>
    <div class="card center">
      <p class="sub">${L("1) Test the voice — you should hear a Vietnamese greeting:","1) Prueba la voz — deberías oír un saludo en vietnamita:")}</p>
      <button class="btn big" onclick="Speech.say('Xin chào, rất vui được gặp bạn.')">🔊 ${L("Play test sound","Reproducir sonido")}</button>
    </div>
    <div class="card center">
      <p class="sub">${L("2) Test the microphone — tap, then say “xin chào”:","2) Prueba el micro — toca y di «xin chào»:")}</p>
      <button class="btn big rec" id="mic-test-btn" onclick="micTest()">🎙️ ${L("Test microphone","Probar micrófono")}</button>
      <div id="mic-test-out"></div>
    </div>
    ${!voice ? `<div class="card">
      <h3>🔊 ${L("No Vietnamese voice? Add one:","¿Sin voz vietnamita? Añade una:")}</h3>
      <p class="sub">${L("Android: Settings → System → Languages & input → Text-to-speech → Google → install Vietnamese. iPhone: Settings → Accessibility → Spoken Content → Voices → Vietnamese.",
        "Android: Ajustes → Sistema → Idiomas → Texto a voz → Google → instalar vietnamita. iPhone: Ajustes → Accesibilidad → Contenido hablado → Voces → Vietnamita.")}</p>
    </div>` : ""}
    ${!rec ? `<div class="card">
      <p class="sub">${L("Your browser can't recognise speech. Speaking practice will still work — you'll record yourself and compare with the model. For live recognition, use Chrome on Android.",
        "Tu navegador no reconoce la voz. La práctica de hablar seguirá funcionando: te grabas y comparas con el ejemplo. Para reconocimiento en vivo, usa Chrome en Android.")}</p>
    </div>` : ""}
  </div>${navBar()}`;
}

function micTest(){
  const btn = document.getElementById("mic-test-btn");
  const out = document.getElementById("mic-test-out");
  if (!Speech.hasRecognition()){
    out.innerHTML = `<p class="sub">❌ ${L("No speech recognition in this browser — try Chrome on Android.","Sin reconocimiento de voz en este navegador — prueba Chrome en Android.")}</p>`;
    return;
  }
  btn.textContent = "👂 " + L("Listening…","Escuchando…"); btn.classList.add("live");
  Speech.listen(alts => {
    btn.classList.remove("live"); btn.textContent = "🎙️ " + L("Test again","Probar otra vez");
    out.innerHTML = `<div class="fbx good"><b>✅ ${L("It works! I heard:","¡Funciona! Oí:")}</b><p class="es">“${esc(alts[0] || "")}”</p></div>`;
  }, err => {
    btn.classList.remove("live"); btn.textContent = "🎙️ " + L("Test again","Probar otra vez");
    const m = err === "not-allowed"
      ? L("Microphone blocked. Allow it: tap the 🔒/ⓘ icon in the address bar → Microphone → Allow, then reload.",
          "Micrófono bloqueado. Permítelo: toca el icono 🔒/ⓘ en la barra → Micrófono → Permitir, y recarga.")
      : err === "language-not-supported"
      ? L("Your phone doesn't have Vietnamese recognition. Speaking practice will use record-and-compare instead.",
          "Tu teléfono no tiene reconocimiento de vietnamita. La práctica usará grabar-y-comparar.")
      : L("I didn't catch anything — try again a bit louder in a quiet place.",
          "No capté nada — inténtalo más alto en un lugar silencioso.");
    out.innerHTML = `<p class="sub">⚠️ ${m}</p>`;
  });
}

/* ================= Intro ================= */
function viewTalk(){
  const band = TALK_BANDS[State.data.speakBand || 0];
  const mastered = DRILLS.filter(d => (State.data.items[d.id] || {}).ivl >= 3).length;
  const rec = Speech.hasRecognition();
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← ${L("Home","Inicio")}</button>
    <h1>🗣️ ${L("Hands-free speaking","Hablar sin manos")}</h1>
    <div class="card">
      <p><b>${L("Put your phone down and just talk.","Deja el teléfono y solo habla.")}</b>
      ${L("I'll show a sentence, say it, and ask you to repeat it in Vietnamese. Then I check it and help you fix it — automatically.",
        "Muestro una frase, la digo y te pido repetirla en vietnamita. Luego la reviso y te ayudo a mejorarla — automáticamente.")}</p>
      <p class="sub">${L("Level","Nivel")}: <b>${band}</b> · ${mastered} ${L("sentences mastered","frases dominadas")}</p>
    </div>
    <button class="btn big rec" onclick="talkStart()">▶️ ${L("Start talking","Empezar a hablar")}</button>
    <button class="btn ghost" onclick="viewMicCheck()">🔧 ${L("Mic not working? Check it here","¿El micro no va? Compruébalo aquí")}</button>
    <p class="sub center">${rec
      ? L("When it asks, tap Allow for the microphone. Tap Stop anytime.","Cuando lo pida, toca Permitir para el micrófono. Toca Parar cuando quieras.")
      : L("No live recognition here — you'll record yourself and compare with the model.","Sin reconocimiento en vivo — te grabarás y compararás con el ejemplo.")}</p>
  </div>${navBar()}`;
}

/* ================= Session ================= */
function talkStart(){
  TALK.running = true;
  TALK.seq++;
  talkAcquireWake();
  TALK.recMode = !Speech.hasRecognition();
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
  const q = shuffle([...sample(due, 10), ...fresh]);
  return q.length ? q : shuffle(DRILLS.filter(d => d.lv === TALK_BANDS[State.data.speakBand || 0])).slice(0, 8);
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

function talkAdvanceBand(){
  let b = State.data.speakBand || 0;
  if (b >= TALK_BANDS.length - 1) return;
  const cur = DRILLS.filter(d => d.lv === TALK_BANDS[b]);
  const seen = cur.filter(d => State.data.items[d.id]).length;
  if (seen / cur.length >= 0.8){ State.data.speakBand = b + 1; State.save(); }
}

function talkPrompt(retry){
  if (!TALK.running) return;
  const d = TALK.drill;
  const mySeq = TALK.seq;
  APP.innerHTML = `<div class="screen talk">
    <div class="sessiontop">
      <button class="back" onclick="talkStop()">■ ${L("Stop","Parar")}</button>
      <div class="progress"><div style="width:${100 * TALK.right / Math.max(1, TALK.right + TALK.wrong + TALK.queue.length + 1)}%"></div></div>
    </div>
    <p class="sub center">${d.lv} · ${retry ? L("Try again","Otra vez") : L("Say this in Vietnamese","Di esto en vietnamita")}</p>
    <div class="card center">
      <p class="es big-es">${esc(d.vi)}</p>
      <p class="sub">${esc(tr(d))}</p>
      <button class="btn" onclick="Speech.say('${esc(d.vi)}')">🔊 ${L("Hear it","Escúchala")}</button>
      <div class="talkmic" id="talk-mic">🎙️</div>
      <p class="talkstatus" id="talk-status">…</p>
      <div id="talk-fb"></div>
    </div>
    <button class="btn ghost" onclick="talkSkip()">${L("Skip","Saltar")} →</button>
  </div>${navBar()}`;

  talkStatus("🔊 " + L("Speaking…","Hablando…"), "");
  talkSpeak(d.vi, "vi-VN", () => { if (TALK.seq === mySeq) (TALK.recMode ? talkRecord() : talkListen()); });
}

/* --- live recognition path --- */
function talkListen(){
  if (!TALK.running) return;
  const mySeq = TALK.seq;
  const mic = document.getElementById("talk-mic");
  if (mic) mic.classList.add("live");
  talkStatus("👂 " + L("Listening… say it now","Escuchando… dilo ahora"), "live");
  TALK.rec = Speech.listen(alts => {
    if (TALK.seq !== mySeq || !TALK.running) return;
    if (mic) mic.classList.remove("live");
    talkGrade(alts);
  }, err => {
    if (TALK.seq !== mySeq || !TALK.running) return;
    if (mic) mic.classList.remove("live");
    if (err === "not-allowed" || err === "service-not-allowed"){
      talkStatus("🚫 " + L("Allow the microphone, then Start again.","Permite el micrófono y pulsa Empezar."), "bad");
      TALK.running = false;
      talkReleaseWake();
      document.getElementById("talk-fb").innerHTML =
        `<button class="btn" onclick="viewMicCheck()">🔧 ${L("Fix the microphone","Arreglar el micrófono")}</button>`;
      return;
    }
    if (err === "language-not-supported"){
      TALK.recMode = true;  // fall back to record & compare for the rest
      return talkRecord();
    }
    // Transient (silence, screen sleep/wake) — keep re-listening a few times.
    TALK.noHear++;
    if (TALK.noHear <= 4){
      talkStatus("👂 " + L("Still listening…","Sigo escuchando…"), "live");
      setTimeout(() => { if (TALK.seq === mySeq && TALK.running) talkListen(); }, 500);
      return;
    }
    talkStatus(L("Paused — tap to keep going.","En pausa — toca para seguir."), "");
    document.getElementById("talk-fb").innerHTML =
      `<button class="btn big rec" onclick="TALK.noHear=0;talkAcquireWake();talkListen()">🎙️ ${L("Resume","Seguir")}</button>
       <button class="btn ghost" onclick="talkNext()">${L("Next","Siguiente")} →</button>`;
  });
}

/* --- record & compare fallback (no recognition) --- */
async function talkRecord(){
  if (!TALK.running) return;
  const mic = document.getElementById("talk-mic");
  const fb = document.getElementById("talk-fb");
  talkStatus(L("Record yourself saying it:","Grábate diciéndola:"), "");
  fb.innerHTML = `<button class="btn big rec" id="talk-recbtn" onclick="talkRecToggle()">🎙️ ${L("Record","Grabar")}</button>`;
}
let talkRecording = false;
async function talkRecToggle(){
  const btn = document.getElementById("talk-recbtn");
  if (!talkRecording){
    try {
      await Recorder.start();
      talkRecording = true;
      btn.textContent = "⏹️ " + L("Stop","Parar"); btn.classList.add("live");
      const mic = document.getElementById("talk-mic"); if (mic) mic.classList.add("live");
    } catch(e){
      talkStatus("🚫 " + L("Allow the microphone.","Permite el micrófono."), "bad");
    }
  } else {
    talkRecording = false;
    btn.classList.remove("live");
    const mic = document.getElementById("talk-mic"); if (mic) mic.classList.remove("live");
    const url = await Recorder.stop();
    const d = TALK.drill;
    TALK.right++;
    SRS.answer(d.id, true);   // self-graded practice always counts as done
    talkAdvanceBand();
    document.getElementById("talk-fb").innerHTML = `<div class="fbx good">
      <p class="sub">${L("Compare yourself with the model:","Compárate con el ejemplo:")}</p>
      <audio controls src="${url}" style="width:100%"></audio>
      <div class="speakrow">
        <button class="btn" onclick="Speech.say('${esc(d.vi)}')">🔊 ${L("Model","Ejemplo")}</button>
        <button class="btn big" onclick="talkNext()">${L("Next","Siguiente")} →</button>
      </div></div>`;
    talkStatus("✅ " + L("Good — keep going!","¡Bien, sigue!"), "good");
  }
}

function talkGrade(alts){
  const d = TALK.drill;
  const res = Speech.compare(d.vi, alts);
  const pct = Math.round(res.score * 100);
  const heard = alts[0] || "";
  const mySeq = TALK.seq;

  if (res.score >= 0.55){
    TALK.right++;
    SRS.answer(d.id, true);
    talkAdvanceBand();
    document.getElementById("talk-fb").innerHTML = `<div class="fbx good">
      <b>${pct >= 99 ? "🌟 " + L("Perfect!","¡Perfecto!") : "✅ " + L("Well done!","¡Muy bien!") + " " + pct + "%"}</b>
      <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p></div>`;
    talkStatus("✅ " + L("Correct!","¡Correcto!"), "good");
    talkSpeak("Tốt lắm!", "vi-VN", () => { if (TALK.seq === mySeq) talkNext(); });
    return;
  }

  TALK.attempt++;
  document.getElementById("talk-fb").innerHTML = `<div class="fbx bad">
    <b>${L("Almost","Casi")} — ${pct}%</b>
    <p class="sub">${L("I heard:","Oí:")} “${esc(heard)}”</p>
    <p class="wordchips">${res.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</p>
    <p class="sub">${L("Say:","Di:")} <b>${esc(d.vi)}</b></p>
    <p class="sub">${L("Tones aren't scored — focus on the sounds.","Los tonos no se puntúan — céntrate en los sonidos.")}</p></div>`;

  if (TALK.attempt >= 3){
    TALK.wrong++;
    SRS.answer(d.id, false);
    talkStatus(L("Let's move on — you'll see this again.","Sigamos — la verás de nuevo."), "");
    talkSpeak(d.vi, "vi-VN", () => { if (TALK.seq === mySeq) talkNext(); }, 0.72);
  } else {
    talkStatus("🔁 " + L("Listen and try again","Escucha e inténtalo"), "");
    talkSpeak(d.vi, "vi-VN", () => { if (TALK.seq === mySeq) talkPrompt(true); }, 0.7);
  }
}

function tuiLang(){ return State.data.lang === "es" ? "es-ES" : "en-US"; }

function talkSkip(){
  if (!TALK.running) return;
  TALK.wrong++;
  SRS.answer(TALK.drill.id, false);
  TALK.seq++;
  try { speechSynthesis.cancel(); } catch(e){}
  try { if (TALK.rec) TALK.rec.abort(); } catch(e){}
  TALK.running = true;
  talkNext();
}

function talkEnd(stopped){
  TALK.running = false;
  talkReleaseWake();
  const earned = State.data.xp - TALK.xpStart;
  APP.innerHTML = `<div class="screen center">
    <div class="hero">🗣️</div>
    <h1>${stopped ? L("Session ended","Sesión terminada") : L("Well done!","¡Muy bien!")}</h1>
    <div class="tiles">
      <div class="tile"><b>${TALK.right}</b><span>${L("said","dichas")}</span></div>
      <div class="tile"><b>+${earned}</b><span>XP</span></div>
      <div class="tile"><b>${TALK_BANDS[State.data.speakBand || 0]}</b><span>${L("level","nivel")}</span></div>
    </div>
    <p class="sub center">${L("Come back tomorrow — hard sentences return until they feel easy.","Vuelve mañana — las frases difíciles regresan hasta que sean fáciles.")}</p>
    <button class="btn big rec" onclick="talkStart()">▶️ ${L("Keep going","Seguir")}</button>
    <button class="btn big ghost" onclick="go('home')">${L("Done for now","Listo por ahora")}</button>
  </div>${navBar()}`;
}
