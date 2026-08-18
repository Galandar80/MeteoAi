const { activePlaces } = require('./_location-seo.js');
const {
  localeFor,
  LOCALES,
  localizedPlacePath,
  displayCountry,
  directoryAlternateLinks
} = require('./_seo-locales.js');

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://meteo-ai.vercel.app';

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const jsonForHtml = value => JSON.stringify(value).replaceAll('<', '\\u003c');

const slug = value => String(value || 'area')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

function groupPlaces(places, language) {
  const countries = new Map();
  for (const place of places) {
    if (!countries.has(place.cc)) countries.set(place.cc, { name: displayCountry(place, language), code: place.cc, regions: new Map() });
    const country = countries.get(place.cc);
    const regionName = place.ad || place.c;
    if (!country.regions.has(regionName)) country.regions.set(regionName, []);
    country.regions.get(regionName).push(place);
  }
  return [...countries.values()]
    .sort((left, right) => left.name.localeCompare(right.name, localeFor(language).locale))
    .map(country => ({
      ...country,
      regions: [...country.regions.entries()]
        .map(([name, entries]) => ({ name, entries: entries.sort((left, right) => right.p - left.p || left.n.localeCompare(right.n, localeFor(language).locale)) }))
        .sort((left, right) => left.name.localeCompare(right.name, localeFor(language).locale))
    }));
}

module.exports = async function handler(req, res) {
  const language = localeFor(req.query?.lang).code;
  const locale = localeFor(language);
  const places = await activePlaces().catch(() => []);
  const countries = groupPlaces(places, language);
  const canonical = `${SITE_ORIGIN}${locale.directoryPath}`;
  const languageLinks = [
    ['it', 'IT'], ['pt-BR', 'PT'], ['es', 'ES']
  ].map(([code, label]) => `<a lang="${LOCALES[code].locale}" href="${LOCALES[code].directoryPath}"${language === code ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const title = locale.directoryTitle;
  const description = locale.directoryDescription(places.length);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: title,
        description,
        inLanguage: locale.locale,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: places.length,
          itemListElement: places.slice(0, 100).map((place, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: locale.placeWeather(place.n),
            url: `${SITE_ORIGIN}${localizedPlacePath(place, language)}`
          }))
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Meteo AI', item: `${SITE_ORIGIN}${locale.homePath}` },
          { '@type': 'ListItem', position: 2, name: locale.directoryName, item: canonical }
        ]
      }
    ]
  };

  const countrySections = countries.map(country => `
    <section class="country" id="paese-${slug(country.code)}">
      <h2>${escapeHtml(locale.weatherIn(country.name))}</h2>
      ${country.regions.map(region => `
        <section class="region" id="regione-${slug(country.code)}-${slug(region.name)}">
          <h3>${escapeHtml(region.name)}</h3>
          <div class="places">${region.entries.map(place => `<a href="${escapeHtml(localizedPlacePath(place, language))}"><strong>${escapeHtml(locale.placeWeather(place.n))}</strong><small>${locale.todayTomorrow}</small></a>`).join('')}</div>
        </section>`).join('')}
    </section>`).join('');

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  res.setHeader('Content-Language', locale.locale);
  res.setHeader('X-Robots-Tag', 'index,follow,max-image-preview:large,max-snippet:-1');
  res.end(`<!doctype html>
<html lang="${locale.locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta name="theme-color" content="#0d7b57">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${locale.ogLocale}">
  <meta property="og:site_name" content="Meteo AI">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE_ORIGIN}/social-preview.jpg?v=20260723b">
  <link rel="canonical" href="${canonical}">
  ${directoryAlternateLinks()}
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <title>${escapeHtml(title)}</title>
  <script type="application/ld+json">${jsonForHtml(structuredData)}</script>
  <style>
    :root{--bg:#f4f7f4;--surface:#fff;--ink:#13231e;--muted:#63716c;--green:#0d7b57;--lime:#c9f25d;--line:#dfe6e1;--navy:#102d26}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}.top{display:flex;align-items:center;justify-content:space-between;padding:18px max(4vw,22px);background:#fff;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:9px;color:var(--ink);font-weight:800;text-decoration:none}.mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--green);color:#fff}.top nav{display:flex;gap:18px}.top nav a{color:var(--muted);font-size:14px;text-decoration:none}.languages{gap:8px!important}.languages a[aria-current="page"]{color:var(--green);font-weight:800}.hero{padding:68px 22px 50px;text-align:center;background:radial-gradient(circle at 82% 0,rgba(201,242,93,.3),transparent 27%)}.eyebrow{color:var(--green);font-size:11px;font-weight:800;letter-spacing:1.4px}.hero h1{max-width:950px;margin:14px auto 14px;font-size:clamp(38px,7vw,68px);line-height:1.03;letter-spacing:-2px}.hero p{max-width:760px;margin:auto;color:var(--muted);font-size:18px;line-height:1.65}.stats{display:flex;justify-content:center;gap:12px;margin-top:24px;flex-wrap:wrap}.stats span{padding:9px 13px;border:1px solid var(--line);border-radius:999px;background:#fff;font-weight:700}main{max-width:1120px;margin:auto;padding:24px 22px 70px}.intro{max-width:820px;margin:0 auto 28px;color:var(--muted);line-height:1.7;text-align:center}.country{margin-top:20px;padding:28px;border:1px solid var(--line);border-radius:22px;background:#fff;scroll-margin-top:20px}.country h2{margin:0 0 22px;font-size:30px}.region{padding-top:18px;border-top:1px solid var(--line);scroll-margin-top:20px}.region+.region{margin-top:24px}.region h3{margin:0 0 13px;color:var(--green);font-size:18px}.places{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.places a{display:block;padding:15px;border:1px solid var(--line);border-radius:13px;color:var(--ink);text-decoration:none}.places a:hover{border-color:var(--green);transform:translateY(-1px)}.places small{display:block;margin-top:5px;color:var(--muted)}footer{padding:35px 20px;background:var(--navy);color:#b8c9c3;text-align:center}footer a{color:var(--lime)}@media(max-width:760px){.places{grid-template-columns:1fr 1fr}.top nav:not(.languages){display:none}}@media(max-width:480px){.places{grid-template-columns:1fr}.country{padding:21px}.hero{padding-top:52px}}
  </style>
</head>
<body>
  <header class="top">
    <a class="brand" href="${locale.homePath}"><span class="mark">M</span><span>Meteo AI</span></a>
    <nav aria-label="${escapeHtml(locale.pathLabel)}"><a href="${locale.homePath}">${locale.navForecast}</a><a href="${locale.directoryPath}" aria-current="page">${locale.navLocations}</a></nav>
    <nav class="languages" aria-label="Language">${languageLinks}</nav>
  </header>
  <section class="hero">
    <div class="eyebrow">${locale.directoryEyebrow}</div>
    <h1>${locale.directoryH1}</h1>
    <p>${locale.directoryHero}</p>
    <div class="stats"><span>${locale.activeCount(places.length)}</span><span>${locale.countryCount(countries.length)}</span></div>
  </section>
  <main>
    <p class="intro">${locale.directoryIntro}</p>
    ${countrySections || `<section class="country"><h2>${locale.directoryUpdating}</h2><p>${locale.directoryUpdatingCopy}</p></section>`}
  </main>
  <footer><p><a href="${locale.homePath}">Meteo AI</a> • ${locale.footerDirectory}</p></footer>
</body>
</html>`);
};
