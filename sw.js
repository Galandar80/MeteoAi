const CACHE='meteo-ai-v52-localized-tools';
const CORE=['/','/index.html','/installa.html','/styles.css','/install.css','/i18n.js','/pwa-install.js','/app-core.js','/app.js','/app-marine.js','/app-assistants.js','/app-features.js','/app-legal.js','/app-bootstrap.js','/world-live.html','/world-live.css','/world-live.js','/manifest.webmanifest','/manifest.en.webmanifest','/manifest.fr.webmanifest','/manifest.pt-BR.webmanifest','/icon.svg','/icon-192.png','/icon-512.png','/icon-maskable-512.png','/apple-touch-icon.png','/social-preview.jpg','/screenshots/app-desktop.png','/screenshots/app-mobile.png','/countries-110m.geojson'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('meteo-ai-')&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  // Cache the app shell only. Forecast pages and APIs must respect server freshness.
  if(!CORE.includes(url.pathname)&&!/^\/(en|fr|pt-br|es)(\/(world-live|install))?$/.test(url.pathname))return;
  e.respondWith((async()=>{
    try{const response=await fetch(e.request);if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(cache=>cache.put(url.pathname,copy)))}return response}
    catch(_){return await caches.match(url.pathname)||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
  })());
});
self.addEventListener('notificationclick',event=>{event.notification.close();const target=new URL(event.notification.data?.url||'/world-live.html',self.location.origin).href;event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(windows=>{const existing=windows.find(client=>client.url.includes('world-live.html'));if(existing){if('navigate'in existing)existing.navigate(target);return existing.focus()}return clients.openWindow?clients.openWindow(target):undefined}))});
