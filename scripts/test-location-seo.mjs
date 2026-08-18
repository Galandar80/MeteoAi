import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const handler = require('../api/meteo-page.js');
const locationsIndexHandler = require('../api/locations-index.js');

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
assert.match(found.body, /Meteo Messina oggi, domani e questa settimana/);
assert.match(found.body, /<title>Meteo Messina: oggi, domani e 7 giorni \| Meteo AI<\/title>/);
assert.match(found.body, /https:\/\/meteo-ai\.vercel\.app\/meteo\/it\/sicily\/messina-2524170/);
assert.match(found.body, /application\/ld\+json/);
assert.match(found.body, /property="og:image" content="https:\/\/meteo-ai\.vercel\.app\/social-preview\.jpg\?v=20260723b"/);
assert.match(found.body, /name="twitter:card" content="summary_large_image"/);
assert.match(found.body, /25°C/);
assert.match(found.body, /class="primary" rel="nofollow"/);
assert.match(found.body, /href="\/localita"/);
assert.match(found.body, /aria-label="Percorso"/);
assert.match(found.body, /Altre località meteo in Sicily/);
assert.doesNotMatch(found.body, /canavieiras-3467577/);
assert.doesNotMatch(found.body, /https:\/\/meteo-ai\.vercel\.app\/meteo\/it["#]/);
assert.doesNotMatch(found.body, /\bundefined\b|\bNaN\b/);

const portuguese = responseRecorder();
await handler(
  { query: { lang: 'pt-BR', country: 'it', region: 'sicily', place: 'messina-2524170' } },
  portuguese
);
assert.equal(portuguese.statusCode, 200);
assert.equal(portuguese.headers['Content-Language'], 'pt-BR');
assert.match(portuguese.body, /<html lang="pt-BR">/);
assert.match(portuguese.body, /Previsão do tempo em Messina hoje, amanhã e esta semana/);
assert.match(portuguese.body, /rel="canonical" href="https:\/\/meteo-ai\.vercel\.app\/pt-br\/previsao\/it\/sicily\/messina-2524170"/);
assert.match(portuguese.body, /hreflang="es" href="https:\/\/meteo-ai\.vercel\.app\/es\/tiempo\/it\/sicily\/messina-2524170"/);

const english = responseRecorder();
await handler(
  { query: { lang: 'en', country: 'it', region: 'lazio', place: 'rome-3169070' } },
  english
);
assert.equal(english.headers['Content-Language'], 'en-GB');
assert.match(english.body, /Weather in Rome today, tomorrow and this week/);
assert.match(english.body, /rel="canonical" href="https:\/\/meteo-ai\.vercel\.app\/en\/weather\/it\/lazio\/rome-3169070"/);

const french = responseRecorder();
await handler(
  { query: { lang: 'fr', country: 'it', region: 'lazio', place: 'rome-3169070' } },
  french
);
assert.equal(french.headers['Content-Language'], 'fr-FR');
assert.match(french.body, /Météo à Rome aujourd’hui, demain et cette semaine/);
assert.match(french.body, /href="\/fr\/meteo\/it\/[^\"]+"/);

const spanish = responseRecorder();
await handler(
  { query: { lang: 'es', country: 'it', region: 'sicily', place: 'messina-2524170' } },
  spanish
);
assert.equal(spanish.statusCode, 200);
assert.equal(spanish.headers['Content-Language'], 'es-ES');
assert.match(spanish.body, /El tiempo en Messina hoy, mañana y esta semana/);
assert.match(spanish.body, /<title>Tiempo en Messina: hoy, mañana y 7 días \| Meteo AI<\/title>/);
assert.match(spanish.body, /href="\/es\/tiempo\/it\/[^\"]+"/);

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

const index = responseRecorder();
await locationsIndexHandler({}, index);
assert.equal(index.statusCode, 200);
assert.match(index.body, /Località meteo attive su Meteo AI/);
assert.match(index.body, /100 località attive/);
assert.match(index.body, /Meteo Roma/);
assert.match(index.body, /CollectionPage/);
assert.doesNotMatch(index.body, /canavieiras-3467577/);
assert.doesNotMatch(index.body, /\bundefined\b|\bNaN\b/);

const spanishIndex = responseRecorder();
await locationsIndexHandler({ query: { lang: 'es' } }, spanishIndex);
assert.equal(spanishIndex.headers['Content-Language'], 'es-ES');
assert.match(spanishIndex.body, /Localidades meteorológicas activas en Meteo AI/);
assert.match(spanishIndex.body, /Tiempo Roma/);
assert.match(spanishIndex.body, /href="\/es\/tiempo\/it\/lazio\/rome-3169070"/);
assert.match(spanishIndex.body, /hreflang="pt-BR" href="https:\/\/meteo-ai\.vercel\.app\/pt-br\/localidades"/);

const englishIndex = responseRecorder();
await locationsIndexHandler({ query: { lang: 'en' } }, englishIndex);
assert.match(englishIndex.body, /Active weather locations on Meteo AI/);
assert.match(englishIndex.body, /href="\/en\/weather\/it\/lazio\/rome-3169070"/);

const frenchIndex = responseRecorder();
await locationsIndexHandler({ query: { lang: 'fr' } }, frenchIndex);
assert.match(frenchIndex.body, /Localités météo actives sur Meteo AI/);
assert.match(frenchIndex.body, /href="\/fr\/meteo\/it\/lazio\/rome-3169070"/);

console.log('Pagine località: test completato con successo.');
