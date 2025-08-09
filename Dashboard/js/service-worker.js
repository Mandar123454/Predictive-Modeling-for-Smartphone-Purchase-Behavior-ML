// Service Worker for Dashboard

const CACHE_NAME = 'smartphone-dashboard-cache-v1';

// Files to cache
const filesToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/enhanced.css',
    '/css/enhanced_v2.css',
    '/css/dark-mode.css',
    '/js/dashboard.js',
    '/js/dashboard-utils.js',
    '/js/data-export.js',
    '/js/service-worker.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(filesToCache);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache if available, otherwise fetch and cache
self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetch', event.request.url);
    
    // Skip cross-origin requests and API calls
    if (event.request.url.includes('/api/')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    console.log('[Service Worker] Found in cache', event.request.url);
                    return response;
                }
                
                // Clone the request because it's a one-time use stream
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest)
                    .then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response because it's a one-time use stream
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                console.log('[Service Worker] Caching new resource', event.request.url);
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('[Service Worker] Fetch failed; returning offline page instead.', error);
                        // If fetch fails, return a default offline page or image
                        return new Response('You are currently offline. Please check your internet connection.');
                    });
            })
    );
});
