// Service Worker — PWA hors-ligne complet pour Constitution RDC
// Network-first : sert la version la plus récente, cache en fallback

const CACHE_NAME = "constitution-rdc-v3";
const STATIC_ASSETS = [
  "/",
  "/sections",
  "/recherche",
  "/favicon.ico",
  "/favicon.svg",
  "/manifest.json",
  "/data.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

// Générer toutes les routes d'articles (1-229) et de titres (1-8)
const ARTICLE_ROUTES = Array.from({ length: 229 }, (_, i) => `/articles/${i + 1}`);
const TITRE_ROUTES = Array.from({ length: 8 }, (_, i) => `/titres/${i + 1}`);

const ALL_ROUTES = [...STATIC_ASSETS, ...ARTICLE_ROUTES, ...TITRE_ROUTES];

// Installation : précache TOUT le site
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Précacher les assets statiques d'abord
      await cache.addAll(STATIC_ASSETS);
      // Puis les pages une par une (évite de bloquer le navigateur)
      for (const route of [...ARTICLE_ROUTES, ...TITRE_ROUTES]) {
        try {
          await cache.add(new Request(route, { mode: "same-origin" }));
        } catch {
          // Ignorer les pages qui renvoient une erreur
        }
      }
    })()
  );
  self.skipWaiting();
});

// Activation : nettoie l'ancien cache et prend le contrôle immédiatement
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      ),
      // Prendre le contrôle de tous les clients (onglets) ouverts
      self.clients.claim(),
    ])
  );
});

// Interception : network-first — va sur le réseau, cache en arrière-plan
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les appels API
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Ignorer les requêtes non-GET
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first : va sur le réseau d'abord
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        // Hors-ligne : utilise le cache
        const cached = await caches.match(request);
        if (cached) return cached;
        // Fallback ultime
        const fallback = await caches.match("/");
        return (
          fallback ||
          new Response("Vous êtes hors-ligne. Revenez plus tard.", {
            status: 503,
          })
        );
      }
    })()
  );
});
