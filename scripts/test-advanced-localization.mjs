import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const app=read('app.js'),assistant=read('app-assistants.js');
const line=(source,prefix)=>source.split(/\r?\n/).find(value=>value.startsWith(prefix));
for(const language of ['it','en','fr','pt-BR','es']){
  const elements={};
  const context=vm.createContext({window:{location:{pathname:''}},document:{documentElement:{},addEventListener(){}},navigator:{languages:[language]},localStorage:{getItem:()=>language},MutationObserver:class{},URLSearchParams,setTimeout,clearTimeout});
  vm.runInContext(read('i18n.js'),context);
  context.I18n=context.window.I18n;
  context.$=key=>elements[key]||={value:'',innerHTML:'',setAttribute(k,v){this[k]=v}};
  vm.runInContext(line(app,'const aiActivities=')+'\n'+line(app,'function renderWeatherWindow'),context);
  const start=new Date();start.setDate(start.getDate()+1);start.setHours(8,0,0,0);
  const hourly={time:Array.from({length:12},(_,i)=>new Date(+start+i*3600000).toISOString()),temperature_2m:Array(12).fill(20),precipitation_probability:Array(12).fill(5),wind_speed_10m:Array(12).fill(10),uv_index:Array(12).fill(2),weather_code:Array(12).fill(0)};
  context.renderWeatherWindow({hourly});
  assert(elements['#windowResult'].innerHTML.includes(context.I18n.t('windowBest')));
  assert(elements['#windowResult'].innerHTML.includes(context.I18n.t('windowDry',{temp:20,wind:10})));
  context.renderWeatherWindow({hourly:{...hourly,time:[]}});
  assert(elements['#windowResult'].innerHTML.includes(context.I18n.t('windowEmpty')));
  vm.runInContext(line(assistant,'function requestedDay'),context);
  const times=['2026-09-16','2026-09-17','2026-09-18'];
  assert.equal(context.requestedDay('mañana',{daily:{time:times}}),1);
  assert.equal(context.requestedDay('pasado mañana',{daily:{time:times}}),2);
  assert.equal(context.requestedDay('viernes',{daily:{time:times}}),2);
  vm.runInContext(line(assistant,'function normaliseAssistantQuery')+'\n'+assistant.slice(assistant.indexOf('function localWeatherAnswer'),assistant.indexOf('function askWeather')),context);
  context.lastPlace={name:'Rain <City>'};context.lastMarine=null;
  context.weather=()=>[context.I18n.translate('Sereno')];context.cardinal=()=>context.I18n.t('wind:Nord');
  context.lastData={daily:{time:times,weather_code:[0,0,0],precipitation_probability_max:[10,50,70],temperature_2m_max:[28,29,30],temperature_2m_min:[10,11,12],uv_index_max:[7,7,7]},current:{wind_speed_10m:20,wind_gusts_10m:30,wind_direction_10m:0}};
  for(const question of ['paraguas mañana','lluvia pasado mañana','sport','mare','bucato','evento','uv','vento','temperatura','help']){
    const answer=context.localWeatherAnswer(context.normaliseAssistantQuery(question));
    assert(answer.includes('Rain <City>'));
    assert(!/undefined|\{[^}]*\}/.test(answer));
    if(language!=='it')assert(!/pioggia|Ombrello|Consigliata|Posso aiutarti/.test(answer));
  }
  vm.runInContext(line(assistant,'const esc=')+'\n'+line(assistant,"$('#travelForm').onsubmit="),context);
  context.$('#travelPlace').value='Rain <City>';
  context.$('#travelDate').value=times[0];context.$('#travelDays').value='2';
  context.searchPlaces=async()=>[{name:'Rain <City>',latitude:1,longitude:2}];
  context.iconHTML=()=>'';
  context.fetchResilient=async()=>({json:async()=>({daily:{time:times,temperature_2m_max:[28,29,30],temperature_2m_min:[10,11,12],precipitation_probability_max:[40,50,60],uv_index_max:[6,7,8],wind_speed_10m_max:[35,36,37],weather_code:[0,0,0]}})});
  await elements['#travelForm'].onsubmit({preventDefault(){}});
  const result=elements['#travelResult'].innerHTML;
  assert(result.includes('Rain &lt;City&gt;'),'Escape place names after interpolation');
  assert(!result.includes('<City>'));
  assert(result.includes(context.I18n.translate('Giacca calda')));
  if(language!=='it')assert(!/piano di|troverai temperature|Probabilità massima/.test(result));
  context.searchPlaces=async()=>[];
  await elements['#travelForm'].onsubmit({preventDefault(){}});
  assert(elements['#travelResult'].innerHTML.includes(context.I18n.t('travelMissing')));
  vm.runInContext(app.slice(app.indexOf('const specialProfileRules='),app.indexOf("$$('[data-special-profile]')")),context);
  context.ensureProfessionalData=()=>{};context.autoLoadMarine=()=>{};context.marineAutoFailed=false;
  const sampleTime=new Date(Date.now()+3600000).toISOString();
  context.professionalData={hourly:{time:[sampleTime],soil_moisture_0_to_1cm:[.2],vapour_pressure_deficit:[1],visibility:[10000],cloud_cover:[45]},daily:{et0_fao_evapotranspiration:[3],precipitation_hours:[0],snowfall_sum:[0],sunshine_duration:[18000]}};
  context.lastMarine={current:{wave_height:.8,wave_period:6}};
  context.lastData.current={temperature_2m:22,wind_speed_10m:18,wind_gusts_10m:25,visibility:10000};
  Object.assign(context.lastData.daily,{precipitation_sum:[0,0,0],wind_gusts_10m_max:[25,25,25],sunrise:[sampleTime],sunset:[sampleTime]});
  for(const profile of ['fishing','sailing','surf','children','pets','drones','agriculture','construction','hiking','photography']){
    context.selectedSpecialProfile=profile;
    context.renderSpecialProfile();
    const text=elements['#profileAdvice'].textContent;
    assert(text.length>10,profile);
    if(language!=='it'){
      const translated=context.I18n.translate(text);
      assert(!/Condizioni|Vento utile|Il profilo|Quadro utile|Finestra operativa|Copertura interessante/.test(translated),profile+': '+translated);
    }
  }
}
console.log('Advanced localization: weather windows, Spanish dates, travel rendering and errors passed in five languages');
