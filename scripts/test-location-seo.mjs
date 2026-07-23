import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const handler = require('../api/meteo-page.js');

const forecast = {
  current: {
    temperature_2m: 25.4,
    apparent_temperature: 26.1,
    relative_humidity_2m: 61,
    weather_code: 1,
    wind_speed_10m: 12,
    wind_direction_10m: 180,
    surface_pressure: 1014,
    precipitation: 0
  },
  daily: {
    time: ['2026-07-23', '2026-07-24'],
    weather_code: [1, 2],
    temperature_2m_max: [29, 30],
    temperature_2m_min: [21, 22],
    precipitation_probability_max: [5, 10],
    sunrise: ['2026-07-23T05:55', '2026-07-24T05:56'],
    sunset: ['2026-07-23T20:15', '2026-07-24T20:14'],
    wind_speed_10m_max: [20, 21]
  }
};

globalThis.fetch = async () => ({
  ok: true,
  json: async () => forecast
});

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = body;
    }
  };
}

const found = responseRecorder();
await handler(
  { query: { place: 'messina-2524170' }, url: '/api/meteo-page?place=messina-2524170' },
  found
);
assert.equal(found.statusCode, 200);
assert.match(found.headers['Content-Type'], /text\/html/);
assert.match(found.body, /Meteo Messina oggi/);
assert.match(found.body, /https:\/\/meteo-ai\.vercel\.app\/meteo\/it\/sicily\/messina-2524170/);
assert.match(found.body, /application\/ld\+json/);
assert.match(found.body, /property="og:image" content="https:\/\/meteo-ai\.vercel\.app\/social-preview\.png"/);
assert.match(found.body, /name="twitter:card" content="summary_large_image"/);
assert.match(found.body, /25 °C/);
assert.doesNotMatch(found.body, /\bundefined\b|\bNaN\b/);

const missing = responseRecorder();
await handler(
  { query: { place: 'inesistente-999999999' }, url: '/api/meteo-page?place=inesistente-999999999' },
  missing
);
assert.equal(missing.statusCode, 404);
assert.equal(missing.headers['X-Robots-Tag'], 'noindex,follow');

const nonCanonical = responseRecorder();
await handler(
  {
    query: { country: 'it', region: 'lazio', place: 'roma-3169070' },
    url: '/api/meteo-page?country=it&region=lazio&place=roma-3169070'
  },
  nonCanonical
);
assert.equal(nonCanonical.statusCode, 308);
assert.equal(nonCanonical.headers.Location, '/meteo/it/lazio/rome-3169070');

console.log('Pagine località: test completato con successo.');
