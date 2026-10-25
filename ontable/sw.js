// 온식탁 v001: 설치용 최소 서비스워커 (화면은 늘 최신으로 받음)
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});
