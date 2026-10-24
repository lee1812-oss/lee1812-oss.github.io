// 바로연락 v001: 설치용 최소 서비스워커 (캐시 안 함, 새 버전 바로 반영)
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});
