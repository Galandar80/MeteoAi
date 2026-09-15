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
  widget:{it:'/widget',en:'/en/widget',fr:'/fr/widget','pt-BR':'/pt-br/widget',es:'/es/widget'},
  tomorrow:{it:'/meteo-domani',en:'/en/weather-tomorrow',fr:'/fr/meteo-demain','pt-BR':'/pt-br/previsao-amanha',es:'/es/tiempo-manana'}
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
const INSTALL_COPY=[
  ['GRATUITA • NESSUN ACCOUNT • SEMPRE A PORTATA DI MANO','FREE • NO ACCOUNT • ALWAYS WITH YOU','GRATUITE • SANS COMPTE • TOUJOURS À PORTÉE DE MAIN','GRÁTIS • SEM CONTA • SEMPRE À MÃO','GRATIS • SIN CUENTA • SIEMPRE A MANO'],
  ['Non devi scaricare nulla da uno store. Installa il sito come una normale app e aprilo con un tocco.','There is nothing to download from an app store. Install the website like a regular app and open it with one tap.','Aucun téléchargement depuis une boutique n’est nécessaire. Installez le site comme une application et ouvrez-le en un geste.','Você não precisa baixar nada de uma loja. Instale o site como um aplicativo e abra com um toque.','No necesitas descargar nada de una tienda. Instala el sitio como una aplicación y ábrelo con un toque.'],
  ['Il pulsante userà il metodo disponibile sul tuo dispositivo.','The button will use the method available on your device.','Le bouton utilisera la méthode disponible sur votre appareil.','O botão usará o método disponível no seu dispositivo.','El botón usará el método disponible en tu dispositivo.'],
  ['Apri direttamente Meteo AI senza cercarla ogni volta nel browser.','Open Meteo AI directly without searching for it in your browser.','Ouvrez directement Meteo AI sans la rechercher dans le navigateur.','Abra o Meteo AI diretamente sem procurar no navegador.','Abre Meteo AI directamente sin buscarlo en el navegador.'],
  ['Interfaccia più pulita e simile a un’app, su telefono e computer.','A cleaner, app-like interface on phone and computer.','Une interface épurée, semblable à une application, sur téléphone et ordinateur.','Uma interface mais limpa, como um aplicativo, no celular e computador.','Una interfaz más limpia, similar a una aplicación, en móvil y ordenador.'],
  ['Preferiti e impostazioni restano sul dispositivo, senza registrazione.','Favourites and settings stay on your device, with no registration.','Les favoris et réglages restent sur votre appareil, sans inscription.','Favoritos e configurações ficam no dispositivo, sem cadastro.','Los favoritos y ajustes permanecen en tu dispositivo, sin registro.'],
  ['Se compare il messaggio del browser, basta premere “Installa”. In alternativa segui questi passaggi.','If your browser shows a prompt, select “Install”. Otherwise follow these steps.','Si le navigateur affiche une invite, sélectionnez « Installer ». Sinon, suivez ces étapes.','Se o navegador mostrar uma mensagem, toque em “Instalar”. Caso contrário, siga estas etapas.','Si el navegador muestra un aviso, pulsa «Instalar». Si no, sigue estos pasos.'],
  ['Apri Meteo AI con Chrome.','Open Meteo AI in Chrome.','Ouvrez Meteo AI dans Chrome.','Abra o Meteo AI no Chrome.','Abre Meteo AI en Chrome.'],
  ['Tocca il menu','Tap the menu','Touchez le menu','Toque no menu','Toca el menú'],
  ['in alto a destra.','at the top right.','en haut à droite.','no canto superior direito.','arriba a la derecha.'],
  ['Aggiungi a schermata Home','Add to Home screen','Ajouter à l’écran d’accueil','Adicionar à tela inicial','Añadir a pantalla de inicio'],
  ['Conferma con','Confirm with','Confirmez avec','Confirme com','Confirma con'],
  ['Apri Meteo AI in','Open Meteo AI in','Ouvrez Meteo AI dans','Abra o Meteo AI no','Abre Meteo AI en'],
  ['Tocca il pulsante','Tap the button','Touchez le bouton','Toque no botão','Toca el botón'],
  ['quadrato con freccia verso l’alto','square with an upward arrow','carré avec une flèche vers le haut','quadrado com uma seta para cima','cuadrado con una flecha hacia arriba'],
  ['Scorri e scegli','Scroll and select','Faites défiler et sélectionnez','Role e selecione','Desplázate y elige'],
  ['Aggiungi alla schermata Home','Add to Home Screen','Ajouter à l’écran d’accueil','Adicionar à Tela de Início','Añadir a la pantalla de inicio'],
  ['Su iPhone il pulsante automatico non è disponibile: questi passaggi sono il metodo previsto da Apple.','On iPhone the automatic button is unavailable; these are Apple’s supported steps.','Sur iPhone, le bouton automatique n’est pas disponible ; suivez la méthode prévue par Apple.','No iPhone, o botão automático não está disponível; siga o método indicado pela Apple.','En iPhone el botón automático no está disponible; sigue el método previsto por Apple.'],
  ['Apri Meteo AI nel browser.','Open Meteo AI in your browser.','Ouvrez Meteo AI dans votre navigateur.','Abra o Meteo AI no navegador.','Abre Meteo AI en el navegador.'],
  ['Clicca l’icona di installazione nella barra degli indirizzi oppure il menu.','Click the install icon in the address bar or open the menu.','Cliquez sur l’icône d’installation dans la barre d’adresse ou ouvrez le menu.','Clique no ícone de instalação na barra de endereço ou abra o menu.','Haz clic en el icono de instalación de la barra de direcciones o abre el menú.'],
  ['Conferma: comparirà tra le tue applicazioni.','Confirm; it will appear among your applications.','Confirmez ; Meteo AI apparaîtra parmi vos applications.','Confirme; o Meteo AI aparecerá entre seus aplicativos.','Confirma; Meteo AI aparecerá entre tus aplicaciones.'],
  ['PRONTA IN POCHI SECONDI','READY IN SECONDS','PRÊTE EN QUELQUES SECONDES','PRONTO EM POUCOS SEGUNDOS','LISTA EN POCOS SEGUNDOS'],
  ['L’installazione è gratuita e puoi rimuovere l’app in qualsiasi momento.','Installation is free and you can remove the app at any time.','L’installation est gratuite et vous pouvez supprimer l’application à tout moment.','A instalação é grátis e você pode remover o aplicativo a qualquer momento.','La instalación es gratuita y puedes eliminar la aplicación cuando quieras.'],
  ['Applicazione web gratuita. Nessun acquisto e nessuna registrazione richiesta.','Free web application. No purchase or registration required.','Application web gratuite. Aucun achat ni inscription requis.','Aplicativo web gratuito. Nenhuma compra ou cadastro necessário.','Aplicación web gratuita. No requiere compra ni registro.']
];
function applyPageCopy(html,page,language){if(page!=='install'||language==='it')return html;const index={en:1,fr:2,'pt-BR':3,es:4}[language];for(const row of INSTALL_COPY)html=html.replaceAll(row[0],row[index]);return html}

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
    if(token.startsWith('<'))return token.replace(/\b(placeholder|aria-label|title|alt)=("([^"]*)"|'([^']*)')/gi,(match,name,quoted,doubleValue,singleValue)=>{const source=doubleValue??singleValue,translated=translate(source);return translated===source?match:`${name}=${quoted[0]}${translated.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#39;')}${quoted[0]} data-i18n-source-${name}="${encodeURIComponent(source)}"`});
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
    '/localita':{en:'/en/locations',fr:'/fr/localites','pt-BR':'/pt-br/localidades',es:'/es/localidades'}[language],
    '/world-live.html':ROUTES.world[language],'world-live.html':ROUTES.world[language],
    '/installa.html':ROUTES.install[language],'installa.html':ROUTES.install[language]
    ,'/come-funziona':GROWTH_ROUTES.how[language],'/widget':GROWTH_ROUTES.widget[language],'/meteo-domani':GROWTH_ROUTES.tomorrow[language]
  };
  return html.replace(/href=("|')([^"']+)(\1)/g,(match,quote,href)=>{
    const [base,hash='']=href.split('#');
    const replacement=routes[base];
    return replacement?`href=${quote}${replacement}${hash?`#${hash}`:''}${quote}`:match;
  });
}
function localizeStructuredData(html,page,language,canonical,meta){
  const translate=translator(language);
  return html.replace(/<script\s+type=("|')application\/ld\+json\1>([\s\S]*?)<\/script>/gi,(match,quote,json)=>{try{const data=JSON.parse(json);const visit=value=>{if(Array.isArray(value)){value.forEach(visit);return}if(!value||typeof value!=='object')return;for(const [key,item]of Object.entries(value)){if(typeof item==='string'&&!['@id','url','logo','image'].includes(key))value[key]=translate(item);else visit(item)}};visit(data);const root=Array.isArray(data?.['@graph'])?data['@graph'].find(item=>['WebPage','CollectionPage','WebApplication'].includes(item?.['@type'])):data;if(root){root.url=canonical;if(root['@id'])root['@id']=canonical+'#page';root.name=meta.title;root.description=meta.description;root.inLanguage=LOCALES[language]}return `<script type=${quote}application/ld+json${quote}>${JSON.stringify(data)}</script>`}catch(_){return match}});
}

function render(page,language){
  const file=FILES[page];
  const locale=LOCALES[language];
  const canonical=`${ORIGIN}${ROUTES[page][language]}`;
  const meta=META[language][page];
  let html=fs.readFileSync(path.join(PROJECT_ROOT,file),'utf8');
  html=applyPageCopy(html,page,language);
  html=translateMarkup(html,language);
  html=localizeLinks(html,language);
  // Nested locale routes must load the same root assets as the Italian pages.
  html=html.replace(/\b(src|href)=("|')((?!https?:|\/|#|data:)[^"']+\.(?:js|css|svg|png|jpg|webmanifest)(?:\?[^"']*)?)\2/gi,(_,attr,quote,asset)=>`${attr}=${quote}/${asset}${quote}`);
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
  html=localizeStructuredData(html,page,language,canonical,meta);
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
