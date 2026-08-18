const { byId } = require('./_location-seo');
const { ORIGIN, localeFor, displayPlaceName, localizedPlacePath } = require('./_seo-locales');

const escapeHtml = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const COPY = {
  it: { forecast:'Previsioni', today:'Oggi', tomorrow:'Domani', rain:'Pioggia', wind:'Vento', unavailable:'Dati temporaneamente non disponibili', on:'su Meteo AI' },
  en: { forecast:'Forecast', today:'Today', tomorrow:'Tomorrow', rain:'Rain', wind:'Wind', unavailable:'Data temporarily unavailable', on:'on Meteo AI' },
  fr: { forecast:'Prévisions', today:'Aujourd’hui', tomorrow:'Demain', rain:'Pluie', wind:'Vent', unavailable:'Données temporairement indisponibles', on:'sur Meteo AI' },
  'pt-BR': { forecast:'Previsão', today:'Hoje', tomorrow:'Amanhã', rain:'Chuva', wind:'Vento', unavailable:'Dados temporariamente indisponíveis', on:'no Meteo AI' },
  es: { forecast:'Previsión', today:'Hoy', tomorrow:'Mañana', rain:'Lluvia', wind:'Viento', unavailable:'Datos temporalmente no disponibles', on:'en Meteo AI' }
};
const LABELS = {
  it: { 0:'Sereno', 1:'Quasi sereno', 2:'Parzialmente nuvoloso', 3:'Nuvoloso', 45:'Nebbia', 61:'Pioggia lieve', 63:'Pioggia', 65:'Pioggia intensa', 71:'Neve lieve', 73:'Neve', 75:'Neve intensa', 80:'Rovesci', 81:'Rovesci', 82:'Rovesci forti', 95:'Temporale' },
  en: { 0:'Clear', 1:'Mainly clear', 2:'Partly cloudy', 3:'Overcast', 45:'Fog', 61:'Light rain', 63:'Rain', 65:'Heavy rain', 71:'Light snow', 73:'Snow', 75:'Heavy snow', 80:'Showers', 81:'Showers', 82:'Heavy showers', 95:'Thunderstorm' },
  fr: { 0:'Dégagé', 1:'Généralement dégagé', 2:'Partiellement nuageux', 3:'Couvert', 45:'Brouillard', 61:'Pluie faible', 63:'Pluie', 65:'Forte pluie', 71:'Neige faible', 73:'Neige', 75:'Forte neige', 80:'Averses', 81:'Averses', 82:'Fortes averses', 95:'Orage' },
  'pt-BR': { 0:'Céu limpo', 1:'Predominantemente limpo', 2:'Parcialmente nublado', 3:'Nublado', 45:'Nevoeiro', 61:'Chuva fraca', 63:'Chuva', 65:'Chuva forte', 71:'Neve fraca', 73:'Neve', 75:'Neve forte', 80:'Pancadas', 81:'Pancadas', 82:'Pancadas fortes', 95:'Trovoada' },
  es: { 0:'Despejado', 1:'Mayormente despejado', 2:'Parcialmente nublado', 3:'Nublado', 45:'Niebla', 61:'Lluvia débil', 63:'Lluvia', 65:'Lluvia intensa', 71:'Nieve débil', 73:'Nieve', 75:'Nieve intensa', 80:'Chubascos', 81:'Chubascos', 82:'Chubascos fuertes', 95:'Tormenta' }
};
const icon = code => code === 0 ? '☀️' : [1,2].includes(code) ? '🌤️' : [3,45,48].includes(code) ? '☁️' : [71,73,75].includes(code) ? '❄️' : code >= 95 ? '⛈️' : '🌧️';

async function forecast(place) {
  const params = new URLSearchParams({ latitude:place.lat, longitude:place.lon, timezone:'auto', forecast_days:'2', current:'temperature_2m,weather_code,wind_speed_10m', daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal:controller.signal });
    if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);
    return response.json();
  } finally { clearTimeout(timeout); }
}

module.exports = async function handler(req, res) {
  const locale=localeFor(req.query?.lang), copy=COPY[locale.code], place=byId.get(String(req.query?.id));
  if (!place) { res.statusCode=404; res.setHeader('X-Robots-Tag','noindex,nofollow'); return res.end('Unknown location'); }
  const theme=req.query?.theme==='dark'?'dark':'light', mode=req.query?.mode==='extended'?'extended':'compact';
  const data=await forecast(place).catch(()=>null), current=data?.current, daily=data?.daily;
  const name=displayPlaceName(place,locale.code), target=`${ORIGIN}${localizedPlacePath(place,locale.code)}?utm_source=weather_widget&utm_medium=referral`;
  const dayCards=mode==='extended'&&daily?.time?daily.time.slice(0,2).map((_,i)=>`<div class="day"><b>${i?copy.tomorrow:copy.today}</b><span>${icon(daily.weather_code[i])} ${escapeHtml(LABELS[locale.code][daily.weather_code[i]]||copy.forecast)}</span><strong>${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</strong><small>${copy.rain} ${Math.round(daily.precipitation_probability_max[i]||0)}%</small></div>`).join(''):'';
  res.statusCode=200;
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Content-Language',locale.locale);
  res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
  res.setHeader('X-Robots-Tag','noindex,follow');
  res.setHeader('Content-Security-Policy','frame-ancestors *');
  res.end(`<!doctype html><html lang="${locale.locale}" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>${escapeHtml(name)} — Meteo AI</title><style>:root{color-scheme:light;--bg:#fff;--ink:#13231e;--muted:#63716c;--line:#dfe6e1;--green:#0d7b57;--soft:#f4f7f4}[data-theme=dark]{color-scheme:dark;--bg:#102d26;--ink:#fff;--muted:#b8c9c3;--line:#315047;--green:#c9f25d;--soft:#183b32}*{box-sizing:border-box}body{margin:0;padding:10px;background:transparent;color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}.widget{height:100%;padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--bg);box-shadow:0 8px 30px rgba(13,40,31,.08)}header{display:flex;align-items:center;justify-content:space-between;gap:14px}.brand{color:var(--green);font-weight:850;font-size:13px}.place{font-size:20px;font-weight:850}.current{display:flex;align-items:center;gap:12px;margin-top:14px}.symbol{font-size:40px}.temp{font-size:42px;font-weight:850}.condition{color:var(--muted)}.days{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.day{display:grid;gap:4px;padding:10px;background:var(--soft);border-radius:10px}.day span,.day small{color:var(--muted);font-size:12px}footer{margin-top:12px;text-align:right}footer a{color:var(--green);font-size:12px;font-weight:800;text-decoration:none}</style></head><body><article class="widget"><header><div><div class="brand">Meteo AI</div><div class="place">${escapeHtml(name)}</div></div><div class="condition">${copy.forecast}</div></header>${data?`<div class="current"><span class="symbol">${icon(current.weather_code)}</span><strong class="temp">${Math.round(current.temperature_2m)}°</strong><div class="condition">${escapeHtml(LABELS[locale.code][current.weather_code]||copy.forecast)}<br>${copy.wind} ${Math.round(current.wind_speed_10m)} km/h</div></div><div class="days">${dayCards}</div>`:`<p class="condition">${copy.unavailable}</p>`}<footer><a href="${escapeHtml(target)}" target="_blank" rel="nofollow noopener">${copy.forecast} ${copy.on} →</a></footer></article></body></html>`);
};
