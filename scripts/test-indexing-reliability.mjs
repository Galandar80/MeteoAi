import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const handler=require('../api/meteo-page');
const {fetchForecast,getForecast,seedForecast,clearForecastCache}=require('../api/_forecast-cache');
const {render}=require('../api/localized-page');
const config=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},end(body=''){this.body=body;}});
const place={id:1,lat:1,lon:2};
const data={current:{temperature_2m:21}};
const ok=()=>({ok:true,json:async()=>data});
const abortable=(_url,{signal})=>new Promise((_,reject)=>{
  signal.addEventListener('abort',()=>reject(Object.assign(new Error('timeout'),{name:'AbortError'})),{once:true});
});

// Parallel crawls share one request.
clearForecastCache();
let calls=0,release;
const options={fetchImpl:()=>{calls++;return new Promise(resolve=>{release=()=>resolve(ok());});}};
const requests=[getForecast(place,options),getForecast(place,options)];
assert.equal(calls,1);
release();
assert((await Promise.all(requests)).every(entry=>entry.data===data));

// A response slower than the previous 1.8-second limit is accepted.
let result=await fetchForecast(place,{fetchImpl:(_url,{signal})=>new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>resolve(ok()),1900);
  signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new Error('aborted'));},{once:true});
})});
assert.equal(result.attempts,1);
assert.deepEqual(result.data,data);

for(const first of [async()=>({ok:false,status:503}),async()=>{throw new TypeError('fetch failed');},abortable]) {
  calls=0;
  result=await fetchForecast(place,{timeoutMs:25,budgetMs:100,retryDelayMs:0,
    fetchImpl:(...args)=>++calls===1?first(...args):Promise.resolve(ok())});
  assert.equal(calls,2);
  assert.equal(result.attempts,2);
  assert.deepEqual(result.data,data);
}
for(const reply of [
  {ok:false,status:429},{ok:false,status:403},
  {ok:false,status:503,headers:{get:()=> '300'}},
  {ok:true,json:async()=>({error:true})},
  {ok:true,json:async()=>{throw new SyntaxError('invalid JSON');}}
]) {
  calls=0;
  await assert.rejects(fetchForecast(place,{retryDelayMs:0,fetchImpl:async()=>{calls++;return reply;}}));
  assert.equal(calls,1);
}
clearForecastCache();
calls=0;
const started=Date.now();
result=await getForecast(place,{fetchImpl:(...args)=>{calls++;return abortable(...args);},timeoutMs:40,budgetMs:65,retryDelayMs:0});
assert.equal(result.data,null);
assert.equal(result.error.code,'timeout');
assert(calls>=1 && calls<=2,'a delayed event loop may exhaust the budget before the second attempt');
assert(Date.now()-started<250);

// Check cache age and local calendar boundaries independently of the time tests run.
const NativeDate=global.Date;
const noon=new NativeDate('2026-09-21T12:00:00Z').getTime();
global.Date=class extends NativeDate {
  constructor(...args){super(...(args.length?args:[noon]));}
  static now(){return noon;}
};
try {
  clearForecastCache();
  seedForecast(place.id,data,'2026-09-21T11:40:00Z');
  result=await getForecast(place,{fetchImpl:async()=>{throw new Error('offline');}});
  assert.equal(result.cache,'stale');
  await new Promise(resolve=>setImmediate(resolve));
  for(const [updatedAt,tz] of [['2026-09-21T05:00:00Z','UTC'],['2026-09-21T10:50:00Z','Pacific/Auckland']]) {
    clearForecastCache();
    seedForecast(place.id,data,updatedAt);
    result=await getForecast({...place,tz},{fetchImpl:async()=>{throw new Error('offline');}});
    assert.equal(result.data,null,'old data or data from the previous local day must not be served');
  }
} finally {global.Date=NativeDate;clearForecastCache();}

const redirect=config.redirects.find(rule=>rule.source==='/meteo/pk/sindh/installa.html');
assert.equal(redirect?.destination,'/installa.html');
assert.equal(redirect?.permanent,true);
assert(fs.existsSync(new URL(`..${redirect.destination}`,import.meta.url)));
assert(!config.redirects.some(rule=>rule.source==='/meteo/:country'));
assert(config.rewrites.some(rule=>rule.source==='/meteo/:country'&&rule.destination==='/api/meteo-page?country=:country'));
for(const country of ['gw','th','es','ve']) {
  const res=response();
  await handler({query:{country}},res);
  assert.equal(res.statusCode,404);
  assert.equal(res.headers.Location,undefined);
  assert.match(res.body,/noindex,follow/);
}
assert.doesNotMatch(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),/href=["']installa\.html/);
for(const lang of ['en','fr','pt-BR','es']) {
  const html=render('home',lang);
  assert(html.includes(`href="/${lang.toLowerCase()}/install"`));
  assert.doesNotMatch(html,/href=["']installa\.html/);
}
const originalFetch=global.fetch;
try {
  clearForecastCache();
  calls=0;
  global.fetch=async()=>++calls===1?{ok:false,status:502}:ok();
  const recovered=response();
  await handler({query:{place:'messina-2524170'}},recovered);
  assert.equal(recovered.statusCode,200);
  assert.equal(calls,2);
  assert.match(recovered.body,/rel="canonical"/);
  clearForecastCache();
  calls=0;
  global.fetch=async()=>{calls++;return{ok:false,status:429};};
  const limited=response();
  await handler({query:{place:'messina-2524170'}},limited);
  assert.equal(calls,1);
  assert.equal(limited.statusCode,503);
  assert.equal(limited.headers['Cache-Control'],'no-store');
  assert.equal(limited.headers['Retry-After'],'300');
} finally {global.fetch=originalFetch;clearForecastCache();}
console.log('Indexing reliability: slow provider, retries, limits, freshness, concurrency, targeted redirect, genuine 404s and localized links passed.');
