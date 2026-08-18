const { ORIGIN, LOCALES, localeFor } = require('./_seo-locales');

const escapeHtml = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
const jsonForHtml = value => JSON.stringify(value).replaceAll('<', '\\u003c');

const COPY = {
  it: {
    title: 'Come funziona Meteo AI: dati, metodo e limiti', description: 'Scopri fonti, aggiornamenti, analisi locale, privacy e limiti delle previsioni di Meteo AI.',
    eyebrow: 'TRASPARENZA • METODO • FONTI', h1: 'Come funziona Meteo AI',
    lead: 'Meteo AI riunisce dati meteorologici verificabili e strumenti locali per rendere più semplici le decisioni quotidiane, senza trasformare una previsione in una certezza.',
    sections: [
      ['Da dove arrivano i dati', 'Le previsioni e i dati storici provengono da Open-Meteo. Le località sono basate su GeoNames; le mappe su OpenStreetMap e i confini su Natural Earth. Mondo Live consulta inoltre fonti pubbliche internazionali indicate nella pagina.'],
      ['Cosa fa l’intelligenza di Meteo AI', 'L’app confronta temperatura, pioggia, vento, indice UV, qualità dell’aria e orizzonte temporale per produrre sintesi e indicazioni pratiche. Le analisi principali vengono elaborate nel browser con regole locali: le domande non sono inviate a servizi generativi esterni.'],
      ['Frequenza degli aggiornamenti', 'I dati correnti e previsionali vengono richiesti quando si apre o si aggiorna una località. Cache tecniche brevi riducono richieste ripetute; orari e disponibilità dipendono dai fornitori delle singole fonti.'],
      ['Previsione, probabilità e incertezza', 'Una probabilità di pioggia non garantisce che pioverà nel punto esatto selezionato. L’incertezza cresce all’aumentare della distanza temporale. Meteo AI descrive il dato disponibile, ma non certifica il singolo evento.'],
      ['Privacy essenziale', 'Non è richiesto un account. Preferiti, tema, località e cache restano normalmente nel browser. La posizione viene letta soltanto dopo il consenso del dispositivo e serve a individuare la località richiesta.'],
      ['Limiti e sicurezza', 'Meteo AI è uno strumento informativo. Non sostituisce protezione civile, autorità locali, bollettini ufficiali, valutazioni professionali o strumenti di navigazione marittima. In caso di rischio fanno fede le fonti ufficiali.']
    ],
    sources: 'Fonti principali', promise: 'Il nostro impegno', promiseText: 'Pagine indicizzabili solo per località realmente attive, fonti dichiarate, nessuna promessa di accuratezza assoluta e spiegazioni comprensibili anche quando il dato è incerto.',
    home: 'Apri le previsioni', widget: 'Crea un widget meteo'
  },
  en: {
    title: 'How Meteo AI works: data, method and limitations', description: 'Learn about Meteo AI sources, updates, local analysis, privacy and forecast limitations.',
    eyebrow: 'TRANSPARENCY • METHOD • SOURCES', h1: 'How Meteo AI works',
    lead: 'Meteo AI combines verifiable weather data with local tools to make everyday decisions easier, without presenting a forecast as certainty.',
    sections: [
      ['Where the data comes from', 'Forecast and historical data come from Open-Meteo. Locations are based on GeoNames, maps on OpenStreetMap and boundaries on Natural Earth. World Live also uses the international public sources listed on that page.'],
      ['What Meteo AI intelligence does', 'The app compares temperature, rain, wind, UV index, air quality and forecast range to produce summaries and practical guidance. Core analysis runs in the browser using local rules; questions are not sent to external generative services.'],
      ['Update frequency', 'Current conditions and forecasts are requested when a location is opened or refreshed. Short technical caches reduce repeated requests; timing and availability depend on each data provider.'],
      ['Forecasts, probability and uncertainty', 'A chance of rain does not guarantee rain at the exact selected point. Uncertainty increases further into the future. Meteo AI explains the available data but does not certify individual events.'],
      ['Essential privacy', 'No account is required. Favourites, theme, locations and caches normally remain in the browser. Position is read only after device consent and is used to find the requested location.'],
      ['Limits and safety', 'Meteo AI is an information tool. It does not replace civil protection, local authorities, official bulletins, professional assessment or marine navigation tools. Official sources take priority whenever safety is involved.']
    ],
    sources: 'Main sources', promise: 'Our commitment', promiseText: 'Indexable pages only for genuinely active locations, declared sources, no promise of absolute accuracy and clear explanations when data is uncertain.',
    home: 'Open forecasts', widget: 'Create a weather widget'
  },
  fr: {
    title: 'Comment fonctionne Meteo AI : données, méthode et limites', description: 'Découvrez les sources, les mises à jour, l’analyse locale, la confidentialité et les limites des prévisions Meteo AI.',
    eyebrow: 'TRANSPARENCE • MÉTHODE • SOURCES', h1: 'Comment fonctionne Meteo AI',
    lead: 'Meteo AI associe des données météo vérifiables à des outils locaux pour faciliter les décisions quotidiennes, sans présenter une prévision comme une certitude.',
    sections: [
      ['Origine des données', 'Les prévisions et données historiques proviennent d’Open-Meteo. Les localités reposent sur GeoNames, les cartes sur OpenStreetMap et les frontières sur Natural Earth. Monde en direct utilise aussi les sources publiques internationales indiquées sur cette page.'],
      ['Rôle de l’intelligence Meteo AI', 'L’application compare température, pluie, vent, indice UV, qualité de l’air et échéance pour produire des synthèses pratiques. L’analyse principale fonctionne dans le navigateur avec des règles locales ; les questions ne sont pas envoyées à des services génératifs externes.'],
      ['Fréquence des mises à jour', 'Les conditions et prévisions sont demandées à l’ouverture ou à l’actualisation d’une localité. De courtes caches techniques limitent les requêtes répétées ; disponibilité et horaires dépendent des fournisseurs.'],
      ['Prévision, probabilité et incertitude', 'Une probabilité de pluie ne garantit pas qu’il pleuvra au point exact sélectionné. L’incertitude augmente avec l’échéance. Meteo AI explique les données disponibles sans certifier un événement particulier.'],
      ['Confidentialité essentielle', 'Aucun compte n’est requis. Favoris, thème, localités et caches restent normalement dans le navigateur. La position n’est lue qu’après l’accord du dispositif.'],
      ['Limites et sécurité', 'Meteo AI est un outil d’information. Il ne remplace ni la protection civile, ni les autorités locales, ni les bulletins officiels, ni une évaluation professionnelle ou un outil de navigation maritime.']
    ],
    sources: 'Sources principales', promise: 'Notre engagement', promiseText: 'Des pages indexables uniquement pour les localités réellement actives, des sources déclarées, aucune promesse d’exactitude absolue et des explications claires en cas d’incertitude.',
    home: 'Voir les prévisions', widget: 'Créer un widget météo'
  },
  'pt-BR': {
    title: 'Como funciona o Meteo AI: dados, método e limites', description: 'Conheça as fontes, atualizações, análise local, privacidade e limites das previsões do Meteo AI.',
    eyebrow: 'TRANSPARÊNCIA • MÉTODO • FONTES', h1: 'Como funciona o Meteo AI',
    lead: 'O Meteo AI combina dados meteorológicos verificáveis com ferramentas locais para facilitar decisões diárias, sem apresentar uma previsão como certeza.',
    sections: [
      ['De onde vêm os dados', 'Previsões e dados históricos vêm do Open-Meteo. As localidades são baseadas no GeoNames, os mapas no OpenStreetMap e os limites no Natural Earth. O Mundo ao vivo também usa as fontes públicas internacionais indicadas na página.'],
      ['O que faz a inteligência do Meteo AI', 'O aplicativo compara temperatura, chuva, vento, índice UV, qualidade do ar e horizonte da previsão para gerar resumos práticos. A análise principal ocorre no navegador com regras locais; perguntas não são enviadas a serviços generativos externos.'],
      ['Frequência de atualização', 'Condições atuais e previsões são solicitadas ao abrir ou atualizar uma localidade. Caches técnicas curtas reduzem pedidos repetidos; horários e disponibilidade dependem de cada fornecedor.'],
      ['Previsão, probabilidade e incerteza', 'Uma probabilidade de chuva não garante chuva no ponto exato selecionado. A incerteza aumenta com o horizonte temporal. O Meteo AI explica os dados disponíveis, mas não certifica eventos individuais.'],
      ['Privacidade essencial', 'Nenhuma conta é necessária. Favoritos, tema, localidades e caches normalmente permanecem no navegador. A posição só é lida após a autorização do dispositivo.'],
      ['Limites e segurança', 'O Meteo AI é uma ferramenta informativa. Não substitui defesa civil, autoridades locais, boletins oficiais, avaliação profissional ou instrumentos de navegação marítima.']
    ],
    sources: 'Fontes principais', promise: 'Nosso compromisso', promiseText: 'Páginas indexáveis apenas para localidades realmente ativas, fontes declaradas, nenhuma promessa de precisão absoluta e explicações claras quando os dados são incertos.',
    home: 'Abrir previsões', widget: 'Criar widget de previsão'
  },
  es: {
    title: 'Cómo funciona Meteo AI: datos, método y límites', description: 'Conoce las fuentes, actualizaciones, análisis local, privacidad y límites de las previsiones de Meteo AI.',
    eyebrow: 'TRANSPARENCIA • MÉTODO • FUENTES', h1: 'Cómo funciona Meteo AI',
    lead: 'Meteo AI combina datos meteorológicos verificables con herramientas locales para facilitar decisiones cotidianas, sin presentar una previsión como una certeza.',
    sections: [
      ['De dónde proceden los datos', 'Las previsiones y los datos históricos proceden de Open-Meteo. Las localidades se basan en GeoNames, los mapas en OpenStreetMap y los límites en Natural Earth. Mundo en directo también utiliza las fuentes públicas internacionales indicadas en esa página.'],
      ['Qué hace la inteligencia de Meteo AI', 'La aplicación compara temperatura, lluvia, viento, índice UV, calidad del aire y horizonte temporal para producir resúmenes prácticos. El análisis principal se ejecuta en el navegador mediante reglas locales; las preguntas no se envían a servicios generativos externos.'],
      ['Frecuencia de actualización', 'Las condiciones y previsiones se solicitan al abrir o actualizar una localidad. Las cachés técnicas breves reducen solicitudes repetidas; horarios y disponibilidad dependen de cada proveedor.'],
      ['Previsión, probabilidad e incertidumbre', 'Una probabilidad de lluvia no garantiza que llueva en el punto exacto seleccionado. La incertidumbre aumenta cuanto más lejano es el horizonte. Meteo AI explica los datos disponibles, pero no certifica sucesos individuales.'],
      ['Privacidad esencial', 'No se requiere una cuenta. Favoritos, tema, localidades y cachés permanecen normalmente en el navegador. La posición solo se lee después del permiso del dispositivo.'],
      ['Límites y seguridad', 'Meteo AI es una herramienta informativa. No sustituye a protección civil, autoridades locales, boletines oficiales, evaluaciones profesionales ni instrumentos de navegación marítima.']
    ],
    sources: 'Fuentes principales', promise: 'Nuestro compromiso', promiseText: 'Páginas indexables solo para localidades realmente activas, fuentes declaradas, ninguna promesa de precisión absoluta y explicaciones claras cuando los datos son inciertos.',
    home: 'Abrir previsiones', widget: 'Crear un widget del tiempo'
  }
};

const alternateLinks = key => Object.values(LOCALES).map(locale => `<link rel="alternate" hreflang="${locale.hreflang}" href="${ORIGIN}${locale[key]}">`).join('\n  ') + `\n  <link rel="alternate" hreflang="x-default" href="${ORIGIN}${LOCALES.it[key]}">`;

module.exports = function handler(req, res) {
  const locale = localeFor(req.query?.lang);
  const copy = COPY[locale.code];
  const canonical = `${ORIGIN}${locale.howPath}`;
  const languageLinks = Object.values(LOCALES).map(item => `<a href="${item.howPath}" lang="${item.locale}"${item.code === locale.code ? ' aria-current="page"' : ''}>${item.code === 'pt-BR' ? 'PT' : item.code.toUpperCase()}</a>`).join('');
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'AboutPage', '@id': `${canonical}#page`, url: canonical,
    name: copy.title, description: copy.description, inLanguage: locale.locale,
    isPartOf: { '@id': `${ORIGIN}/#website` }, about: { '@id': `${ORIGIN}/#organization` }
  };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Language', locale.locale);
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'index,follow,max-image-preview:large,max-snippet:-1');
  res.end(`<!doctype html><html lang="${locale.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(copy.description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><meta property="og:type" content="website"><meta property="og:site_name" content="Meteo AI"><meta property="og:locale" content="${locale.ogLocale}"><meta property="og:title" content="${escapeHtml(copy.title)}"><meta property="og:description" content="${escapeHtml(copy.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${ORIGIN}/social-preview.jpg?v=20260723b"><link rel="canonical" href="${canonical}">
  ${alternateLinks('howPath')}<link rel="icon" href="/icon.svg" type="image/svg+xml"><title>${escapeHtml(copy.title)} | Meteo AI</title><script type="application/ld+json">${jsonForHtml(structuredData)}</script><style>:root{--bg:#f4f7f4;--surface:#fff;--ink:#13231e;--muted:#63716c;--green:#0d7b57;--lime:#c9f25d;--line:#dfe6e1;--navy:#102d26}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}.top{display:flex;align-items:center;justify-content:space-between;padding:18px max(4vw,22px);background:#fff;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:9px;color:var(--ink);font-weight:800;text-decoration:none}.mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--green);color:#fff}.top nav{display:flex;gap:9px}.top nav a{color:var(--muted);text-decoration:none;font-size:13px}.top nav a[aria-current]{color:var(--green);font-weight:800}.hero{padding:78px 22px 58px;text-align:center;background:radial-gradient(circle at 80% 5%,rgba(201,242,93,.25),transparent 24%)}.eyebrow{color:var(--green);font-size:11px;font-weight:800;letter-spacing:1.5px}.hero h1{max-width:900px;margin:16px auto;font-size:clamp(42px,7vw,76px);line-height:1;letter-spacing:-2px}.hero p{max-width:760px;margin:auto;color:var(--muted);font-size:19px;line-height:1.65}.actions{display:flex;justify-content:center;gap:10px;margin-top:28px;flex-wrap:wrap}.actions a{padding:13px 17px;border-radius:11px;background:var(--green);color:#fff;text-decoration:none;font-weight:800}.actions a+ a{background:#fff;color:var(--green);border:1px solid var(--line)}main{max-width:1050px;margin:auto;padding:35px 22px 75px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card{padding:27px;border:1px solid var(--line);border-radius:20px;background:#fff}.card h2{margin:0 0 12px;font-size:23px}.card p{margin:0;color:var(--muted);line-height:1.7}.sources{margin-top:20px;padding:30px;border-radius:22px;background:var(--navy);color:#fff}.sources h2{margin-top:0}.sources a{color:var(--lime)}.promise{margin-top:18px;padding:27px;border-left:5px solid var(--green);background:#eaf5ef;border-radius:0 18px 18px 0}.promise h2{margin-top:0}.promise p{color:var(--muted);line-height:1.7}footer{padding:35px 20px;background:var(--navy);color:#b8c9c3;text-align:center}footer a{color:var(--lime)}@media(max-width:700px){.grid{grid-template-columns:1fr}.hero{padding-top:55px}.top{gap:12px}.top .main-link{display:none}}</style></head><body><header class="top"><a class="brand" href="${locale.homePath}"><span class="mark">M</span>Meteo AI</a><a class="main-link" href="${locale.homePath}" style="color:var(--green);text-decoration:none;font-weight:700">${copy.home}</a><nav aria-label="Language">${languageLinks}</nav></header><section class="hero"><div class="eyebrow">${copy.eyebrow}</div><h1>${copy.h1}</h1><p>${copy.lead}</p><div class="actions"><a href="${locale.homePath}">${copy.home}</a><a href="${locale.widgetPath}">${copy.widget}</a></div></section><main><div class="grid">${copy.sections.map(([title, text]) => `<section class="card"><h2>${title}</h2><p>${text}</p></section>`).join('')}</div><section class="sources"><h2>${copy.sources}</h2><p><a href="https://open-meteo.com/" rel="nofollow noopener">Open-Meteo</a> • <a href="https://www.geonames.org/" rel="nofollow noopener">GeoNames</a> • <a href="https://www.openstreetmap.org/" rel="nofollow noopener">OpenStreetMap</a> • <a href="https://www.naturalearthdata.com/" rel="nofollow noopener">Natural Earth</a></p></section><section class="promise"><h2>${copy.promise}</h2><p>${copy.promiseText}</p></section></main><footer><p><a href="${locale.homePath}">Meteo AI</a> • <a href="${locale.widgetPath}">${locale.widgetLabel}</a></p></footer></body></html>`);
};

module.exports.COPY = COPY;
