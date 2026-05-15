// Service Worker — PWA hors-ligne complet pour Constitution RDC
// Cache-first pour TOUT : assets, articles, sections, titres

const CACHE_NAME = "constitution-rdc-v2";
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

// Activation : nettoie l'ancien cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Interception : cache-first pour tout
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les appels API
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first : sert le cache d'abord, met à jour en arrière-plan si réseau dispo
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        // Hors-ligne : retourner l'accueil comme fallback
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
