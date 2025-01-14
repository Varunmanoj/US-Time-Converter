// service-worker.js

const CACHE_NAME = 'us-time-converter-v1';
const URLS_TO_CACHE = [
  '/', // Root
  '/index.html',
  '/manifest.json',
  '/assets/bootstrap/bootstrap.min.css',
  '/assets/bootstrap/bootstrap.min.js',
  '/assets/css/Navbar-Right-Links-icons.css',
  '/assets/css/styles.css',
  '/assets/js/bs-init.js',
  '/assets/js/script.js',
  
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Fetch Files from Cache or Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve from cache if available, otherwise fetch from network
      return response || fetch(event.request);
    }).catch(() => {
      // Fallback to index.html for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

// Activate Service Worker and Remove Old Caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
