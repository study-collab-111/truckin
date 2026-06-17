const CACHE_NAME = 'trukin-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png',
  '/favicon.ico',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell...');
      // Use addAll to buffer main assets
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('[Service Worker] Non-blocking caching issue:', err);
      });
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Cleanup old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Claim clients
  self.clients.claim();
});

// Fetch Event with elegant network-falling-back-to-cache strategy
self.addEventListener('fetch', (event) => {
  // Only process standard local GET requests, bypass Firebase Auth/Firestore and dev socket APIs
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('identitytoolkit') ||
    event.request.url.includes('localhost:3000') && event.request.url.includes('vite')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return quickly from cache, then fetch fresh in background (stale-while-revalidate style)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Silently swallow fetch failure (offline)
          });
        return cachedResponse;
      }

      // Not cached, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // Clone response and cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is document, return default offline index.html if possible
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
