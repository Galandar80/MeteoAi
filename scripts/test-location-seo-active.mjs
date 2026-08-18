import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const activationHandler = require('../api/location-seo.js');
const sitemapHandler = require('../api/seo-sitemap.js');
const activeIds = new Set();

process.env.UPSTASH_REDIS_REST_URL = 'https://redis.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
globalThis.fetch = async (_url, options) => {
  const [command, key, value] = JSON.parse(options.body);
  assert.equal(key, 'meteo-ai:seo-active-localities');
  if (command === 'SADD') {
    const before = activeIds.size;
    activeIds.add(value);
    return { ok: true, json: async () => ({ result: activeIds.size > before ? 1 : 0 }) };
  }
  if (command === 'SMEMBERS') return { ok: true, json: async () => ({ result: [...activeIds] }) };
  throw new Error(`Comando inatteso: ${command}`);
};

function responseRecorder() {
  return { statusCode: 200, headers: {}, body: '', setHeader(name, value) { this.headers[name] = value; }, end(body = '') { this.body = body; } };
}

async function activate(body, userAgent = 'Mozilla/5.0') {
  const res = responseRecorder();
  await activationHandler({ method: 'POST', headers: { 'user-agent': userAgent }, body }, res);
  return { ...res, json: JSON.parse(res.body) };
}

const manual = await activate({ source: 'manual', id: 3169070 });
assert.equal(manual.statusCode, 200);
assert.equal(manual.json.place.name, 'Rome');
assert.equal(manual.json.added, true);

const duplicate = await activate({ source: 'manual', id: 3169070 });
assert.equal(duplicate.statusCode, 200);
assert.equal(duplicate.json.added, false);
assert.equal(activeIds.size, 1);

const gps = await activate({ source: 'gps', latitude: 38.19, longitude: 15.55 });
assert.equal(gps.statusCode, 200);
assert.equal(gps.json.place.id, 2524170);

const invalid = await activate({ source: 'manual', id: 999999999 });
assert.equal(invalid.statusCode, 400);
assert.equal(activeIds.size, 2);

const crawler = await activate({ source: 'manual', id: 3173435 }, 'Googlebot/2.1');
assert.equal(crawler.statusCode, 403);
assert.equal(activeIds.size, 2);

const longTailForeign = await activate({ source: 'manual', id: 684802 });
assert.equal(longTailForeign.statusCode, 200);
assert.equal(longTailForeign.json.place.name, 'Bârlad');

const sitemap = responseRecorder();
await sitemapHandler({ query: { kind: 'locations' } }, sitemap);
assert.match(sitemap.body, /rome-3169070/);
assert.match(sitemap.body, /messina-2524170/);
assert.match(sitemap.body, /barlad-684802/,'activated foreign long-tail localities become discoverable');
assert.doesNotMatch(sitemap.body, /inesistente/);
assert.match(sitemap.body, /<loc>https:\/\/meteo-ai\.vercel\.app\/pt-br\/previsao\/it\/lazio\/rome-3169070<\/loc>/);
assert.match(sitemap.body, /<loc>https:\/\/meteo-ai\.vercel\.app\/es\/tiempo\/it\/lazio\/rome-3169070<\/loc>/);
assert.match(sitemap.body, /hreflang="pt-BR"/);
assert.match(sitemap.body, /hreflang="es"/);
const activeUrlCount=(sitemap.body.match(/<url>/g)||[]).length;
assert.ok(activeUrlCount>=300&&activeUrlCount<600,`activation-first multilingual sitemap expected, received ${activeUrlCount}`);

const sitemapIndex=fs.readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
assert.match(sitemapIndex,/sitemaps\/localita-attive\.xml/);
assert.doesNotMatch(sitemapIndex,/localita-principali/);

const appSource = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(appSource, /selectWeatherPlace\(place\).*activateLocationSeo\(\{source:'manual'/s);
assert.match(appSource, /source:'gps',latitude,longitude/);
assert.match(appSource, /'\/pt-br\/previsao'/);
assert.match(appSource, /'\/es\/tiempo'/);
const autocompleteBlock = appSource.slice(appSource.indexOf("$('#placeInput').addEventListener('input'"), appSource.indexOf('function openLocationModal'));
assert.doesNotMatch(autocompleteBlock, /activateLocationSeo/);

console.log('SEO località attive: ricerca, GPS, sitemap, duplicati e località non valide verificati.');
