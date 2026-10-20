// Service Worker — build-frei. Precache-Liste und Cache-Kennung kommen aus der
// generierten Datei sw-precache.js (erzeugt von scripts/gen-sw.mjs aus dem Ordner app/).
importScripts("./sw-precache.js");

const { version, assets } = self.__PRECACHE;
const CACHE = `bb-${version}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(assets))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok && new URL(req.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          // Offline-Fallback für Navigationen auf die Hülle.
          if (req.mode === "navigate") return caches.match("./index.html");
          return Promise.reject(new Error("offline"));
        });
    }),
  );
});
