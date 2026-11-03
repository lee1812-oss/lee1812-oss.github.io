// 말씀 낭독 서비스워커: 화면 파일은 항상 새로 받고(인터넷 없으면 저장본), 성경 본문은 한 번 받으면 저장해서 씀
const BIBLE='malsseum-bible-1', SHELL='malsseum-shell-1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 if(/\/data\/b\d\d\.json$/.test(u.pathname)){
  e.respondWith(caches.open(BIBLE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok)c.put(e.request,n.clone());return n}))));
  return;
 }
 if(u.pathname.endsWith('version.txt'))return;
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(n=>{if(n.ok){const cl=n.clone();caches.open(SHELL).then(c=>c.put(e.request,cl))}return n}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
