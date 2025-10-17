
/**
 * Calibration MVP Service Worker
 * Provides offline functionality and caching for the calibration application
 */

const CACHE_NAME = 'calibration-mvp-mobile-optimized-v2.1.0';
const DATA_CACHE_NAME = 'calibration-data-v2';

// Critical assets for fast mobile loading
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app-optimized.js',
  '/manifest.json',
  '/js/mobile-enhancer.js',
  '/js/mobile-nav.js'
];

// Heavy libraries loaded on demand
const ON_DEMAND_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// All assets to cache (critical first, then on-demand)
const STATIC_ASSETS = [...CRITICAL_ASSETS, ...ON_DEMAND_ASSETS];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/push',
  '/api/records',
  '/health'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Wrap in try-catch to handle any URL parsing errors
  try {
    const url = new URL(request.url);
    
    // Only handle same-origin requests (skip external CDNs, APIs, etc.)
    if (url.origin !== self.location.origin) {
      return; // Don't handle external requests at all
    }
    
    // Handle API requests with network-first strategy
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirstStrategy(request));
      return;
    }
    
    // Handle static assets with cache-first strategy
    if (request.method === 'GET') {
      event.respondWith(cacheFirstStrategy(request));
      return;
    }
  } catch (error) {
    // If URL parsing fails or any other error, just let the browser handle it
    console.warn('[SW] Error handling fetch:', error);
    return;
  }
});

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response for offline use
    if (networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a POST request and we're offline, store for later sync
    if (request.method === 'POST') {
      return handleOfflinePost(request);
    }
    
    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Cache miss, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Both cache and network failed:', error);
    
    // Return offline page or default response
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Handle offline POST requests
async function handleOfflinePost(request) {
  // Store the request for later sync when online
  const requestData = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: await request.text(),
    timestamp: Date.now()
  };
  
  // Store in IndexedDB for background sync
  await storeOfflineRequest(requestData);
  
  // Return a response indicating the request was queued
  return new Response(
    JSON.stringify({ 
      ok: true, 
      queued: true, 
      message: 'Request queued for sync when online' 
    }),
    {
      status: 202, // Accepted
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Store offline requests for background sync
async function storeOfflineRequest(requestData) {
  try {
    // Simple implementation - in a real app, you'd use IndexedDB
    const cache = await caches.open('offline-requests');
    const request = new Request('/offline-queue', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
    await cache.put(request, new Response(JSON.stringify(requestData)));
  } catch (error) {
    console.error('[SW] Failed to store offline request:', error);
  }
}

// Background sync event (if supported)
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineRequests());
  }
});

// Sync offline requests when back online
async function syncOfflineRequests() {
  try {
    const cache = await caches.open('offline-requests');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await cache.match(request);
        const requestData = await response.json();
        
        // Replay the request
        await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        // Remove from queue after successful sync
        await cache.delete(request);
        console.log('[SW] Synced offline request:', requestData.url);
      } catch (error) {
        console.error('[SW] Failed to sync request:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification event (for future expansion)
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Your calibration records have been updated',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Records',
        icon: '/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Calibration MVP', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service worker loaded');
