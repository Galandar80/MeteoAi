import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const localized=require('../api/localized-page.js');
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const localizedRoutes={
  '/en':['home','en'],'/fr':['home','fr'],'/pt-br':['home','pt-BR'],
  '/en/world-live':['world','en'],'/fr/world-live':['world','fr'],'/pt-br/world-live':['world','pt-BR'],
  '/en/install':['install','en'],'/fr/install':['install','fr'],'/pt-br/install':['install','pt-BR']
};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};

http.createServer((request,response)=>{
  const pathname=new URL(request.url,'http://127.0.0.1').pathname.replace(/\/$/,'')||'/';
  if(localizedRoutes[pathname]){
    const [page,language]=localizedRoutes[pathname];
    response.setHeader('Content-Type','text/html; charset=utf-8');
    return response.end(localized.render(page,language).replaceAll('https://meteo-ai.vercel.app','http://127.0.0.1:4174'));
  }
  const relative=pathname==='/'?'index.html':pathname.slice(1);
  const target=path.resolve(root,relative);
  if(!target.startsWith(root)||!fs.existsSync(target)||fs.statSync(target).isDirectory()){response.statusCode=404;return response.end('Not found')}
  response.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');
  fs.createReadStream(target).pipe(response);
}).listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log('SEO preview: http://127.0.0.1:4174'));
