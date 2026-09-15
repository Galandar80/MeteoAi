const ORIGIN = process.env.SITE_ORIGIN || 'https://meteo-ai.vercel.app';
const LANGUAGES = ['it', 'en', 'fr', 'pt-BR', 'es'];
const HREFLANG = { it:'it', en:'en', fr:'fr', 'pt-BR':'pt-BR', es:'es' };

const PAGE_CLUSTERS = Object.freeze({
  home: { lastmod:'2026-09-15', paths:{ it:'/', en:'/en', fr:'/fr', 'pt-BR':'/pt-br', es:'/es' } },
  directory: { lastmod:'2026-09-15', paths:{ it:'/localita', en:'/en/locations', fr:'/fr/localites', 'pt-BR':'/pt-br/localidades', es:'/es/localidades' } },
  world: { lastmod:'2026-09-15', paths:{ it:'/world-live.html', en:'/en/world-live', fr:'/fr/world-live', 'pt-BR':'/pt-br/world-live', es:'/es/world-live' } },
  install: { lastmod:'2026-09-15', paths:{ it:'/installa.html', en:'/en/install', fr:'/fr/install', 'pt-BR':'/pt-br/install', es:'/es/install' } },
  how: { lastmod:'2026-08-18', paths:{ it:'/come-funziona', en:'/en/how-it-works', fr:'/fr/comment-ca-marche', 'pt-BR':'/pt-br/como-funciona', es:'/es/como-funciona' } },
  widget: { lastmod:'2026-08-18', paths:{ it:'/widget', en:'/en/widget', fr:'/fr/widget', 'pt-BR':'/pt-br/widget', es:'/es/widget' } },
  tomorrow: { lastmod:'2026-09-15', paths:{ it:'/meteo-domani', en:'/en/weather-tomorrow', fr:'/fr/meteo-demain', 'pt-BR':'/pt-br/previsao-amanha', es:'/es/tiempo-manana' } }
});

const escapeXml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
function alternateTags(paths) {
  return LANGUAGES.map(language => `<xhtml:link rel="alternate" hreflang="${HREFLANG[language]}" href="${escapeXml(ORIGIN + paths[language])}"/>`).join('')
    + `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(ORIGIN + paths.it)}"/>`;
}
function staticSitemap() {
  const urls = Object.values(PAGE_CLUSTERS).flatMap(cluster => LANGUAGES.map(language => `  <url><loc>${escapeXml(ORIGIN + cluster.paths[language])}</loc><lastmod>${cluster.lastmod}</lastmod>${alternateTags(cluster.paths)}</url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

module.exports = { ORIGIN, LANGUAGES, HREFLANG, PAGE_CLUSTERS, alternateTags, staticSitemap, escapeXml };
