// Service worker: cache the app shell so it opens instantly and works offline.
const CACHE = "espanolita-v9";
const ASSETS = [
  ".", "index.html", "css/style.css",
  "js/data-vocab.js", "js/data-grammar.js", "js/data-songs.js", "js/data-talk.js",
  "js/srs.js", "js/speech.js", "js/app.js", "js/extras.js", "js/talk.js", "js/course.js",
  "manifest.webmanifest", "icons/icon-180.png", "icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first for same-origin requests, cache as fallback (so updates arrive
// when online, but the app still opens on the metro with no signal).
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // let YouTube etc. pass through
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
