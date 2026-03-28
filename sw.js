const CACHE_NAME = 'iv-fluid-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 1. ติดตั้ง Service Worker และ Caching ไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ดึงข้อมูลจาก Cache มาใช้เวลาไม่มีเน็ต
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ถ้ามีไฟล์ในเครื่อง ให้โหลดจากเครื่อง, ถ้าไม่มี ให้โหลดจากเน็ต
        return response || fetch(event.request);
      })
  );
});

// 3. ล้าง Cache เก่าเวลาอัปเดตแอป
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
