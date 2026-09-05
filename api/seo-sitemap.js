const { activePlaces, activeLanguagePairs, languagesForPlace } = require('./_location-seo');
const { localizedPlacePath } = require('./_seo-locales');
const { ORIGIN, LANGUAGES, staticSitemap, escapeXml } = require('./_seo-routes');

module.exports = async function handler(req, res) {
  const kind = String(req.query?.kind || 'index');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  if (kind === 'static') return res.end(staticSitemap());
  if (kind === 'locations') {
    const [places,pairs] = await Promise.all([activePlaces({fresh:true}),activeLanguagePairs({fresh:true})]);
    const urls = places.flatMap(place => {
      const languages=languagesForPlace(place,pairs);
      const alternates = [
        ...languages.map(language=>[language,localizedPlacePath(place,language)]),
        ['x-default', localizedPlacePath(place, 'it')]
      ].map(([hreflang, path]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(ORIGIN + path)}"/>`).join('');
      return languages.map(language => `  <url><loc>${escapeXml(ORIGIN + localizedPlacePath(place, language))}</loc>${alternates}</url>`);
    }).join('\n');
    return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
  }
  return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${ORIGIN}/sitemaps/static.xml</loc></sitemap>\n  <sitemap><loc>${ORIGIN}/sitemaps/localita-attive.xml</loc></sitemap>\n</sitemapindex>\n`);
};
