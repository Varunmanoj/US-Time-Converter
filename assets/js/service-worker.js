// Cache versioning
const CACHE_NAME = 'my-pwa-cache-v1';

// List of files to cache
const filesToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/img/US-India Time Converter Logo.webp',    
];

// Install event: caching static files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching files during install');
                return cache.addAll(filesToCache);
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: serving cached files
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached response if available, otherwise fetch from network
                return cachedResponse || fetch(event.request);
            })
    );
});
