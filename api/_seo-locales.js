const ORIGIN = process.env.SITE_ORIGIN || 'https://meteo-ai.vercel.app';

const PLACE_NAMES = {
  it: {
    Rome: 'Roma', Milan: 'Milano', Naples: 'Napoli', Turin: 'Torino', Genoa: 'Genova',
    Florence: 'Firenze', Padua: 'Padova', "Reggio nell'Emilia": 'Reggio Emilia',
    'New York City': 'New York', 'Mexico City': 'Città del Messico', Moscow: 'Mosca',
    'Saint Petersburg': 'San Pietroburgo', Beijing: 'Pechino', Cairo: 'Il Cairo',
    'Cape Town': 'Città del Capo'
  },
  fr: {
    Rome: 'Rome', Milan: 'Milan', Naples: 'Naples', Turin: 'Turin', Genoa: 'Gênes',
    Florence: 'Florence', Padua: 'Padoue', London: 'Londres', 'New York City': 'New York',
    'Mexico City': 'Mexico', Moscow: 'Moscou', 'Saint Petersburg': 'Saint-Pétersbourg',
    Beijing: 'Pékin', Seoul: 'Séoul', Cairo: 'Le Caire', 'Cape Town': 'Le Cap'
  },
  'pt-BR': {
    Rome: 'Roma', Milan: 'Milão', Naples: 'Nápoles', Turin: 'Turim', Genoa: 'Gênova',
    Florence: 'Florença', Padua: 'Pádua', London: 'Londres', 'New York City': 'Nova York',
    'Mexico City': 'Cidade do México', Moscow: 'Moscou', 'Saint Petersburg': 'São Petersburgo',
    Beijing: 'Pequim', Seoul: 'Seul', Cairo: 'Cairo', 'Cape Town': 'Cidade do Cabo'
  },
  es: {
    Rome: 'Roma', Milan: 'Milán', Naples: 'Nápoles', Turin: 'Turín', Genoa: 'Génova',
    Florence: 'Florencia', Padua: 'Padua', London: 'Londres', 'New York City': 'Nueva York',
    'Mexico City': 'Ciudad de México', Moscow: 'Moscú', 'Saint Petersburg': 'San Petersburgo',
    Beijing: 'Pekín', Seoul: 'Seúl', Cairo: 'El Cairo', 'Cape Town': 'Ciudad del Cabo'
  }
};

const LOCALES = {
  it: {
    code: 'it', locale: 'it-IT', hreflang: 'it', ogLocale: 'it_IT',
    homePath: '/', directoryPath: '/localita', locationSegment: 'meteo',
    navForecast: 'Previsioni', navLocations: 'Località', directoryName: 'Località meteo',
    title: name => `Meteo ${name}: oggi, domani e 7 giorni | Meteo AI`,
    description: (name, area) => `Meteo ${name} oggi e domani: temperature, pioggia, vento e previsioni per questa settimana. Dati aggiornati per ${area}.`,
    h1: name => `Meteo ${name} oggi, domani e questa settimana`,
    hero: area => `Previsioni per ${area}: temperatura, probabilità di pioggia e vento per oggi, domani e i prossimi sette giorni.`,
    eyebrow: 'METEO LOCALE • DATI AGGIORNATI', perceived: 'Percepita', humidity: 'Umidità',
    openTools: name => `Apri tutti gli strumenti meteo per ${name}`,
    nextDays: name => `Previsioni meteo ${name}: prossimi 7 giorni`,
    headers: ['Giorno', 'Condizioni', 'Temperature', 'Pioggia', 'Vento massimo'],
    todayConditions: name => `Condizioni di oggi a ${name}`,
    temperature: 'Temperatura', wind: 'Vento', pressure: 'Pressione', precipitation: 'Precipitazioni',
    locationInfo: 'Informazioni sulla località', area: 'Area', population: 'Popolazione', timezone: 'Fuso orario', coordinates: 'Coordinate',
    otherRegion: area => `Altre località meteo in ${area}`,
    otherRegionLead: 'Confronta le previsioni nelle località attive della stessa area geografica.',
    nearby: 'Meteo nelle località vicine',
    nearbyLead: 'Località già consultate dagli utenti e disponibili nell’indice attivo di Meteo AI.',
    sevenDays: 'previsioni 7 giorni',
    currentCopy: (name, condition, temperature) => `Il meteo di ${name} viene aggiornato utilizzando dati modellistici globali. La previsione mostra ${condition} e una temperatura attuale di circa ${temperature} °C. Controlla sempre gli aggiornamenti più recenti prima di programmare attività sensibili al tempo.`,
    unavailable: 'Previsioni temporaneamente non disponibili. Apri l’app per riprovare.',
    variable: 'variabile', variableConditions: 'condizioni variabili',
    footerNotice: 'Meteo AI è uno strumento informativo e non sostituisce bollettini ufficiali o autorità locali.',
    weatherData: 'Dati meteo', placesData: 'Località',
    directoryTitle: 'Località meteo attive: previsioni per città e regioni | Meteo AI',
    directoryDescription: count => `Consulta le previsioni Meteo AI per ${count} località attive, organizzate per paese e regione. La directory cresce soltanto con le località realmente cercate dagli utenti.`,
    directoryEyebrow: 'DIRECTORY ATTIVA • AGGIORNATA AUTOMATICAMENTE',
    directoryH1: 'Località meteo attive su Meteo AI',
    directoryHero: 'Trova rapidamente le previsioni per città e territori già consultati dagli utenti. Ogni pagina mostra meteo di oggi, domani e dei prossimi sette giorni.',
    activeCount: count => `${count} località attive`, countryCount: count => `${count} paesi`,
    directoryIntro: 'Questa directory non genera pagine in massa: include il nucleo iniziale di località rilevanti e si amplia quando una nuova località viene realmente utilizzata nell’app. I collegamenti per paese e regione aiutano persone e motori di ricerca a raggiungere le previsioni più utili.',
    weatherIn: country => `Meteo in ${country}`, placeWeather: name => `Meteo ${name}`, todayTomorrow: 'Oggi, domani e 7 giorni',
    directoryUpdating: 'Directory in aggiornamento', directoryUpdatingCopy: 'Le località attive saranno nuovamente disponibili a breve.',
    footerDirectory: 'Previsioni meteo globali, gratuite e senza registrazione', pathLabel: 'Percorso'
  },
  en: {
    code: 'en', locale: 'en-GB', hreflang: 'en', ogLocale: 'en_GB',
    homePath: '/en', directoryPath: '/en/locations', locationSegment: 'weather',
    navForecast: 'Forecast', navLocations: 'Locations', directoryName: 'Weather locations',
    title: name => `${name} weather: today, tomorrow and 7 days | Meteo AI`,
    description: (name, area) => `Weather in ${name} today and tomorrow: temperature, rain, wind and this week's forecast. Updated data for ${area}.`,
    h1: name => `Weather in ${name} today, tomorrow and this week`,
    hero: area => `Forecast for ${area}: temperature, chance of rain and wind for today, tomorrow and the next seven days.`,
    eyebrow: 'LOCAL WEATHER • UPDATED DATA', perceived: 'Feels like', humidity: 'Humidity',
    openTools: name => `Open all weather tools for ${name}`,
    nextDays: name => `${name} weather forecast: next 7 days`,
    headers: ['Day', 'Conditions', 'Temperatures', 'Rain', 'Maximum wind'],
    todayConditions: name => `Today's conditions in ${name}`,
    temperature: 'Temperature', wind: 'Wind', pressure: 'Pressure', precipitation: 'Precipitation',
    locationInfo: 'Location information', area: 'Area', population: 'Population', timezone: 'Time zone', coordinates: 'Coordinates',
    otherRegion: area => `Other active weather locations in ${area}`,
    otherRegionLead: 'Compare forecasts for active locations in the same geographical area.',
    nearby: 'Weather in nearby locations',
    nearbyLead: 'Locations already viewed by users and available in Meteo AI’s active index.',
    sevenDays: '7-day forecast',
    currentCopy: (name, condition, temperature) => `${name} weather is updated using global forecast model data. Current conditions are ${condition}, with a temperature of around ${temperature} °C. Always check the latest updates before planning weather-sensitive activities.`,
    unavailable: 'Forecast temporarily unavailable. Open the app to try again.',
    variable: 'variable', variableConditions: 'variable conditions',
    footerNotice: 'Meteo AI is an information tool and does not replace official bulletins or local authorities.',
    weatherData: 'Weather data', placesData: 'Locations',
    directoryTitle: 'Active weather locations: forecasts by city and region | Meteo AI',
    directoryDescription: count => `View Meteo AI forecasts for ${count} active locations, organised by country and region. The directory grows only with locations actually searched by users.`,
    directoryEyebrow: 'ACTIVE DIRECTORY • AUTOMATICALLY UPDATED',
    directoryH1: 'Active weather locations on Meteo AI',
    directoryHero: 'Quickly find forecasts for cities and areas already viewed by users. Each page shows weather for today, tomorrow and the next seven days.',
    activeCount: count => `${count} active locations`, countryCount: count => `${count} countries`,
    directoryIntro: 'This directory does not generate pages in bulk: it includes relevant locations and grows when a new place is actually used in the app. Country and region links help people and search engines reach the most useful forecasts.',
    weatherIn: country => `Weather in ${country}`, placeWeather: name => `${name} weather`, todayTomorrow: 'Today, tomorrow and 7 days',
    directoryUpdating: 'Directory updating', directoryUpdatingCopy: 'Active locations will be available again shortly.',
    footerDirectory: 'Free worldwide weather forecasts with no registration', pathLabel: 'Breadcrumb'
  },
  fr: {
    code: 'fr', locale: 'fr-FR', hreflang: 'fr', ogLocale: 'fr_FR',
    homePath: '/fr', directoryPath: '/fr/localites', locationSegment: 'meteo',
    navForecast: 'Prévisions', navLocations: 'Localités', directoryName: 'Localités météo',
    title: name => `Météo ${name} : aujourd’hui, demain et 7 jours | Meteo AI`,
    description: (name, area) => `Météo à ${name} aujourd’hui et demain : température, pluie, vent et prévisions de la semaine. Données actualisées pour ${area}.`,
    h1: name => `Météo à ${name} aujourd’hui, demain et cette semaine`,
    hero: area => `Prévisions pour ${area} : température, risque de pluie et vent aujourd’hui, demain et les sept prochains jours.`,
    eyebrow: 'MÉTÉO LOCALE • DONNÉES ACTUALISÉES', perceived: 'Ressentie', humidity: 'Humidité',
    openTools: name => `Ouvrir tous les outils météo pour ${name}`,
    nextDays: name => `Prévisions météo ${name} : les 7 prochains jours`,
    headers: ['Jour', 'Conditions', 'Températures', 'Pluie', 'Vent maximal'],
    todayConditions: name => `Conditions aujourd’hui à ${name}`,
    temperature: 'Température', wind: 'Vent', pressure: 'Pression', precipitation: 'Précipitations',
    locationInfo: 'Informations sur la localité', area: 'Zone', population: 'Population', timezone: 'Fuseau horaire', coordinates: 'Coordonnées',
    otherRegion: area => `Autres localités météo dans ${area}`,
    otherRegionLead: 'Comparez les prévisions des localités actives de la même zone géographique.',
    nearby: 'Météo dans les localités voisines',
    nearbyLead: 'Localités déjà consultées et disponibles dans l’index actif de Meteo AI.',
    sevenDays: 'prévisions à 7 jours',
    currentCopy: (name, condition, temperature) => `La météo de ${name} est actualisée à partir de modèles météorologiques mondiaux. Les conditions actuelles sont ${condition}, avec une température d’environ ${temperature} °C. Consultez toujours les dernières mises à jour avant de planifier des activités sensibles à la météo.`,
    unavailable: 'Prévisions temporairement indisponibles. Ouvrez l’application pour réessayer.',
    variable: 'variable', variableConditions: 'conditions variables',
    footerNotice: 'Meteo AI est un outil d’information et ne remplace pas les bulletins officiels ni les autorités locales.',
    weatherData: 'Données météo', placesData: 'Localités',
    directoryTitle: 'Localités météo actives : prévisions par ville et région | Meteo AI',
    directoryDescription: count => `Consultez les prévisions Meteo AI pour ${count} localités actives, classées par pays et région. Le répertoire évolue uniquement avec les lieux réellement recherchés.`,
    directoryEyebrow: 'RÉPERTOIRE ACTIF • MISE À JOUR AUTOMATIQUE',
    directoryH1: 'Localités météo actives sur Meteo AI',
    directoryHero: 'Trouvez rapidement les prévisions des villes et territoires déjà consultés. Chaque page présente la météo d’aujourd’hui, de demain et des sept prochains jours.',
    activeCount: count => `${count} localités actives`, countryCount: count => `${count} pays`,
    directoryIntro: 'Ce répertoire ne génère pas de pages en masse : il contient des localités pertinentes et s’enrichit lorsqu’un nouveau lieu est réellement utilisé dans l’application. Les liens par pays et région aident les personnes et les moteurs de recherche à trouver les prévisions les plus utiles.',
    weatherIn: country => `Météo en ${country}`, placeWeather: name => `Météo ${name}`, todayTomorrow: 'Aujourd’hui, demain et 7 jours',
    directoryUpdating: 'Répertoire en cours de mise à jour', directoryUpdatingCopy: 'Les localités actives seront à nouveau disponibles prochainement.',
    footerDirectory: 'Prévisions météo mondiales gratuites et sans inscription', pathLabel: 'Fil d’Ariane'
  },
  'pt-BR': {
    code: 'pt-BR', locale: 'pt-BR', hreflang: 'pt-BR', ogLocale: 'pt_BR',
    homePath: '/pt-br', directoryPath: '/pt-br/localidades', locationSegment: 'previsao',
    navForecast: 'Previsões', navLocations: 'Localidades', directoryName: 'Localidades com previsão',
    title: name => `Previsão do tempo ${name}: hoje, amanhã e 7 dias | Meteo AI`,
    description: (name, area) => `Previsão do tempo em ${name} hoje e amanhã: temperatura, chuva, vento e previsão para esta semana. Dados atualizados para ${area}.`,
    h1: name => `Previsão do tempo em ${name} hoje, amanhã e esta semana`,
    hero: area => `Previsão para ${area}: temperatura, probabilidade de chuva e vento para hoje, amanhã e os próximos sete dias.`,
    eyebrow: 'PREVISÃO LOCAL • DADOS ATUALIZADOS', perceived: 'Sensação', humidity: 'Umidade',
    openTools: name => `Abrir todas as ferramentas de previsão para ${name}`,
    nextDays: name => `Previsão do tempo em ${name}: próximos 7 dias`,
    headers: ['Dia', 'Condições', 'Temperaturas', 'Chuva', 'Vento máximo'],
    todayConditions: name => `Condições de hoje em ${name}`,
    temperature: 'Temperatura', wind: 'Vento', pressure: 'Pressão', precipitation: 'Precipitação',
    locationInfo: 'Informações sobre a localidade', area: 'Área', population: 'População', timezone: 'Fuso horário', coordinates: 'Coordenadas',
    otherRegion: area => `Outras localidades com previsão em ${area}`,
    otherRegionLead: 'Compare a previsão nas localidades ativas da mesma região.',
    nearby: 'Previsão em localidades próximas',
    nearbyLead: 'Localidades já consultadas e disponíveis no índice ativo do Meteo AI.',
    sevenDays: 'previsão para 7 dias',
    currentCopy: (name, condition, temperature) => `A previsão de ${name} é atualizada com dados de modelos meteorológicos globais. A condição atual é ${condition}, com temperatura em torno de ${temperature} °C. Consulte sempre as atualizações mais recentes antes de planejar atividades sensíveis ao tempo.`,
    unavailable: 'Previsão temporariamente indisponível. Abra o aplicativo para tentar novamente.',
    variable: 'variável', variableConditions: 'condições variáveis',
    footerNotice: 'O Meteo AI é uma ferramenta informativa e não substitui boletins oficiais ou autoridades locais.',
    weatherData: 'Dados meteorológicos', placesData: 'Localidades',
    directoryTitle: 'Localidades ativas: previsão do tempo por cidade e região | Meteo AI',
    directoryDescription: count => `Consulte a previsão do Meteo AI para ${count} localidades ativas, organizadas por país e região. A lista cresce apenas com locais realmente pesquisados pelos usuários.`,
    directoryEyebrow: 'LISTA ATIVA • ATUALIZADA AUTOMATICAMENTE',
    directoryH1: 'Localidades com previsão ativa no Meteo AI',
    directoryHero: 'Encontre rapidamente a previsão para cidades e regiões já consultadas. Cada página mostra o tempo de hoje, amanhã e dos próximos sete dias.',
    activeCount: count => `${count} localidades ativas`, countryCount: count => `${count} países`,
    directoryIntro: 'Esta lista não cria páginas em massa: inclui localidades relevantes e cresce quando um novo local é realmente usado no aplicativo. Os links por país e região ajudam pessoas e buscadores a encontrar as previsões mais úteis.',
    weatherIn: country => `Previsão do tempo em ${country}`, placeWeather: name => `Previsão ${name}`, todayTomorrow: 'Hoje, amanhã e 7 dias',
    directoryUpdating: 'Lista em atualização', directoryUpdatingCopy: 'As localidades ativas estarão disponíveis novamente em breve.',
    footerDirectory: 'Previsões globais gratuitas e sem cadastro', pathLabel: 'Navegação'
  },
  es: {
    code: 'es', locale: 'es-ES', hreflang: 'es', ogLocale: 'es_ES',
    homePath: '/es', directoryPath: '/es/localidades', locationSegment: 'tiempo',
    navForecast: 'Previsión', navLocations: 'Localidades', directoryName: 'Localidades meteorológicas',
    title: name => `Tiempo en ${name}: hoy, mañana y 7 días | Meteo AI`,
    description: (name, area) => `El tiempo en ${name} hoy y mañana: temperatura, lluvia, viento y previsión para esta semana. Datos actualizados para ${area}.`,
    h1: name => `El tiempo en ${name} hoy, mañana y esta semana`,
    hero: area => `Previsión para ${area}: temperatura, probabilidad de lluvia y viento para hoy, mañana y los próximos siete días.`,
    eyebrow: 'TIEMPO LOCAL • DATOS ACTUALIZADOS', perceived: 'Sensación', humidity: 'Humedad',
    openTools: name => `Abrir todas las herramientas meteorológicas para ${name}`,
    nextDays: name => `El tiempo en ${name}: próximos 7 días`,
    headers: ['Día', 'Condiciones', 'Temperaturas', 'Lluvia', 'Viento máximo'],
    todayConditions: name => `Condiciones de hoy en ${name}`,
    temperature: 'Temperatura', wind: 'Viento', pressure: 'Presión', precipitation: 'Precipitaciones',
    locationInfo: 'Información de la localidad', area: 'Área', population: 'Población', timezone: 'Zona horaria', coordinates: 'Coordenadas',
    otherRegion: area => `Otras localidades meteorológicas en ${area}`,
    otherRegionLead: 'Compara la previsión en las localidades activas de la misma zona.',
    nearby: 'El tiempo en localidades cercanas',
    nearbyLead: 'Localidades ya consultadas y disponibles en el índice activo de Meteo AI.',
    sevenDays: 'previsión de 7 días',
    currentCopy: (name, condition, temperature) => `La previsión de ${name} se actualiza con datos de modelos meteorológicos globales. La condición actual es ${condition}, con una temperatura aproximada de ${temperature} °C. Consulta siempre las últimas actualizaciones antes de planificar actividades sensibles al tiempo.`,
    unavailable: 'La previsión no está disponible temporalmente. Abre la aplicación para volver a intentarlo.',
    variable: 'variable', variableConditions: 'condiciones variables',
    footerNotice: 'Meteo AI es una herramienta informativa y no sustituye los boletines oficiales ni a las autoridades locales.',
    weatherData: 'Datos meteorológicos', placesData: 'Localidades',
    directoryTitle: 'Localidades meteorológicas activas: previsión por ciudad y región | Meteo AI',
    directoryDescription: count => `Consulta la previsión de Meteo AI para ${count} localidades activas, organizadas por país y región. El directorio crece solo con lugares realmente buscados por los usuarios.`,
    directoryEyebrow: 'DIRECTORIO ACTIVO • ACTUALIZADO AUTOMÁTICAMENTE',
    directoryH1: 'Localidades meteorológicas activas en Meteo AI',
    directoryHero: 'Encuentra rápidamente la previsión de ciudades y territorios ya consultados. Cada página muestra el tiempo de hoy, mañana y de los próximos siete días.',
    activeCount: count => `${count} localidades activas`, countryCount: count => `${count} países`,
    directoryIntro: 'Este directorio no genera páginas en masa: incluye localidades relevantes y crece cuando un nuevo lugar se utiliza realmente en la aplicación. Los enlaces por país y región ayudan a personas y buscadores a encontrar las previsiones más útiles.',
    weatherIn: country => `El tiempo en ${country}`, placeWeather: name => `Tiempo ${name}`, todayTomorrow: 'Hoy, mañana y 7 días',
    directoryUpdating: 'Directorio en actualización', directoryUpdatingCopy: 'Las localidades activas volverán a estar disponibles en breve.',
    footerDirectory: 'Previsiones meteorológicas globales, gratuitas y sin registro', pathLabel: 'Ruta de navegación'
  }
};

const normalizeLanguage = value => {
  const language = String(value || 'it').toLowerCase();
  if (language === 'en' || language.startsWith('en-')) return 'en';
  if (language === 'fr' || language.startsWith('fr-')) return 'fr';
  if (language === 'pt' || language === 'pt-br') return 'pt-BR';
  if (language === 'es' || language.startsWith('es-')) return 'es';
  return 'it';
};

const localeFor = value => LOCALES[normalizeLanguage(value)];

const placeParts = place => {
  const parts = String(place.path || '').split('/').filter(Boolean);
  return { country: parts[1], region: parts[2], token: parts[3] };
};

const localizedPlacePath = (place, language) => {
  const locale = localeFor(language);
  if (locale.code === 'it') return place.path;
  const { country, region, token } = placeParts(place);
  return `${locale.homePath}/${locale.locationSegment}/${country}/${region}/${token}`;
};

const localizedDirectoryAnchor = (place, language, region = false) => {
  const locale = localeFor(language);
  const slug = value => String(value || 'area').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${locale.directoryPath}#${region ? `regione-${slug(place.cc)}-${slug(place.ad)}` : `paese-${slug(place.cc)}`}`;
};

const displayCountry = (place, language) => {
  try {
    return new Intl.DisplayNames([localeFor(language).locale], { type: 'region' }).of(place.cc) || place.c;
  } catch (_) {
    return place.c;
  }
};

const displayPlaceName = (place, language) => PLACE_NAMES[normalizeLanguage(language)]?.[place.n] || place.n;

const alternateLinks = place => [
  ['it', localizedPlacePath(place, 'it')],
  ['en', localizedPlacePath(place, 'en')],
  ['fr', localizedPlacePath(place, 'fr')],
  ['pt-BR', localizedPlacePath(place, 'pt-BR')],
  ['es', localizedPlacePath(place, 'es')],
  ['x-default', localizedPlacePath(place, 'it')]
].map(([hreflang, path]) => `<link rel="alternate" hreflang="${hreflang}" href="${ORIGIN}${path}">`).join('\n  ');

const directoryAlternateLinks = () => [
  ['it', LOCALES.it.directoryPath],
  ['en', LOCALES.en.directoryPath],
  ['fr', LOCALES.fr.directoryPath],
  ['pt-BR', LOCALES['pt-BR'].directoryPath],
  ['es', LOCALES.es.directoryPath],
  ['x-default', LOCALES.it.directoryPath]
].map(([hreflang, path]) => `<link rel="alternate" hreflang="${hreflang}" href="${ORIGIN}${path}">`).join('\n  ');

module.exports = {
  ORIGIN,
  LOCALES,
  normalizeLanguage,
  localeFor,
  localizedPlacePath,
  localizedDirectoryAnchor,
  displayCountry,
  displayPlaceName,
  alternateLinks,
  directoryAlternateLinks
};
