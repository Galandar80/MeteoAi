const localities = [
  ...require('../data/localities-1.json'),
  ...require('../data/localities-2.json'),
  ...require('../data/localities-3.json'),
  ...require('../data/localities-4.json'),
  ...require('../data/localities-5.json'),
  ...require('../data/localities-6.json'),
  ...require('../data/localities-7.json'),
  ...require('../data/localities-8.json'),
  ...require('../data/localities-9.json'),
  ...require('../data/localities-10.json'),
  ...require('../data/localities-11.json'),
  ...require('../data/localities-12.json')
];

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://meteo-ai.vercel.app';
const byId = new Map(localities.map(place => [String(place.id), place]));

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const jsonForHtml = value => JSON.stringify(value).replaceAll('<', '\\u003c');

const weatherLabels = {
  0: 'sereno', 1: 'prevalentemente sereno', 2: 'parzialmente nuvoloso', 3: 'nuvoloso',
  45: 'nebbia', 48: 'nebbia con brina', 51: 'pioviggine lieve', 53: 'pioviggine',
  55: 'pioviggine intensa', 61: 'pioggia lieve', 63: 'pioggia', 65: 'pioggia intensa',
  71: 'neve lieve', 73: 'neve', 75: 'neve intensa', 80: 'rovesci lievi',
  81: 'rovesci', 82: 'rovesci intensi', 95: 'temporale', 96: 'temporale con grandine',
  99: 'temporale forte'
};

const weatherIcons = code => {
  if (code === 0) return '☀️';
  if ([1, 2].includes(code)) return '🌤️';
  if ([3, 45, 48].includes(code)) return '☁️';
  if ([71, 73, 75].includes(code)) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌧️';
};

const formatNumber = number => new Intl.NumberFormat('it-IT').format(number || 0);
const formatDay = date => new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
const rounded = value => Number.isFinite(Number(value)) ? Math.round(Number(value)) : '—';

const distanceKm = (left, right) => {
  const toRadians = degrees => degrees * Math.PI / 180;
  const dLat = toRadians(right.lat - left.lat);
  const dLon = toRadians(right.lon - left.lon);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(left.lat)) * Math.cos(toRadians(right.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function nearbyPlaces(place) {
  return localities
    .filter(candidate => candidate.id !== place.id && candidate.cc === place.cc)
    .map(candidate => ({ ...candidate, distance: distanceKm(place, candidate) }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, 6);
}

async function loadForecast(place) {
  const params = new URLSearchParams({
    latitude: place.lat,
    longitude: place.lon,
    timezone: 'auto',
    forecast_days: '7',
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max'
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex,follow');
  res.end('<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Località non trovata | Meteo AI</title></head><body><main><h1>Località non trovata</h1><p><a href="/">Cerca un’altra località su Meteo AI</a></p></main></body></html>');
}

module.exports = async function handler(req, res) {
  const placeToken = String(req.query?.place || '');
  const id = placeToken.match(/-(\d+)$/)?.[1];
  const place = id ? byId.get(id) : null;
  if (!place) return notFound(res);

  const requestedPath = req.query?.country && req.query?.region
    ? `/meteo/${req.query.country}/${req.query.region}/${placeToken}`
    : '';
  if (requestedPath && requestedPath !== place.path) {
    res.statusCode = 308;
    res.setHeader('Location', place.path);
    return res.end();
  }

  let forecast = null;
  try {
    forecast = await loadForecast(place);
  } catch (_) {
    forecast = null;
  }

  const canonical = `${SITE_ORIGIN}${place.path}`;
  const areaLabel = [place.ad, place.c].filter(Boolean).join(', ');
  const title = `Meteo ${place.n} oggi e previsioni 7 giorni | Meteo AI`;
  const description = `Meteo ${place.n}: temperatura di oggi, pioggia, vento e previsioni per i prossimi 7 giorni. Dati aggiornati per ${areaLabel}.`;
  const current = forecast?.current;
  const daily = forecast?.daily;
  const currentCode = current?.weather_code;
  const currentLabel = weatherLabels[currentCode] || 'condizioni variabili';
  const nearby = nearbyPlaces(place);
  const appQuery = new URLSearchParams({
    localita: place.n,
    lat: place.lat,
    lon: place.lon,
    country: place.c,
    cc: place.cc,
    admin1: place.ad,
    id: place.id
  });

  const forecastRows = daily?.time?.map((date, index) => `
    <tr>
      <th scope="row">${escapeHtml(formatDay(date))}</th>
      <td><span aria-hidden="true">${weatherIcons(daily.weather_code[index])}</span> ${escapeHtml(weatherLabels[daily.weather_code[index]] || 'variabile')}</td>
      <td><strong>${rounded(daily.temperature_2m_max[index])}°</strong> / ${rounded(daily.temperature_2m_min[index])}°</td>
      <td>${rounded(daily.precipitation_probability_max[index])}%</td>
      <td>${rounded(daily.wind_speed_10m_max[index])} km/h</td>
    </tr>`).join('') || `
    <tr><td colspan="5">Previsioni temporaneamente non disponibili. Apri l’app per riprovare.</td></tr>`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: title,
        description,
        inLanguage: 'it-IT',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${canonical}#place` },
        dateModified: new Date().toISOString()
      },
      {
        '@type': 'Place',
        '@id': `${canonical}#place`,
        name: place.n,
        address: {
          '@type': 'PostalAddress',
          addressRegion: place.ad,
          addressCountry: place.cc
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: place.lat,
          longitude: place.lon
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Meteo AI', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: place.c, item: `${SITE_ORIGIN}/meteo/${place.cc.toLowerCase()}` },
          { '@type': 'ListItem', position: 3, name: place.n, item: canonical }
        ]
      }
    ]
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'index,follow,max-image-preview:large,max-snippet:-1');
  res.end(`<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="theme-color" content="#0d7b57">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="it_IT">
  <meta property="og:site_name" content="Meteo AI">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${SITE_ORIGIN}/social-preview.jpg?v=20260723b">
  <meta property="og:image:url" content="${SITE_ORIGIN}/social-preview.jpg?v=20260723b">
  <meta property="og:image:secure_url" content="${SITE_ORIGIN}/social-preview.jpg?v=20260723b">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Meteo AI — Il meteo reale, reso semplice">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE_ORIGIN}/social-preview.jpg?v=20260723b">
  <meta name="twitter:image:alt" content="Meteo AI — Il meteo reale, reso semplice">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <title>${escapeHtml(title)}</title>
  <script type="application/ld+json">${jsonForHtml(structuredData)}</script>
  <style>
    :root{--bg:#f4f7f4;--surface:#fff;--ink:#13231e;--muted:#63716c;--green:#0d7b57;--lime:#c9f25d;--line:#dfe6e1;--navy:#102d26}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}.top{display:flex;align-items:center;justify-content:space-between;padding:18px max(4vw,22px);background:#fff;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:9px;color:var(--ink);font-weight:800;text-decoration:none}.mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--green);color:#fff}.top nav{display:flex;gap:18px}.top nav a{color:var(--muted);font-size:14px;text-decoration:none}.hero{padding:70px 22px 46px;text-align:center;background:radial-gradient(circle at 82% 0,rgba(201,242,93,.28),transparent 24%)}.eyebrow{color:var(--green);font-size:11px;font-weight:800;letter-spacing:1.4px}.hero h1{max-width:900px;margin:14px auto 12px;font-size:clamp(38px,7vw,70px);line-height:1.02;letter-spacing:-2px}.hero p{max-width:720px;margin:0 auto;color:var(--muted);font-size:18px;line-height:1.6}.current{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;max-width:920px;margin:30px auto 0;padding:23px;border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 18px 50px rgba(20,45,37,.09);text-align:left}.current-icon{font-size:48px}.current strong{display:block;font-size:28px}.current span{color:var(--muted)}.current-temp{font-size:48px!important;color:var(--green)}main{max-width:1080px;margin:auto;padding:18px 22px 70px}.actions{display:flex;justify-content:center;margin:20px 0 38px}.primary{display:inline-block;border-radius:12px;padding:14px 20px;background:var(--green);color:#fff;text-decoration:none;font-weight:800}.panel{margin-top:18px;padding:26px;border:1px solid var(--line);border-radius:20px;background:#fff}.panel h2{margin:0 0 16px;font-size:26px}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:13px 10px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}th{font-size:13px}td{color:var(--muted)}.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.fact{padding:16px;border-radius:13px;background:var(--bg)}.fact small,.fact strong{display:block}.fact small{color:var(--muted);margin-bottom:5px}.nearby{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.nearby a{display:block;padding:15px;border:1px solid var(--line);border-radius:12px;color:var(--ink);text-decoration:none}.nearby small{display:block;color:var(--muted);margin-top:4px}.copy{color:var(--muted);line-height:1.7}.copy strong{color:var(--ink)}footer{padding:35px 20px;background:var(--navy);color:#b8c9c3;text-align:center}footer a{color:var(--lime)}@media(max-width:700px){.top nav{display:none}.current{grid-template-columns:auto 1fr}.current-temp{grid-column:1/-1}.facts,.nearby{grid-template-columns:1fr 1fr}.hero{padding-top:50px}}@media(max-width:460px){.facts,.nearby{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header class="top">
    <a class="brand" href="/"><span class="mark">M</span><span>Meteo AI</span></a>
    <nav aria-label="Navigazione principale"><a href="/">Previsioni</a><a href="/world-live.html">Mondo Live</a></nav>
  </header>
  <section class="hero">
    <div class="eyebrow">METEO LOCALE • DATI AGGIORNATI</div>
    <h1>Meteo ${escapeHtml(place.n)} oggi</h1>
    <p>Previsioni per ${escapeHtml(areaLabel)}: temperatura, probabilità di pioggia e vento per oggi e i prossimi sette giorni.</p>
    <div class="current">
      <div class="current-icon" aria-hidden="true">${weatherIcons(currentCode)}</div>
      <div><strong>${escapeHtml(currentLabel)}</strong><span>Percepita ${rounded(current?.apparent_temperature)}° • Umidità ${rounded(current?.relative_humidity_2m)}%</span></div>
      <strong class="current-temp">${rounded(current?.temperature_2m)}°</strong>
    </div>
  </section>
  <main>
    <div class="actions"><a class="primary" href="/?${escapeHtml(appQuery.toString())}">Apri tutti gli strumenti meteo per ${escapeHtml(place.n)}</a></div>
    <section class="panel">
      <h2>Previsioni meteo ${escapeHtml(place.n)}: prossimi 7 giorni</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Giorno</th><th>Condizioni</th><th>Temperature</th><th>Pioggia</th><th>Vento massimo</th></tr></thead>
        <tbody>${forecastRows}</tbody>
      </table></div>
    </section>
    <section class="panel">
      <h2>Condizioni di oggi a ${escapeHtml(place.n)}</h2>
      <div class="facts">
        <div class="fact"><small>Temperatura</small><strong>${rounded(current?.temperature_2m)}°C</strong></div>
        <div class="fact"><small>Vento</small><strong>${rounded(current?.wind_speed_10m)} km/h</strong></div>
        <div class="fact"><small>Pressione</small><strong>${rounded(current?.surface_pressure)} hPa</strong></div>
        <div class="fact"><small>Precipitazioni</small><strong>${Number(current?.precipitation || 0).toFixed(1)} mm</strong></div>
      </div>
      <p class="copy"><strong>Il meteo di ${escapeHtml(place.n)}</strong> viene aggiornato utilizzando dati modellistici globali. La previsione mostra ${escapeHtml(currentLabel)} e una temperatura attuale di circa ${rounded(current?.temperature_2m)} °C. Controlla sempre gli aggiornamenti più recenti prima di programmare attività sensibili al tempo.</p>
    </section>
    <section class="panel">
      <h2>Informazioni sulla località</h2>
      <div class="facts">
        <div class="fact"><small>Area</small><strong>${escapeHtml(areaLabel)}</strong></div>
        <div class="fact"><small>Popolazione</small><strong>${formatNumber(place.p)}</strong></div>
        <div class="fact"><small>Fuso orario</small><strong>${escapeHtml(place.tz)}</strong></div>
        <div class="fact"><small>Coordinate</small><strong>${place.lat.toFixed(3)}, ${place.lon.toFixed(3)}</strong></div>
      </div>
    </section>
    <section class="panel">
      <h2>Meteo nelle località vicine</h2>
      <div class="nearby">${nearby.map(candidate => `<a href="${escapeHtml(candidate.path)}"><strong>${escapeHtml(candidate.n)}</strong><small>${Math.round(candidate.distance)} km • ${escapeHtml(candidate.ad || candidate.c)}</small></a>`).join('')}</div>
    </section>
  </main>
  <footer>
    <p>Meteo AI è uno strumento informativo e non sostituisce bollettini ufficiali o autorità locali.</p>
    <p>Dati meteo: <a href="https://open-meteo.com/" rel="nofollow">Open-Meteo</a> • Località: <a href="https://www.geonames.org/" rel="nofollow">GeoNames</a> CC BY 4.0</p>
  </footer>
</body>
</html>`);
};
