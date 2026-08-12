const catalog = Array.from({ length: 12 }, (_, index) => require(`../data/localities-${index + 1}.json`)).flat();

const byId = new Map(catalog.map(place => [String(place.id), place]));
const ACTIVE_KEY = 'meteo-ai:seo-active-localities';
const SEED_IDS = Object.freeze([
  3169070, 3173435, 3172394, 3165524, 2523920,
  3176959, 3181928, 3176219, 3164603, 2524170
]);
const DISCOVERY_MIN_POPULATION = 100000;
const discoveryPlaces = catalog.filter(place => place.cc === 'IT' || place.p >= DISCOVERY_MIN_POPULATION);

function publicPlace(place) {
  return {
    id: place.id,
    name: place.n,
    country: place.c,
    country_code: place.cc,
    admin1: place.ad,
    latitude: place.lat,
    longitude: place.lon,
    path: place.path
  };
}

function distanceSquared(latitude, longitude, place) {
  const latitudeScale = 111;
  const longitudeScale = Math.max(20, 111 * Math.cos(latitude * Math.PI / 180));
  return ((place.lat - latitude) * latitudeScale) ** 2
    + ((place.lon - longitude) * longitudeScale) ** 2;
}

function nearestPlace(latitude, longitude) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
    || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null;
  let nearest = null;
  let nearestDistance = Infinity;
  for (const place of catalog) {
    const distance = distanceSquared(latitude, longitude, place);
    if (distance < nearestDistance) {
      nearest = place;
      nearestDistance = distance;
    }
  }
  return nearest;
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL
    || process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
    || process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function redisCommand(command) {
  const config = redisConfig();
  if (!config) throw new Error('SEO storage non configurato');
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  if (!response.ok) throw new Error(`SEO storage ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

async function activate(place) {
  const added = await redisCommand(['SADD', ACTIVE_KEY, String(place.id)]);
  return { place: publicPlace(place), added: Number(added) === 1 };
}

async function activePlaces() {
  let ids = [];
  try {
    const result = await redisCommand(['SMEMBERS', ACTIVE_KEY]);
    if (Array.isArray(result)) ids = result;
  } catch (_) {
    // Fail-open: il seed resta disponibile anche se il piano gratuito e' temporaneamente limitato.
  }
  // Mantiene una base editoriale abbastanza ampia per la ricerca organica senza
  // riproporre a Google l'intero catalogo di 34 mila localita'. Le selezioni reali
  // degli utenti aggiungono progressivamente anche le localita' long-tail estere.
  const uniqueIds = new Set([
    ...discoveryPlaces.map(place => String(place.id)),
    ...SEED_IDS.map(String),
    ...ids.map(String)
  ]);
  return [...uniqueIds].map(id => byId.get(id)).filter(Boolean);
}

module.exports = { ACTIVE_KEY, SEED_IDS, DISCOVERY_MIN_POPULATION, byId, publicPlace, nearestPlace, activate, activePlaces, redisCommand };
