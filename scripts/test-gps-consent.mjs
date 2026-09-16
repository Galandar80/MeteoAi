import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../app-bootstrap.js',import.meta.url),'utf8');
for(const state of ['granted','prompt','denied','unsupported']){
  let callback,gpsCalls=0;
  const context={URLSearchParams,location:{search:''},lastPlace:{},document:{addEventListener(){}},localStorage:{getItem:()=>''},
    navigator:{permissions:{query:async()=>{if(state==='unsupported')throw Error();return {state}}}},
    window:{setTimeout:fn=>callback=fn},useDeviceLocation:()=>gpsCalls++,initMap(){},initSeaAtlas(){},initPortPlanner(){},renderSaved(){},loadWeather(){}};
  vm.runInNewContext(source,context);
  await callback();
  assert.equal(gpsCalls,state==='granted'?1:0,state);
}
console.log('GPS consent: auto-location only for existing permission passed');
