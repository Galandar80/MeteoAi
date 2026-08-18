import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../i18n.js',import.meta.url),'utf8');

function runtime({languages=['en-US'],stored=null,pathname=''}={}){
  const documentElement={lang:'it',closest:()=>null,childNodes:[],hasAttribute:()=>false};
  const document={documentElement,body:{},querySelector:()=>null,addEventListener:()=>{},dispatchEvent:()=>{}};
  const localStorage={getItem:key=>key==='meteo-ai-language'?stored:null,setItem:()=>{}};
  const window={location:{pathname,origin:'https://meteo-ai.vercel.app',search:'',hash:''}};
  const context={window,document,localStorage,navigator:{languages,language:languages[0]},MutationObserver:class{observe(){}},CustomEvent:class{},Intl,Date,Number,URLSearchParams,setTimeout,clearTimeout,console};
  vm.runInNewContext(source,context,{filename:'i18n.js'});
  return window.I18n;
}

assert.equal(runtime({languages:['it-IT']}).language,'it');
assert.equal(runtime({languages:['en-US']}).language,'en');
assert.equal(runtime({languages:['fr-FR']}).language,'fr');
assert.equal(runtime({languages:['pt-BR']}).language,'pt-BR');
assert.equal(runtime({languages:['es-AR']}).language,'es');
assert.equal(runtime({languages:['de-DE']}).language,'en');
assert.equal(runtime({languages:['de-DE'],stored:'fr'}).language,'fr');
assert.equal(runtime({languages:['de-DE'],stored:'it',pathname:'/fr/world-live'}).language,'fr');

const i18n=runtime();
assert.equal(i18n.resolveLanguage('it_CH'),'it');
assert.equal(i18n.resolveLanguage('fr-CA'),'fr');
assert.equal(i18n.resolveLanguage('pt-PT'),'pt-BR');
assert.equal(i18n.resolveLanguage('es-MX'),'es');
assert.equal(i18n.resolveLanguage('de-DE'),null);
assert.equal(i18n.languageFromPath('/pt-br/install'),'pt-BR');
assert.equal(i18n.languageFromPath('/es/install'),'es');
assert.equal(i18n.localizedPath('es','world'),'/es/world-live');
assert.equal(i18n.localizedPath('en','world'),'/en/world-live');
const keys=Object.keys(i18n.messages.it).sort();
for(const code of i18n.supported)assert.deepEqual(Object.keys(i18n.messages[code]).sort(),keys,`message keys differ for ${code}`);

for(const file of ['manifest.webmanifest','manifest.en.webmanifest','manifest.fr.webmanifest','manifest.pt-BR.webmanifest','manifest.es.webmanifest'])JSON.parse(fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8'));
console.log('i18n: detection, fallback, dictionary parity and manifests OK');
