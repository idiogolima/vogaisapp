const CACHE_NAME = "vogaisapp-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.png",
  "./css/style.css",
  "./js/app.js",
  "./imgs/a.png",
  "./imgs/e.png",
  "./imgs/i.png",
  "./imgs/o.png",
  "./imgs/u.png",
  "./imgs/vogais.png",
  "./imgs/icon-192.png",
  "./imgs/icon-512.png",
  "./imgs/generated/pt_vogais_a.png",
  "./imgs/generated/pt_vogais_e.png",
  "./imgs/generated/pt_vogais_i.png",
  "./imgs/generated/pt_vogais_o.png",
  "./imgs/generated/pt_vogais_u.png",
  "./imgs/generated/en_vogais_a.png",
  "./imgs/generated/en_vogais_e.png",
  "./imgs/generated/en_vogais_i.png",
  "./imgs/generated/en_vogais_o.png",
  "./imgs/generated/en_vogais_u.png",
  "./imgs/generated/shared_numeros_1.png",
  "./imgs/generated/shared_numeros_2.png",
  "./imgs/generated/shared_numeros_3.png",
  "./imgs/generated/shared_numeros_4.png",
  "./imgs/generated/shared_numeros_5.png",
  "./imgs/generated/shared_numeros_6.png",
  "./imgs/generated/shared_numeros_7.png",
  "./imgs/generated/shared_numeros_8.png",
  "./imgs/generated/shared_numeros_9.png",
  "./imgs/generated/shared_numeros_10.png",
  "./imgs/generated/shared_cores_red.png",
  "./imgs/generated/shared_cores_green.png",
  "./imgs/generated/shared_cores_blue.png",
  "./imgs/generated/shared_cores_yellow.png",
  "./imgs/generated/shared_cores_purple.png",
  
  // High quality PT Vowel audios
  "./sounds/pt_vogais_a.mp3",
  "./sounds/pt_vogais_e.mp3",
  "./sounds/pt_vogais_i.mp3",
  "./sounds/pt_vogais_o.mp3",
  "./sounds/pt_vogais_u.mp3",
  
  // High quality EN Vowel audios
  "./sounds/en_vogais_a.mp3",
  "./sounds/en_vogais_e.mp3",
  "./sounds/en_vogais_i.mp3",
  "./sounds/en_vogais_o.mp3",
  "./sounds/en_vogais_u.mp3",
  
  // High quality PT Number audios
  "./sounds/pt_numeros_1.mp3",
  "./sounds/pt_numeros_2.mp3",
  "./sounds/pt_numeros_3.mp3",
  "./sounds/pt_numeros_4.mp3",
  "./sounds/pt_numeros_5.mp3",
  "./sounds/pt_numeros_6.mp3",
  "./sounds/pt_numeros_7.mp3",
  "./sounds/pt_numeros_8.mp3",
  "./sounds/pt_numeros_9.mp3",
  "./sounds/pt_numeros_10.mp3",
  
  // High quality EN Number audios
  "./sounds/en_numeros_1.mp3",
  "./sounds/en_numeros_2.mp3",
  "./sounds/en_numeros_3.mp3",
  "./sounds/en_numeros_4.mp3",
  "./sounds/en_numeros_5.mp3",
  "./sounds/en_numeros_6.mp3",
  "./sounds/en_numeros_7.mp3",
  "./sounds/en_numeros_8.mp3",
  "./sounds/en_numeros_9.mp3",
  "./sounds/en_numeros_10.mp3",
  
  // High quality PT Color audios
  "./sounds/pt_cores_vermelho.mp3",
  "./sounds/pt_cores_verde.mp3",
  "./sounds/pt_cores_azul.mp3",
  "./sounds/pt_cores_amarelo.mp3",
  "./sounds/pt_cores_roxo.mp3",
  
  // High quality EN Color audios
  "./sounds/en_cores_red.mp3",
  "./sounds/en_cores_green.mp3",
  "./sounds/en_cores_blue.mp3",
  "./sounds/en_cores_yellow.mp3",
  "./sounds/en_cores_purple.mp3"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all assets");
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Cache-First strategy for static assets)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Cache new fetch requests if they are within our scope
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback if request is not cached and network fails
      if (e.request.mode === "navigate") {
        return caches.match("./index.html");
      }
    })
  );
});
