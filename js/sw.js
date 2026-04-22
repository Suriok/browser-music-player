const CACHE_NAME = "vibemusic-shell-v1";
const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./css/style.css",
    "./css/popUp.css",
    "./js/main.js",
    "./js/popup.js",
    "./js/dataHandler.js",
    "./js/player.js",
    "./js/search.js",
    "./js/storage.js",
    "./js/playlistRenderer.js",
    "./js/cloude.js",
    "./js/namespace.js",
    "./photo/album.jpg",
    "./photo/cover.jpg",
    "./photo/add_button.svg",
    "./photo/cloude_1.svg",
    "./photo/cloude_2.svg",
    "./photo/cloude_3.svg",
    "./photo/control_button_prev.svg",
    "./photo/control_button_next.svg",
    "./photo/play.svg",
    "./photo/pause.svg",
    "./photo/note.svg",
    "./photo/cross.svg",
    "./photo/folder.svg",
    "./photo/upload.svg",
    "./photo/pwa-icon.svg",
    "https://cdn.jsdelivr.net/npm/jsmediatags@3.9.7/dist/jsmediatags.min.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                })
                .catch(async () => {
                    if (event.request.mode === "navigate") {
                        return caches.match("./index.html");
                    }
                    return new Response("Offline", { status: 503 });
                });
        })
    );
});
