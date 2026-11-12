/* 빵을그리다 방송실 — 앱 설치 도우미 v001 (2026-11-12)
   주소 끝에 #install 을 붙여 열었을 때만 아래쪽에 「앱으로 설치」 띠를 띄운다.
   평소(포스기·키오스크·TV·사무실 PC)에는 아무것도 보이지 않는다. 서비스워커·저장 없음. */
(function () {
  'use strict';
  var me = document.currentScript, APP = (me && me.getAttribute('data-app')) || '방송실 앱';
  var want = /^#install/.test(location.hash), dp = null, bar = null, done = false;
  var ua = navigator.userAgent || '';
  var IOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  var AND = /Android/i.test(ua), KAKAO = /KAKAOTALK/i.test(ua), SAMSUNG = /SamsungBrowser/i.test(ua);
  var IOS_OTHER = IOS && /CriOS|FxiOS|EdgiOS|NAVER|whale/i.test(ua);
  function standalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  window.addEventListener('beforeinstallprompt', function (e) { if (!want) return; e.preventDefault(); dp = e; draw(); });
  window.addEventListener('appinstalled', function () { done = true; draw(); });
  function css() {
    if (document.getElementById('aiCss')) return;
    var s = document.createElement('style'); s.id = 'aiCss';
    s.textContent = '#aiBar{position:fixed;left:0;right:0;bottom:0;z-index:99;background:#fff;border-top:4px solid #5A3A22;box-shadow:0 -6px 24px rgba(0,0,0,.25);padding:14px 16px calc(14px + env(safe-area-inset-bottom));font-family:inherit;color:#1E1A17;font-size:18px;line-height:1.5;word-break:keep-all;overflow-wrap:break-word;max-height:70vh;overflow:auto}' +
      '#aiBar h3{margin:0 0 6px;font-size:21px;color:#5A3A22}#aiBar ol{margin:6px 0 4px;padding-left:24px}#aiBar li{margin:4px 0}' +
      '#aiBar .r{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}#aiBar button{min-height:56px;border-radius:14px;font-size:19px;font-weight:800;padding:0 18px;cursor:pointer;font-family:inherit}' +
      '#aiGo{flex:2 1 200px;background:#5A3A22;color:#fff;border:0}#aiX{flex:1 1 100px;background:#EFE6DA;color:#3B2716;border:2px solid #C9B7A2}' +
      '#aiBar .ok{color:#1E7B45;font-weight:800}#aiBar .warn{color:#B42318;font-weight:800}';
    document.head.appendChild(s);
  }
  function steps() {
    if (KAKAO) return '<p class="warn">[주의] 카카오톡 안에서는 설치가 안 돼요.</p><ol><li>오른쪽 아래(또는 위) <b>⋮ / 공유</b> 단추</li><li><b>「다른 브라우저로 열기」</b> (안드로이드는 크롬, 아이폰은 사파리)</li><li>열린 화면에서 다시 이 안내를 따라 주세요</li></ol>';
    if (IOS) return (IOS_OTHER ? '<p class="warn">[확인 필요] 사파리에서 여는 것이 가장 확실해요.</p>' : '') + '<ol><li>화면 아래(아이패드는 위) <b>공유 단추 (네모에 ↑)</b></li><li>목록을 내려 <b>「홈 화면에 추가」</b></li><li>오른쪽 위 <b>「추가」</b> → 홈 화면에 「' + APP + '」 아이콘이 생겨요</li></ol>';
    if (SAMSUNG) return '<ol><li>아래쪽 <b>≡ 메뉴</b></li><li><b>「현재 페이지 추가」 → 「홈 화면」</b></li><li>홈 화면에 「' + APP + '」 아이콘이 생겨요</li></ol>';
    if (AND) return '<ol><li>오른쪽 위 <b>⋮</b> (점 3개)</li><li><b>「앱 설치」</b> 또는 <b>「홈 화면에 추가」 → 「설치」</b></li><li>홈 화면에 「' + APP + '」 아이콘이 생겨요</li></ol>';
    return '<ol><li>크롬·엣지 주소창 오른쪽의 <b>설치 아이콘 (모니터에 ↓)</b></li><li>또는 <b>⋮ → 전송, 저장 및 공유 → 「페이지를 앱으로 설치」</b></li><li>「설치」를 누르면 바탕화면·시작 메뉴에 「' + APP + '」가 생겨요</li></ol>';
  }
  function draw() {
    if (!want || !document.body) return;
    css();
    if (!bar) { bar = document.createElement('div'); bar.id = 'aiBar'; document.body.appendChild(bar); }
    var h = '<h3>📲 「' + APP + '」 앱으로 설치</h3>';
    if (standalone()) h += '<p class="ok">[완료] 지금 앱으로 열려 있어요. 다음부터는 홈 화면 아이콘으로 여세요.</p>';
    else if (done) h += '<p class="ok">[완료] 설치됐어요. 홈 화면(또는 앱 목록)의 「' + APP + '」 아이콘으로 열어 주세요.</p>';
    else if (dp) h += '<p>아래 단추를 누르고 「설치」를 고르면 끝나요.</p>';
    else h += '<p>이 기기에서는 아래 순서로 설치해요.</p>' + steps();
    h += '<div class="r">' + (dp && !done && !standalone() ? '<button id="aiGo">📲 앱으로 설치하기</button>' : '') + '<button id="aiX">닫기</button></div>';
    bar.innerHTML = h;
    var g = document.getElementById('aiGo');
    if (g) g.onclick = function () { var p = dp; dp = null; p.prompt(); (p.userChoice || Promise.resolve({})).then(function (c) { if (c && c.outcome === 'accepted') done = true; draw(); }); };
    document.getElementById('aiX').onclick = function () { want = false; bar.remove(); bar = null; try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { } };
  }
  function start() { if (want) setTimeout(draw, dp ? 0 : 1200); }
  window.addEventListener('hashchange', function () { if (/^#install/.test(location.hash)) { want = true; draw(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
