import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function boot(search) {
  const events = [];
  const input = { value: '', dispatchEvent: event => events.push(event.type) };
  const context = {
    URLSearchParams, Event, location: { search },
    document: { addEventListener() {} },
    lastPlace: { name: 'Default', latitude: 41, longitude: 12 },
    I18n: { translate: value => value },
    localStorage: { getItem: () => '' },
    window: { setTimeout: () => events.push('gps') },
    $: () => input,
    openLocationModal: () => events.push('modal'),
    syncLocationSeo: () => events.push('seo'),
    initMap() {}, initSeaAtlas() {}, initPortPlanner() {}, renderSaved() {},
    loadWeather: place => events.push({ ...place })
  };
  vm.runInNewContext(fs.readFileSync(new URL('../app-bootstrap.js', import.meta.url), 'utf8'), context);
  return { context, events, input };
}
const named = boot('?localita=Rome');
assert.equal(named.context.lastPlace.name, 'Default');
assert.equal(named.input.value, 'Rome');
assert(named.events.includes('modal'));
assert(named.events.includes('input'));
assert(!named.events.includes('gps'));
const gps = boot('?lat=38.19&lon=15.55');
assert.equal(gps.context.lastPlace.latitude, 38.19);
assert.equal(gps.context.lastPlace.longitude, 15.55);
assert(gps.events.includes('seo'));
assert(!gps.events.includes('modal'));
for (const query of ['?localita=Rome&lat=&lon=', '?localita=Rome&lat=91&lon=12', '?localita=Rome&lat=null&lon=12']) {
  assert.equal(boot(query).context.lastPlace.name, 'Default');
}
assert.equal(boot('?lat=0&lon=0').context.lastPlace.latitude, 0);
console.log('Bootstrap SEO location tests passed');
