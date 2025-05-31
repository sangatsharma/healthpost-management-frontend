// const CACHE_NAME = 'patient-health-system-v1';
// const STATIC_CACHE = 'static-v1';
// const DYNAMIC_CACHE = 'dynamic-v1';

// // Static assets to cache immediately
// const staticAssets = [
//   '/',
//   '/reports',
//   '/reports/new',
//   '/sync',
//   '/staff',
//   '/settings',
//   '/manifest.json',
//   '/messages/en.json',
//   '/messages/np.json',
//   '/_next/static/css/app/layout.css',
//   '/_next/static/css/app/globals.css',
//   // Add other CSS files that Next.js generates
// ];

// // Install event - cache static resources
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installing...');
//   event.waitUntil(
//     Promise.all([
//       caches.open(STATIC_CACHE).then((cache) => {
//         console.log('Caching static assets');
//         return cache.addAll(staticAssets);
//       }),
//       caches.open(DYNAMIC_CACHE).then((cache) => {
//         console.log('Dynamic cache ready', cache);
//         return Promise.resolve();
//       }),
//     ]),
//   );
//   self.skipWaiting();
// });

// /// Install event - cache static resources
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installing...');
//   event.waitUntil(
//     Promise.all([
//       caches.open(STATIC_CACHE).then((cache) => {
//         console.log('Caching static assets');
//         return cache.addAll(staticAssets);
//       }),
//       caches.open(DYNAMIC_CACHE).then((cache) => {
//         console.log('Dynamic cache ready', cache);
//         return Promise.resolve();
//       }),
//     ]),
//   );
//   self.skipWaiting();
// });

// // Fetch event - serve from cache with network fallback
// self.addEventListener('fetch', (event) => {
//   const { request } = event;
//   const url = new URL(request.url);

//   // Handle different types of requests
//   if (request.method === 'GET') {
//     // CSS and static assets
//     if (
//       request.url.includes('_next/static') ||
//       request.url.includes('.css') ||
//       request.url.includes('.js')
//     ) {
//       event.respondWith(
//         caches.match(request).then((cachedResponse) => {
//           if (cachedResponse) {
//             return cachedResponse;
//           }

//           return fetch(request).then((response) => {
//             // Cache the response for future use
//             if (response.status === 200) {
//               const responseClone = response.clone();
//               caches.open(STATIC_CACHE).then((cache) => {
//                 cache.put(request, responseClone);
//               });
//             }
//             return response;
//           })``.catch(() => {
//             // Return a basic response if offline and not cached
//             if (request.url.includes('.css')) {
//               return new Response('/* Offline - CSS not available */', {
//                 headers: { 'Content-Type': 'text/css' },
//               });
//             }
//           });
//         }),
//       );
//       return;
//     }

//     // HTML pages
//     if (request.headers.get('accept').includes('text/html')) {
//       event.respondWith(
//         fetch(request)
//           .then((response) => {
//             const responseClone = response.clone();
//             caches.open(DYNAMIC_CACHE).then((cache) => {
//               cache.put(request, responseClone);
//             });
//             return response;
//           })
//           .catch(() => {
//             return caches.match(request).then((cachedResponse) => {
//               return cachedResponse || caches.match('/');
//             });
//           }),
//       );
//       return;
//     }

//     // API requests
//     if (url.pathname.startsWith('/api/')) {
//       event.respondWith(
//         fetch(request).catch(() => {
//           // Return cached data or offline response for API calls
//           return new Response(
//             JSON.stringify({
//               error: 'Offline',
//               message: 'This request will be retried when online',
//             }),
//             {
//               status: 503,
//               headers: { 'Content-Type': 'application/json' },
//             },
//           );
//         }),
//       );
//       return;
//     }

//     // Default: try network first, then cache
//     event.respondWith(
//       fetch(request)
//         .then((response) => {
//           if (response.status === 200) {
//             const responseClone = response.clone();
//             caches.open(DYNAMIC_CACHE).then((cache) => {
//               cache.put(request, responseClone);
//             });
//           }
//           return response;
//         })
//         .catch(() => {
//           return caches.match(request);
//         }),
//     );
//   }
// });

// // Background sync for offline data
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'background-sync') {
//     event.waitUntil(syncOfflineData());
//   }
// });

// async function syncOfflineData() {
//   console.log('Syncing offline data...');
//   try {
//     const offlineData = await getOfflineData();
//     for (const data of offlineData) {
//       try {
//         await fetch('/api/sync', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data),
//         });
//         await removeFromOfflineStorage(data.id);
//       } catch (error) {
//         console.error('Failed to sync data:', error);
//       }
//     }
//   } catch (error) {
//     console.error('Sync failed:', error);
//   }
// }

// async function getOfflineData() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open('PatientHealthDB', 1);
//     request.onsuccess = (event) => {
//       const db = event.target.result;
//       const transaction = db.transaction(['syncQueue'], 'readonly');
//       const store = transaction.objectStore('syncQueue');
//       const getAllRequest = store.getAll();
//       getAllRequest.onsuccess = () => resolve(getAllRequest.result);
//     };
//     request.onerror = () => reject(request.error);
//   });
// }

// async function removeFromOfflineStorage(id) {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open('PatientHealthDB', 1);
//     request.onsuccess = (event) => {
//       const db = event.target.result;
//       const transaction = db.transaction(['syncQueue'], 'readwrite');
//       const store = transaction.objectStore('syncQueue');
//       const deleteRequest = store.delete(id);
//       deleteRequest.onsuccess = () => resolve();
//     };
//     request.onerror = () => reject(request.error);
//   });
// }
