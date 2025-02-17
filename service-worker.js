// service-worker.js

const CACHE_NAME = 'us-time-converter-v1';
const URLS_TO_CACHE = [
  '/', // Root
  '/index.html', 
  '/manifest.json', // Manifest File
  '/service-worker.js', // Service Worker
  // CSS files
  '/assets/bootstrap/bootstrap.min.css',
  '/assets/bootstrap/bootstrap.min.js',
  '/assets/css/Navbar-Right-Links-icons.css',
  '/assets/css/styles.css',
  '/assets/css/aos.min.css',
  '/assets/css/News Cycle.css',
  '/assets/css/Poppins.css',
  // JS Files
  '/assets/js/bs-init.js',
  '/assets/js/script.js',
  '/assets/js/aos.min.js',
  // Font Files
  '/assets/fonts/News Cycle-953c26826a31e3c5c07e672ff04835c6.woff2',
  '/assets/fonts/News Cycle-9712f0865119b80d36b1cab221c04251.woff2',
  '/assets/fonts/News Cycle-b63a68bbde9a25bc3db07ac33b076656.woff2',
  '/assets/fonts/News Cycle-e0530b2e1ad6946445ea010449d7f391.woff2',
  '/assets/fonts/Poppins-0a7b3a9e4bd70125b19dcb8851bf6227.woff2',
  '/assets/fonts/Poppins-4cea605b2baace598c548d2fda974e23.woff2',
  '/assets/fonts/Poppins-6d0df50fc0a4f93b236a04f39c58e374.woff2',
  '/assets/fonts/Poppins-7ddd01029e50b821770b5a7db9f61221.woff2',
  '/assets/fonts/Poppins-340e1a68b2b8ef7aa69d2464c4ead1cc.woff2',
  '/assets/fonts/Poppins-650fd3db394f22368851b1efc048c7eb.woff2',
  '/assets/fonts/Poppins-808a7fadde2803377986dfbbb8700b6a.woff2',
  '/assets/fonts/Poppins-7167aec86a62fc20dde977838bb01fe1.woff2',
  '/assets/fonts/Poppins-52641e563c8b74d5b9a1e1e42eccded1.woff2',
  '/assets/fonts/Poppins-a48e3370be978e12258161118d6c2f08.woff2',
  '/assets/fonts/Poppins-b57e21c9fab8a74acb6e61f5b9446872.woff2',
  '/assets/fonts/Poppins-cd41308b36a56094f6fe209a02995d53.woff2',  
  '/assets/fonts/fa-brands-400.eot',
  '/assets/fonts/fa-brands-400.svg',
  '/assets/fonts/fa-brands-400.ttf',
  '/assets/fonts/fa-brands-400.woff',
  '/assets/fonts/fa-brands-400.woff2',  
  '/assets/fonts/fa-regular-400.eot',
  '/assets/fonts/fa-regular-400.svg',
  '/assets/fonts/fa-regular-400.ttf',
  '/assets/fonts/fa-regular-400.woff',
  '/assets/fonts/fa-regular-400.woff2',
  '/assets/fonts/fa-solid-900.eot',
  '/assets/fonts/fa-solid-900.svg',
  '/assets/fonts/fa-solid-900.ttf',
  '/assets/fonts/fa-solid-900.woff',
  '/assets/fonts/fa-solid-900.woff2',
  '/assets/fonts/fontawesome-all.min.css',
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
