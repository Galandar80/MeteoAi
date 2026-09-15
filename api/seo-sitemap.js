const { activePlaces, activeLanguagePairs, languagesForPlace } = require('./_location-seo');
const { localizedPlacePath } = require('./_seo-locales');
const { ORIGIN, LANGUAGES, staticSitemap, escapeXml } = require('./_seo-routes');
const PLACES_PER_SITEMAP = 1000;
const locationSitemapPath = page => page === 1 ? '/sitemaps/localita-attive.xml' : `/sitemaps/localita-attive-${page}.xml`;

module.exports = async function handler(req, res) {
  const kind = String(req.query?.kind || 'index');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  if (kind === 'static') return res.end(staticSitemap());
  if (kind === 'locations') {
    const [places,pairs] = await Promise.all([activePlaces({fresh:true}),activeLanguagePairs({fresh:true})]);
    const page = Number(req.query?.page || 1);
    if (!Number.isInteger(page) || page < 1 || page > Math.max(1,Math.ceil(places.length/PLACES_PER_SITEMAP))) { res.statusCode=404;res.setHeader('Cache-Control','no-store');return res.end(''); }
    const urls = [...places].sort((a,b)=>a.id-b.id).slice((page-1)*PLACES_PER_SITEMAP,page*PLACES_PER_SITEMAP).flatMap(place => {
      const languages=languagesForPlace(place,pairs);
      const alternates = [
        ...LANGUAGES.map(language=>[language,localizedPlacePath(place,language)]),
        ['x-default', localizedPlacePath(place, 'it')]
      ].map(([hreflang, path]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(ORIGIN + path)}"/>`).join('');
      return languages.map(language => `  <url><loc>${escapeXml(ORIGIN + localizedPlacePath(place, language))}</loc>${alternates}</url>`);
    }).join('\n');
    return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
  }
  const places=await activePlaces({fresh:true});
  const children=Array.from({length:Math.max(1,Math.ceil(places.length/PLACES_PER_SITEMAP))},(_,index)=>`  <sitemap><loc>${escapeXml(ORIGIN+locationSitemapPath(index+1))}</loc></sitemap>`).join('\n');
  return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${escapeXml(ORIGIN)}/sitemaps/static.xml</loc></sitemap>\n${children}\n</sitemapindex>\n`);
};
