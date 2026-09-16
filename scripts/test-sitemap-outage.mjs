import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
process.env.UPSTASH_REDIS_REST_URL='https://storage.test';
process.env.UPSTASH_REDIS_REST_TOKEN='test';
const handler=require('../api/seo-sitemap.js');
const record=()=>({statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v},end(body){this.body=body}});
async function request(kind){const res=record();await handler({query:{kind}},res);return res}
globalThis.fetch=async()=>{throw new Error('Unavailable')};
for(const kind of ['index','locations']){
  const res=await request(kind);
  assert.equal(res.statusCode,503);
  assert.equal(res.headers['Cache-Control'],'no-store');
  assert.equal(res.headers['Retry-After'],'300');
  assert(!res.body.includes('<loc>'));
}
assert.equal((await request('static')).statusCode,200);
globalThis.fetch=async()=>({ok:true,json:async()=>({result:['684802']})});
const healthy=await request('locations');
assert.equal(healthy.statusCode,200);
assert(healthy.body.includes('barlad-684802'));
globalThis.fetch=async()=>{throw new Error('Unavailable again')};
const warm=await request('locations');
assert.equal(warm.statusCode,200);
assert.equal(warm.body,healthy.body,'Keep complete warm snapshot during outage');
console.log('Sitemap outage: cold 503, recovery and complete warm snapshot passed');
