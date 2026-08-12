import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { discoveryPlaces } = require('../api/_location-seo.js');
const origin = 'https://meteo-ai.vercel.app';
const escapeXml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const urls = discoveryPlaces
  .map(place => `  <url><loc>${escapeXml(origin + place.path)}</loc></url>`)
  .join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(new URL('../sitemaps/localita-principali.xml', import.meta.url), xml, 'utf8');
console.log(`Sitemap località principali: ${discoveryPlaces.length} URL.`);
