const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const ORIGIN=process.env.SITE_ORIGIN||'https://meteo-ai.vercel.app';
const PROJECT_ROOT=path.join(__dirname,'..');
const LOCALES={en:'en-GB',fr:'fr-FR','pt-BR':'pt-BR',es:'es-ES'};
const PREFIX={en:'en',fr:'fr','pt-BR':'pt-br',es:'es'};
const FILES={home:'index.html',world:'world-live.html',install:'installa.html'};
const ROUTES={
  home:{it:'/',en:'/en',fr:'/fr','pt-BR':'/pt-br',es:'/es'},
  world:{it:'/world-live.html',en:'/en/world-live',fr:'/fr/world-live','pt-BR':'/pt-br/world-live',es:'/es/world-live'},
  install:{it:'/installa.html',en:'/en/install',fr:'/fr/install','pt-BR':'/pt-br/install',es:'/es/install'}
};
const GROWTH_ROUTES={
  how:{it:'/come-funziona',en:'/en/how-it-works',fr:'/fr/comment-ca-marche','pt-BR':'/pt-br/como-funciona',es:'/es/como-funciona'},
  widget:{it:'/widget',en:'/en/widget',fr:'/fr/widget','pt-BR':'/pt-br/widget',es:'/es/widget'}
};
const META={
  en:{
    home:{title:'Weather today and 14-day worldwide forecast | Meteo AI',description:'Worldwide weather forecasts with temperature, rain, wind, sea conditions, air quality, historical comparison and maps.'},
    world:{title:'World Live — Natural events and risks | Meteo AI',description:'Earthquakes, cyclones, volcanoes, wildfires, floods and tsunami notices from international public sources.'},
    install:{title:'Install Meteo AI for free | Android, iPhone and desktop',description:'Add Meteo AI to your Home screen for quick access, a full-screen experience and no account requirement.'}
  },
  fr:{
    home:{title:'Météo du jour et prévisions mondiales à 14 jours | Meteo AI',description:'Prévisions météo mondiales : température, pluie, vent, mer, qualité de l’air, comparaison historique et cartes.'},
    world:{title:'Monde en direct — Événements et risques naturels | Meteo AI',description:'Séismes, cyclones, volcans, incendies, inondations et alertes tsunami provenant de sources publiques internationales.'},
    install:{title:'Installer Meteo AI gratuitement | Android, iPhone et ordinateur',description:'Ajoutez Meteo AI à l’écran d’accueil : accès rapide, plein écran et aucun compte requis.'}
  },
  'pt-BR':{
    home:{title:'Clima hoje e previsão mundial de 14 dias | Meteo AI',description:'Previsão do tempo mundial com temperatura, chuva, vento, mar, qualidade do ar, comparação histórica e mapas.'},
    world:{title:'Mundo ao vivo — Eventos e riscos naturais | Meteo AI',description:'Terremotos, ciclones, vulcões, incêndios, inundações e alertas de tsunami de fontes públicas internacionais.'},
    install:{title:'Instale o Meteo AI grátis | Android, iPhone e computador',description:'Adicione o Meteo AI à tela inicial para acesso rápido, experiência em tela cheia e sem necessidade de conta.'}
  },
  es:{
    home:{title:'El tiempo hoy y previsión mundial de 14 días | Meteo AI',description:'Previsión meteorológica mundial con temperatura, lluvia, viento, mar, calidad del aire, comparación histórica y mapas.'},
    world:{title:'Mundo en directo — Eventos y riesgos naturales | Meteo AI',description:'Terremotos, ciclones, volcanes, incendios, inundaciones y avisos de tsunami procedentes de fuentes públicas internacionales.'},
    install:{title:'Instala Meteo AI gratis | Android, iPhone y ordenador',description:'Añade Meteo AI a la pantalla de inicio para un acceso rápido, una experiencia a pantalla completa y sin necesidad de cuenta.'}
  }
};

let sourceCache;
const translators=new Map();
function translator(language){
  if(translators.has(language))return translators.get(language);
  sourceCache||=fs.readFileSync(path.join(PROJECT_ROOT,'i18n.js'),'utf8');
  const documentElement={lang:'it',closest:()=>null,childNodes:[],hasAttribute:()=>false};
  const document={documentElement,body:{},querySelector:()=>null,addEventListener:()=>{},dispatchEvent:()=>{}};
  const window={__METEO_LOCALE__:language};
  const localStorage={getItem:key=>key==='meteo-ai-language'?language:null,setItem:()=>{}};
  const context={window,document,localStorage,navigator:{languages:[LOCALES[language]],language:LOCALES[language]},MutationObserver:class{observe(){}},CustomEvent:class{},Intl,Date,Number,URLSearchParams,setTimeout,clearTimeout,console};
  vm.runInNewContext(sourceCache,context,{filename:'i18n.js'});
  const translate=value=>window.I18n.translate(value,language);
  translators.set(language,translate);
  return translate;
}

function translateMarkup(html,language){
  const translate=translator(language);
  const protectedBlocks=[];
  html=html.replace(/<(script|style)\b[\s\S]*?<\/\1>|<a\b[^>]*class="[^"]*brand[^"]*"[^>]*>[\s\S]*?<\/a>/gi,block=>`@@METEO_BLOCK_${protectedBlocks.push(block)-1}@@`);
  html=html.replace(/(<[^>]+>|[^<]+)/g,token=>{
    if(token.startsWith('<'))return token.replace(/\b(placeholder|aria-label|title|alt)=("([^"]*)"|'([^']*)')/gi,(match,name,quoted,doubleValue,singleValue)=>{const source=doubleValue??singleValue,translated=translate(source);return translated===source?match:`${name}=${quoted[0]}${translated}${quoted[0]} data-i18n-source-${name}="${encodeURIComponent(source)}"`});
    const translated=translate(token);
    return translated===token?token:`<!--meteo-i18n:${encodeURIComponent(token)}-->${translated}`;
  });
  return html.replace(/@@METEO_BLOCK_(\d+)@@/g,(_,index)=>protectedBlocks[Number(index)]);
}

function alternateLinks(page){
  return Object.entries(ROUTES[page]).map(([language,route])=>`  <link rel="alternate" hreflang="${language==='pt-BR'?'pt-BR':language}" href="${ORIGIN}${route}">`).join('\n')+`\n  <link rel="alternate" hreflang="x-default" href="${ORIGIN}${ROUTES[page].it}">`;
}

function localizeLinks(html,language){
  const routes={
    '/':ROUTES.home[language],'/index.html':ROUTES.home[language],'index.html':ROUTES.home[language],
    '/world-live.html':ROUTES.world[language],'world-live.html':ROUTES.world[language],
    '/installa.html':ROUTES.install[language],'installa.html':ROUTES.install[language]
    ,'/come-funziona':GROWTH_ROUTES.how[language],'/widget':GROWTH_ROUTES.widget[language]
  };
  return html.replace(/href=("|')([^"']+)(\1)/g,(match,quote,href)=>{
    const [base,hash='']=href.split('#');
    const replacement=routes[base];
    return replacement?`href=${quote}${replacement}${hash?`#${hash}`:''}${quote}`:match;
  });
}

function render(page,language){
  const file=FILES[page];
  const locale=LOCALES[language];
  const canonical=`${ORIGIN}${ROUTES[page][language]}`;
  const meta=META[language][page];
  let html=fs.readFileSync(path.join(PROJECT_ROOT,file),'utf8');
  html=translateMarkup(html,language);
  html=localizeLinks(html,language);
  html=html.replace(/<html\s+lang="[^"]+">/i,`<html lang="${locale}">`);
  html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${meta.title}</title>`);
  html=html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,`<meta name="description" content="${meta.description}">`);
  html=html.replace(/<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/i,`<meta property="og:locale" content="${locale.replace('-','_')}">`);
  html=html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,`<meta property="og:url" content="${canonical}">`);
  html=html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,`<meta property="og:title" content="${meta.title}">`);
  html=html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,`<meta property="og:description" content="${meta.description}">`);
  html=html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,`<meta name="twitter:title" content="${meta.title}">`);
  html=html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,`<meta name="twitter:description" content="${meta.description}">`);
  html=html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+"\s*\/?>/gi,'');
  html=html.replace(/<link\s+rel="canonical"\s+href="[^"]+"\s*\/?>/i,`<link rel="canonical" href="${canonical}">\n${alternateLinks(page)}`);
  html=html.replace(/("inLanguage"\s*:\s*)"it-IT"/g,`$1"${locale}"`);
  html=html.replace(/<script\s+src=("|')\/?i18n\.js\1><\/script>/i,`<script>window.__METEO_LOCALE__=${JSON.stringify(language)}</script>\n  <script src="/i18n.js"></script>`);
  return html;
}

module.exports=function handler(req,res){
  const page=String(req.query?.page||'home');
  const rawLanguage=String(req.query?.lang||'en');
  const language=rawLanguage.toLowerCase()==='pt-br'?'pt-BR':rawLanguage.toLowerCase();
  if(!FILES[page]||!LOCALES[language]){
    res.statusCode=404;
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    return res.end('Not found');
  }
  res.statusCode=200;
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('Content-Language',LOCALES[language]);
  res.setHeader('X-Robots-Tag','index,follow,max-image-preview:large,max-snippet:-1');
  return res.end(render(page,language));
};

module.exports.render=render;
module.exports.ROUTES=ROUTES;
