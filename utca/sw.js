// UTCA 출력일보: 설치용 최소 서비스워커 (저장본 안 씀, 항상 새 화면)
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});
