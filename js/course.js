// 5-Week Spanish Fluency Course — ~2 hours/day of varied practice.
// Mixes in-app activities with links to free external resources.
"use strict";

// Free-only resources (all free to watch/listen — no subscriptions).
const RES = {
  dreaming:   { label: "Dreaming Spanish — free videos (YouTube)", url: "https://www.youtube.com/results?search_query=dreaming+spanish+super+beginner" },
  langtrans:  { label: "Language Transfer — free audio course", url: "https://www.languagetransfer.org/" },
  coffee:     { label: "Coffee Break Spanish — free podcast (YouTube)", url: "https://www.youtube.com/results?search_query=coffee+break+spanish+season+1" },
  notes:      { label: "Notes in Spanish — free podcast (YouTube)", url: "https://www.youtube.com/results?search_query=notes+in+spanish+beginners" },
  butterfly:  { label: "Butterfly Spanish — free lessons (YouTube)", url: "https://www.youtube.com/results?search_query=butterfly+spanish+lessons" },
  juan:       { label: "Español con Juan — free videos (YouTube)", url: "https://www.youtube.com/results?search_query=espanol+con+juan+principiantes" },
  music:      { label: "Easy Spanish songs (YouTube)", url: "https://www.youtube.com/results?search_query=canciones+en+espanol+faciles+con+letra" }
};

const COURSE = [
  { n: 1, level: "A1", theme: "Foundations",
    goal: "Greetings, introducing yourself, present tense, numbers, sounds.",
    input: RES.dreaming, audio: RES.langtrans,
    tip: "Repeat everything out loud. Don't worry about perfect grammar — get comfortable making Spanish sounds." },
  { n: 2, level: "A1→A2", theme: "Daily life",
    goal: "Food, shopping, ordering, telling the time, likes/dislikes.",
    input: RES.dreaming, audio: RES.coffee,
    tip: "Talk about YOUR day: narrate simple actions aloud (‘tomo un café’, ‘voy a la tienda’)." },
  { n: 3, level: "A2", theme: "Past & plans",
    goal: "Talking about yesterday (pretérito), the near future (voy a…), and asking questions.",
    input: RES.butterfly, audio: RES.coffee,
    tip: "Each night, say 3 sentences about what you did today and 3 about tomorrow." },
  { n: 4, level: "A2→B1", theme: "Opinions & conversation",
    goal: "Giving opinions, connectors (porque, pero, aunque), longer sentences.",
    input: RES.juan, audio: RES.notes,
    tip: "In the AI chat with Lola, refuse to switch to English — push through in Spanish." },
  { n: 5, level: "B1→B2", theme: "Fluency",
    goal: "Real conversation, subjunctive basics, reacting naturally, faster speech.",
    input: RES.juan, audio: RES.notes,
    tip: "Aim to speak without pausing to translate in your head. Speed over perfection." }
];

// A day's ~2-hour plan. The "input" and "extra" blocks rotate by weekday so
// each day feels different. type: "app" links to a screen; "link" opens a URL.
function courseDay(week, day){
  const w = COURSE[week - 1];
  const rot = (day - 1) % 5;
  const inputBlock = [
    { icon: "📺", mins: 30, label: "Watch: " + w.input.label, type: "link", url: w.input.url },
    { icon: "🎧", mins: 30, label: "Listen: " + w.audio.label, type: "link", url: w.audio.url },
    { icon: "📖", mins: 30, label: "Read along: " + w.input.label, type: "link", url: w.input.url },
    { icon: "🎧", mins: 30, label: "Listen: " + w.audio.label, type: "link", url: w.audio.url },
    { icon: "📺", mins: 30, label: "Watch & repeat: " + w.input.label, type: "link", url: w.input.url }
  ][rot];
  const extraBlock = [
    { icon: "🎵", mins: 15, label: "Song practice", type: "app", view: "songs" },
    { icon: "🧩", mins: 15, label: "Crossword", type: "app", view: "crossword" },
    { icon: "🔄", mins: 15, label: "Translate 5 sentences you'd really say", type: "app", view: "translate" },
    { icon: "🎵", mins: 15, label: "Song practice", type: "app", view: "songs" },
    { icon: "🧩", mins: 15, label: "Crossword", type: "app", view: "crossword" }
  ][rot];
  return [
    { icon: "🗣️", mins: 30, label: "Hands-free speaking tutor", type: "app", view: "talk" },
    { icon: "🎯", mins: 25, label: "Vocabulary + grammar (daily plan)", type: "app", view: "practice" },
    inputBlock,
    { icon: "🤖", mins: 20, label: "Conversation with Lola (AI tutor) — Spanish only", type: "app", view: "ai" },
    extraBlock
  ];
}

function courseDoneKey(w, d){ return "w" + w + "d" + d; }
function courseProgress(){
  const c = State.data.course || (State.data.course = { done: {} });
  return c;
}

/* ---------- Course overview ---------- */
function viewCourse(){
  const c = courseProgress();
  const doneTotal = Object.keys(c.done).filter(k => c.done[k]).length;
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('home')">← Home</button>
    <h1>📘 5-Week Fluency Course</h1>
    <p class="sub">About 2 hours a day of varied practice. Do the days in order — each mixes speaking, listening, vocabulary and real conversation. ${doneTotal}/35 days done.</p>
    ${COURSE.map(w => {
      const wd = [1,2,3,4,5,6,7].filter(d => c.done[courseDoneKey(w.n, d)]).length;
      return `<button class="card weekcard" onclick="viewCourseWeek(${w.n})">
        <b>Week ${w.n} · ${w.level} — ${esc(w.theme)}</b>
        <span class="sub">${esc(w.goal)}</span>
        <span class="sub">${wd}/7 days ${"✅".repeat(wd)}</span>
      </button>`;
    }).join("")}
    <p class="sub center">Links open free outside sites in your browser. Everything with an app icon happens right here.</p>
  </div>${navBar()}`;
}

function viewCourseWeek(n){
  const w = COURSE[n - 1];
  const c = courseProgress();
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="go('course')">← Course</button>
    <h1>Week ${w.n}: ${esc(w.theme)}</h1>
    <p class="sub"><b>${w.level}</b> · ${esc(w.goal)}</p>
    <div class="card"><p>💡 ${esc(w.tip)}</p></div>
    ${[1,2,3,4,5,6,7].map(d => {
      const done = c.done[courseDoneKey(w.n, d)];
      return `<button class="planrow ${done ? "done" : ""}" onclick="viewCourseDay(${w.n},${d})">
        <span class="pi">${done ? "✅" : "📅"}</span>
        <span class="pt"><b>Day ${d}</b><span class="sub">~2 hours</span></span>
        <span class="arrow">›</span>
      </button>`;
    }).join("")}
  </div>${navBar()}`;
}

function viewCourseDay(w, d){
  const week = COURSE[w - 1];
  const blocks = courseDay(w, d);
  const c = courseProgress();
  const done = c.done[courseDoneKey(w, d)];
  const total = blocks.reduce((s, b) => s + b.mins, 0);
  APP.innerHTML = `<div class="screen">
    <button class="back" onclick="viewCourseWeek(${w})">← Week ${w}</button>
    <h1>Week ${w} · Day ${d}</h1>
    <p class="sub">${week.level} — ${esc(week.theme)} · about ${total} minutes</p>
    <div class="card">
      ${blocks.map((b, i) => `
        <div class="courseblock">
          <span class="cb-icon">${b.icon}</span>
          <span class="cb-main"><b>${esc(b.label)}</b><span class="sub">${b.mins} min</span></span>
          ${b.type === "app"
            ? `<button class="btn small" onclick="go('${b.view}')">Do it →</button>`
            : `<a class="btn small" href="${b.url}" target="_blank" rel="noopener">Open ↗</a>`}
        </div>`).join("")}
    </div>
    <button class="btn big ${done ? "ghost" : ""}" onclick="courseToggleDay(${w},${d})">
      ${done ? "✅ Day complete (tap to undo)" : "Mark this day complete"}
    </button>
  </div>${navBar()}`;
}

function courseToggleDay(w, d){
  const c = courseProgress();
  const k = courseDoneKey(w, d);
  if (c.done[k]){ delete c.done[k]; }
  else { c.done[k] = true; State.addXP(20); State.touchStreak(); }
  State.save();
  viewCourseDay(w, d);
}
