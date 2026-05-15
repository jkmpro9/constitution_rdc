// Service Worker — PWA hors-ligne pour Constitution RDC
// Cache-first pour les assets statiques, network-first pour les articles

const CACHE_NAME = "constitution-rdc-v1";
const STATIC_ASSETS = [
  "/",
  "/sections",
  "/favicon.ico",
  "/favicon.svg",
  "/manifest.json",
  "/data.json",
];

// Installation : précache les assets statiques
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : nettoie les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes vers l'API DeepSeek
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Pages de navigation (HTML) : network-first, fallback cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre en cache la réponse pour plus tard
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return (
              cached ||
              caches.match("/") // fallback vers l'accueil
            );
          });
        })
    );
    return;
  }

  // Assets statiques (JS, CSS, images, data.json) : cache-first
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.endsWith(".json") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Tout le reste : réseau normal
  event.respondWith(fetch(request));
});
