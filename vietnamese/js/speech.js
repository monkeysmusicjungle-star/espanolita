// Speech: Vietnamese text-to-speech + pronunciation checking.
// Vietnamese TTS/recognition works in Chrome and newer iOS Safari where a
// Vietnamese voice is installed; otherwise TTS is silently skipped.
const Speech = {
  voice: null,

  init(){
    const pick = () => {
      const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith("vi"));
      this.voice = vs[0] || null;
    };
    pick();
    if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = pick;
  },

  say(text, rate = 0.9){
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "vi-VN";
      if (this.voice) u.voice = this.voice;
      u.rate = rate;
      speechSynthesis.speak(u);
    } catch(e){}
  },

  hasRecognition(){
    return typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  },

  // Listen once; calls cb(transcripts) or errCb(err). lang defaults to Vietnamese.
  listen(cb, errCb, lang = "vi-VN"){
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new Rec();
    r.lang = lang;
    r.interimResults = false;
    r.maxAlternatives = 3;
    let got = false;
    r.onresult = (e) => {
      got = true;
      const alts = [];
      const res = e.results[0];
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
      cb(alts);
    };
    r.onerror = (e) => { if (!got) errCb(e.error || "error"); };
    r.onend   = ()  => { if (!got) errCb("no-speech"); };
    try { r.start(); } catch(e){ errCb("start-failed"); }
    return r;
  },

  // Normalize for comparison: lowercase, strip Vietnamese tone/diacritics & punctuation.
  norm(s){
    return s.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z\s]/gi, " ")
      .replace(/\s+/g, " ").trim();
  },

  // Compare spoken transcript(s) against a target phrase (tone-insensitive).
  compare(target, transcripts){
    const tWords = this.norm(target).split(" ").filter(Boolean);
    let best = { score: 0, words: tWords.map(w => ({ w, ok: false })) };
    for (const tr of transcripts){
      const sWords = new Set(this.norm(tr).split(" ").filter(Boolean));
      const words = tWords.map(w => ({ w, ok: sWords.has(w) }));
      const score = words.filter(x => x.ok).length / Math.max(1, words.length);
      if (score >= best.score) best = { score, words };
    }
    return best;
  }
};

// Recording fallback (listen back and compare yourself).
const Recorder = {
  rec: null, chunks: [], url: null,
  async start(){
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];
    this.rec = new MediaRecorder(stream);
    this.rec.ondataavailable = e => this.chunks.push(e.data);
    this.rec.start();
  },
  stop(){
    return new Promise((resolve) => {
      if (!this.rec) return resolve(null);
      this.rec.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.rec.mimeType || "audio/mp4" });
        if (this.url) URL.revokeObjectURL(this.url);
        this.url = URL.createObjectURL(blob);
        this.rec.stream.getTracks().forEach(t => t.stop());
        this.rec = null;
        resolve(this.url);
      };
      this.rec.stop();
    });
  }
};
