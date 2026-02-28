self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Let the browser handle network requests for now
    event.respondWith(fetch(event.request));

});