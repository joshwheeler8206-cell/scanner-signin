// Offline cache for the scanner sign-in app. Pages are served cache-first and refreshed in the background.
const CACHE = 'scanner-signin-980e8f59ad';
const ASSETS = ["./", "./index.html", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable.png", "./kiosk.html", "./kiosk.webmanifest", "./leads.html", "./leads.webmanifest"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
