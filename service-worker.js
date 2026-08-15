/**
 * SERVICE WORKER — El Ritual del Regresso
 * Cachea el "app shell" (HTML/CSS/JS) para que la app abra rápido y
 * funcione offline. El contenido (.md) usa network-first con fallback
 * a cache, para que actualizaciones de contenido lleguen apenas haya
 * conexión, sin dejar de funcionar sin internet.
 */
var CACHE_NAME = 'ritual-retorno-v2';
var APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/config.js',
  '/js/content-manifest.js',
  '/js/md-render.js',
  '/js/app.js',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  var isContent = url.pathname.startsWith('/content/');

  if (isContent) {
    // Network-first: intenta traer la versión más nueva del contenido;
    // si no hay red, usa lo que ya esté en cache.
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
          return res;
        })
        .catch(function () { return caches.match(req); })
    );
    return;
  }

  // App shell: cache-first para abrir rápido.
  event.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, copy); });
        return res;
      });
    })
  );
});
