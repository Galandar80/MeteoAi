import fs from 'node:fs';
import path from 'node:path';

const sourceDirectory = process.argv[2];
if (!sourceDirectory) {
  throw new Error('Uso: node scripts/generate-location-seo.mjs <cartella-geonames>');
}

const root = process.cwd();
const citiesPath = path.join(sourceDirectory, 'cities15000.txt');
const adminPath = path.join(sourceDirectory, 'admin1CodesASCII.txt');
const countriesPath = path.join(sourceDirectory, 'countryInfo.txt');
for (const file of [citiesPath, adminPath, countriesPath]) {
  if (!fs.existsSync(file)) throw new Error(`File GeoNames mancante: ${file}`);
}

const slugify = value => String(value || 'area')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'area';

const countryNames = new Map();
for (const line of fs.readFileSync(countriesPath, 'utf8').split(/\r?\n/)) {
  if (!line || line.startsWith('#')) continue;
  const columns = line.split('\t');
  countryNames.set(columns[0], columns[4]);
}

const italianCountryNames = new Map();
const bordersPath = path.join(root, 'countries-110m.geojson');
if (fs.existsSync(bordersPath)) {
  const borders = JSON.parse(fs.readFileSync(bordersPath, 'utf8'));
  for (const feature of borders.features || []) {
    const code = feature.properties?.code;
    const name = feature.properties?.name;
    if (code && name) italianCountryNames.set(code, name);
  }
}

const adminNames = new Map();
for (const line of fs.readFileSync(adminPath, 'utf8').split(/\r?\n/)) {
  if (!line) continue;
  const [code, name, asciiName] = line.split('\t');
  adminNames.set(code, asciiName || name);
}

const localities = [];
for (const line of fs.readFileSync(citiesPath, 'utf8').split(/\r?\n/)) {
  if (!line) continue;
  const columns = line.split('\t');
  const [
    id, name, asciiName, , latitude, longitude, , , countryCode, ,
    admin1Code, , , , population, , , timezone
  ] = columns;
  const admin1 = adminNames.get(`${countryCode}.${admin1Code}`) || '';
  const country = italianCountryNames.get(countryCode) || countryNames.get(countryCode) || countryCode;
  const placeSlug = `${slugify(asciiName || name)}-${id}`;
  const seoPath = `/meteo/${countryCode.toLowerCase()}/${slugify(admin1)}/${placeSlug}`;
  localities.push({
    id: Number(id),
    n: name,
    a: asciiName || name,
    lat: Number(latitude),
    lon: Number(longitude),
    cc: countryCode,
    c: country,
    ad: admin1,
    tz: timezone,
    p: Number(population) || 0,
    path: seoPath
  });
}

localities.sort((left, right) => right.p - left.p || left.n.localeCompare(right.n));

const dataDirectory = path.join(root, 'data');
const sitemapDirectory = path.join(root, 'sitemaps');
fs.mkdirSync(dataDirectory, { recursive: true });
fs.mkdirSync(sitemapDirectory, { recursive: true });

for (const filename of fs.readdirSync(dataDirectory)) {
  if (/^localities-\d+\.json$/.test(filename)) {
    fs.unlinkSync(path.join(dataDirectory, filename));
  }
}
const catalogChunkSize = 3000;
const catalogFiles = [];
for (let offset = 0; offset < localities.length; offset += catalogChunkSize) {
  const part = Math.floor(offset / catalogChunkSize) + 1;
  const filename = `localities-${part}.json`;
  fs.writeFileSync(
    path.join(dataDirectory, filename),
    JSON.stringify(localities.slice(offset, offset + catalogChunkSize)),
    'utf8'
  );
  catalogFiles.push(filename);
}
fs.writeFileSync(
  path.join(dataDirectory, 'localities.json'),
  JSON.stringify({ count: localities.length, files: catalogFiles }),
  'utf8'
);
fs.writeFileSync(
  path.join(dataDirectory, 'geonames-attribution.txt'),
  'Località: GeoNames (https://www.geonames.org/) — licenza Creative Commons Attribution 4.0.\n',
  'utf8'
);

const origin = 'https://meteo-ai.vercel.app';
const lastModified = new Date().toISOString().slice(0, 10);
const xmlEscape = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><lastmod>${lastModified}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${origin}/world-live.html</loc><lastmod>${lastModified}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${origin}/installa.html</loc><lastmod>${lastModified}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>
`;
fs.writeFileSync(path.join(sitemapDirectory, 'static.xml'), staticSitemap, 'utf8');

for (const filename of fs.readdirSync(sitemapDirectory)) {
  if (/^localita-\d+\.xml$/.test(filename)) fs.unlinkSync(path.join(sitemapDirectory, filename));
}

console.log('Indice sitemap dinamico disponibile su /sitemap.xml; nessun file statico generato.');

console.log(JSON.stringify({
  localities: localities.length,
  sitemapFiles: 1,
  first: localities[0],
  output: {
    catalog: catalogFiles.map(filename => path.join(dataDirectory, filename)),
    sitemap: '/sitemap.xml (dinamica)'
  }
}, null, 2));
