/* 설치 조건용 최소 서비스워커: 저장(캐시) 없이 항상 네트워크를 그대로 사용합니다. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* 가로채지 않음 */ });
