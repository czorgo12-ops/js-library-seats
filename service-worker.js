const CACHE_NAME = 'js-library-seat-tracker-v2';
const ASSETS = ['./manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Network-first for the app page itself, so code updates always take effect
// immediately when online. Cache is only a fallback for offline use.
self.addEventListener('fetch', (event) => {
  const isPage = event.request.mode === 'navigate' || event.request.url.endsWith('index.html') || event.request.url.endsWith('/');
  if(isPage){
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
