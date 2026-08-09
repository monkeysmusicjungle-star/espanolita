// Spoken grammar lessons — read aloud, auto-advancing (~10-15 min each).
// A line with only `en` is spoken explanation; add `es` for a Spanish example
// (spoken slowly, twice, with a pause so you can repeat it).
"use strict";

const LESSONS = [
  {
    id: "l_serestar", title: "Ser vs Estar (to be)", lvl: "A1–A2",
    lines: [
      { en: "In this lesson we learn the two Spanish words for 'to be': ser and estar." },
      { en: "Spanish has two verbs where English has one. Choosing the right one is one of the first big steps." },
      { en: "Use ser for permanent things: who you are, where you're from, your job, what something is." },
      { en: "For example: I am Dutch.", es: "Soy holandesa.", esEn: "I am Dutch." },
      { en: "Here 'soy' comes from ser, because your nationality doesn't change." },
      { en: "Another example: She is a teacher.", es: "Ella es profesora.", esEn: "She is a teacher." },
      { en: "A job or profession uses ser." },
      { en: "Now estar. Use estar for temporary states and for location — where something is right now." },
      { en: "For example: I am tired.", es: "Estoy cansada.", esEn: "I am tired." },
      { en: "Being tired is temporary, so we use estar: estoy." },
      { en: "For location: The coffee is on the table.", es: "El café está en la mesa.", esEn: "The coffee is on the table." },
      { en: "Where something is always uses estar." },
      { en: "A helpful memory trick: for how you FEEL and where you ARE, use estar." },
      { en: "Feelings and location — estar. Everything more permanent — ser." },
      { en: "Listen to the difference. He is boring — a permanent trait.", es: "Él es aburrido.", esEn: "He is boring." },
      { en: "But: He is bored — a feeling right now.", es: "Él está aburrido.", esEn: "He is bored." },
      { en: "Same English word, but ser describes his character and estar describes his mood." },
      { en: "Let's practise the forms of ser: yo soy, tú eres, él es, nosotros somos, ellos son." },
      { en: "And estar: yo estoy, tú estás, él está, nosotros estamos, ellos están." },
      { en: "One more: I am at home.", es: "Estoy en casa.", esEn: "I am at home." },
      { en: "Location, so estar. Well done — that's ser and estar. Practise saying today's examples out loud." }
    ]
  },
  {
    id: "l_gender", title: "El and La — gender", lvl: "A1",
    lines: [
      { en: "Today: the words for 'the' in Spanish — el and la — and why every noun has a gender." },
      { en: "Every Spanish noun is either masculine or feminine. It's not about the object itself — it's just grammar." },
      { en: "Masculine nouns use el. Most words ending in -o are masculine." },
      { en: "For example: the book.", es: "el libro", esEn: "the book" },
      { en: "Feminine nouns use la. Most words ending in -a are feminine." },
      { en: "For example: the house.", es: "la casa", esEn: "the house" },
      { en: "So a good rule of thumb: -o goes with el, -a goes with la." },
      { en: "The house is big.", es: "La casa es grande.", esEn: "The house is big." },
      { en: "But watch out — there are exceptions you must simply learn." },
      { en: "The day — this ends in -a but is masculine.", es: "el día", esEn: "the day" },
      { en: "The hand — this ends in -o but is feminine.", es: "la mano", esEn: "the hand" },
      { en: "The problem — masculine, even though it ends in -a.", es: "el problema", esEn: "the problem" },
      { en: "Words ending in -ción are feminine. The station.", es: "la estación", esEn: "the station" },
      { en: "A tip: always learn a new noun together with its el or la. Don't learn 'casa' — learn 'la casa'." },
      { en: "For plurals, el becomes los and la becomes las." },
      { en: "The books.", es: "los libros", esEn: "the books" },
      { en: "The houses.", es: "las casas", esEn: "the houses" },
      { en: "And the adjective matches too: a red house.", es: "una casa roja", esEn: "a red house." },
      { en: "That's gender. From now on, learn every noun with its little el or la attached." }
    ]
  },
  {
    id: "l_present", title: "Present tense — regular verbs", lvl: "A1",
    lines: [
      { en: "This lesson: how to say what you do — the present tense of regular verbs." },
      { en: "Spanish verbs come in three families, ending in -ar, -er, or -ir." },
      { en: "To use them, you drop the ending and add a new one for each person." },
      { en: "Take hablar, to speak. Drop -ar, and add the endings." },
      { en: "I speak.", es: "Yo hablo.", esEn: "I speak." },
      { en: "You speak.", es: "Tú hablas.", esEn: "You speak." },
      { en: "He or she speaks.", es: "Él habla.", esEn: "He speaks." },
      { en: "We speak.", es: "Nosotros hablamos.", esEn: "We speak." },
      { en: "They speak.", es: "Ellos hablan.", esEn: "They speak." },
      { en: "So the -ar endings are: o, as, a, amos, an." },
      { en: "Now an -er verb: comer, to eat. I eat.", es: "Yo como.", esEn: "I eat." },
      { en: "You eat.", es: "Tú comes.", esEn: "You eat." },
      { en: "We eat.", es: "Nosotros comemos.", esEn: "We eat." },
      { en: "The -er endings: o, es, e, emos, en." },
      { en: "And an -ir verb: vivir, to live. I live in Spain.", es: "Yo vivo en España.", esEn: "I live in Spain." },
      { en: "They live here.", es: "Ellos viven aquí.", esEn: "They live here." },
      { en: "The -ir endings are almost the same as -er: o, es, e, imos, en." },
      { en: "Notice that in Spanish you often drop the word for 'I' or 'you', because the ending already tells you who." },
      { en: "Hablo español already means 'I speak Spanish' — no yo needed.", es: "Hablo español.", esEn: "I speak Spanish." },
      { en: "Practise the three verbs out loud: hablar, comer, vivir. That's the present tense." }
    ]
  },
  {
    id: "l_past", title: "The past — pretérito vs imperfecto", lvl: "A2–B1",
    lines: [
      { en: "Today, the two main past tenses: the pretérito and the imperfecto, and when to use each." },
      { en: "The pretérito is for finished, single actions — something that happened and ended." },
      { en: "Yesterday I went to the market.", es: "Ayer fui al mercado.", esEn: "Yesterday I went to the market." },
      { en: "That's one completed action, so we use the pretérito: fui." },
      { en: "I ate paella last night.", es: "Anoche comí paella.", esEn: "Last night I ate paella." },
      { en: "Again, one finished action: comí." },
      { en: "The imperfecto is different. It's for background, habits, and how things used to be." },
      { en: "When I was a child, I lived in the countryside.", es: "Cuando era niña, vivía en el campo.", esEn: "When I was a child, I lived in the countryside." },
      { en: "'Era' and 'vivía' describe an ongoing situation in the past, so we use the imperfecto." },
      { en: "Every day I used to walk to school.", es: "Cada día caminaba a la escuela.", esEn: "Every day I used to walk to school." },
      { en: "A repeated habit in the past — imperfecto: caminaba." },
      { en: "A simple way to feel the difference: the imperfecto sets the scene, the pretérito is the event." },
      { en: "It was raining when I arrived.", es: "Llovía cuando llegué.", esEn: "It was raining when I arrived." },
      { en: "'Llovía' is the background, the imperfecto. 'Llegué' is the single event, the pretérito." },
      { en: "Words like 'ayer', 'anoche', and 'el año pasado' often signal the pretérito." },
      { en: "Words like 'siempre', 'cada día', and 'cuando era' often signal the imperfecto." },
      { en: "Don't worry about getting it perfect — even the difference of ideas is the key thing." },
      { en: "Practise: say one thing you did yesterday, and one thing you used to do as a child." }
    ]
  },
  {
    id: "l_porpara", title: "Por vs Para", lvl: "B1",
    lines: [
      { en: "This lesson: por and para. Both can mean 'for', but they're used differently." },
      { en: "Use para for a goal, a purpose, or a destination — where something is heading." },
      { en: "This gift is for you.", es: "Este regalo es para ti.", esEn: "This gift is for you." },
      { en: "The gift's destination is you, so para." },
      { en: "I study to speak Spanish.", es: "Estudio para hablar español.", esEn: "I study to speak Spanish." },
      { en: "The purpose of studying is speaking, so para." },
      { en: "We leave for Madrid tomorrow.", es: "Salimos para Madrid mañana.", esEn: "We leave for Madrid tomorrow." },
      { en: "A destination — para." },
      { en: "Now por. Use por for a reason, a cause, an exchange, or movement through a place." },
      { en: "Thank you for your help.", es: "Gracias por tu ayuda.", esEn: "Thank you for your help." },
      { en: "The help is the reason for the thanks, so por." },
      { en: "I paid twenty euros for the book.", es: "Pagué veinte euros por el libro.", esEn: "I paid twenty euros for the book." },
      { en: "An exchange — money for a book — uses por." },
      { en: "We walk through the park.", es: "Caminamos por el parque.", esEn: "We walk through the park." },
      { en: "Movement through a place — por." },
      { en: "A short way to remember: para points forward to a goal; por looks back at a reason or moves through." },
      { en: "It's tricky, so don't rush. Learn a few fixed phrases: gracias por, para ti, por favor." },
      { en: "Practise saying today's examples aloud, and you'll build a feel for it over time." }
    ]
  }
];
const LESSONS_BY_ID = Object.fromEntries(LESSONS.map(l => [l.id, l]));

/* ---------- Player ---------- */
let LESSON = { id: null, i: 0, playing: false, seq: 0, phase: "main", recap: [], ri: 0 };

function lessonSpeak(text, lang, cb, rate){
  let done = false;
  const finish = () => { if (done) return; done = true; cb && cb(); };
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    if (lang.indexOf("es") === 0 && Speech.voice) u.voice = Speech.voice;
    u.rate = rate || 0.95;
    u.pitch = lang.indexOf("es") === 0 ? 1.08 : 1;
    u.onend = finish; u.onerror = finish;
    speechSynthesis.speak(u);
    setTimeout(finish, Math.min(14000, 2000 + text.length * 95));
  } catch(e){ finish(); }
}

function viewLessons(){
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>🧠 Grammar lessons (spoken)</h1>
    <p class="sub">Set the phone down and listen. Each lesson explains one grammar point out loud, with Spanish examples said slowly for you to repeat. About 10–15 minutes each.</p>
    ${LESSONS.map(l => `<button class="card weekcard" onclick="startLesson('${l.id}')">
      <b>${esc(l.title)}</b><span class="sub">${l.lvl} · ${l.lines.length} points</span>
    </button>`).join("")}
  </div>${navBar()}`;
}

function startLesson(id){
  LESSON = { id, i: 0, playing: true, seq: LESSON.seq + 1, phase: "main", recap: [], ri: 0 };
  renderLesson();
  lessonPlayStep();
}

function renderLesson(){
  const l = LESSONS_BY_ID[LESSON.id];
  if (!l) return viewLessons();
  const line = l.lines[Math.min(LESSON.i, l.lines.length - 1)];
  APP.innerHTML = `<div class="screen">
    <div class="sessiontop">
      <button class="back" onclick="lessonStop()">■ Stop</button>
      <div class="progress"><div style="width:${(LESSON.i / l.lines.length) * 100}%"></div></div>
    </div>
    <h2 class="center">${esc(l.title)}</h2>
    <p class="sub center">Point ${Math.min(LESSON.i + 1, l.lines.length)} of ${l.lines.length}</p>
    <div class="card center">
      <p class="lessonline">${esc(line.en)}</p>
      ${line.es ? `<p class="es big-es">${esc(line.es)}</p><p class="sub">${esc(line.esEn || "")}
        <button class="say" onclick="Speech.say('${esc(line.es)}', 0.7)">🔊</button></p>` : ""}
    </div>
    <div class="lessonctrls">
      <button class="btn" onclick="lessonPrev()">⏮</button>
      ${LESSON.playing
        ? `<button class="btn big" onclick="lessonPause()">⏸ Pause</button>`
        : `<button class="btn big rec" onclick="lessonResume()">▶️ Play</button>`}
      <button class="btn" onclick="lessonNext()">⏭</button>
    </div>
  </div>${navBar()}`;
}

function lessonPlayStep(){
  const l = LESSONS_BY_ID[LESSON.id];
  if (!l) return;

  // Review phase: re-say each example sentence slowly for extra repetition.
  if (LESSON.phase === "recap"){
    if (LESSON.ri >= LESSON.recap.length) return lessonDone();
    const rl = LESSON.recap[LESSON.ri];
    const mySeq = LESSON.seq;
    renderRecap(rl);
    lessonSpeak(rl.es, "es-ES", () => {
      if (LESSON.seq !== mySeq || !LESSON.playing) return;
      setTimeout(() => {   // pause to repeat, then move on
        if (LESSON.seq === mySeq && LESSON.playing){ LESSON.ri++; lessonPlayStep(); }
      }, 2500);
    }, 0.66);
    return;
  }

  if (LESSON.i >= l.lines.length){
    // Enter the review phase (all the example sentences), then finish.
    LESSON.recap = l.lines.filter(x => x.es);
    if (LESSON.recap.length){ LESSON.phase = "recap"; LESSON.ri = 0; return lessonPlayStep(); }
    return lessonDone();
  }
  renderLesson();
  const mySeq = LESSON.seq;
  const line = l.lines[LESSON.i];
  lessonSpeak(line.en, "en-US", () => {
    if (LESSON.seq !== mySeq || !LESSON.playing) return;
    if (line.es){
      lessonSpeak(line.es, "es-ES", () => {
        if (LESSON.seq !== mySeq || !LESSON.playing) return;
        setTimeout(() => {   // a pause for you to repeat it
          if (LESSON.seq !== mySeq || !LESSON.playing) return;
          lessonSpeak(line.es, "es-ES", () => { if (LESSON.seq === mySeq && LESSON.playing) lessonAdvance(); }, 0.7);
        }, 2200);
      }, 0.7);
    } else {
      setTimeout(() => { if (LESSON.seq === mySeq && LESSON.playing) lessonAdvance(); }, 500);
    }
  });
}

function lessonAdvance(){ LESSON.i++; lessonPlayStep(); }

function renderRecap(rl){
  const l = LESSONS_BY_ID[LESSON.id];
  APP.innerHTML = `<div class="screen">
    <div class="sessiontop">
      <button class="back" onclick="lessonStop()">■ Stop</button>
      <div class="progress"><div style="width:${((LESSON.ri + 1) / Math.max(1, LESSON.recap.length)) * 100}%"></div></div>
    </div>
    <h2 class="center">🔁 Review · ${esc(l.title)}</h2>
    <p class="sub center">Say each sentence out loud after me (${LESSON.ri + 1}/${LESSON.recap.length})</p>
    <div class="card center">
      <p class="es big-es">${esc(rl.es)}</p>
      <p class="sub">${esc(rl.esEn || "")} <button class="say" onclick="Speech.say('${esc(rl.es)}', 0.66)">🔊</button></p>
    </div>
    <div class="lessonctrls">
      ${LESSON.playing
        ? `<button class="btn big" onclick="lessonPause()">⏸ Pause</button>`
        : `<button class="btn big rec" onclick="lessonResume()">▶️ Play</button>`}
    </div>
  </div>${navBar()}`;
}

function lessonPause(){
  LESSON.playing = false; LESSON.seq++;
  try { speechSynthesis.cancel(); } catch(e){}
  if (LESSON.phase === "recap") renderRecap(LESSON.recap[Math.min(LESSON.ri, LESSON.recap.length - 1)]);
  else renderLesson();
}
function lessonResume(){ LESSON.playing = true; LESSON.seq++; lessonPlayStep(); }
function lessonNext(){
  const l = LESSONS_BY_ID[LESSON.id];
  LESSON.seq++; try { speechSynthesis.cancel(); } catch(e){}
  LESSON.i = Math.min(l.lines.length - 1, LESSON.i + 1);
  if (LESSON.playing) lessonPlayStep(); else renderLesson();
}
function lessonPrev(){
  LESSON.seq++; try { speechSynthesis.cancel(); } catch(e){}
  LESSON.i = Math.max(0, LESSON.i - 1);
  if (LESSON.playing) lessonPlayStep(); else renderLesson();
}
function lessonStop(){
  LESSON.playing = false; LESSON.seq++;
  try { speechSynthesis.cancel(); } catch(e){}
  viewLessons();
}
function lessonDone(){
  LESSON.playing = false;
  State.addXP(15); State.touchStreak(); State.save();
  APP.innerHTML = `<div class="screen center">
    <div class="hero">🎓</div>
    <h1>Lesson complete!</h1>
    <p class="sub center">+15 XP · Now try saying today's examples in the speaking tutor.</p>
    <button class="btn big rec" onclick="go('talk')">🗣️ Practise speaking</button>
    <button class="btn big ghost" onclick="viewLessons()">Another lesson</button>
  </div>${navBar()}`;
}
