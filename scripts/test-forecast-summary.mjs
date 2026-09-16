import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const i18n=fs.readFileSync(new URL('../i18n.js',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const renderer=app.slice(app.indexOf('function renderAI(d)'),app.indexOf('async function choose(q)'));
for(const language of ['it','en','fr','pt-BR','es']){
  const elements={};
  const window={location:{pathname:language==='it'?'/':`/${language.toLowerCase()}`}};
  const context=vm.createContext({window,document:{documentElement:{},addEventListener(){}},localStorage:{getItem:()=>language},navigator:{languages:[language]},MutationObserver:class{},URLSearchParams,setTimeout,clearTimeout});
  vm.runInContext(i18n,context);
  context.I18n=window.I18n;
  context.$=selector=>elements[selector]||=( {textContent:'',setAttribute(k,v){this[k]=v}} );
  context.lastPlace={name:'Rain, Italia'};
  context.weather=()=>[window.I18n.translate('Parzialmente nuvoloso')];
  vm.runInContext(renderer,context);
  for(const rain of [10,40,70])for(const uv of [2,8]){
    context.renderAI({daily:{temperature_2m_max:[28],precipitation_probability_max:[rain],uv_index_max:[uv],weather_code:[2]},current:{wind_speed_10m:40}});
    const summary=elements['#aiSummary'].textContent;
    assert(summary.includes('Rain, Italia'));
    assert(!/undefined|\{.*\}/.test(summary));
    assert.equal(elements['#aiSummary']['data-no-i18n'],'');
    assert(elements['#advice p'].textContent.length>10);
    if(language!=='it')assert(!/Oggi a|La probabilità|Vento sostenuto|Possibili precipitazioni/.test(summary));
  }
}
console.log('Forecast summary: five languages and rain/UV branches passed');
