import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {byId,nearestPlace}=require('../api/_location-seo');
const {displayAdmin,displayPlaceName,localizedPlacePath}=require('../api/_seo-locales');
const {getForecast,clearForecastCache,seedForecast}=require('../api/_forecast-cache');
const render=require('../api/localized-page').render;
const handler=require('../api/meteo-page');
const sitemap=require('../api/seo-sitemap');
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(body=''){this.body=body}});
const catalog=Array.from({length:12},(_,i)=>require(`../data/localities-${i+1}.json`)).flat();
assert.equal(byId.size,catalog.length,'duplicate GeoNames IDs');
assert.equal(new Set(catalog.map(p=>p.path)).size,catalog.length,'duplicate paths');
for(const p of catalog){
 assert(Number.isFinite(p.lat)&&Math.abs(p.lat)<=90&&Number.isFinite(p.lon)&&Math.abs(p.lon)<=180);
 assert(p.path.startsWith(`/meteo/${p.cc.toLowerCase()}/`)&&p.path.endsWith(`-${p.id}`));
 new Intl.DateTimeFormat('en',{timeZone:p.tz});
}
const messina=byId.get('2524170');
for(const [lang,region]of Object.entries({it:'Sicilia',en:'Sicily',fr:'Sicile','pt-BR':'Sicília',es:'Sicilia'}))assert.equal(displayAdmin(messina,lang),region);
assert.equal(displayPlaceName(byId.get('3169070'),'it'),'Roma');
assert.equal(displayPlaceName({id:123,n:'Rome',cc:'US'},'it'),'Rome');
assert.equal(nearestPlace(0,-140),null,'ocean GPS must not activate an unrelated city');
assert.equal(nearestPlace(messina.lat,messina.lon).id,messina.id);
for(const lang of ['en','fr','pt-BR','es'])for(const page of ['home','world','install']){
 const html=render(page,lang);
 assert.doesNotMatch(html,/(?:src|href)="(?:styles\.css|world-live\.js|pwa-install\.js|world-live\.css)"/);
 const visible=html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g,'').replace(/<[^>]+>/g,' ');
 assert.doesNotMatch(visible,/\b(?:della|degli|vengono|soltanto|Interrogo|Gestisci|sorvegliate|Scarica)\b/);
 if(page==='world'){const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert.equal(schema['@id'],`https://meteo-ai.vercel.app/${lang==='pt-BR'?'pt-br':lang}/world-live#page`);}
}
clearForecastCache();
global.fetch=async()=>({ok:true,json:async()=>({current:{temperature_2m:null,precipitation:null},daily:{time:['2026-09-15','2026-09-16'],temperature_2m_max:[20,21]}})});
const partial=response();await handler({query:{place:'messina-2524170'}},partial);
assert.equal(partial.statusCode,200);assert.doesNotMatch(partial.body,/NaN|undefined/);assert.match(partial.body,/— mm/);
clearForecastCache();seedForecast(messina.id,{current:{temperature_2m:20}},new Date(Date.now()-7*3600000).toISOString());
const expired=await getForecast(messina,{fetchImpl:async()=>{throw Error('offline')}});assert.equal(expired.data,null);
clearForecastCache();global.fetch=async()=>{throw Error('offline')};
const unavailable=response();await handler({query:{place:'messina-2524170'}},unavailable);
assert.equal(unavailable.statusCode,503);assert.equal(unavailable.headers['Retry-After'],'300');assert.equal(unavailable.headers['Cache-Control'],'no-store');
for(const lang of ['en','fr']){const missing=response();await handler({query:{lang,place:'missing-999999999'}},missing);assert.equal(missing.statusCode,404);assert(!missing.body.includes('Località non trovata'));}
const original=globalThis.__METEO_ACTIVE_PLACES__.places;
try{
 globalThis.__METEO_ACTIVE_PLACES__.places=catalog.slice(0,1001);
 const index=response();await sitemap({query:{kind:'index'}},index);assert(index.body.includes('localita-attive-2.xml'));
 const first=response(),second=response();await sitemap({query:{kind:'locations'}},first);await sitemap({query:{kind:'locations',page:'2'}},second);
 const urls=xml=>[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls(first.body).length,5000);assert.equal(urls(second.body).length,5);assert.equal(new Set([...urls(first.body),...urls(second.body)]).size,5005);
 const invalid=response();await sitemap({query:{kind:'locations',page:'999'}},invalid);assert.equal(invalid.statusCode,404);
}finally{globalThis.__METEO_ACTIVE_PLACES__.places=original;}
console.log(`SEO audit: ${catalog.length} entities, translations, geography, assets, partial data, errors and sitemap pagination passed.`);
