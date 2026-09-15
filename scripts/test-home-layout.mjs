import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { render } = require('../api/localized-page.js');
const original = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
for (const html of [original, ...['en', 'fr', 'es', 'pt-BR'].map(lang => render('home', lang))]) {
  assert.equal((html.match(/id="hourly"/g) || []).length, 1);
  assert(html.indexOf('id="hourly"') < html.indexOf('id="fourteenDays"'));
  assert.match(html, /for="placeInput"/);
  assert.match(html, /spellcheck="false"/);
}
console.log('Home layout: hourly before extended forecast, search label and localized pages passed');
