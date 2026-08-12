import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const handler=require('../api/localized-page.js');

const cases=[
  {page:'home',language:'en',lang:'en-GB',canonical:'/en',title:'Weather today',heading:'Don’t just look'},
  {page:'home',language:'fr',lang:'fr-FR',canonical:'/fr',title:'Météo du jour',heading:'Ne regardez pas seulement'},
  {page:'home',language:'pt-BR',lang:'pt-BR',canonical:'/pt-br',title:'Clima hoje',heading:'Não veja apenas'},
  {page:'world',language:'en',lang:'en-GB',canonical:'/en/world-live',title:'World Live',heading:'The planet'},
  {page:'install',language:'fr',lang:'fr-FR',canonical:'/fr/install',title:'Installer Meteo AI',heading:'Ajoutez Meteo AI'}
];

for(const test of cases){
  const html=handler.render(test.page,test.language);
  assert.match(html,new RegExp(`<html lang="${test.lang}"`));
  assert.match(html,new RegExp(`<title>${test.title}`));
  assert.match(html,new RegExp(`rel="canonical" href="https://meteo-ai\\.vercel\\.app${test.canonical.replaceAll('/','\\/')}`));
  assert.match(html,new RegExp(test.heading));
  assert.match(html,/<!--meteo-i18n:/,'server output must retain canonical source markers for live language changes');
  for(const hreflang of ['it','en','fr','pt-BR','x-default'])assert.match(html,new RegExp(`hreflang="${hreflang}"`));
  assert.match(html,new RegExp(`window\\.__METEO_LOCALE__=${JSON.stringify(test.language)}`));
  assert.doesNotMatch(html,/@@METEO_BLOCK_/);
}

function responseRecorder(){return{statusCode:200,headers:{},body:'',setHeader(name,value){this.headers[name]=value},end(body=''){this.body=body}}}
const response=responseRecorder();
handler({query:{page:'home',lang:'fr'}},response);
assert.equal(response.statusCode,200);
assert.equal(response.headers['Content-Language'],'fr-FR');
assert.match(response.headers['X-Robots-Tag'],/index,follow/);

const config=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
for(const source of ['/en','/fr','/pt-br','/en/world-live','/fr/world-live','/pt-br/world-live','/en/install','/fr/install','/pt-br/install'])assert.ok(config.rewrites.some(rule=>rule.source===source),`missing rewrite ${source}`);
assert.equal(config.rewrites.filter(rule=>rule.source.startsWith('/meteo/')).length,1,'location routes must not be multiplied by locale');

const sitemap=fs.readFileSync(new URL('../sitemaps/static.xml',import.meta.url),'utf8');
assert.match(sitemap,/xmlns:xhtml=/);
assert.match(sitemap,/https:\/\/meteo-ai\.vercel\.app\/pt-br\/world-live/);
assert.doesNotMatch(sitemap,/\/en\/meteo\/|\/fr\/meteo\/|\/pt-br\/meteo\//);
console.log('SEO internazionale: rendering server-side, URL, canonical, hreflang e sitemap OK');
