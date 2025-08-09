// ===== NeonQuest Service Worker =====

const CACHE_NAME = 'neonquest-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline usage
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/theme.css',
  '/components.css',
  '/animations.css',
  '/translations.js',
  '/api.js',
  '/state.js',
  '/app.js',
  '/manifest.json'
];

// API endpoints to cache
const API_CACHE_NAME = 'neonquest-api-v1';
const API_PATTERNS = [
  /^https:\/\/opentdb\.com\/api_category\.php/,
  /^https:\/\/opentdb\.com\/api_token\.php/
];

// Network-first resources (questions should always be fresh when possible)
const NETWORK_FIRST_PATTERNS = [
  /^https:\/\/opentdb\.com\/api\.php/
];

// ===== Service Worker Installation =====
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache app shell
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_ASSETS);
        
        // Cache offline page
        await cache.add(OFFLINE_URL);
        
        console.log('✅ App shell cached successfully');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('❌ Failed to cache app shell:', error);
      }
    })()
  );
});

// ===== Service Worker Activation =====
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(name => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map(name => caches.delete(name));
        
        await Promise.all(deletePromises);
        
        // Claim all clients
        await self.clients.claim();
        
        console.log('✅ Service Worker activated and claimed clients');
      } catch (error) {
        console.error('❌ Failed to activate service worker:', error);
      }
    })()
  );
});

// ===== Fetch Event Handler =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleStaticAssetRequest(request));
  }
});

// ===== Request Type Detection =====
function isAPIRequest(url) {
  return url.hostname === 'opentdb.com';
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isNetworkFirstAPI(url) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href));
}

function isCacheableAPI(url) {
  return API_PATTERNS.some(pattern => pattern.test(url.href));
}

// ===== API Request Handling =====
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  try {
    if (isNetworkFirstAPI(url)) {
      return await handleNetworkFirstRequest(request);
    } else if (isCacheableAPI(url)) {
      return await handleCacheFirstRequest(request);
    } else {
      // Default to network only for other API requests
      return await fetch(request);
    }
  } catch (error) {
    console.error('API request failed:', error);
    
    // Try to return cached version for failed requests
    const cache = await caches.open(API_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline response for quiz questions
    if (url.pathname === '/api.php') {
      return new Response(JSON.stringify({
        response_code: 0,
        results: getOfflineQuestions()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Network-first with timeout fallback
async function handleNetworkFirstRequest(request) {
  const TIMEOUT = 5000; // 5 seconds
  
  try {
    // Race between network request and timeout
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), TIMEOUT)
    );
    
    const response = await Promise.race([networkPromise, timeoutPromise]);
    
    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(API_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Cache-first for stable resources
async function handleCacheFirstRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Ignore background update errors
    });
    
    return cached;
  }
  
  // Fetch and cache if not in cache
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

// ===== Navigation Request Handling =====
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const response = await fetch(request);
    
    if (response.ok) {
      return response;
    }
    
    throw new Error(`Network response not ok: ${response.status}`);
  } catch (error) {
    console.log('Navigation request failed, serving cached version');
    
    // Fallback to cached index.html
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match('/index.html');
    
    if (cached) {
      return cached;
    }
    
    // Final fallback to offline page
    return cache.match(OFFLINE_URL);
  }
}

// ===== Static Asset Request Handling =====
async function handleStaticAssetRequest(request) {
  // Stale-while-revalidate strategy for static assets
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Start fetching fresh version in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore fetch errors for background updates
  });
  
  // Return cached version immediately if available
  if (cached) {
    return cached;
  }
  
  // If not cached, wait for network
  try {
    return await fetchPromise;
  } catch (error) {
    console.error('Failed to fetch static asset:', error);
    
    // Return offline indicator for failed asset loads
    return new Response('Resource not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// ===== Offline Fallback Questions =====
function getOfflineQuestions() {
  return [
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What is the capital of India?',
      correct_answer: 'New Delhi',
      incorrect_answers: ['Mumbai', 'Kolkata', 'Chennai']
    },
    {
      category: 'Science & Nature',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What gas do plants absorb from the atmosphere during photosynthesis?',
      correct_answer: 'Carbon Dioxide',
      incorrect_answers: ['Oxygen', 'Nitrogen', 'Hydrogen']
    },
    {
      category: 'Geography',
      type: 'multiple',
      difficulty: 'medium',
      question: 'Which is the longest river in the world?',
      correct_answer: 'Nile River',
      incorrect_answers: ['Amazon River', 'Yangtze River', 'Mississippi River']
    },
    {
      category: 'History',
      type: 'multiple',
      difficulty: 'medium',
      question: 'In which year did World War II end?',
      correct_answer: '1945',
      incorrect_answers: ['1944', '1946', '1947']
    },
    {
      category: 'Sports',
      type: 'multiple',
      difficulty: 'easy',
      question: 'How many players are on a football (soccer) team on the field at one time?',
      correct_answer: '11',
      incorrect_answers: ['10', '12', '9']
    }
  ];
}

// ===== Background Sync =====
self.addEventListener('sync', (event) => {
  if (event.tag === 'quiz-data-sync') {
    event.waitUntil(syncQuizData());
  }
});

async function syncQuizData() {
  try {
    // Sync any pending quiz results or user data
    const quizStorage = await getQuizStorageData();
    
    if (quizStorage.pendingSync && quizStorage.pendingSync.length > 0) {
      console.log('🔄 Syncing quiz data...');
      
      // Process pending sync data
      // This would typically send data to a server
      // For now, we just clear the pending sync
      await clearPendingSync();
      
      console.log('✅ Quiz data synced successfully');
    }
  } catch (error) {
    console.error('❌ Failed to sync quiz data:', error);
  }
}

async function getQuizStorageData() {
  // This would retrieve data from IndexedDB or localStorage
  // For now, return empty data
  return { pendingSync: [] };
}

async function clearPendingSync() {
  // Clear pending sync data
  return Promise.resolve();
}

// ===== Push Notifications =====
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New quiz available!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'Play Quiz',
          icon: '/icons/play-icon.png'
        },
        {
          action: 'dismiss',
          title: 'Later',
          icon: '/icons/dismiss-icon.png'
        }
      ],
      requireInteraction: true,
      tag: 'quiz-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'NeonQuest Quiz', options)
    );
  } catch (error) {
    console.error('Failed to show push notification:', error);
  }
});

// ===== Notification Click Handling =====
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ===== Message Handling =====
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME
      });
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearAllCaches());
      break;
      
    case 'PRELOAD_QUESTIONS':
      event.waitUntil(preloadQuestions(payload));
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  const deletePromises = cacheNames.map(name => caches.delete(name));
  await Promise.all(deletePromises);
  console.log('🗑️ All caches cleared');
}

async function preloadQuestions(params) {
  try {
    const url = new URL('https://opentdb.com/api.php');
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    const response = await fetch(url);
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put(url, response);
      console.log('📥 Questions preloaded');
    }
  } catch (error) {
    console.error('Failed to preload questions:', error);
  }
}

// ===== Periodic Background Sync =====
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(doPeriodicSync());
  }
});

async function doPeriodicSync() {
  try {
    // Update categories cache
    const response = await fetch('https://opentdb.com/api_category.php');
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put('https://opentdb.com/api_category.php', response);
      console.log('🔄 Categories updated via periodic sync');
    }
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// ===== Error Handling =====
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
  event.preventDefault();
});

// ===== Utility Functions =====
function isHTML(request) {
  return request.headers.get('Accept')?.includes('text/html');
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/.test(url.pathname);
}

function shouldCache(response) {
  return response.status === 200 && 
         response.type === 'basic' && 
         !response.url.includes('chrome-extension');
}

// ===== Cache Size Management =====
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const entriesToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(entriesToDelete.map(key => cache.delete(key)));
    console.log(`🗑️ Cleaned up ${entriesToDelete.length} cache entries from ${cacheName}`);
  }
}

// Periodically clean up caches
setInterval(() => {
  limitCacheSize(API_CACHE_NAME, 50);
}, 60000); // Every minute

console.log('🔥 NeonQuest Service Worker loaded successfully');