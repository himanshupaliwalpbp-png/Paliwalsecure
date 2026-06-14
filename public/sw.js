// Paliwal Secure AI — Service Worker v3
const CACHE_NAME = 'paliwal-secure-v3';
const STATIC_CACHE_NAME = 'paliwal-static-v3';
const OFFLINE_URL = '/offline.html';

// Static assets to precache on install
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
];

// Maximum cache age: 7 days (in ms)
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000;
// Maximum number of entries in runtime cache
const MAX_CACHE_ENTRIES = 50;

// Install event — precache only essential static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('[SW] Precache failed for some URLs:', err);
        return Promise.resolve();
      });
    })
  );
  // Don't force skipWaiting — let the new SW wait for old tabs to close
  // This prevents sudden cache inconsistencies
});

// Activate event — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Clean up expired entries from runtime cache
      return cleanExpiredEntries();
    })
  );
  self.clients.claim();
});

// Helper: Remove expired entries from runtime cache
async function cleanExpiredEntries() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  const now = Date.now();

  for (const request of keys) {
    const response = await cache.match(request);
    if (!response) continue;

    const dateHeader = response.headers.get('date');
    if (dateHeader) {
      const responseTime = new Date(dateHeader).getTime();
      if (now - responseTime > MAX_CACHE_AGE) {
        await cache.delete(request);
      }
    }
  }

  // If still too many entries, remove oldest
  const remainingKeys = await cache.keys();
  if (remainingKeys.length > MAX_CACHE_ENTRIES) {
    // Delete oldest entries (first in = oldest)
    const toDelete = remainingKeys.length - MAX_CACHE_ENTRIES;
    for (let i = 0; i < toDelete; i++) {
      await cache.delete(remainingKeys[i]);
    }
  }
}

// Helper: Check if URL is a Next.js static asset (has content hash)
function isNextStaticAsset(url) {
  return url.includes('/_next/static/');
}

// Helper: Check if URL is an API route that should not be cached
function isApiRoute(url) {
  return url.includes('/api/');
}

// Fetch event — strategy depends on request type
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip admin and API admin routes
  if (event.request.url.includes('/api/admin/') || event.request.url.includes('/admin/')) return;

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Skip external requests (only handle same-origin)
  if (!event.request.url.startsWith(self.location.origin)) return;

  // API routes: network-only (no caching)
  if (isApiRoute(event.request.url)) return;

  // Next.js static assets: cache-first (they have content hashes)
  if (isNextStaticAsset(event.request.url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Page navigations: stale-while-revalidate (instant from cache, update in background)
  if (event.request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Everything else: network-first with cache fallback
  event.respondWith(networkFirst(event.request));
});

// Cache-first strategy (for immutable static assets)
async function cacheFirst(request) {
  const staticCache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await staticCache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === 'basic') {
      const responseClone = response.clone();
      staticCache.put(request, responseClone);
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Stale-while-revalidate strategy (for page navigations — instant load from cache)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Fetch in background to update cache for next visit
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200 && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed — that's OK, we already served from cache
  });

  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Network-first strategy (for non-navigation dynamic content)
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    // Clone the response and cache it
    if (response && response.status === 200 && response.type === 'basic') {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseClone);
    }
    return response;
  } catch {
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a navigation request, show offline page
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match(OFFLINE_URL);
      if (offlineResponse) {
        return offlineResponse;
      }
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}
