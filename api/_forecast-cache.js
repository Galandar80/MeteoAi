const CACHE = globalThis.__METEO_FORECAST_CACHE__ ||= new Map();
const INFLIGHT = globalThis.__METEO_FORECAST_INFLIGHT__ ||= new Map();
const FRESH_MS = 15 * 60 * 1000;
const STALE_MS = 6 * 60 * 60 * 1000;
const UPSTREAM_TIMEOUT_MS = 1800;

function forecastParams(place, days = 7) {
  return new URLSearchParams({
    latitude: place.lat, longitude: place.lon, timezone: 'auto', forecast_days: String(days),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation',
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_gusts_10m_max'
  });
}

async function fetchForecast(place, { days=7, fetchImpl=fetch, timeoutMs=UPSTREAM_TIMEOUT_MS }={}) {
  const controller = new AbortController(), started=Date.now();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`https://api.open-meteo.com/v1/forecast?${forecastParams(place,days)}`, { signal:controller.signal });
    if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);
    const data = await response.json();
    if (!data || data.error || (!Number.isFinite(data.current?.temperature_2m) && !data.daily?.temperature_2m_max?.some(Number.isFinite))) throw new Error('Empty forecast');
    return { data, updatedAt:new Date().toISOString(), upstreamMs:Date.now()-started };
  } finally { clearTimeout(timeout); }
}

function refresh(place, options={}) {
  const key=String(place.id);
  if (INFLIGHT.has(key)) return INFLIGHT.get(key);
  const task=fetchForecast(place,options).then(entry => { CACHE.set(key,entry); if(CACHE.size>2000)CACHE.delete(CACHE.keys().next().value); return entry; }).finally(()=>INFLIGHT.delete(key));
  INFLIGHT.set(key,task);
  return task;
}

async function getForecast(place, options={}) {
  const key=String(place.id), cached=CACHE.get(key);
  const calendar=new Intl.DateTimeFormat('en-CA',{timeZone:place.tz||'UTC'});
  const sameDay=cached&&calendar.format(new Date(cached.updatedAt))===calendar.format(new Date());
  const age=cached&&sameDay?Date.now()-Date.parse(cached.updatedAt):Infinity;
  if (cached && age < FRESH_MS) return { ...cached, cache:'hit', elapsedMs:0 };
  if (cached && age < STALE_MS) {
    refresh(place,options).catch(()=>{});
    return { ...cached, cache:'stale', elapsedMs:0 };
  }
  const started=Date.now();
  try { const entry=await refresh(place,options); return { ...entry, cache:'miss', elapsedMs:Date.now()-started }; }
  catch (error) { return { data:null, updatedAt:null, cache:'unavailable', elapsedMs:Date.now()-started, error }; }
}

function seedForecast(placeId, data, updatedAt=new Date().toISOString()) { CACHE.set(String(placeId),{data,updatedAt,upstreamMs:0}); }
function clearForecastCache() { CACHE.clear(); INFLIGHT.clear(); }
module.exports={ FRESH_MS, STALE_MS, UPSTREAM_TIMEOUT_MS, forecastParams, fetchForecast, getForecast, seedForecast, clearForecastCache };
