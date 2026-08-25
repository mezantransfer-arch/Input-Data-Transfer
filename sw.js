const CACHE_NAME = 'setoran-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first untuk file aplikasi (shell), tapi selalu ambil dari jaringan
// untuk permintaan ke Apps Script (data transfer harus selalu real-time).
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('script.google.com')) {
    return; // biarkan browser handle langsung, jangan di-cache
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
