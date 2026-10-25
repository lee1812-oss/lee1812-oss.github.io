const C='mansung-v020';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// 항상 인터넷에서 새로 받고(휴대폰 임시 저장 무시), 안 되면 저장해 둔 것(교회에서 인터넷이 약할 때 대비)
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const k=new Request(u.origin+u.pathname);const cp=r.clone();caches.open(C).then(c=>c.put(k,cp));return r;}).catch(()=>caches.match(new Request(u.origin+u.pathname))));});