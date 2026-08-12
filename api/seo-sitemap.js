const { activePlaces } = require('./_location-seo');

const ORIGIN = process.env.SITE_ORIGIN || 'https://meteo-ai.vercel.app';
const escapeXml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

module.exports = async function handler(req, res) {
  const kind = String(req.query?.kind || 'index');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  if (kind === 'locations') {
    const places = await activePlaces();
    const urls = places.map(place => `  <url><loc>${escapeXml(ORIGIN + place.path)}</loc><changefreq>daily</changefreq><priority>${place.p >= 100000 ? '0.7' : '0.6'}</priority></url>`).join('\n');
    return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  }
  return res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${ORIGIN}/sitemaps/static.xml</loc></sitemap>\n  <sitemap><loc>${ORIGIN}/sitemaps/localita-principali.xml</loc></sitemap>\n  <sitemap><loc>${ORIGIN}/sitemaps/localita-attive.xml</loc></sitemap>\n</sitemapindex>\n`);
};
