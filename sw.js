const CACHE = "advantage-silchar-v1";

// All static assets to cache on install
const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg",
];

// Install — cache core files immediately
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate — remove old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first for assets, network first for API
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  // Skip non-GET and API calls — always go to network for data
  if (e.request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;

  // For navigation requests (page loads) — serve index.html from cache
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.match("/index.html").then(cached => {
        if (cached) return cached;
        return fetch(e.request).catch(() => caches.match("/index.html"));
      })
    );
    return;
  }

  // For JS/CSS/images — cache first, then network, then cache update
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type !== "opaque") {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached); // If network fails, return whatever's cached

      // Return cached immediately if available, otherwise wait for network
      return cached || networkFetch;
    })
  );
});