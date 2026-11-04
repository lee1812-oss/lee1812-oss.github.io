/* UTCA 음성 소통 서비스워커 v003: 앱 화면을 보관해 인터넷이 약해도 열리게 하고, 새 메시지 알림을 띄웁니다. */
var API = 'https://script.google.com/macros/s/AKfycbwoQPipOSJMnrkCI24OsPwjFfx-kiJRuAqPqNEw6Kmn-hVAv2Vju92bMx_ibOgPiLKm/exec', CACHE = 'utv-v003', SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'utca-logo.png'];
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).catch(function () {})); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('utv-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(function (res) { if (res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); } return res; })
    .catch(function () { return caches.match(r).then(function (m) { return m || caches.match('index.html'); }); }));
});
function getKey() {
  return new Promise(function (res) {
    try { var o = indexedDB.open('utv', 1);
      o.onupgradeneeded = function () { var d = o.result; ['kv', 'media', 'out', 'draft'].forEach(function (n) { if (!d.objectStoreNames.contains(n)) d.createObjectStore(n); }); };
      o.onsuccess = function () { try { var q = o.result.transaction('kv').objectStore('kv').get('k'); q.onsuccess = function () { res(q.result || ''); }; q.onerror = function () { res(''); }; } catch (x) { res(''); } };
      o.onerror = function () { res(''); };
    } catch (x) { res(''); }
  });
}
self.addEventListener('push', function (e) {
  e.waitUntil(getKey().then(function (k) {
    if (!k) return null;
    return fetch(API, { method: 'POST', body: JSON.stringify({ op: 'pmsg', k: k }) }).then(function (r) { return r.json(); });
  }).catch(function () { return null; }).then(function (j) {
    var ok = j && j.ok;
    return self.registration.showNotification(ok ? j.title : 'UTCA 음성 소통', { body: ok ? j.body : '새 메시지가 왔어요. 눌러서 확인해 주세요.',
      icon: 'icon-192.png', badge: 'icon-192.png', tag: 'utv', renotify: true, vibrate: [300, 150, 300], data: { url: './' } });
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = new URL('./', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) { if (ws[i].url.indexOf(self.registration.scope) === 0 && 'focus' in ws[i]) return ws[i].focus(); }
    return self.clients.openWindow(url);
  }));
});