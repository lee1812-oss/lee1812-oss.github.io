/* 건강일지 서비스워커: 저장(캐시) 없이 네트워크를 그대로 쓰고, w4부터 9시 체크 알림(푸시)을 받습니다. */
var EXEC="https://script.google.com/macros/s/AKfycbzNl5rHzO50ma6wfpor9ScTccQkmXTviCfofLdq0E0EV3n1yRaA1lplrtoOgMfTPF0pDQ/exec";
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* 가로채지 않음 */ });
self.addEventListener('push', function (e) {
  e.waitUntil(self.registration.pushManager.getSubscription().then(function (s) {
    return fetch(EXEC, { method: 'POST', body: JSON.stringify({ f: 'apiPushMsg', a: [s ? s.endpoint : ''] }) }).then(function (r) { return r.json(); });
  }).catch(function () { return null; }).then(function (j) {
    var ok = j && j.ok;
    var t = ok ? j.title : '⏰ 건강일지 체크 알림', b = ok ? j.body : '아직 건강 체크를 안 한 분이 있어요. 앱을 열어 확인해 주세요.';
    return self.registration.showNotification(t, { body: b, icon: 'icon-192.png', tag: 'hl9', renotify: true,
      requireInteraction: !(ok && j.quiet), silent: !!(ok && j.quiet), vibrate: [400, 200, 400, 200, 800],
      data: { url: (ok && j.url) || './?m=phone' } });
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) { if (ws[i].url.indexOf(self.registration.scope) === 0 && 'focus' in ws[i]) return ws[i].focus(); }
    return self.clients.openWindow(url);
  }));
});
