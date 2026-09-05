import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { staticSitemap } = require('../api/_seo-routes');
fs.writeFileSync(new URL('../sitemaps/static.xml', import.meta.url), staticSitemap(), 'utf8');
console.log('sitemaps/static.xml generated from api/_seo-routes.js');
