// Service worker: apertura anche senza rete + aggiornamenti automatici dell'app.
// I DATI non passano di qui: li gestisce GitHub Sync con la sua cache locale.
const CACHE = 'agenda-famiglia-rev17-v17';
const SHELL = [
  './',
  './index.html',
  './github-config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];
const CDN_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'unpkg.com'];

self.addEventListener('install', e => {
  // Salta l'attesa e attiva subito il nuovo service worker
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).catch(err => console.log('Cache shell err:', err))
  );
});

self.addEventListener('activate', e => {
  // Elimina vecchie cache precedenti e prendi il controllo di tutte le pagine aperte
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => {
        console.log('Rimozione vecchia cache:', k);
        return caches.delete(k);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // File dell'app (stesso sito): Network First con fallback su Cache per aggiornamento immediato
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Librerie esterne (Tailwind, Lucide, html2canvas): Cache First + aggiornamento in background
  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then(cached => {
        const net = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || net;
      })
    );
  }
});
