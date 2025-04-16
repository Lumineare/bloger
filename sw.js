self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('neo-blog-cache').then(cache => {
            return cache.addAll(['/', '/index.html', '/styles.css', '/script.js']);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});