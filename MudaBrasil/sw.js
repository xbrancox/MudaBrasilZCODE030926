/* VotaBrasil Service Worker v8 */
var CACHE = 'vb-v8';
var CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
  './config.js',
  './core.js',
  './pdf-cassacao.js',
  './notificacoes-pwa.js'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(CORE).catch(function () {
      return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
    });
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { if (k !== CACHE) { return caches.delete(k); } }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') { return; }
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (r) {
      if (r && r.ok && r.type === 'basic') {
        var cp = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, cp); });
      }
      return r;
    }).catch(function () { return hit || caches.match('./index.html'); });
    return hit || net;
  }));
});
