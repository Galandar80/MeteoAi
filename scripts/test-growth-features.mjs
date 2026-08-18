import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const about=require('../api/about-page');
const widgetPage=require('../api/widget-page');
const weatherWidget=require('../api/weather-widget');
const { SEED_IDS }=require('../api/_location-seo');
const routes={it:['/come-funziona','/widget'],en:['/en/how-it-works','/en/widget'],fr:['/fr/comment-ca-marche','/fr/widget'],'pt-BR':['/pt-br/como-funciona','/pt-br/widget'],es:['/es/como-funciona','/es/widget']};
function response(){return{statusCode:0,headers:{},setHeader(key,value){this.headers[key]=value},end(body=''){this.body=body}}}
for(const [lang,[howPath,widgetPath]] of Object.entries(routes)){
  let res=response();about({query:{lang}},res);assert.equal(res.statusCode,200);assert.match(res.body,new RegExp(`canonical" href="https://meteo-ai\\.vercel\\.app${howPath.replaceAll('/','\\/')}`));assert.match(res.body,/application\/ld\+json/);assert.match(res.body,/hreflang="x-default"/);assert.doesNotMatch(res.body,/undefined/);
  res=response();await widgetPage({query:{lang}},res);assert.equal(res.statusCode,200);assert.match(res.body,new RegExp(`canonical" href="https://meteo-ai\\.vercel\\.app${widgetPath.replaceAll('/','\\/')}`));assert.match(res.body,/\/embed\/weather\?id=/);assert.match(res.body,/navigator\.clipboard/);assert.doesNotMatch(res.body,/undefined/);
}
const originalFetch=global.fetch;
global.fetch=async()=>({ok:true,json:async()=>({current:{temperature_2m:23.4,weather_code:1,wind_speed_10m:12},daily:{time:['2026-08-18','2026-08-19'],weather_code:[1,2],temperature_2m_max:[27,28],temperature_2m_min:[18,19],precipitation_probability_max:[10,20]}})});
try{
  for(const lang of Object.keys(routes)){const res=response();await weatherWidget({query:{id:String(SEED_IDS[0]),lang,theme:'dark',mode:'extended'}},res);assert.equal(res.statusCode,200);assert.equal(res.headers['X-Robots-Tag'],'noindex,follow');assert.equal(res.headers['Content-Security-Policy'],'frame-ancestors *');assert.match(res.body,/utm_source=weather_widget&amp;utm_medium=referral/);assert.match(res.body,/rel="nofollow noopener"/);assert.doesNotMatch(res.body,/undefined/)}
}finally{global.fetch=originalFetch}
const vercel=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));const sources=new Set(vercel.rewrites.map(item=>item.source));for(const paths of Object.values(routes))for(const path of paths)assert(sources.has(path),`Missing rewrite ${path}`);assert(sources.has('/embed/weather'));
const app=fs.readFileSync(new URL('../app-features.js',import.meta.url),'utf8');assert.match(app,/utm_source/);assert.match(app,/shareCopy/);assert.match(app,/clipboard\.writeText\(text\)/);
const sitemap=fs.readFileSync(new URL('../sitemaps/static.xml',import.meta.url),'utf8');for(const paths of Object.values(routes))for(const path of paths)assert(sitemap.includes(`https://meteo-ai.vercel.app${path}`));assert(!sitemap.includes('/embed/weather'));
console.log('Growth features: methodology, sharing and widget OK');
