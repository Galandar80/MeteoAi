import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const handlers = {};
const writes = [];
let network = async () => new Response('Unavailable', { status: 503 });
vm.runInNewContext(fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), {
  URL, Response, location: { origin: 'https://meteo-ai.vercel.app' },
  self: { addEventListener: (name, handler) => handlers[name] = handler },
  fetch: (...args) => network(...args),
  caches: { open: async () => ({ put: async key => writes.push(key) }), match: async () => undefined }
});
async function request(path) {
  let response;
  const pending = [];
  handlers.fetch({ request: { method: 'GET', url: 'https://meteo-ai.vercel.app' + path },
    respondWith: promise => response = promise, waitUntil: promise => pending.push(promise) });
  const result = await response;
  await Promise.all(pending);
  return result;
}
assert.equal((await request('/fr')).status, 503);
assert.equal(writes.length, 0, 'Never cache unsuccessful responses');
network = async () => new Response('OK');
assert.equal((await request('/fr?localita=Paris')).status, 200);
assert.deepEqual(writes, ['/fr'], 'Query strings must not multiply cache entries');
assert.equal(await request('/api/forecast'), undefined);
assert.equal(await request('/meteo/it/lazio/rome-3169070'), undefined);
assert.equal(await request('/missing.js'), undefined);
network = async () => { throw new Error('offline'); };
assert.equal((await request('/styles.css')).status, 503, 'Do not return homepage HTML as CSS');
console.log('Service worker SEO cache tests passed');
