// Spaced repetition (simplified SM-2) + persistent app state.
const STORE_KEY = "tiengviet_v1";

function todayNum(){ return Math.floor(Date.now() / 86400000); }

const State = {
  data: null,

  defaults(){
    return {
      onboarded: false,
      lang: "en",              // interface language: "en" | "es"
      band: 0,                 // 0 = A1, 1 = A2, 2 = B1
      xp: 0,
      streak: { last: null, count: 0 },
      items: {},               // id -> {ease, ivl, due, reps, lapses}
      introduced: [],          // vocab ids in the order they were unlocked
      recent: [],              // last answers (1/0)
      stats: { answers: 0, correct: 0, days: {} },
      plan: null
    };
  },

  load(){
    try {
      const raw = localStorage.getItem(STORE_KEY);
      this.data = raw ? Object.assign(this.defaults(), JSON.parse(raw)) : this.defaults();
    } catch(e){ this.data = this.defaults(); }
    return this.data;
  },

  save(){
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch(e){}
  },

  touchStreak(){
    const d = this.data, t = new Date().toISOString().slice(0,10);
    if (d.streak.last === t) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    d.streak.count = (d.streak.last === yesterday) ? d.streak.count + 1 : 1;
    d.streak.last = t;
  },

  addXP(n){
    this.data.xp += n;
    const t = new Date().toISOString().slice(0,10);
    this.data.stats.days[t] = (this.data.stats.days[t] || 0) + n;
  }
};

const SRS = {
  ensure(id){
    const items = State.data.items;
    if (!items[id]) items[id] = { ease: 2.5, ivl: 0, due: todayNum(), reps: 0, lapses: 0 };
    return items[id];
  },

  answer(id, correct){
    const it = this.ensure(id);
    it.reps++;
    if (correct){
      if (it.ivl === 0)      it.ivl = 1;
      else if (it.ivl === 1) it.ivl = 3;
      else                   it.ivl = Math.round(it.ivl * it.ease);
      it.ivl = Math.min(it.ivl, 365);
      it.ease = Math.min(3.0, it.ease + 0.05);
    } else {
      it.lapses++;
      it.ivl = 0;
      it.ease = Math.max(1.3, it.ease - 0.2);
    }
    it.due = todayNum() + it.ivl;

    const d = State.data;
    d.stats.answers++;
    if (correct) d.stats.correct++;
    d.recent.push(correct ? 1 : 0);
    if (d.recent.length > 30) d.recent.shift();

    State.touchStreak();
    State.addXP(correct ? 10 : 2);
    State.save();
  },

  dueItems(){
    const t = todayNum();
    return Object.entries(State.data.items)
      .filter(([id, it]) => it.due <= t)
      .map(([id]) => id);
  },

  dueCount(){ return this.dueItems().length; },

  learnedCount(){
    return Object.values(State.data.items).filter(it => it.ivl >= 3).length;
  },

  weakest(n = 5){
    return Object.entries(State.data.items)
      .filter(([id, it]) => it.lapses > 0 && id.startsWith("v"))
      .sort((a, b) => b[1].lapses - a[1].lapses)
      .slice(0, n)
      .map(([id]) => id);
  },

  recentAccuracy(){
    const r = State.data.recent;
    if (r.length < 10) return null;
    return r.reduce((a, b) => a + b, 0) / r.length;
  },

  nextNewWords(n){
    const d = State.data;
    const bands = ["A1", "A2", "B1"];
    const out = [];
    let band = d.band;
    while (out.length < n && band < bands.length){
      const pool = VOCAB.filter(v => v.lv === bands[band] && !d.introduced.includes(v.id));
      for (const v of pool){
        if (out.length >= n) break;
        out.push(v);
      }
      if (out.length < n) band++;
    }
    return out;
  },

  introduce(id){
    const d = State.data;
    if (!d.introduced.includes(id)) d.introduced.push(id);
    this.ensure(id);
    const bands = ["A1", "A2", "B1"];
    if (d.band < 2){
      const cur = VOCAB.filter(v => v.lv === bands[d.band]);
      const done = cur.filter(v => d.introduced.includes(v.id)).length;
      if (done / cur.length >= 0.85) d.band++;
    }
    State.save();
  },

  levelLabel(){
    const d = State.data;
    const bands = ["A1", "A2", "B1"];
    const cur = VOCAB.filter(v => v.lv === bands[d.band]);
    const done = cur.filter(v => d.introduced.includes(v.id)).length;
    const frac = cur.length ? done / cur.length : 0;
    return bands[d.band] + (frac < 0.5 ? ".1" : ".2");
  }
};
