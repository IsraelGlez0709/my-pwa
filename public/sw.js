const APP_VERSION = 'v1.0.1';
const SHELL_CACHE = `bookify-shell-${APP_VERSION}`;
const RUNTIME_CACHE = `bookify-runtime-${APP_VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![SHELL_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET' || (url.protocol !== 'http:' && url.protocol !== 'https:')) return;

  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstNav(req));
    return;
  }

  if (req.destination === 'style' || req.destination === 'script' || req.url.endsWith('.css') || req.url.endsWith('.js')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  event.respondWith(fetch(req).catch(() => caches.match(req)));
});

async function networkFirstNav(req) {
  const runtime = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(req);
    runtime.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await runtime.match(req);
    if (cached) return cached;

    return caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const networkPromise = fetch(req)
    .then((res) => { cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return cached || (await networkPromise) || fetch(req);
}

async function cacheFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch {
    return caches.match('/logo.png') || Response.error();
  }
}
