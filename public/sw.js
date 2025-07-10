const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Static assets to cache immediately
const staticAssets = [
  // Routes
  '/',
  '/en',
  '/np',
  '/en/admin/dashboard',
  '/np/admin/dashboard',
  '/en/admin/staffs',
  '/np/admin/staffs',
  '/en/admin/healthpost',
  '/np/admin/healthpost',
  '/en/admin/login',
  '/np/admin/login',
  '/en/admin/email',
  '/np/admin/email',

  '/manifest.json',

  // Images
  '/images/cancelEdit.png',
  '/images/doc.png',
  '/images/doctor.png',
  '/images/file.png',
  '/images/hp.png',
  '/images/pdf.png',
  '/images/trash.png',
  '/images/txt-file.png',
  '/images/xls.png',

  // Do NOT include Next.js build files here, as they may not exist at install time
  // We Are Handling caching of _next/static assets dynamically in the fetch event
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log('Caching static assets (robust)');
        const results = await Promise.allSettled(
          staticAssets.map((url) => cache.add(url)),
        );
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            console.warn('Failed to cache:', staticAssets[i], result.reason);
          }
        });
      }),
      caches.open(DYNAMIC_CACHE).then((_cache) => {
        console.log('Dynamic cache ready', _cache);
        return Promise.resolve();
      }),
    ]),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // CSS and static assets
    if (
      request.url.match(/\.css$/) ||
      request.url.includes('_next/static/css') ||
      request.url.includes('.js')
    ) {
      event.respondWith(
        caches.match(request).then((cached) => {
          // Return cached CSS if available
          if (cached) return cached;

          // Fetch and cache new CSS
          return fetch(request)
            .then((networkResponse) => {
              const clone = networkResponse.clone();
              caches
                .open(STATIC_CACHE)
                .then((cache) => cache.put(request, clone));
              return networkResponse;
            })
            .catch(() => {
              // Fallback for critical CSS
              if (url.pathname.includes('globals.css')) {
                return new Response(
                  `
                body { font-family: system-ui; }
                .btn { padding: 0.5rem 1rem; }
                /* Basic Tailwind fallback */
              `,
                  { headers: { 'Content-Type': 'text/css' } },
                );
              }
              return new Response('', {
                headers: { 'Content-Type': 'text/css' },
              });
            });
        }),
      );
      return;
    }
    // HTML pages
    if (request.headers.get('accept').includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(request).then((cachedResponse) => {
              return cachedResponse || caches.match('/');
            });
          }),
      );
      return;
    }

    // Default: try network first, then cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        }),
    );
  }
});
