const catalog = Array.from({ length: 12 }, (_, index) => require(`../data/localities-${index + 1}.json`)).flat();

const byId = new Map(catalog.map(place => [String(place.id), place]));
const ACTIVE_KEY = 'meteo-ai:seo-active-localities';
const LANGUAGE_ACTIVE_KEY = 'meteo-ai:seo-active-language-localities';
const GLOBAL_SEED_COUNT = 70;
const ITALY_SEED_COUNT = 30;
const byPopulation = (left, right) => right.p - left.p || left.n.localeCompare(right.n);
const globalSeed = [...catalog].sort(byPopulation).slice(0, GLOBAL_SEED_COUNT);
const italianSeed = catalog.filter(place => place.cc === 'IT').sort(byPopulation).slice(0, ITALY_SEED_COUNT);
const SEED_IDS = Object.freeze([...new Set([...globalSeed, ...italianSeed].map(place => place.id))]);

function publicPlace(place, language='it') {
  const {displayPlaceName,displayCountry,displayAdmin}=require('./_seo-locales');
  return {
    id: place.id,
    name: displayPlaceName(place,language),
    country: displayCountry(place,language),
    country_code: place.cc,
    admin1: displayAdmin(place,language),
    latitude: place.lat,
    longitude: place.lon,
    path: place.path
  };
}

function distanceSquared(latitude, longitude, place) {
  const rad=value=>value*Math.PI/180;
  const a=Math.sin(rad(place.lat-latitude)/2)**2+Math.cos(rad(latitude))*Math.cos(rad(place.lat))*Math.sin(rad(place.lon-longitude)/2)**2;
  return (6371*2*Math.asin(Math.sqrt(Math.min(1,a))))**2;
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
  return nearestDistance <= 50**2 ? nearest : null;
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`SEO storage ${response.status}`);
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error);
    return payload.result;
  } finally {
    clearTimeout(timeout);
  }
}

const activeState = globalThis.__METEO_ACTIVE_PLACES__ ||= { places:[...new Set(SEED_IDS.map(String))].map(id=>byId.get(id)).filter(Boolean), updatedAt:0, inflight:null };
const languageState=globalThis.__METEO_ACTIVE_LANGUAGES__||={pairs:new Set(),updatedAt:0,inflight:null};
async function refreshActivePlaces() {
  if (activeState.inflight) return activeState.inflight;
  activeState.inflight=(async()=>{let ids=[];try{const result=await redisCommand(['SMEMBERS',ACTIVE_KEY]);if(Array.isArray(result))ids=result}catch(_){return activeState.places}const unique=new Set([...SEED_IDS.map(String),...ids.map(String)]);activeState.places=[...unique].map(id=>byId.get(id)).filter(Boolean);activeState.updatedAt=Date.now();return activeState.places})().finally(()=>{activeState.inflight=null});
  return activeState.inflight;
}
async function activate(place, language='it') {
  const pair=`${language}:${place.id}`;
  const [added]=await Promise.all([redisCommand(['SADD',ACTIVE_KEY,String(place.id)]),redisCommand(['SADD',LANGUAGE_ACTIVE_KEY,pair]).catch(()=>0)]);
  if(!activeState.places.some(item=>item.id===place.id))activeState.places.push(place);
  languageState.pairs.add(pair);
  return { place:publicPlace(place,language), language, added:Number(added)===1 };
}
async function activePlaces({fresh=false}={}) {
  const expired=Date.now()-activeState.updatedAt>5*60*1000;
  if(fresh)return refreshActivePlaces();
  if(expired)refreshActivePlaces().catch(()=>{});
  return activeState.places;
}
function legacyLanguagesForPlace(){return ['it','en','fr','pt-BR','es']}
async function activeLanguagePairs({fresh=false}={}){if(!fresh&&Date.now()-languageState.updatedAt<5*60*1000)return languageState.pairs;if(languageState.inflight)return languageState.inflight;languageState.inflight=(async()=>{try{const result=await redisCommand(['SMEMBERS',LANGUAGE_ACTIVE_KEY]);if(Array.isArray(result))languageState.pairs=new Set(result)}catch(_){}languageState.updatedAt=Date.now();return languageState.pairs})().finally(()=>{languageState.inflight=null});return languageState.inflight}
function languagesForPlace(place,pairs=languageState.pairs){if(process.env.SEO_LANGUAGE_ACTIVATION_MODE!=='pair')return legacyLanguagesForPlace();const active=['it','en','fr','pt-BR','es'].filter(language=>pairs.has(`${language}:${place.id}`)),local={IT:'it',FR:'fr',BR:'pt-BR',PT:'pt-BR',ES:'es'}[place.cc];if(place.p>=1000000)active.push('en');if(local)active.push(local);active.push('it');return [...new Set(active)]}
module.exports = { ACTIVE_KEY, LANGUAGE_ACTIVE_KEY, SEED_IDS, GLOBAL_SEED_COUNT, ITALY_SEED_COUNT, byId, publicPlace, nearestPlace, activate, activePlaces, refreshActivePlaces, activeLanguagePairs, languagesForPlace, legacyLanguagesForPlace, redisCommand };
