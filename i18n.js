(function(global){
  'use strict';

  const STORAGE_KEY='meteo-ai-language';
  const supported=['it','en','fr','pt-BR','es'];
  const localeMap={it:'it-IT',en:'en-GB',fr:'fr-FR','pt-BR':'pt-BR',es:'es-ES'};
  const names={it:'Italiano',en:'English',fr:'Français','pt-BR':'Português (Brasil)',es:'Español'};
  const flags={it:'🇮🇹',en:'🇬🇧',fr:'🇫🇷','pt-BR':'🇧🇷',es:'🇪🇸'};

  const messages={
    it:{language:'Lingua',languageSelector:'Seleziona lingua',location:'Località',today:'Oggi',tomorrow:'Domani',dayAfterTomorrow:'Dopodomani',forecast:'Previsioni',sea:'Mare',worldLive:'Mondo Live',install:'Installa',installApp:'Installa App',favorites:'Preferiti',sections:'Tutte le sezioni',search:'Cerca',searchPlace:'Cerca una località',usePosition:'Usa la mia posizione',changeTheme:'Cambia tema',openMenu:'Apri menu',close:'Chiudi',loading:'Caricamento…',retry:'Riprova',update:'Aggiorna',savePlace:'Salva località',share:'Condividi',rain:'Pioggia',wind:'Vento',humidity:'Umidità',pressure:'Pressione',visibility:'Visibilità',uvIndex:'Indice UV',sunrise:'Alba',sunset:'Tramonto',currentTemperature:'Temperatura attuale',feelsLike:'Percepita',high:'Alta',moderate:'Moderata',low:'Bassa',extreme:'Estrema',noResults:'Nessun risultato',notAvailable:'Non disponibile',installed:'Meteo AI è installata',alreadyInstalled:'Meteo AI è già installata su questo dispositivo.',installStarted:'Installazione avviata. Grazie!',installComplete:'Meteo AI è stata installata correttamente.',linkCopied:'Link copiato. Puoi incollarlo sui social.',geoDenied:'Accesso alla posizione negato.',geoUnavailable:'Posizione non disponibile.',geoTimeout:'La richiesta della posizione è scaduta.',geoError:'Impossibile rilevare la posizione.',favourableOutdoor:'Condizioni favorevoli per attività all’aperto.',privacy:'Privacy',cookies:'Cookie',terms:'Termini',backWeather:'Torna al meteo',all:'Tutti',events:'Eventi',notifications:'Notifiche',active:'Attive',blocked:'Bloccate',minutesAgo:'{count} min fa',hoursAgo:'{count} ore fa',daysAgo:'{count} giorni fa',sourcesAvailable:'{available} fonti su {total} disponibili',eventsReceived:'{events} eventi ricevuti da {sources} fonti',distanceFrom:'{distance} da {place}',languageChanged:'Lingua impostata su {language}'},
    en:{language:'Language',languageSelector:'Select language',location:'Location',today:'Today',tomorrow:'Tomorrow',dayAfterTomorrow:'The day after tomorrow',forecast:'Forecast',sea:'Sea',worldLive:'World Live',install:'Install',installApp:'Install App',favorites:'Favourites',sections:'All sections',search:'Search',searchPlace:'Search for a location',usePosition:'Use my location',changeTheme:'Change theme',openMenu:'Open menu',close:'Close',loading:'Loading…',retry:'Try again',update:'Update',savePlace:'Save location',share:'Share',rain:'Rain',wind:'Wind',humidity:'Humidity',pressure:'Pressure',visibility:'Visibility',uvIndex:'UV index',sunrise:'Sunrise',sunset:'Sunset',currentTemperature:'Current temperature',feelsLike:'Feels like',high:'High',moderate:'Moderate',low:'Low',extreme:'Extreme',noResults:'No results',notAvailable:'Not available',installed:'Meteo AI is installed',alreadyInstalled:'Meteo AI is already installed on this device.',installStarted:'Installation started. Thank you!',installComplete:'Meteo AI was installed successfully.',linkCopied:'Link copied. You can paste it on social media.',geoDenied:'Location access was denied.',geoUnavailable:'Location is unavailable.',geoTimeout:'The location request timed out.',geoError:'Unable to detect your location.',favourableOutdoor:'Favourable conditions for outdoor activities.',privacy:'Privacy',cookies:'Cookies',terms:'Terms',backWeather:'Back to weather',all:'All',events:'Events',notifications:'Notifications',active:'Active',blocked:'Blocked',minutesAgo:'{count} min ago',hoursAgo:'{count} hours ago',daysAgo:'{count} days ago',sourcesAvailable:'{available} of {total} sources available',eventsReceived:'{events} events received from {sources} sources',distanceFrom:'{distance} from {place}',languageChanged:'Language set to {language}'},
    fr:{language:'Langue',languageSelector:'Sélectionner la langue',location:'Localité',today:"Aujourd’hui",tomorrow:'Demain',dayAfterTomorrow:'Après-demain',forecast:'Prévisions',sea:'Mer',worldLive:'Monde en direct',install:'Installer',installApp:"Installer l’application",favorites:'Favoris',sections:'Toutes les sections',search:'Rechercher',searchPlace:'Rechercher une localité',usePosition:'Utiliser ma position',changeTheme:'Changer de thème',openMenu:'Ouvrir le menu',close:'Fermer',loading:'Chargement…',retry:'Réessayer',update:'Actualiser',savePlace:'Enregistrer la localité',share:'Partager',rain:'Pluie',wind:'Vent',humidity:'Humidité',pressure:'Pression',visibility:'Visibilité',uvIndex:'Indice UV',sunrise:'Lever du soleil',sunset:'Coucher du soleil',currentTemperature:'Température actuelle',feelsLike:'Ressentie',high:'Élevée',moderate:'Modérée',low:'Faible',extreme:'Extrême',noResults:'Aucun résultat',notAvailable:'Indisponible',installed:'Meteo AI est installée',alreadyInstalled:'Meteo AI est déjà installée sur cet appareil.',installStarted:'Installation lancée. Merci !',installComplete:'Meteo AI a été installée correctement.',linkCopied:'Lien copié. Vous pouvez le coller sur les réseaux sociaux.',geoDenied:"L’accès à la position a été refusé.",geoUnavailable:'Position indisponible.',geoTimeout:'La demande de position a expiré.',geoError:'Impossible de détecter la position.',favourableOutdoor:'Conditions favorables aux activités en plein air.',privacy:'Confidentialité',cookies:'Cookies',terms:"Conditions d’utilisation",backWeather:'Retour à la météo',all:'Tous',events:'Événements',notifications:'Notifications',active:'Actives',blocked:'Bloquées',minutesAgo:'il y a {count} min',hoursAgo:'il y a {count} h',daysAgo:'il y a {count} jours',sourcesAvailable:'{available} sources disponibles sur {total}',eventsReceived:'{events} événements reçus de {sources} sources',distanceFrom:'{distance} de {place}',languageChanged:'Langue définie sur {language}'},
    'pt-BR':{language:'Idioma',languageSelector:'Selecionar idioma',location:'Local',today:'Hoje',tomorrow:'Amanhã',dayAfterTomorrow:'Depois de amanhã',forecast:'Previsão',sea:'Mar',worldLive:'Mundo ao vivo',install:'Instalar',installApp:'Instalar app',favorites:'Favoritos',sections:'Todas as seções',search:'Buscar',searchPlace:'Buscar um local',usePosition:'Usar minha localização',changeTheme:'Mudar tema',openMenu:'Abrir menu',close:'Fechar',loading:'Carregando…',retry:'Tentar novamente',update:'Atualizar',savePlace:'Salvar local',share:'Compartilhar',rain:'Chuva',wind:'Vento',humidity:'Umidade',pressure:'Pressão',visibility:'Visibilidade',uvIndex:'Índice UV',sunrise:'Nascer do sol',sunset:'Pôr do sol',currentTemperature:'Temperatura atual',feelsLike:'Sensação',high:'Alta',moderate:'Moderada',low:'Baixa',extreme:'Extrema',noResults:'Nenhum resultado',notAvailable:'Indisponível',installed:'Meteo AI está instalado',alreadyInstalled:'Meteo AI já está instalado neste dispositivo.',installStarted:'Instalação iniciada. Obrigado!',installComplete:'Meteo AI foi instalado corretamente.',linkCopied:'Link copiado. Você pode colá-lo nas redes sociais.',geoDenied:'O acesso à localização foi negado.',geoUnavailable:'Localização indisponível.',geoTimeout:'A solicitação de localização expirou.',geoError:'Não foi possível detectar a localização.',favourableOutdoor:'Condições favoráveis para atividades ao ar livre.',privacy:'Privacidade',cookies:'Cookies',terms:'Termos',backWeather:'Voltar à previsão',all:'Todos',events:'Eventos',notifications:'Notificações',active:'Ativas',blocked:'Bloqueadas',minutesAgo:'há {count} min',hoursAgo:'há {count} horas',daysAgo:'há {count} dias',sourcesAvailable:'{available} de {total} fontes disponíveis',eventsReceived:'{events} eventos recebidos de {sources} fontes',distanceFrom:'{distance} de {place}',languageChanged:'Idioma definido como {language}'}
  };
  messages.es={language:'Idioma',languageSelector:'Seleccionar idioma',location:'Localidad',today:'Hoy',tomorrow:'Mañana',dayAfterTomorrow:'Pasado mañana',forecast:'Previsión',sea:'Mar',worldLive:'Mundo en directo',install:'Instalar',installApp:'Instalar aplicación',favorites:'Favoritos',sections:'Todas las secciones',search:'Buscar',searchPlace:'Buscar una localidad',usePosition:'Usar mi ubicación',changeTheme:'Cambiar tema',openMenu:'Abrir menú',close:'Cerrar',loading:'Cargando…',retry:'Reintentar',update:'Actualizar',savePlace:'Guardar localidad',share:'Compartir',rain:'Lluvia',wind:'Viento',humidity:'Humedad',pressure:'Presión',visibility:'Visibilidad',uvIndex:'Índice UV',sunrise:'Amanecer',sunset:'Atardecer',currentTemperature:'Temperatura actual',feelsLike:'Sensación',high:'Alta',moderate:'Moderada',low:'Baja',extreme:'Extrema',noResults:'Sin resultados',notAvailable:'No disponible',installed:'Meteo AI está instalada',alreadyInstalled:'Meteo AI ya está instalada en este dispositivo.',installStarted:'Instalación iniciada. ¡Gracias!',installComplete:'Meteo AI se ha instalado correctamente.',linkCopied:'Enlace copiado. Puedes pegarlo en las redes sociales.',geoDenied:'Se ha denegado el acceso a la ubicación.',geoUnavailable:'Ubicación no disponible.',geoTimeout:'La solicitud de ubicación ha caducado.',geoError:'No se ha podido detectar la ubicación.',favourableOutdoor:'Condiciones favorables para actividades al aire libre.',privacy:'Privacidad',cookies:'Cookies',terms:'Términos',backWeather:'Volver al tiempo',all:'Todos',events:'Eventos',notifications:'Notificaciones',active:'Activas',blocked:'Bloqueadas',minutesAgo:'hace {count} min',hoursAgo:'hace {count} horas',daysAgo:'hace {count} días',sourcesAvailable:'{available} de {total} fuentes disponibles',eventsReceived:'{events} eventos recibidos de {sources} fuentes',distanceFrom:'{distance} de {place}',languageChanged:'Idioma cambiado a {language}'};

  // Longer phrases are intentionally applied before individual terms. This also
  // localises messages assembled by the existing weather modules at runtime.
  const lexicons={
    en:{
      'Il meteo reale, reso semplice dall’intelligenza artificiale.':'Real weather, made simple by artificial intelligence.','Il meteo reale, reso semplice.':'Real weather, made simple.','Non guardare soltanto che tempo farà. Capiscilo.':'Don’t just look at what the weather will be. Understand it.','Meteo, qualità dell’aria, mappe e consigli personali in un’unica esperienza semplice. Cerca qualsiasi luogo nel mondo.':'Weather, air quality, maps and personal advice in one simple experience. Search for any place in the world.','Condizioni favorevoli per attività all’aperto.':'Favourable conditions for outdoor activities.','Tutte le funzioni incluse sono accessibili senza piano a pagamento.':'All included features are available without a paid plan.','Nessuna domanda viene inviata a servizi AI esterni.':'No question is sent to external AI services.','Dati modellistici indicativi':'Indicative model data','non sostituisce':'does not replace','non sostituiscono':'do not replace','bollettini ufficiali':'official bulletins','autorità locali':'local authorities','Caricamento dati reali':'Loading real data','Analisi in corso':'Analysis in progress','Analisi automatica':'Automatic analysis','Confronto in corso':'Comparison in progress','momentaneamente non disponibile':'temporarily unavailable','momentaneamente non raggiungibili':'temporarily unreachable','Località non trovata':'Location not found','Controlla il nome e riprova':'Check the name and try again','Nessun evento con questi filtri':'No events match these filters','Prova un periodo più ampio oppure seleziona “Tutti”.':'Try a longer period or select “All”.','Quanto è affidabile la previsione?':'How reliable is the forecast?','La giornata in breve':'The day at a glance','Situazioni da tenere sotto controllo':'Situations to keep an eye on','Oggi, ora per ora':'Today, hour by hour','Trova la tua Finestra Meteo':'Find your Weather Window','Un meteo diverso per ogni attività e professione':'Different weather guidance for every activity and profession','Salute e astronomia':'Health and astronomy','Direzione, intensità, raffiche e momenti più favorevoli.':'Direction, intensity, gusts and the best times.','Confronta due località':'Compare two locations','Esplora il territorio':'Explore the area','Come cambierà il mare':'How the sea will change','Mari della nazione selezionata':'Seas of the selected country','Esplora le condizioni in un corridoio geografico':'Explore conditions along a geographic corridor','Chiedi a Meteo AI':'Ask Meteo AI','Prepara il viaggio con il meteo':'Prepare your trip with the weather','Intelligente sul tuo dispositivo.':'Smart on your device.','Tutto ciò che serve per capire il meteo di oggi e dei prossimi giorni':'Everything you need to understand today’s weather and the days ahead','Mappa mondiale degli eventi naturali':'World map of natural events','Probabilità, criticità e impatto non sono la stessa cosa.':'Probability, severity and impact are not the same thing.','Dati verificabili, spiegazioni semplici.':'Verifiable data, simple explanations.','Installa gratuitamente Meteo AI':'Install Meteo AI for free','Porta Meteo AI sulla schermata Home.':'Put Meteo AI on your Home screen.','Scegli il tuo dispositivo':'Choose your device','Il meteo che ti serve, a un tocco.':'The weather you need, one tap away.','Nessuna registrazione':'No registration','Previsioni fino a 14 giorni':'Forecasts up to 14 days','Tutte le sezioni':'All sections','Condizioni attuali':'Current conditions','Previsioni 14 giorni':'14-day forecast','Confronto storico':'Historical comparison','Avvisi previsionali':'Forecast notices','Situazione dei venti':'Wind conditions','Situazione del mare':'Sea conditions','Atlante dei mari':'Sea atlas','Confronto fra porti':'Port comparison','Mappa della località':'Location map','Aria e astronomia':'Air and astronomy','Strumenti personali':'Personal tools','Profili specializzati':'Specialised profiles','Assistenti Meteo AI':'Meteo AI assistants','Condividi una località':'Share a location','Località selezionata':'Selected location','Accesso rapido':'Quick access','Previsioni per i prossimi due giorni':'Forecast for the next two days','Prossimi due giorni':'Next two days','Vedi 14 giorni':'View 14 days','Finestra Meteo':'Weather Window','Scegli attività':'Choose an activity','Passeggiata':'Walk','Corsa':'Run','Bicicletta':'Cycling','Bucato':'Laundry','Evento all’aperto':'Outdoor event','Pesca':'Fishing','Vela':'Sailing','Bambini':'Children','Animali':'Pets','Droni':'Drones','Agricoltura':'Agriculture','Edilizia':'Construction','Escursionismo':'Hiking','Fotografia':'Photography','Confronto storico climatico':'Historical climate comparison','Oggi rispetto alla stessa data del passato':'Today compared with the same date in the past','Aggiorna confronto':'Update comparison','Media della stessa data':'Average for the same date','Scostamento di oggi':'Today’s difference','Qualità dell’aria':'Air quality','Attività consigliate':'Recommended activities','Provenienza':'Direction','Velocità':'Speed','Raffiche':'Gusts','Scala Beaufort':'Beaufort scale','Finestra più tranquilla':'Calmest window','Cerca una seconda città':'Search for a second city','Aggiorna analisi':'Update analysis','Temperatura acqua':'Water temperature','Altezza onde':'Wave height','Periodo onde':'Wave period','Energia del moto ondoso':'Wave energy','Punto marino':'Marine point','Prossimi giorni':'Next days','Nazione rilevata':'Detected country','Aggiorna dati':'Update data','Porto di partenza':'Departure port','Porto di arrivo':'Arrival port','Confronta il corridoio':'Compare corridor','Non usare per navigare':'Do not use for navigation','Motore intelligente locale':'Local smart engine','Mi serve l’ombrello?':'Will I need an umbrella?','Quando andare al mare?':'When should I go to the beach?','Posso fare sport?':'Can I exercise?','Assistente viaggio':'Travel assistant','Crea il piano':'Create plan','Analisi locale':'Local analysis','Nessun abbonamento':'No subscription','Preferiti privati':'Private favourites','Architettura leggera':'Lightweight architecture','Le tue località':'Your locations','Cambia località':'Change location','Mostra questa località':'Show this location','Privacy essenziale':'Essential privacy','Leggi l’informativa':'Read the privacy policy','Ho capito':'Got it','Torna al meteo':'Back to weather','Monitoraggio mondiale':'Global monitoring','Località di riferimento':'Reference location','Eventi visibili':'Visible events','Alta criticità':'High severity','Più vicino':'Nearest','Aggiornamento':'Updated','Filtri degli eventi':'Event filters','Terremoti':'Earthquakes','Cicloni':'Cyclones','Vulcani':'Volcanoes','Incendi':'Wildfires','Alluvioni':'Floods','Altri':'Other','Periodo':'Period','ore':'hours','giorni':'days','Sorveglianza':'Watchlist','Vicino alla località':'Near location','Eventi nelle aree sorvegliate':'Events in watched areas','Gestisci località':'Manage locations','Più rilevanti per te':'Most relevant to you','Più recenti':'Most recent','Maggiore criticità':'Highest severity','Più vicini':'Nearest','Raccolgo gli eventi':'Collecting events','Probabilità ufficiale':'Official probability','Criticità':'Severity','Impatto sulla località':'Impact on location','Fonti e limiti':'Sources and limitations','Località sorvegliate':'Watched locations','Notifiche del browser':'Browser notifications','Attiva notifiche':'Enable notifications','Raggio':'Radius','Criticità minima':'Minimum severity','Tipo di evento':'Event type','Tutti gli eventi':'All events','Usa località meteo':'Use weather location','Posizione dispositivo':'Device location','Aggiungi sorveglianza':'Add watch','Regole attive':'Active rules','Vantaggi dell’installazione':'Installation benefits','Avvio rapido':'Quick launch','Schermo completo':'Full screen','Istruzioni':'Instructions','Apri il meteo':'Open weather','Installa adesso':'Install now','gratuita':'free','nessun account':'no account','Cerca città, località o CAP':'Search city, location or postcode','Cerca una città, un comune o una località':'Search for a city, town or location','Dati reali':'Real data','Previsioni globali':'Global forecasts','Analisi AI':'AI analysis','Installa gratis':'Install free','Come funziona':'How it works','Ora':'Now','Caricamento':'Loading','Percepita':'Feels like','Umidità':'Humidity','Pressione':'Pressure','Visibilità':'Visibility','Pioggia':'Rain','Vento':'Wind','Mare':'Sea','Oggi':'Today','Domani':'Tomorrow','Dopodomani':'The day after tomorrow','Previsioni':'Forecast','Località':'Location','Cerca':'Search','Installa':'Install','Preferiti':'Favourites','Sezioni':'Sections','Strumenti':'Tools','Salva':'Save','Condividi':'Share','Chiudi':'Close','Riprova':'Try again','Aggiorna':'Update','Disponibile':'Available','Non disponibile':'Not available','Italia':'Italy','mila km':'thousand km','min fa':'min ago','ore fa':'hours ago','giorni fa':'days ago','da criticità':'from severity','impatto AI':'AI impact','Distanza':'Distance','Informazioni disponibili':'Available information','Apri la fonte ufficiale':'Open official source','Rimuovi':'Remove','Attiva':'Enable','attive':'active','bloccate':'blocked','fonte':'source','fonti':'sources','evento':'event','eventi':'events','giornata':'day','settimana':'week','mese':'month','anno':'year','anni':'years','giorno':'day','meteo':'weather','corrente':'current','onde':'waves','temperatura':'temperature','direzione':'direction','analisi':'analysis','dati':'data','località':'location','paese':'country','nazione':'country','costa':'coast','coste':'coasts','mare':'sea','pioggia':'rain','vento':'wind','consigliato':'recommended','favorevole':'favourable','favorevoli':'favourable','debole':'light','forte':'strong','sereno':'clear','nuvoloso':'cloudy','nebbia':'fog','neve':'snow','temporale':'thunderstorm','rovesci':'showers','lieve':'light','intensa':'heavy','intenso':'heavy','variabile':'variable'},
    fr:{
      'Il meteo reale, reso semplice dall’intelligenza artificiale.':"La météo réelle, simplifiée par l’intelligence artificielle.",'Il meteo reale, reso semplice.':'La météo réelle, en toute simplicité.','Non guardare soltanto che tempo farà. Capiscilo.':'Ne vous contentez pas de regarder le temps qu’il fera. Comprenez-le.','Condizioni favorevoli per attività all’aperto.':'Conditions favorables aux activités en plein air.','Dati modellistici indicativi':'Données de modèle indicatives','non sostituisce':'ne remplace pas','non sostituiscono':'ne remplacent pas','bollettini ufficiali':'bulletins officiels','autorità locali':'autorités locales','Caricamento dati reali':'Chargement des données réelles','Analisi in corso':'Analyse en cours','Analisi automatica':'Analyse automatique','Confronto in corso':'Comparaison en cours','momentaneamente non disponibile':'temporairement indisponible','Località non trovata':'Localité introuvable','Controlla il nome e riprova':'Vérifiez le nom et réessayez','Nessun evento con questi filtri':'Aucun événement avec ces filtres','Quanto è affidabile la previsione ?':'Quelle est la fiabilité des prévisions ?','La giornata in breve':'La journée en bref','Situazioni da tenere sotto controllo':'Situations à surveiller','Oggi, ora per ora':"Aujourd’hui, heure par heure",'Trova la tua Finestra Meteo':'Trouvez votre Fenêtre Météo','Un meteo diverso per ogni attività e professione':'Une météo adaptée à chaque activité et profession','Salute e astronomia':'Santé et astronomie','Confronta due località':'Comparer deux localités','Esplora il territorio':'Explorer la région','Come cambierà il mare':'Évolution de la mer','Mari della nazione selezionata':'Mers du pays sélectionné','Chiedi a Meteo AI':'Demandez à Meteo AI','Prepara il viaggio con il meteo':'Préparez votre voyage avec la météo','Intelligente sul tuo dispositivo.':'Intelligente sur votre appareil.','Mappa mondiale degli eventi naturali':'Carte mondiale des événements naturels','Probabilità, criticità e impatto non sono la stessa cosa.':'Probabilité, criticité et impact ne sont pas la même chose.','Dati verificabili, spiegazioni semplici.':'Données vérifiables, explications simples.','Installa gratuitamente Meteo AI':'Installez Meteo AI gratuitement','Porta Meteo AI sulla schermata Home.':"Ajoutez Meteo AI à l’écran d’accueil.",'Scegli il tuo dispositivo':'Choisissez votre appareil','Il meteo che ti serve, a un tocco.':'La météo dont vous avez besoin, en un geste.','Nessuna registrazione':'Sans inscription','Previsioni fino a 14 giorni':"Prévisions jusqu’à 14 jours",'Tutte le sezioni':'Toutes les sections','Condizioni attuali':'Conditions actuelles','Previsioni 14 giorni':'Prévisions à 14 jours','Confronto storico':'Comparaison historique','Avvisi previsionali':'Avis prévisionnels','Situazione dei venti':'Conditions de vent','Situazione del mare':'État de la mer','Atlante dei mari':'Atlas des mers','Confronto fra porti':'Comparaison des ports','Mappa della località':'Carte de la localité','Aria e astronomia':'Air et astronomie','Strumenti personali':'Outils personnels','Profili specializzati':'Profils spécialisés','Assistenti Meteo AI':'Assistants Meteo AI','Condividi una località':'Partager une localité','Località selezionata':'Localité sélectionnée','Accesso rapido':'Accès rapide','Prossimi due giorni':'Deux prochains jours','Finestra Meteo':'Fenêtre Météo','Scegli attività':'Choisir une activité','Passeggiata':'Promenade','Corsa':'Course','Bicicletta':'Vélo','Bucato':'Lessive','Evento all’aperto':'Événement en plein air','Pesca':'Pêche','Vela':'Voile','Bambini':'Enfants','Animali':'Animaux','Droni':'Drones','Agricoltura':'Agriculture','Edilizia':'Bâtiment','Escursionismo':'Randonnée','Fotografia':'Photographie','Qualità dell’aria':"Qualité de l’air",'Attività consigliate':'Activités recommandées','Provenienza':'Direction','Velocità':'Vitesse','Raffiche':'Rafales','Scala Beaufort':'Échelle de Beaufort','Finestra più tranquilla':'Créneau le plus calme','Cerca una seconda città':'Rechercher une deuxième ville','Aggiorna analisi':"Actualiser l’analyse",'Temperatura acqua':"Température de l’eau",'Altezza onde':'Hauteur des vagues','Periodo onde':'Période des vagues','Corrente':'Courant','Prossimi giorni':'Prochains jours','Nazione rilevata':'Pays détecté','Aggiorna dati':'Actualiser les données','Porto di partenza':'Port de départ','Porto di arrivo':"Port d’arrivée",'Confronta il corridoio':'Comparer le corridor','Non usare per navigare':'Ne pas utiliser pour naviguer','Motore intelligente locale':'Moteur intelligent local','Mi serve l’ombrello ?':"Ai-je besoin d’un parapluie ?",'Quando andare al mare ?':'Quand aller à la plage ?','Posso fare sport ?':'Puis-je faire du sport ?','Assistente viaggio':'Assistant de voyage','Crea il piano':'Créer le programme','Analisi locale':'Analyse locale','Nessun abbonamento':'Sans abonnement','Preferiti privati':'Favoris privés','Architettura leggera':'Architecture légère','Le tue località':'Vos localités','Cambia località':'Changer de localité','Mostra questa località':'Afficher cette localité','Privacy essenziale':'Confidentialité essentielle','Leggi l’informativa':'Lire la politique','Ho capito':'Compris','Torna al meteo':'Retour à la météo','Monitoraggio mondiale':'Surveillance mondiale','Località di riferimento':'Localité de référence','Eventi visibili':'Événements visibles','Alta criticità':'Criticité élevée','Più vicino':'Le plus proche','Aggiornamento':'Mise à jour','Filtri degli eventi':'Filtres des événements','Terremoti':'Séismes','Cicloni':'Cyclones','Vulcani':'Volcans','Incendi':'Incendies','Alluvioni':'Inondations','Altri':'Autres','Periodo':'Période','Sorveglianza':'Surveillance','Vicino alla località':'Près de la localité','Più rilevanti per te':'Les plus pertinents','Più recenti':'Les plus récents','Maggiore criticità':'Criticité maximale','Più vicini':'Les plus proches','Raccolgo gli eventi':'Collecte des événements','Probabilità ufficiale':'Probabilité officielle','Criticità':'Criticité','Impatto sulla località':'Impact sur la localité','Fonti e limiti':'Sources et limites','Notifiche del browser':'Notifications du navigateur','Attiva notifiche':'Activer les notifications','Raggio':'Rayon','Tipo di evento':"Type d’événement",'Tutti gli eventi':'Tous les événements','Posizione dispositivo':"Position de l’appareil",'Aggiungi sorveglianza':'Ajouter une surveillance','Regole attive':'Règles actives','Vantaggi dell’installazione':"Avantages de l’installation",'Avvio rapido':'Démarrage rapide','Schermo completo':'Plein écran','Istruzioni':'Instructions','Apri il meteo':'Ouvrir la météo','Installa adesso':'Installer maintenant','Cerca città, località o CAP':'Rechercher une ville, une localité ou un code postal','Dati reali':'Données réelles','Previsioni globali':'Prévisions mondiales','Analisi AI':'Analyse IA','Come funziona':'Comment ça marche','Ora':'Maintenant','Caricamento':'Chargement','Percepita':'Ressentie','Umidità':'Humidité','Pressione':'Pression','Visibilità':'Visibilité','Pioggia':'Pluie','Vento':'Vent','Mare':'Mer','Oggi':"Aujourd’hui",'Domani':'Demain','Dopodomani':'Après-demain','Previsioni':'Prévisions','Località':'Localité','Cerca':'Rechercher','Installa':'Installer','Preferiti':'Favoris','Sezioni':'Sections','Strumenti':'Outils','Salva':'Enregistrer','Condividi':'Partager','Chiudi':'Fermer','Riprova':'Réessayer','Aggiorna':'Actualiser','Italia':'Italie','min fa':'min auparavant','ore fa':'h auparavant','giorni fa':'jours auparavant','impatto AI':'impact IA','Distanza':'Distance','Informazioni disponibili':'Informations disponibles','Apri la fonte ufficiale':'Ouvrir la source officielle','Rimuovi':'Supprimer','fonte':'source','fonti':'sources','evento':'événement','eventi':'événements','giorno':'jour','giorni':'jours','meteo':'météo','corrente':'courant','onde':'vagues','temperatura':'température','direzione':'direction','analisi':'analyse','dati':'données','località':'localité','paese':'pays','nazione':'pays','costa':'côte','coste':'côtes','mare':'mer','pioggia':'pluie','vento':'vent','consigliato':'recommandé','favorevole':'favorable','favorevoli':'favorables','debole':'faible','forte':'fort','sereno':'dégagé','nuvoloso':'nuageux','nebbia':'brouillard','neve':'neige','temporale':'orage','rovesci':'averses','lieve':'faible','intensa':'forte','intenso':'fort','variabile':'variable'},
    'pt-BR':{
      'Il meteo reale, reso semplice dall’intelligenza artificiale.':'O clima real, simplificado pela inteligência artificial.','Il meteo reale, reso semplice.':'O clima real, de forma simples.','Non guardare soltanto che tempo farà. Capiscilo.':'Não veja apenas como estará o tempo. Entenda-o.','Condizioni favorevoli per attività all’aperto.':'Condições favoráveis para atividades ao ar livre.','Dati modellistici indicativi':'Dados de modelo indicativos','non sostituisce':'não substitui','non sostituiscono':'não substituem','bollettini ufficiali':'boletins oficiais','autorità locali':'autoridades locais','Caricamento dati reali':'Carregando dados reais','Analisi in corso':'Análise em andamento','Analisi automatica':'Análise automática','Confronto in corso':'Comparação em andamento','momentaneamente non disponibile':'temporariamente indisponível','Località non trovata':'Local não encontrado','Controlla il nome e riprova':'Verifique o nome e tente novamente','Nessun evento con questi filtri':'Nenhum evento com estes filtros','Quanto è affidabile la previsione?':'Qual é a confiabilidade da previsão?','La giornata in breve':'Resumo do dia','Situazioni da tenere sotto controllo':'Situações para monitorar','Oggi, ora per ora':'Hoje, hora a hora','Trova la tua Finestra Meteo':'Encontre sua Janela do Tempo','Un meteo diverso per ogni attività e professione':'Uma previsão diferente para cada atividade e profissão','Salute e astronomia':'Saúde e astronomia','Confronta due località':'Compare dois locais','Esplora il territorio':'Explore a região','Come cambierà il mare':'Como o mar vai mudar','Mari della nazione selezionata':'Mares do país selecionado','Chiedi a Meteo AI':'Pergunte ao Meteo AI','Prepara il viaggio con il meteo':'Prepare sua viagem com a previsão','Intelligente sul tuo dispositivo.':'Inteligente no seu dispositivo.','Mappa mondiale degli eventi naturali':'Mapa mundial de eventos naturais','Probabilità, criticità e impatto non sono la stessa cosa.':'Probabilidade, gravidade e impacto não são a mesma coisa.','Dati verificabili, spiegazioni semplici.':'Dados verificáveis, explicações simples.','Installa gratuitamente Meteo AI':'Instale o Meteo AI gratuitamente','Porta Meteo AI sulla schermata Home.':'Coloque o Meteo AI na tela inicial.','Scegli il tuo dispositivo':'Escolha seu dispositivo','Il meteo che ti serve, a un tocco.':'A previsão de que você precisa, a um toque.','Nessuna registrazione':'Sem cadastro','Previsioni fino a 14 giorni':'Previsão de até 14 dias','Tutte le sezioni':'Todas as seções','Condizioni attuali':'Condições atuais','Previsioni 14 giorni':'Previsão de 14 dias','Confronto storico':'Comparação histórica','Avvisi previsionali':'Avisos de previsão','Situazione dei venti':'Condições do vento','Situazione del mare':'Condições do mar','Atlante dei mari':'Atlas dos mares','Confronto fra porti':'Comparação entre portos','Mappa della località':'Mapa do local','Aria e astronomia':'Ar e astronomia','Strumenti personali':'Ferramentas pessoais','Profili specializzati':'Perfis especializados','Assistenti Meteo AI':'Assistentes Meteo AI','Condividi una località':'Compartilhar um local','Località selezionata':'Local selecionado','Accesso rapido':'Acesso rápido','Prossimi due giorni':'Próximos dois dias','Finestra Meteo':'Janela do Tempo','Scegli attività':'Escolha uma atividade','Passeggiata':'Caminhada','Corsa':'Corrida','Bicicletta':'Bicicleta','Bucato':'Lavanderia','Evento all’aperto':'Evento ao ar livre','Pesca':'Pesca','Vela':'Vela','Bambini':'Crianças','Animali':'Animais','Droni':'Drones','Agricoltura':'Agricultura','Edilizia':'Construção','Escursionismo':'Trilha','Fotografia':'Fotografia','Qualità dell’aria':'Qualidade do ar','Attività consigliate':'Atividades recomendadas','Provenienza':'Direção','Velocità':'Velocidade','Raffiche':'Rajadas','Scala Beaufort':'Escala Beaufort','Finestra più tranquilla':'Janela mais tranquila','Cerca una seconda città':'Buscar uma segunda cidade','Aggiorna analisi':'Atualizar análise','Temperatura acqua':'Temperatura da água','Altezza onde':'Altura das ondas','Periodo onde':'Período das ondas','Corrente':'Corrente','Prossimi giorni':'Próximos dias','Nazione rilevata':'País detectado','Aggiorna dati':'Atualizar dados','Porto di partenza':'Porto de partida','Porto di arrivo':'Porto de chegada','Confronta il corridoio':'Comparar corredor','Non usare per navigare':'Não use para navegação','Motore intelligente locale':'Motor inteligente local','Mi serve l’ombrello?':'Vou precisar de guarda-chuva?','Quando andare al mare?':'Quando ir à praia?','Posso fare sport?':'Posso praticar esportes?','Assistente viaggio':'Assistente de viagem','Crea il piano':'Criar plano','Analisi locale':'Análise local','Nessun abbonamento':'Sem assinatura','Preferiti privati':'Favoritos privados','Architettura leggera':'Arquitetura leve','Le tue località':'Seus locais','Cambia località':'Alterar local','Mostra questa località':'Mostrar este local','Privacy essenziale':'Privacidade essencial','Leggi l’informativa':'Ler política','Ho capito':'Entendi','Torna al meteo':'Voltar à previsão','Monitoraggio mondiale':'Monitoramento mundial','Località di riferimento':'Local de referência','Eventi visibili':'Eventos visíveis','Alta criticità':'Alta gravidade','Più vicino':'Mais próximo','Aggiornamento':'Atualização','Filtri degli eventi':'Filtros de eventos','Terremoti':'Terremotos','Cicloni':'Ciclones','Vulcani':'Vulcões','Incendi':'Incêndios','Alluvioni':'Inundações','Altri':'Outros','Periodo':'Período','Sorveglianza':'Monitoramento','Vicino alla località':'Perto do local','Più rilevanti per te':'Mais relevantes para você','Più recenti':'Mais recentes','Maggiore criticità':'Maior gravidade','Più vicini':'Mais próximos','Raccolgo gli eventi':'Coletando eventos','Probabilità ufficiale':'Probabilidade oficial','Criticità':'Gravidade','Impatto sulla località':'Impacto no local','Fonti e limiti':'Fontes e limitações','Notifiche del browser':'Notificações do navegador','Attiva notifiche':'Ativar notificações','Raggio':'Raio','Tipo di evento':'Tipo de evento','Tutti gli eventi':'Todos os eventos','Posizione dispositivo':'Localização do dispositivo','Aggiungi sorveglianza':'Adicionar monitoramento','Regole attive':'Regras ativas','Vantaggi dell’installazione':'Vantagens da instalação','Avvio rapido':'Abertura rápida','Schermo completo':'Tela cheia','Istruzioni':'Instruções','Apri il meteo':'Abrir previsão','Installa adesso':'Instalar agora','Cerca città, località o CAP':'Buscar cidade, local ou CEP','Dati reali':'Dados reais','Previsioni globali':'Previsões globais','Analisi AI':'Análise de IA','Come funziona':'Como funciona','Ora':'Agora','Caricamento':'Carregando','Percepita':'Sensação','Umidità':'Umidade','Pressione':'Pressão','Visibilità':'Visibilidade','Pioggia':'Chuva','Vento':'Vento','Mare':'Mar','Oggi':'Hoje','Domani':'Amanhã','Dopodomani':'Depois de amanhã','Previsioni':'Previsão','Località':'Local','Cerca':'Buscar','Installa':'Instalar','Preferiti':'Favoritos','Sezioni':'Seções','Strumenti':'Ferramentas','Salva':'Salvar','Condividi':'Compartilhar','Chiudi':'Fechar','Riprova':'Tentar novamente','Aggiorna':'Atualizar','Italia':'Itália','min fa':'min atrás','ore fa':'horas atrás','giorni fa':'dias atrás','impatto AI':'impacto de IA','Distanza':'Distância','Informazioni disponibili':'Informações disponíveis','Apri la fonte ufficiale':'Abrir fonte oficial','Rimuovi':'Remover','fonte':'fonte','fonti':'fontes','evento':'evento','eventi':'eventos','giorno':'dia','giorni':'dias','meteo':'previsão','corrente':'corrente','onde':'ondas','temperatura':'temperatura','direzione':'direção','analisi':'análise','dati':'dados','località':'local','paese':'país','nazione':'país','costa':'costa','coste':'costas','mare':'mar','pioggia':'chuva','vento':'vento','consigliato':'recomendado','favorevole':'favorável','favorevoli':'favoráveis','debole':'fraco','forte':'forte','sereno':'céu limpo','nuvoloso':'nublado','nebbia':'neblina','neve':'neve','temporale':'tempestade','rovesci':'pancadas','lieve':'leve','intensa':'forte','intenso':'forte','variabile':'variável'}
  };
  lexicons.es={
    'Il meteo reale, reso semplice dall’intelligenza artificiale.':'El tiempo real, simplificado por la inteligencia artificial.',
    'Il meteo reale, reso semplice.':'El tiempo real, de forma sencilla.',
    'Non guardare soltanto che tempo farà. Capiscilo.':'No te limites a mirar qué tiempo hará. Entiéndelo.',
    'Meteo, qualità dell’aria, mappe e consigli personali in un’unica esperienza semplice. Cerca qualsiasi luogo nel mondo.':'Tiempo, calidad del aire, mapas y consejos personales en una experiencia sencilla. Busca cualquier lugar del mundo.',
    'Condizioni favorevoli per attività all’aperto.':'Condiciones favorables para actividades al aire libre.',
    'Tutte le funzioni incluse sono accessibili senza piano a pagamento.':'Todas las funciones incluidas están disponibles sin un plan de pago.',
    'Nessuna domanda viene inviata a servizi AI esterni.':'Ninguna pregunta se envía a servicios externos de IA.',
    'Dati modellistici indicativi':'Datos de modelos orientativos','non sostituisce':'no sustituye','non sostituiscono':'no sustituyen','bollettini ufficiali':'boletines oficiales','autorità locali':'autoridades locales',
    'Caricamento dati reali':'Cargando datos reales','Analisi in corso':'Análisis en curso','Analisi automatica':'Análisis automático','Confronto in corso':'Comparación en curso',
    'momentaneamente non disponibile':'temporalmente no disponible','momentaneamente non raggiungibili':'temporalmente inaccesibles','Località non trovata':'Localidad no encontrada','Controlla il nome e riprova':'Comprueba el nombre e inténtalo de nuevo',
    'Quanto è affidabile la previsione?':'¿Qué fiabilidad tiene la previsión?','La giornata in breve':'Resumen del día','Situazioni da tenere sotto controllo':'Situaciones que conviene vigilar','Oggi, ora per ora':'Hoy, hora a hora',
    'Trova la tua Finestra Meteo':'Encuentra tu Ventana Meteorológica','Un meteo diverso per ogni attività e professione':'Una previsión distinta para cada actividad y profesión','Salute e astronomia':'Salud y astronomía',
    'Confronta due località':'Compara dos localidades','Esplora il territorio':'Explora la zona','Come cambierà il mare':'Cómo cambiará el mar','Mari della nazione selezionata':'Mares del país seleccionado',
    'Chiedi a Meteo AI':'Pregunta a Meteo AI','Prepara il viaggio con il meteo':'Prepara el viaje con la previsión','Intelligente sul tuo dispositivo.':'Inteligente en tu dispositivo.',
    'Mappa mondiale degli eventi naturali':'Mapa mundial de eventos naturales','Probabilità, criticità e impatto non sono la stessa cosa.':'Probabilidad, gravedad e impacto no son lo mismo.','Dati verificabili, spiegazioni semplici.':'Datos verificables, explicaciones sencillas.',
    'Installa gratuitamente Meteo AI':'Instala Meteo AI gratis','Porta Meteo AI sulla schermata Home.':'Añade Meteo AI a la pantalla de inicio.','Scegli il tuo dispositivo':'Elige tu dispositivo','Il meteo che ti serve, a un tocco.':'El tiempo que necesitas, a un toque.',
    'Nessuna registrazione':'Sin registro','Previsioni fino a 14 giorni':'Previsión de hasta 14 días','Tutte le sezioni':'Todas las secciones','Condizioni attuali':'Condiciones actuales','Previsioni 14 giorni':'Previsión de 14 días',
    'Confronto storico':'Comparación histórica','Avvisi previsionali':'Avisos de previsión','Situazione dei venti':'Situación del viento','Situazione del mare':'Situación del mar','Atlante dei mari':'Atlas de mares','Confronto fra porti':'Comparación de puertos',
    'Mappa della località':'Mapa de la localidad','Aria e astronomia':'Aire y astronomía','Strumenti personali':'Herramientas personales','Profili specializzati':'Perfiles especializados','Assistenti Meteo AI':'Asistentes Meteo AI',
    'Condividi una località':'Comparte una localidad','Località selezionata':'Localidad seleccionada','Accesso rapido':'Acceso rápido','Prossimi due giorni':'Próximos dos días','Finestra Meteo':'Ventana Meteorológica','Scegli attività':'Elige una actividad',
    'Passeggiata':'Paseo','Corsa':'Carrera','Bicicletta':'Bicicleta','Bucato':'Colada','Evento all’aperto':'Evento al aire libre','Pesca':'Pesca','Vela':'Vela','Bambini':'Niños','Animali':'Mascotas','Droni':'Drones','Agricoltura':'Agricultura','Edilizia':'Construcción','Escursionismo':'Senderismo','Fotografia':'Fotografía',
    'Qualità dell’aria':'Calidad del aire','Attività consigliate':'Actividades recomendadas','Provenienza':'Dirección','Velocità':'Velocidad','Raffiche':'Rachas','Scala Beaufort':'Escala Beaufort','Finestra più tranquilla':'Intervalo más tranquilo',
    'Cerca una seconda città':'Busca una segunda ciudad','Aggiorna analisi':'Actualizar análisis','Temperatura acqua':'Temperatura del agua','Altezza onde':'Altura de las olas','Periodo onde':'Periodo de las olas','Prossimi giorni':'Próximos días',
    'Nazione rilevata':'País detectado','Aggiorna dati':'Actualizar datos','Porto di partenza':'Puerto de salida','Porto di arrivo':'Puerto de llegada','Confronta il corridoio':'Comparar corredor','Non usare per navigare':'No usar para navegar',
    'Motore intelligente locale':'Motor inteligente local','Mi serve l’ombrello?':'¿Necesito paraguas?','Quando andare al mare?':'¿Cuándo ir a la playa?','Posso fare sport?':'¿Puedo hacer deporte?','Assistente viaggio':'Asistente de viaje','Crea il piano':'Crear plan',
    'Analisi locale':'Análisis local','Nessun abbonamento':'Sin suscripción','Preferiti privati':'Favoritos privados','Architettura leggera':'Arquitectura ligera','Le tue località':'Tus localidades','Cambia località':'Cambiar localidad','Mostra questa località':'Mostrar esta localidad',
    'Privacy essenziale':'Privacidad esencial','Leggi l’informativa':'Leer la política','Ho capito':'Entendido','Torna al meteo':'Volver al tiempo','Monitoraggio mondiale':'Vigilancia mundial','Località di riferimento':'Localidad de referencia',
    'Eventi visibili':'Eventos visibles','Alta criticità':'Gravedad alta','Più vicino':'Más cercano','Aggiornamento':'Actualización','Filtri degli eventi':'Filtros de eventos','Terremoti':'Terremotos','Cicloni':'Ciclones','Vulcani':'Volcanes','Incendi':'Incendios','Alluvioni':'Inundaciones','Altri':'Otros','Periodo':'Periodo',
    'Sorveglianza':'Vigilancia','Vicino alla località':'Cerca de la localidad','Più rilevanti per te':'Más relevantes para ti','Più recenti':'Más recientes','Maggiore criticità':'Mayor gravedad','Più vicini':'Más cercanos','Raccolgo gli eventi':'Recopilando eventos',
    'Probabilità ufficiale':'Probabilidad oficial','Criticità':'Gravedad','Impatto sulla località':'Impacto en la localidad','Fonti e limiti':'Fuentes y límites','Notifiche del browser':'Notificaciones del navegador','Attiva notifiche':'Activar notificaciones',
    'Raggio':'Radio','Tipo di evento':'Tipo de evento','Tutti gli eventi':'Todos los eventos','Posizione dispositivo':'Ubicación del dispositivo','Aggiungi sorveglianza':'Añadir vigilancia','Regole attive':'Reglas activas',
    'Vantaggi dell’installazione':'Ventajas de la instalación','Avvio rapido':'Inicio rápido','Schermo completo':'Pantalla completa','Istruzioni':'Instrucciones','Apri il meteo':'Abrir previsión','Installa adesso':'Instalar ahora',
    'Cerca città, località o CAP':'Busca una ciudad, localidad o código postal','Cerca una città, un comune o una località':'Busca una ciudad, municipio o localidad','Dati reali':'Datos reales','Previsioni globali':'Previsiones globales','Analisi AI':'Análisis con IA','Come funziona':'Cómo funciona',
    'Ora':'Ahora','Caricamento':'Cargando','Percepita':'Sensación','Umidità':'Humedad','Pressione':'Presión','Visibilità':'Visibilidad','Pioggia':'Lluvia','Vento':'Viento','Mare':'Mar','Oggi':'Hoy','Domani':'Mañana','Dopodomani':'Pasado mañana',
    'Previsioni':'Previsión','Località':'Localidad','Cerca':'Buscar','Installa':'Instalar','Preferiti':'Favoritos','Sezioni':'Secciones','Strumenti':'Herramientas','Salva':'Guardar','Condividi':'Compartir','Chiudi':'Cerrar','Riprova':'Reintentar','Aggiorna':'Actualizar',
    'Disponibile':'Disponible','Non disponibile':'No disponible','Italia':'Italia','min fa':'min atrás','ore fa':'horas atrás','giorni fa':'días atrás','Distanza':'Distancia','Informazioni disponibili':'Información disponible','Apri la fonte ufficiale':'Abrir la fuente oficial','Rimuovi':'Eliminar',
    'fonte':'fuente','fonti':'fuentes','evento':'evento','eventi':'eventos','giorno':'día','giorni':'días','meteo':'tiempo','corrente':'corriente','onde':'olas','temperatura':'temperatura','direzione':'dirección','analisi':'análisis','dati':'datos','località':'localidad','paese':'país','nazione':'país','costa':'costa','coste':'costas','mare':'mar','pioggia':'lluvia','vento':'viento','consigliato':'recomendado','favorevole':'favorable','favorevoli':'favorables','debole':'débil','forte':'fuerte','sereno':'despejado','nuvoloso':'nublado','nebbia':'niebla','neve':'nieve','temporale':'tormenta','rovesci':'chubascos','lieve':'débil','intensa':'intensa','intenso':'intenso','variabile':'variable'
  };

  const supplements={
    en:{'Non guardare soltanto':"Don’t just look",'che tempo farà.':'at what the weather will be.','Capiscilo.':'Understand it.','Cambia':'Change','Popolari:':'Popular:','Analisi locale senza API AI a pagamento':'Local analysis without paid AI APIs','METEO AI SUL TUO DISPOSITIVO':'METEO AI ON YOUR DEVICE','Apri il meteo con un solo tocco':'Open the weather with one tap','Installa gratuitamente Meteo AI sulla schermata Home. Nessun account e nessuno store.':'Install Meteo AI on your Home screen for free. No account and no app store.','Aggiornato alle':'Updated at','Sto analizzando temperatura, vento, precipitazioni e indice UV...':'Analysing temperature, wind, precipitation and UV index...','Meteo AI distingue la qualità indicativa in base alla distanza temporale: più ci si allontana da oggi, maggiore è l’incertezza.':'Meteo AI shows indicative quality based on forecast range: uncertainty increases farther from today.','È una stima orientativa dell’orizzonte temporale, non una probabilità certificata del singolo evento.':'This is an indicative estimate of forecast range, not a certified probability for an individual event.','Non cercare giorno per giorno. Dicci cosa vuoi fare e analizzeremo le prossime 168 ore per trovare i momenti migliori.':'Tell us what you want to do and we will analyse the next 168 hours to find the best times.','Meteo AI applica criteri specifici per sicurezza, comfort e decisioni operative. I dati professionali aggiuntivi vengono caricati soltanto quando servono.':'Meteo AI applies specific criteria for safety, comfort and operational decisions. Additional professional data is loaded only when needed.','ATTIVITÀ E FAMIGLIA':'ACTIVITIES AND FAMILY','MODALITÀ PROFESSIONALI':'PROFESSIONAL MODES','Condizioni discrete':'Fair conditions','Oggi è più caldo della media storica':'Today is warmer than the historical average','Oggi è più fresco della media storica':'Today is cooler than the historical average','Oggi è in linea con la media storica':'Today is close to the historical average','ore di luce':'hours of daylight','Bicicletta, mare e attività esposte richiedono prudenza.':'Cycling, sea activities and exposed activities require caution.','Scopri subito dove troverai le condizioni migliori.':'Find out where conditions will be best.','Scegli una località da confrontare con Messina.':'Choose a location to compare with Messina.','Muovi e ingrandisci la mappa per conoscere il luogo selezionato.':'Pan and zoom the map to explore the selected location.','Onde, temperatura dell’acqua, correnti e momento migliore nelle vicinanze della località selezionata. L’analisi parte automaticamente.':'Waves, water temperature, currents and the best time near the selected location. Analysis starts automatically.','Moto ondoso e corrente risultano contenuti nel punto analizzato.':'Wave motion and current are limited at the analysed point.','La temperatura dell’acqua non determina la sicurezza del mare.':'Water temperature does not determine sea safety.','segue la località meteo':'follows the weather location','Ho capito che non è una rotta né uno strumento di navigazione.':'I understand this is not a route or a navigation tool.','Confronto esplorativo, non navigazione':'Exploratory comparison, not navigation','Sono pronto. Seleziona una domanda oppure scrivine una tua.':'Ready. Select a question or write your own.','Per emergenze consulta sempre le autorità locali.':'For emergencies, always consult local authorities.','PRIVACY E COSTI SOTTO CONTROLLO':'PRIVACY AND COSTS UNDER CONTROL','Le località salvate non lasciano il dispositivo.':'Saved locations never leave the device.','Sito statico, installabile e senza database obbligatorio.':'Static, installable site with no required database.','Il meteo reale, reso semplice dall\'intelligenza artificiale.':'Real weather, made simple by artificial intelligence.','Le previsioni possono variare.':'Forecasts may change.','Accesso rapido ai luoghi che segui.':'Quick access to the places you follow.','La tua scheda meteo personalizzata generata al volo.':'Your personalised weather card, generated instantly.'},
    fr:{'Non guardare soltanto':'Ne regardez pas seulement','che tempo farà.':'le temps qu’il fera.','Capiscilo.':'Comprenez-le.','Cambia':'Changer','Popolari:':'Populaires :','Analisi locale senza API AI a pagamento':'Analyse locale sans API IA payante','METEO AI SUL TUO DISPOSITIVO':'METEO AI SUR VOTRE APPAREIL','Apri il meteo con un solo tocco':'Ouvrez la météo en un geste','Installa gratuitamente Meteo AI sulla schermata Home. Nessun account e nessuno store.':"Installez gratuitement Meteo AI sur l’écran d’accueil. Sans compte ni boutique d’applications.",'Aggiornato alle':'Mis à jour à','Sto analizzando temperatura, vento, precipitazioni e indice UV...':'Analyse de la température, du vent, des précipitations et de l’indice UV...','ATTIVITÀ E FAMIGLIA':'ACTIVITÉS ET FAMILLE','MODALITÀ PROFESSIONALI':'MODES PROFESSIONNELS','Condizioni discrete':'Conditions correctes','ore di luce':'heures de lumière','Scopri subito dove troverai le condizioni migliori.':'Découvrez où les conditions seront les meilleures.','Scegli una località da confrontare con Messina.':'Choisissez une localité à comparer avec Messine.','Muovi e ingrandisci la mappa per conoscere il luogo selezionato.':'Déplacez et zoomez la carte pour explorer la localité sélectionnée.','Sono pronto. Seleziona una domanda oppure scrivine una tua.':'Prêt. Sélectionnez une question ou écrivez la vôtre.','Per emergenze consulta sempre le autorità locali.':'En cas d’urgence, consultez toujours les autorités locales.','PRIVACY E COSTI SOTTO CONTROLLO':'CONFIDENTIALITÉ ET COÛTS MAÎTRISÉS','Le località salvate non lasciano il dispositivo.':'Les localités enregistrées ne quittent jamais l’appareil.','Sito statico, installabile e senza database obbligatorio.':'Site statique et installable, sans base de données obligatoire.','Il meteo reale, reso semplice dall\'intelligenza artificiale.':"La météo réelle, simplifiée par l’intelligence artificielle.",'Le previsioni possono variare.':'Les prévisions peuvent changer.','Accesso rapido ai luoghi che segui.':'Accès rapide aux lieux que vous suivez.','Ho capito che non è una rotta né uno strumento di navigazione.':'Je comprends qu’il ne s’agit ni d’une route ni d’un outil de navigation.'},
    'pt-BR':{'Non guardare soltanto':'Não veja apenas','che tempo farà.':'como estará o tempo.','Capiscilo.':'Entenda-o.','Cambia':'Alterar','Popolari:':'Populares:','Analisi locale senza API AI a pagamento':'Análise local sem APIs de IA pagas','METEO AI SUL TUO DISPOSITIVO':'METEO AI NO SEU DISPOSITIVO','Apri il meteo con un solo tocco':'Abra a previsão com um toque','Installa gratuitamente Meteo AI sulla schermata Home. Nessun account e nessuno store.':'Instale gratuitamente o Meteo AI na tela inicial. Sem conta e sem loja de aplicativos.','Aggiornato alle':'Atualizado às','Sto analizzando temperatura, vento, precipitazioni e indice UV...':'Analisando temperatura, vento, precipitação e índice UV...','ATTIVITÀ E FAMIGLIA':'ATIVIDADES E FAMÍLIA','MODALITÀ PROFESSIONALI':'MODOS PROFISSIONAIS','Condizioni discrete':'Condições razoáveis','ore di luce':'horas de luz','Scopri subito dove troverai le condizioni migliori.':'Descubra onde estarão as melhores condições.','Scegli una località da confrontare con Messina.':'Escolha um local para comparar com Messina.','Muovi e ingrandisci la mappa per conoscere il luogo selezionato.':'Mova e amplie o mapa para explorar o local selecionado.','Sono pronto. Seleziona una domanda oppure scrivine una tua.':'Pronto. Selecione uma pergunta ou escreva a sua.','Per emergenze consulta sempre le autorità locali.':'Em emergências, consulte sempre as autoridades locais.','PRIVACY E COSTI SOTTO CONTROLLO':'PRIVACIDADE E CUSTOS SOB CONTROLE','Le località salvate non lasciano il dispositivo.':'Os locais salvos nunca saem do dispositivo.','Sito statico, installabile e senza database obbligatorio.':'Site estático e instalável, sem banco de dados obrigatório.','Il meteo reale, reso semplice dall\'intelligenza artificiale.':'O clima real, simplificado pela inteligência artificial.','Le previsioni possono variare.':'As previsões podem mudar.','Accesso rapido ai luoghi che segui.':'Acesso rápido aos locais que você acompanha.','Ho capito che non è una rotta né uno strumento di navigazione.':'Entendo que isto não é uma rota nem uma ferramenta de navegação.'}
  };
  supplements.es={'Non guardare soltanto':'No te limites a mirar','che tempo farà.':'qué tiempo hará.','Capiscilo.':'Entiéndelo.','Cambia':'Cambiar','Popolari:':'Populares:','Analisi locale senza API AI a pagamento':'Análisis local sin API de IA de pago','METEO AI SUL TUO DISPOSITIVO':'METEO AI EN TU DISPOSITIVO','Apri il meteo con un solo tocco':'Abre el tiempo con un toque','Installa gratuitamente Meteo AI sulla schermata Home. Nessun account e nessuno store.':'Instala Meteo AI gratis en la pantalla de inicio. Sin cuenta ni tienda de aplicaciones.','Aggiornato alle':'Actualizado a las','Sto analizzando temperatura, vento, precipitazioni e indice UV...':'Analizando temperatura, viento, precipitaciones e índice UV...','ATTIVITÀ E FAMIGLIA':'ACTIVIDADES Y FAMILIA','MODALITÀ PROFESSIONALI':'MODOS PROFESIONALES','Condizioni discrete':'Condiciones aceptables','ore di luce':'horas de luz','Scopri subito dove troverai le condizioni migliori.':'Descubre dónde encontrarás las mejores condiciones.','Scegli una località da confrontare con Messina.':'Elige una localidad para compararla con Mesina.','Muovi e ingrandisci la mappa per conoscere il luogo selezionato.':'Mueve y amplía el mapa para explorar el lugar seleccionado.','Sono pronto. Seleziona una domanda oppure scrivine una tua.':'Estoy listo. Elige una pregunta o escribe la tuya.','Per emergenze consulta sempre le autorità locali.':'En caso de emergencia, consulta siempre a las autoridades locales.','PRIVACY E COSTI SOTTO CONTROLLO':'PRIVACIDAD Y COSTES BAJO CONTROL','Le località salvate non lasciano il dispositivo.':'Las localidades guardadas nunca salen del dispositivo.','Sito statico, installabile e senza database obbligatorio.':'Sitio estático e instalable, sin base de datos obligatoria.','Il meteo reale, reso semplice dall\'intelligenza artificiale.':'El tiempo real, simplificado por la inteligencia artificial.','Le previsioni possono variare.':'Las previsiones pueden cambiar.','Accesso rapido ai luoghi che segui.':'Acceso rápido a los lugares que sigues.','Ho capito che non è una rotta né uno strumento di navigazione.':'Entiendo que no es una ruta ni una herramienta de navegación.'};
  for(const code of ['en','fr','pt-BR','es'])Object.assign(lexicons[code],supplements[code]);
  Object.assign(lexicons.en,{'Il pianeta,':'The planet,','in tempo quasi reale.':'in near real time.','Porta Meteo AI':'Bring Meteo AI','sulla schermata Home.':'to your Home screen.'});
  Object.assign(lexicons.fr,{'Il pianeta,':'La planète,','in tempo quasi reale.':'presque en temps réel.','Porta Meteo AI':'Ajoutez Meteo AI','sulla schermata Home.':"à l’écran d’accueil."});
  Object.assign(lexicons['pt-BR'],{'Il pianeta,':'O planeta,','in tempo quasi reale.':'quase em tempo real.','Porta Meteo AI':'Leve o Meteo AI','sulla schermata Home.':'para a tela inicial.'});
  Object.assign(lexicons.es,{'Il pianeta,':'El planeta,','in tempo quasi reale.':'casi en tiempo real.','Porta Meteo AI':'Lleva Meteo AI','sulla schermata Home.':'a la pantalla de inicio.'});
  Object.assign(lexicons.en,{'Widget meteo':'Weather widget','Meteo domani':'Weather tomorrow'});
  Object.assign(lexicons.fr,{'Widget meteo':'Widget météo','Meteo domani':'Météo demain'});
  Object.assign(lexicons['pt-BR'],{'Widget meteo':'Widget de previsão','Meteo domani':'Previsão para amanhã'});
  Object.assign(lexicons.es,{'Widget meteo':'Widget del tiempo','Meteo domani':'El tiempo mañana'});
  Object.assign(lexicons.en,{'Città':'Cities','MAPPE E FENOMENI':'MAPS AND EVENTS','APP METEO AI':'METEO AI APP','Località meteo attive':'Active weather locations','VENTO E MARE':'WIND AND SEA','Installa su telefono o computer':'Install on phone or computer','Menu delle sezioni':'Sections menu','Navigazione principale mobile':'Main mobile navigation','Interfaccia attualmente disponibile in italiano':'Interface currently available in Italian','Località salvate':'Saved locations'});
  Object.assign(lexicons.fr,{'Città':'Villes','MAPPE E FENOMENI':'CARTES ET PHÉNOMÈNES','APP METEO AI':'APPLICATION METEO AI','Località meteo attive':'Localités météo actives','VENTO E MARE':'VENT ET MER','Installa su telefono o computer':'Installer sur téléphone ou ordinateur','Menu delle sezioni':'Menu des sections','Navigazione principale mobile':'Navigation mobile principale','Interfaccia attualmente disponibile in italiano':"Interface actuellement disponible en italien",'Località salvate':'Localités enregistrées'});
  Object.assign(lexicons['pt-BR'],{'Città':'Cidades','MAPPE E FENOMENI':'MAPAS E FENÔMENOS','APP METEO AI':'APP METEO AI','Località meteo attive':'Locais meteorológicos ativos','VENTO E MARE':'VENTO E MAR','Installa su telefono o computer':'Instalar no celular ou computador','Menu delle sezioni':'Menu de seções','Navigazione principale mobile':'Navegação móvel principal','Interfaccia attualmente disponibile in italiano':'Interface atualmente disponível em italiano','Località salvate':'Locais salvos'});
  Object.assign(lexicons.es,{'Città':'Ciudades','MAPPE E FENOMENI':'MAPAS Y FENÓMENOS','APP METEO AI':'APLICACIÓN METEO AI','Località meteo attive':'Localidades meteorológicas activas','VENTO E MARE':'VIENTO Y MAR','Installa su telefono o computer':'Instalar en el teléfono o el ordenador','Menu delle sezioni':'Menú de secciones','Navigazione principale mobile':'Navegación móvil principal','Interfaccia attualmente disponibile in italiano':'Interfaz disponible actualmente en italiano','Località salvate':'Localidades guardadas'});
  Object.assign(lexicons.en,{'Geolocalizzazione non supportata':'Geolocation is not supported','Il GPS richiede una connessione sicura HTTPS':'GPS requires a secure HTTPS connection','Permesso GPS non concesso':'GPS permission was not granted','Posizione non disponibile':'Location is unavailable','Posizione attuale':'Current location','Posizione non disponibile o autorizzazione negata.':'Location unavailable or permission denied.'});
  Object.assign(lexicons.fr,{'Geolocalizzazione non supportata':"La géolocalisation n’est pas prise en charge",'Il GPS richiede una connessione sicura HTTPS':'Le GPS nécessite une connexion HTTPS sécurisée','Permesso GPS non concesso':"L’autorisation GPS n’a pas été accordée",'Posizione non disponibile':'Position indisponible','Posizione attuale':'Position actuelle','Posizione non disponibile o autorizzazione negata.':'Position indisponible ou autorisation refusée.'});
  Object.assign(lexicons['pt-BR'],{'Geolocalizzazione non supportata':'Geolocalização não suportada','Il GPS richiede una connessione sicura HTTPS':'O GPS requer uma conexão HTTPS segura','Permesso GPS non concesso':'A permissão de GPS não foi concedida','Posizione non disponibile':'Localização indisponível','Posizione attuale':'Localização atual','Posizione non disponibile o autorizzazione negata.':'Localização indisponível ou permissão negada.'});
  Object.assign(lexicons.es,{'Geolocalizzazione non supportata':'Geolocalización no compatible','Il GPS richiede una connessione sicura HTTPS':'El GPS requiere una conexión HTTPS segura','Permesso GPS non concesso':'No se ha concedido el permiso de GPS','Posizione non disponibile':'Ubicación no disponible','Posizione attuale':'Ubicación actual','Posizione non disponibile o autorizzazione negata.':'Ubicación no disponible o permiso denegado.'});

  const auditCopy=[
  [
    "Eventi naturali osservati, livelli ufficiali e una lettura semplice del possibile impatto sulla località che stai seguendo.",
    "Observed natural events, official severity levels and a simple explanation of their possible impact on your location.",
    "Événements naturels observés, niveaux officiels et explication simple de leur impact possible sur la localité suivie.",
    "Eventos naturais observados, níveis oficiais e uma explicação simples do possível impacto no local acompanhado.",
    "Fenómenos naturales observados, niveles oficiales y una explicación sencilla de su posible impacto en la localidad que sigues."
  ],
  [
    "Gli eventi vengono ordinati anche in base alla distanza.",
    "Events are also sorted by distance.",
    "Les événements sont aussi classés par distance.",
    "Os eventos também são ordenados por distância.",
    "Los eventos también se ordenan por distancia."
  ],
  [
    "con i filtri attuali",
    "with the current filters",
    "avec les filtres actuels",
    "com os filtros atuais",
    "con los filtros actuales"
  ],
  [
    "eventi arancioni o rossi",
    "orange or red events",
    "événements orange ou rouges",
    "eventos laranja ou vermelhos",
    "eventos naranjas o rojos"
  ],
  [
    "alla località scelta",
    "from the selected location",
    "de la localité choisie",
    "do local selecionado",
    "de la localidad elegida"
  ],
  [
    "Fonti in caricamento",
    "Loading sources",
    "Chargement des sources",
    "Carregando fontes",
    "Cargando fuentes"
  ],
  [
    "RADAR PERSONALE",
    "PERSONAL RADAR",
    "RADAR PERSONNEL",
    "RADAR PESSOAL",
    "RADAR PERSONAL"
  ],
  [
    "Caricamento degli eventi reali…",
    "Loading observed events…",
    "Chargement des événements observés…",
    "Carregando eventos observados…",
    "Cargando eventos observados…"
  ],
  [
    "Il colore indica la criticità dell’evento, non la probabilità.",
    "Colour indicates event severity, not probability.",
    "La couleur indique la gravité de l’événement, pas sa probabilité.",
    "A cor indica a gravidade do evento, não a probabilidade.",
    "El color indica la gravedad del evento, no su probabilidad."
  ],
  [
    "EVENTI RILEVANTI",
    "RELEVANT EVENTS",
    "ÉVÉNEMENTS PERTINENTS",
    "EVENTOS RELEVANTES",
    "EVENTOS RELEVANTES"
  ],
  [
    "Quadro mondiale",
    "Global overview",
    "Vue mondiale",
    "Panorama mundial",
    "Panorama mundial"
  ],
  [
    "Interrogo USGS, NASA EONET e i centri tsunami.",
    "Querying USGS, NASA EONET and tsunami centres.",
    "Consultation de l’USGS, de NASA EONET et des centres tsunami.",
    "Consultando USGS, NASA EONET e centros de tsunami.",
    "Consultando USGS, NASA EONET y los centros de tsunamis."
  ],
  [
    "TRASPARENZA METEO AI",
    "METEO AI TRANSPARENCY",
    "TRANSPARENCE METEO AI",
    "TRANSPARÊNCIA METEO AI",
    "TRANSPARENCIA METEO AI"
  ],
  [
    "Meteo AI mostra una probabilità soltanto quando viene pubblicata dalla fonte. Per terremoti e vulcani non inventa percentuali di previsione: descrive l’evento osservato e calcola esclusivamente un indice orientativo d’impatto sulla località.",
    "Meteo AI shows a probability only when the source publishes one. For earthquakes and volcanoes it describes the observed event and calculates only an indicative local impact score, without inventing forecast percentages.",
    "Meteo AI affiche une probabilité uniquement lorsqu’elle est publiée par la source. Pour les séismes et volcans, l’application décrit l’événement observé et calcule seulement un indice indicatif d’impact local, sans inventer de pourcentages prévisionnels.",
    "O Meteo AI mostra probabilidades apenas quando publicadas pela fonte. Para terremotos e vulcões, descreve o evento observado e calcula somente um índice indicativo de impacto local, sem inventar percentuais de previsão.",
    "Meteo AI muestra probabilidades solo cuando las publica la fuente. Para terremotos y volcanes, describe el evento observado y calcula únicamente un índice orientativo de impacto local, sin inventar porcentajes de previsión."
  ],
  [
    "Quanto è probabile uno scenario, solo se la fonte lo dichiara.",
    "How likely a scenario is, only when stated by the source.",
    "Probabilité d’un scénario, uniquement si la source l’indique.",
    "Probabilidade de um cenário, apenas se informada pela fonte.",
    "Probabilidad de un escenario, solo si la fuente la indica."
  ],
  [
    "Intensità o livello attribuito all’evento osservato.",
    "Intensity or level assigned to the observed event.",
    "Intensité ou niveau attribué à l’événement observé.",
    "Intensidade ou nível atribuído ao evento observado.",
    "Intensidad o nivel atribuido al evento observado."
  ],
  [
    "Indice 0–100 basato su distanza, intensità, tipo e attualità.",
    "A 0–100 score based on distance, intensity, type and recency.",
    "Indice de 0 à 100 selon la distance, l’intensité, le type et la récence.",
    "Índice de 0 a 100 baseado em distância, intensidade, tipo e atualidade.",
    "Índice de 0 a 100 basado en distancia, intensidad, tipo y actualidad."
  ],
  [
    "I provider sono indipendenti da Meteo AI. Timeout, CORS, manutenzione o modifiche alle condizioni d’uso possono rendere una singola fonte temporaneamente indisponibile; le altre continuano a funzionare e il loro stato è mostrato nella pagina.",
    "Providers are independent of Meteo AI. Timeouts, access restrictions, maintenance or changes to terms may temporarily affect one source; the others continue working and their status is displayed on the page.",
    "Les fournisseurs sont indépendants de Meteo AI. Délais dépassés, restrictions d’accès, maintenance ou changements des conditions peuvent rendre une source indisponible ; les autres continuent à fonctionner et leur état est affiché.",
    "Os provedores são independentes do Meteo AI. Limites de tempo, restrições de acesso, manutenção ou mudanças nos termos podem afetar uma fonte temporariamente; as outras continuam funcionando e seu estado aparece na página.",
    "Los proveedores son independientes de Meteo AI. Los tiempos de espera, restricciones de acceso, mantenimiento o cambios de condiciones pueden afectar temporalmente a una fuente; las demás siguen funcionando y su estado aparece en la página."
  ],
  [
    "Terremoti mondiali",
    "Worldwide earthquakes",
    "Séismes mondiaux",
    "Terremotos mundiais",
    "Terremotos mundiales"
  ],
  [
    "Feed GeoJSON aggiornato frequentemente ↗",
    "Frequently updated GeoJSON feed ↗",
    "Flux GeoJSON fréquemment actualisé ↗",
    "Feed GeoJSON atualizado frequentemente ↗",
    "Fuente GeoJSON actualizada frecuentemente ↗"
  ],
  [
    "Eventi naturali globali",
    "Global natural events",
    "Événements naturels mondiaux",
    "Eventos naturais globais",
    "Fenómenos naturales mundiales"
  ],
  [
    "Cicloni, vulcani, incendi e altro ↗",
    "Cyclones, volcanoes, wildfires and more ↗",
    "Cyclones, volcans, incendies et autres ↗",
    "Ciclones, vulcões, incêndios e outros ↗",
    "Ciclones, volcanes, incendios y otros ↗"
  ],
  [
    "Messaggi CAP ufficiali",
    "Official CAP messages",
    "Messages CAP officiels",
    "Mensagens CAP oficiais",
    "Mensajes CAP oficiales"
  ],
  [
    "Centri NOAA PTWC e NTWC ↗",
    "NOAA PTWC and NTWC centres ↗",
    "Centres NOAA PTWC et NTWC ↗",
    "Centros NOAA PTWC e NTWC ↗",
    "Centros NOAA PTWC y NTWC ↗"
  ],
  [
    "Giappone e Pacifico nord-occidentale",
    "Japan and the northwestern Pacific",
    "Japon et Pacifique nord-ouest",
    "Japão e Pacífico noroeste",
    "Japón y Pacífico noroccidental"
  ],
  [
    "Bollettini XML dell’agenzia giapponese ↗",
    "Japanese agency XML bulletins ↗",
    "Bulletins XML de l’agence japonaise ↗",
    "Boletins XML da agência japonesa ↗",
    "Boletines XML de la agencia japonesa ↗"
  ],
  [
    "Indonesia e mari circostanti",
    "Indonesia and surrounding seas",
    "Indonésie et mers voisines",
    "Indonésia e mares próximos",
    "Indonesia y mares cercanos"
  ],
  [
    "Dati aperti del sistema TEWS indonesiano ↗",
    "Open data from Indonesia’s TEWS system ↗",
    "Données ouvertes du système TEWS indonésien ↗",
    "Dados abertos do sistema TEWS indonésio ↗",
    "Datos abiertos del sistema TEWS indonesio ↗"
  ],
  [
    "Mondo Live è informativo e non sostituisce protezione civile, autorità locali, ordini di evacuazione o bollettini ufficiali. In caso di emergenza segui esclusivamente le autorità competenti.",
    "World Live provides information and does not replace civil protection, local authorities, evacuation orders or official bulletins. In an emergency follow the responsible authorities.",
    "Monde en direct est informatif et ne remplace ni la protection civile, ni les autorités locales, ni les ordres d’évacuation, ni les bulletins officiels. En cas d’urgence, suivez les autorités compétentes.",
    "Mundo ao vivo é informativo e não substitui a defesa civil, autoridades locais, ordens de evacuação ou boletins oficiais. Em emergências, siga as autoridades competentes.",
    "Mundo en directo es informativo y no sustituye a protección civil, autoridades locales, órdenes de evacuación ni boletines oficiales. En emergencias, sigue a las autoridades competentes."
  ],
  [
    "Ricevi un avviso quando Mondo Live rileva un evento compatibile con le tue regole. Tutto resta su questo dispositivo.",
    "Receive a notice when World Live detects an event matching your rules. Everything stays on this device.",
    "Recevez un avis lorsque Monde en direct détecte un événement correspondant à vos règles. Tout reste sur cet appareil.",
    "Receba um aviso quando Mundo ao vivo detectar um evento compatível com suas regras. Tudo fica neste dispositivo.",
    "Recibe un aviso cuando Mundo en directo detecte un evento que coincida con tus reglas. Todo permanece en este dispositivo."
  ],
  [
    "Controllo disponibilità…",
    "Checking availability…",
    "Vérification de la disponibilité…",
    "Verificando disponibilidade…",
    "Comprobando disponibilidad…"
  ],
  [
    "Cicloni e tempeste",
    "Cyclones and storms",
    "Cyclones et tempêtes",
    "Ciclones e tempestades",
    "Ciclones y tormentas"
  ],
  [
    "Come funzionano davvero:",
    "How they work:",
    "Fonctionnement :",
    "Como funcionam:",
    "Cómo funcionan:"
  ],
  [
    "gli avvisi vengono controllati all’apertura e ogni dieci minuti mentre la pagina o la PWA è attiva. Le notifiche in background a sito completamente chiuso richiederebbero un servizio push esterno.",
    "notices are checked on opening and every ten minutes while the page or PWA is active. Notifications when the site is fully closed would require an external push service.",
    "les avis sont vérifiés à l’ouverture et toutes les dix minutes tant que la page ou la PWA est active. Les notifications lorsque le site est fermé nécessiteraient un service push externe.",
    "os avisos são verificados ao abrir e a cada dez minutos enquanto a página ou PWA está ativa. Notificações com o site fechado exigiriam um serviço push externo.",
    "los avisos se comprueban al abrir y cada diez minutos mientras la página o PWA está activa. Las notificaciones con el sitio cerrado requerirían un servicio push externo."
  ],
  [
    "Il pianeta reale, spiegato con trasparenza.",
    "The real planet, explained transparently.",
    "La planète réelle, expliquée avec transparence.",
    "O planeta real, explicado com transparência.",
    "El planeta real, explicado con transparencia."
  ],
  [
    "Dati: USGS • NASA EONET • NOAA Tsunami.gov • JMA • BMKG • Mappe: OpenStreetMap. Verifica sempre le fonti ufficiali.",
    "Data: USGS • NASA EONET • NOAA Tsunami.gov • JMA • BMKG • Maps: OpenStreetMap. Always check official sources.",
    "Données : USGS • NASA EONET • NOAA Tsunami.gov • JMA • BMKG • Cartes : OpenStreetMap. Vérifiez toujours les sources officielles.",
    "Dados: USGS • NASA EONET • NOAA Tsunami.gov • JMA • BMKG • Mapas: OpenStreetMap. Consulte sempre as fontes oficiais.",
    "Datos: USGS • NASA EONET • NOAA Tsunami.gov • JMA • BMKG • Mapas: OpenStreetMap. Consulta siempre las fuentes oficiales."
  ],
  [
    "Ordina eventi",
    "Sort events",
    "Trier les événements",
    "Ordenar eventos",
    "Ordenar eventos"
  ],
  [
    "Chiudi scheda",
    "Close details",
    "Fermer la fiche",
    "Fechar detalhes",
    "Cerrar ficha"
  ],
  [
    "Chiudi sorveglianza",
    "Close watchlist",
    "Fermer la surveillance",
    "Fechar monitoramento",
    "Cerrar vigilancia"
  ],
  [
    "Cambia località di riferimento",
    "Change reference location",
    "Changer la localité de référence",
    "Alterar local de referência",
    "Cambiar localidad de referencia"
  ],
  [
    "Es. Messina, Tokyo, Honolulu",
    "E.g. Messina, Tokyo, Honolulu",
    "Ex. Messine, Tokyo, Honolulu",
    "Ex.: Messina, Tóquio, Honolulu",
    "Ej.: Mesina, Tokio, Honolulu"
  ],
  [
    "14 giorni",
    "14 days",
    "14 jours",
    "14 dias",
    "14 días"
  ],
  [
    "7 giorni",
    "7 days",
    "7 jours",
    "7 dias",
    "7 días"
  ],
  [
    "30 giorni",
    "30 days",
    "30 jours",
    "30 dias",
    "30 días"
  ],
  [
    "24 ore",
    "24 hours",
    "24 heures",
    "24 horas",
    "24 horas"
  ]
];
  for(const row of auditCopy)for(const [index,code] of ['en','fr','pt-BR','es'].entries())lexicons[code][row[0]]=row[index+1];

  const homeAuditCopy=[
  [
    "Analisi automatica basata su dati previsionali reali.",
    "Automatic analysis based on real forecast data.",
    "Analyse automatique fondée sur des données prévisionnelles réelles.",
    "Análise automática baseada em dados reais de previsão.",
    "Análisis automático basado en datos reales de previsión."
  ],
  [
    "ORIZZONTE ESTESO",
    "EXTENDED OUTLOOK",
    "ÉCHÉANCE ÉTENDUE",
    "PREVISÃO ESTENDIDA",
    "PREVISIÓN AMPLIADA"
  ],
  [
    "TRASPARENZA PREVISIONALE",
    "FORECAST TRANSPARENCY",
    "TRANSPARENCE DES PRÉVISIONS",
    "TRANSPARÊNCIA DA PREVISÃO",
    "TRANSPARENCIA DE LA PREVISIÓN"
  ],
  [
    "Oggi–2 giorni",
    "Today–2 days",
    "Aujourd’hui–2 jours",
    "Hoje–2 dias",
    "Hoy–2 días"
  ],
  [
    "3–7 giorni",
    "3–7 days",
    "3–7 jours",
    "3–7 dias",
    "3–7 días"
  ],
  [
    "8–14 giorni",
    "8–14 days",
    "8–14 jours",
    "8–14 dias",
    "8–14 días"
  ],
  [
    "Buona",
    "Good",
    "Bonne",
    "Boa",
    "Buena"
  ],
  [
    "Indicativa",
    "Indicative",
    "Indicative",
    "Indicativa",
    "Orientativa"
  ],
  [
    "Consulta avvisi ufficiali ↗",
    "Check official notices ↗",
    "Consulter les avis officiels ↗",
    "Consultar avisos oficiais ↗",
    "Consulta avisos oficiales ↗"
  ],
  [
    "Controllo pioggia, temporali, vento, temperature e UV.",
    "Checking rain, thunderstorms, wind, temperatures and UV.",
    "Vérification de la pluie, des orages, du vent, des températures et des UV.",
    "Verificando chuva, tempestades, vento, temperaturas e UV.",
    "Comprobando lluvia, tormentas, viento, temperaturas y UV."
  ],
  [
    "Gli avvisi Meteo AI sono calcolati dai dati previsionali e non sono allerte ufficiali.",
    "Meteo AI notices are calculated from forecast data and are not official warnings.",
    "Les avis Meteo AI sont calculés à partir des prévisions et ne sont pas des alertes officielles.",
    "Os avisos do Meteo AI são calculados a partir de previsões e não são alertas oficiais.",
    "Los avisos de Meteo AI se calculan a partir de previsiones y no son alertas oficiales."
  ],
  [
    "PROSSIME ORE",
    "NEXT HOURS",
    "PROCHAINES HEURES",
    "PRÓXIMAS HORAS",
    "PRÓXIMAS HORAS"
  ],
  [
    "✦ FUNZIONE ESCLUSIVA METEO AI",
    "✦ METEO AI EXCLUSIVE FEATURE",
    "✦ FONCTION EXCLUSIVE METEO AI",
    "✦ FUNÇÃO EXCLUSIVA METEO AI",
    "✦ FUNCIÓN EXCLUSIVA METEO AI"
  ],
  [
    "Analisi delle condizioni in corso...",
    "Analysing conditions...",
    "Analyse des conditions...",
    "Analisando condições...",
    "Analizando condiciones..."
  ],
  [
    "Confronto le condizioni disponibili.",
    "Comparing available conditions.",
    "Comparaison des conditions disponibles.",
    "Comparando condições disponíveis.",
    "Comparando las condiciones disponibles."
  ],
  [
    "Il confronto viene aggiornato automaticamente usando la massima prevista oggi e le massime registrate nello stesso giorno di calendario nei 10 anni precedenti.",
    "The comparison updates automatically using today’s forecast high and the highs recorded on the same calendar day over the previous 10 years.",
    "La comparaison est actualisée automatiquement avec le maximum prévu aujourd’hui et les maxima enregistrés à la même date au cours des 10 années précédentes.",
    "A comparação é atualizada automaticamente com a máxima prevista hoje e as máximas registradas na mesma data nos 10 anos anteriores.",
    "La comparación se actualiza automáticamente con la máxima prevista hoy y las máximas registradas en la misma fecha durante los 10 años anteriores."
  ],
  [
    "Temperatura attuale",
    "Current temperature",
    "Température actuelle",
    "Temperatura atual",
    "Temperatura actual"
  ],
  [
    "MEDIA DELLA STESSA DATA • 10 ANNI",
    "SAME-DATE AVERAGE • 10 YEARS",
    "MOYENNE À LA MÊME DATE • 10 ANS",
    "MÉDIA DA MESMA DATA • 10 ANOS",
    "MEDIA DE LA MISMA FECHA • 10 AÑOS"
  ],
  [
    "Analisi in attesa",
    "Awaiting analysis",
    "En attente d’analyse",
    "Aguardando análise",
    "Análisis pendiente"
  ],
  [
    "DATI AVANZATI",
    "ADVANCED DATA",
    "DONNÉES AVANCÉES",
    "DADOS AVANÇADOS",
    "DATOS AVANZADOS"
  ],
  [
    "QUALITÀ DELL'ARIA",
    "AIR QUALITY",
    "QUALITÉ DE L’AIR",
    "QUALIDADE DO AR",
    "CALIDAD DEL AIRE"
  ],
  [
    "Indice europeo CAQI",
    "European CAQI index",
    "Indice européen CAQI",
    "Índice europeu CAQI",
    "Índice europeo CAQI"
  ],
  [
    "SOLE",
    "SUN",
    "SOLEIL",
    "SOL",
    "SOL"
  ],
  [
    "In analisi",
    "Under analysis",
    "Analyse en cours",
    "Em análise",
    "En análisis"
  ],
  [
    "✦ LETTURA METEO AI",
    "✦ METEO AI INTERPRETATION",
    "✦ INTERPRÉTATION METEO AI",
    "✦ INTERPRETAÇÃO METEO AI",
    "✦ INTERPRETACIÓN METEO AI"
  ],
  [
    "Analisi del vento in corso",
    "Analysing wind",
    "Analyse du vent",
    "Analisando o vento",
    "Analizando el viento"
  ],
  [
    "Confronto velocità, raffiche e andamento delle prossime ore.",
    "Comparing speed, gusts and trends over the coming hours.",
    "Comparaison de la vitesse, des rafales et de l’évolution des prochaines heures.",
    "Comparando velocidade, rajadas e evolução nas próximas horas.",
    "Comparando velocidad, rachas y evolución durante las próximas horas."
  ],
  [
    "CONFRONTO",
    "COMPARISON",
    "COMPARAISON",
    "COMPARAÇÃO",
    "COMPARACIÓN"
  ],
  [
    "Confronta",
    "Compare",
    "Comparer",
    "Comparar",
    "Comparar"
  ],
  [
    "MAPPA INTERATTIVA",
    "INTERACTIVE MAP",
    "CARTE INTERACTIVE",
    "MAPA INTERATIVO",
    "MAPA INTERACTIVO"
  ],
  [
    "Mappa © OpenStreetMap contributors",
    "Map © OpenStreetMap contributors",
    "Carte © contributeurs OpenStreetMap",
    "Mapa © colaboradores do OpenStreetMap",
    "Mapa © colaboradores de OpenStreetMap"
  ],
  [
    "Analisi automatica del mare",
    "Automatic sea analysis",
    "Analyse automatique de la mer",
    "Análise automática do mar",
    "Análisis automático del mar"
  ],
  [
    "Sto selezionando il punto marino modellistico più vicino alla località.",
    "Selecting the nearest modelled marine point.",
    "Sélection du point marin modélisé le plus proche.",
    "Selecionando o ponto marinho modelado mais próximo.",
    "Seleccionando el punto marino modelado más cercano."
  ],
  [
    "INDICE MARE AI",
    "AI SEA INDEX",
    "INDICE MER IA",
    "ÍNDICE MAR IA",
    "ÍNDICE MAR IA"
  ],
  [
    "Sto confrontando onde, corrente e temperatura.",
    "Comparing waves, currents and temperature.",
    "Comparaison des vagues, du courant et de la température.",
    "Comparando ondas, corrente e temperatura.",
    "Comparando olas, corriente y temperatura."
  ],
  [
    "Superficie",
    "Surface",
    "Surface",
    "Superfície",
    "Superficie"
  ],
  [
    "Direzione",
    "Direction",
    "Direction",
    "Direção",
    "Dirección"
  ],
  [
    "✦ SPIEGAZIONE",
    "✦ EXPLANATION",
    "✦ EXPLICATION",
    "✦ EXPLICAÇÃO",
    "✦ EXPLICACIÓN"
  ],
  [
    "I consigli vengono elaborati localmente e non sostituiscono bollettini o autorità marittime.",
    "Advice is generated locally and does not replace maritime bulletins or authorities.",
    "Les conseils sont calculés localement et ne remplacent pas les bulletins ni les autorités maritimes.",
    "As recomendações são calculadas localmente e não substituem boletins ou autoridades marítimas.",
    "Los consejos se calculan localmente y no sustituyen a los boletines ni a las autoridades marítimas."
  ],
  [
    "Punto marino in selezione…",
    "Selecting marine point…",
    "Sélection du point marin…",
    "Selecionando ponto marinho…",
    "Seleccionando punto marino…"
  ],
  [
    "ATLANTE DEI MARI • COPERTURA MONDIALE",
    "SEA ATLAS • WORLDWIDE COVERAGE",
    "ATLAS DES MERS • COUVERTURE MONDIALE",
    "ATLAS DOS MARES • COBERTURA MUNDIAL",
    "ATLAS DE LOS MARES • COBERTURA MUNDIAL"
  ],
  [
    "La mappa riconosce automaticamente lo Stato della località meteo e analizza i principali tratti costieri, senza richiedere una seconda scelta.",
    "The map automatically identifies the selected location’s country and analyses its main coastal areas.",
    "La carte identifie automatiquement le pays de la localité choisie et analyse ses principales zones côtières.",
    "O mapa identifica automaticamente o país do local selecionado e analisa suas principais áreas costeiras.",
    "El mapa identifica automáticamente el país de la localidad elegida y analiza sus principales zonas costeras."
  ],
  [
    "Rilevamento della nazione…",
    "Detecting country…",
    "Détection du pays…",
    "Detectando país…",
    "Detectando país…"
  ],
  [
    "Il Paese segue automaticamente la località meteo selezionata.",
    "The country automatically follows the selected weather location.",
    "Le pays suit automatiquement la localité météo sélectionnée.",
    "O país acompanha automaticamente o local selecionado.",
    "El país sigue automáticamente la localidad meteorológica seleccionada."
  ],
  [
    "Poco mosso",
    "Slight seas",
    "Mer peu agitée",
    "Mar pouco agitado",
    "Marejadilla"
  ],
  [
    "Mosso",
    "Moderate seas",
    "Mer agitée",
    "Mar agitado",
    "Marejada"
  ],
  [
    "Molto mosso",
    "Rough seas",
    "Mer forte",
    "Mar muito agitado",
    "Fuerte marejada"
  ],
  [
    "Il confine nazionale semplificato proviene da Natural Earth, con fallback OpenStreetMap; i punti costieri sono campioni modellistici automatici, non porti o rotte ufficiali. Verifica sempre compagnia di navigazione, autorità marittime e bollettini locali.",
    "Simplified national boundaries come from Natural Earth, with OpenStreetMap as fallback. Coastal points are automatic model samples, not official ports or routes. Always check ferry operators, maritime authorities and local bulletins.",
    "Les frontières simplifiées proviennent de Natural Earth, avec OpenStreetMap en secours. Les points côtiers sont des échantillons de modèles, pas des ports ni des routes officiels. Consultez les compagnies, les autorités maritimes et les bulletins locaux.",
    "As fronteiras simplificadas vêm do Natural Earth, com OpenStreetMap como alternativa. Os pontos costeiros são amostras de modelos, não portos ou rotas oficiais. Consulte as companhias, autoridades marítimas e boletins locais.",
    "Las fronteras simplificadas proceden de Natural Earth, con OpenStreetMap como alternativa. Los puntos costeros son muestras de modelos, no puertos ni rutas oficiales. Consulta las compañías, autoridades marítimas y boletines locales."
  ],
  [
    "CONFRONTO METEO FRA PORTI",
    "WEATHER COMPARISON BETWEEN PORTS",
    "COMPARAISON MÉTÉO ENTRE PORTS",
    "COMPARAÇÃO METEOROLÓGICA ENTRE PORTOS",
    "COMPARACIÓN METEOROLÓGICA ENTRE PUERTOS"
  ],
  [
    "Seleziona due porti e una data: Meteo AI confronta il moto ondoso lungo una linea geometrica. Non calcola una rotta nautica.",
    "Select two ports and a date: Meteo AI compares waves along a geometric line. It does not calculate a nautical route.",
    "Choisissez deux ports et une date : Meteo AI compare les vagues le long d’une ligne géométrique. L’application ne calcule pas de route nautique.",
    "Selecione dois portos e uma data: o Meteo AI compara ondas ao longo de uma linha geométrica. Não calcula uma rota náutica.",
    "Elige dos puertos y una fecha: Meteo AI compara el oleaje a lo largo de una línea geométrica. No calcula una ruta náutica."
  ],
  [
    "La linea può attraversare terra, aree interdette o zone non navigabili. Non considera fondali, coste, ostacoli, traffico, ordinanze, dotazioni, capacità dell’imbarcazione o decisioni delle autorità.",
    "The line may cross land, restricted or unnavigable areas. It does not account for depths, coastlines, obstacles, traffic, regulations, equipment, vessel capability or authorities’ decisions.",
    "La ligne peut traverser des terres ou des zones interdites ou non navigables. Elle ne tient pas compte des fonds, côtes, obstacles, trafic, règles, équipements, capacités du bateau ni des décisions des autorités.",
    "A linha pode atravessar terra e áreas restritas ou não navegáveis. Não considera profundidades, costas, obstáculos, tráfego, regras, equipamentos, capacidade da embarcação ou decisões das autoridades.",
    "La línea puede cruzar tierra y zonas restringidas o no navegables. No considera fondos, costas, obstáculos, tráfico, normas, equipamiento, capacidad de la embarcación ni decisiones de las autoridades."
  ],
  [
    "Per pianificare una traversata usa carte nautiche aggiornate, bollettini ufficiali e indicazioni delle autorità marittime.",
    "Plan crossings using current nautical charts, official bulletins and maritime authorities’ guidance.",
    "Préparez les traversées avec des cartes nautiques à jour, les bulletins officiels et les consignes des autorités maritimes.",
    "Planeje travessias com cartas náuticas atualizadas, boletins oficiais e orientações das autoridades marítimas.",
    "Planifica las travesías con cartas náuticas actualizadas, boletines oficiales e indicaciones de las autoridades marítimas."
  ],
  [
    "Dati modellistici indicativi: non utilizzare Meteo AI come strumento di navigazione o sicurezza in mare.",
    "Indicative model data: do not use Meteo AI as a navigation or maritime safety tool.",
    "Données de modèles indicatives : ne pas utiliser Meteo AI comme outil de navigation ou de sécurité en mer.",
    "Dados indicativos de modelos: não use o Meteo AI como ferramenta de navegação ou segurança marítima.",
    "Datos indicativos de modelos: no uses Meteo AI como herramienta de navegación o seguridad marítima."
  ],
  [
    "PERCHÉ METEO AI",
    "WHY METEO AI",
    "POURQUOI METEO AI",
    "POR QUE METEO AI",
    "POR QUÉ METEO AI"
  ],
  [
    "I dati dicono cosa accadrà.",
    "Data shows what is forecast.",
    "Les données montrent les prévisions.",
    "Os dados mostram a previsão.",
    "Los datos muestran la previsión."
  ],
  [
    "L’AI ti aiuta a decidere.",
    "AI helps you decide.",
    "L’IA vous aide à décider.",
    "A IA ajuda você a decidir.",
    "La IA te ayuda a decidir."
  ],
  [
    "Incrociamo temperatura, pioggia, vento, UV e qualità dell’aria per trasformarli in indicazioni semplici e legate alle tue attività.",
    "We combine temperature, rain, wind, UV and air quality into simple guidance for your activities.",
    "Nous combinons température, pluie, vent, UV et qualité de l’air pour fournir des conseils adaptés à vos activités.",
    "Combinamos temperatura, chuva, vento, UV e qualidade do ar em orientações simples para suas atividades.",
    "Combinamos temperatura, lluvia, viento, UV y calidad del aire para ofrecer consejos sencillos para tus actividades."
  ],
  [
    "Vai al lavoro in bici?",
    "Cycling to work?",
    "Au travail à vélo ?",
    "Vai de bicicleta ao trabalho?",
    "¿Vas al trabajo en bici?"
  ],
  [
    "Partenza consigliata entro le 8:10: dopo aumenta il rischio di pioggia.",
    "Suggested departure by 08:10: rain becomes more likely afterwards.",
    "Départ conseillé avant 8 h 10 : le risque de pluie augmente ensuite.",
    "Saída sugerida até 8h10: depois aumenta o risco de chuva.",
    "Salida sugerida antes de las 8:10: después aumenta el riesgo de lluvia."
  ],
  [
    "Pausa pranzo all’aperto?",
    "Lunch outdoors?",
    "Déjeuner dehors ?",
    "Almoço ao ar livre?",
    "¿Almuerzo al aire libre?"
  ],
  [
    "Sì, ma cerca ombra: indice UV elevato.",
    "Yes, but seek shade: the UV index is high.",
    "Oui, mais cherchez l’ombre : l’indice UV est élevé.",
    "Sim, mas procure sombra: o índice UV está alto.",
    "Sí, pero busca sombra: el índice UV es alto."
  ],
  [
    "Passeggiata serale?",
    "Evening walk?",
    "Promenade du soir ?",
    "Caminhada à noite?",
    "¿Paseo al atardecer?"
  ],
  [
    "Condizioni favorevoli e vento debole.",
    "Favourable conditions and light wind.",
    "Conditions favorables et vent faible.",
    "Condições favoráveis e vento fraco.",
    "Condiciones favorables y viento débil."
  ],
  [
    "Fai una domanda normale: la risposta viene calcolata nel browser usando soltanto i dati meteorologici della località selezionata.",
    "Ask a question: the answer is calculated in your browser using the selected location’s weather data.",
    "Posez une question : la réponse est calculée dans votre navigateur avec les données météo de la localité choisie.",
    "Faça uma pergunta: a resposta é calculada no navegador com os dados meteorológicos do local selecionado.",
    "Haz una pregunta: la respuesta se calcula en el navegador con los datos meteorológicos de la localidad elegida."
  ],
  [
    "Chiedi",
    "Ask",
    "Demander",
    "Perguntar",
    "Preguntar"
  ],
  [
    "Analizziamo destinazione e periodo per suggerire abbigliamento, accessori e criticità previste.",
    "We analyse your destination and dates to suggest clothing, accessories and weather concerns.",
    "Nous analysons destination et dates pour suggérer vêtements, accessoires et points de vigilance.",
    "Analisamos destino e datas para sugerir roupas, acessórios e cuidados meteorológicos.",
    "Analizamos el destino y las fechas para sugerir ropa, accesorios y posibles riesgos meteorológicos."
  ],
  [
    "Destinazione",
    "Destination",
    "Destination",
    "Destino",
    "Destino"
  ],
  [
    "Partenza",
    "Departure",
    "Départ",
    "Partida",
    "Salida"
  ],
  [
    "Giorni",
    "Days",
    "Jours",
    "Dias",
    "Días"
  ],
  [
    "Giorno",
    "Day",
    "Jour",
    "Dia",
    "Día"
  ],
  [
    "Inserisci il tuo prossimo viaggio per ricevere il piano Meteo AI.",
    "Enter your next trip to receive a Meteo AI plan.",
    "Renseignez votre prochain voyage pour recevoir le programme Meteo AI.",
    "Informe sua próxima viagem para receber o plano Meteo AI.",
    "Introduce tu próximo viaje para recibir el plan de Meteo AI."
  ],
  [
    "Meteo AI non richiede account, non mostra pubblicità e non usa modelli AI a consumo. Preferiti e tema restano nella memoria locale del browser.",
    "Meteo AI requires no account, shows no ads and uses no metered AI models. Favourites and theme stay in your browser’s local storage.",
    "Meteo AI ne nécessite aucun compte, n’affiche aucune publicité et n’utilise pas de modèles IA facturés à l’usage. Favoris et thème restent dans le stockage local du navigateur.",
    "O Meteo AI não exige conta, não mostra anúncios e não usa modelos de IA pagos por uso. Favoritos e tema ficam no armazenamento local do navegador.",
    "Meteo AI no requiere cuenta, no muestra anuncios ni usa modelos de IA de pago por uso. Los favoritos y el tema permanecen en el almacenamiento local del navegador."
  ],
  [
    "Domande, finestre meteo e consigli vengono elaborati direttamente nel browser.",
    "Questions, weather windows and advice are processed in your browser.",
    "Questions, créneaux météo et conseils sont traités dans votre navigateur.",
    "Perguntas, janelas meteorológicas e recomendações são processadas no navegador.",
    "Las preguntas, franjas meteorológicas y consejos se procesan en tu navegador."
  ],
  [
    "PREVISIONI METEO MONDIALI",
    "WORLDWIDE WEATHER FORECASTS",
    "PRÉVISIONS MÉTÉO MONDIALES",
    "PREVISÕES METEOROLÓGICAS MUNDIAIS",
    "PREVISIONES METEOROLÓGICAS MUNDIALES"
  ],
  [
    "Cerca una città, un comune o una località in qualsiasi parte del mondo. Meteo AI riunisce previsioni fino a 14 giorni, condizioni attuali e strumenti di confronto in una pagina semplice da consultare.",
    "Search for a city, town or location anywhere in the world. Meteo AI brings together forecasts up to 14 days, current conditions and comparison tools on one easy-to-use page.",
    "Recherchez une ville, une commune ou une localité partout dans le monde. Meteo AI réunit prévisions jusqu’à 14 jours, conditions actuelles et outils de comparaison sur une page facile à consulter.",
    "Busque uma cidade ou local em qualquer parte do mundo. O Meteo AI reúne previsões de até 14 dias, condições atuais e ferramentas de comparação em uma página fácil de consultar.",
    "Busca una ciudad, municipio o localidad en cualquier parte del mundo. Meteo AI reúne previsiones de hasta 14 días, condiciones actuales y herramientas de comparación en una página fácil de consultar."
  ],
  [
    "Meteo oggi e previsioni a 14 giorni",
    "Today’s weather and 14-day forecasts",
    "Météo du jour et prévisions à 14 jours",
    "Tempo hoje e previsão de 14 dias",
    "Tiempo de hoy y previsión a 14 días"
  ],
  [
    "Controlla temperatura minima e massima, probabilità e quantità di pioggia, umidità, pressione, visibilità, indice UV, alba e tramonto.",
    "Check low and high temperatures, rain probability and amount, humidity, pressure, visibility, UV index, sunrise and sunset.",
    "Consultez les températures minimale et maximale, la probabilité et la quantité de pluie, l’humidité, la pression, la visibilité, les UV et les heures du soleil.",
    "Consulte temperaturas mínima e máxima, probabilidade e quantidade de chuva, umidade, pressão, visibilidade, UV, nascer e pôr do sol.",
    "Consulta temperaturas mínima y máxima, probabilidad y cantidad de lluvia, humedad, presión, visibilidad, UV, amanecer y atardecer."
  ],
  [
    "Vento e situazione del mare",
    "Wind and sea conditions",
    "Vent et état de la mer",
    "Vento e condições do mar",
    "Viento y estado del mar"
  ],
  [
    "Consulta velocità, direzione e raffiche del vento. Per le località costiere sono disponibili anche onde, periodo, direzione e temperatura del mare come dati modellistici indicativi.",
    "Check wind speed, direction and gusts. Coastal locations also offer indicative model data for waves, wave period, direction and sea temperature.",
    "Consultez vitesse, direction et rafales du vent. Pour les localités côtières, des données de modèles indicatives décrivent aussi les vagues, leur période, leur direction et la température de la mer.",
    "Consulte velocidade, direção e rajadas do vento. Locais costeiros também oferecem dados indicativos de modelos para ondas, período, direção e temperatura do mar.",
    "Consulta velocidad, dirección y rachas del viento. Las localidades costeras también ofrecen datos indicativos de modelos sobre olas, período, dirección y temperatura del mar."
  ],
  [
    "Confronto con il clima passato",
    "Historical climate comparison",
    "Comparaison avec le climat passé",
    "Comparação com o clima passado",
    "Comparación con el clima pasado"
  ],
  [
    "La temperatura di oggi viene confrontata con i dati storici della stessa località per mostrare in modo immediato se la giornata è più calda, più fresca o vicina alla media.",
    "Today’s temperature is compared with historical data for the same location to show whether the day is warmer, cooler or near average.",
    "La température du jour est comparée aux données historiques de la même localité pour montrer si elle est plus chaude, plus fraîche ou proche de la moyenne.",
    "A temperatura de hoje é comparada com dados históricos do mesmo local para mostrar se o dia está mais quente, mais fresco ou próximo da média.",
    "La temperatura de hoy se compara con los datos históricos de la misma localidad para mostrar si el día es más cálido, más fresco o cercano a la media."
  ],
  [
    "Mappe ed eventi naturali nel mondo",
    "Maps and natural events worldwide",
    "Cartes et événements naturels mondiaux",
    "Mapas e eventos naturais no mundo",
    "Mapas y fenómenos naturales del mundo"
  ],
  [
    "La sezione",
    "The section",
    "La section",
    "A seção",
    "La sección"
  ],
  [
    "raccoglie terremoti, cicloni, vulcani, incendi, alluvioni e avvisi tsunami provenienti da fonti pubbliche internazionali.",
    "collects earthquakes, cyclones, volcanoes, wildfires, floods and tsunami notices from international public sources.",
    "rassemble séismes, cyclones, volcans, incendies, inondations et avis tsunami provenant de sources publiques internationales.",
    "reúne terremotos, ciclones, vulcões, incêndios, inundações e avisos de tsunami de fontes públicas internacionais.",
    "recopila terremotos, ciclones, volcanes, incendios, inundaciones y avisos de tsunami de fuentes públicas internacionales."
  ],
  [
    "Installa l’app",
    "Install the app",
    "Installer l’application",
    "Instalar o aplicativo",
    "Instalar la aplicación"
  ],
  [
    "Dati: Open-Meteo • Mappe: OpenStreetMap • Confini: Natural Earth • Località: GeoNames CC BY 4.0. Le previsioni possono variare.",
    "Data: Open-Meteo • Maps: OpenStreetMap • Boundaries: Natural Earth • Locations: GeoNames CC BY 4.0. Forecasts may change.",
    "Données : Open-Meteo • Cartes : OpenStreetMap • Frontières : Natural Earth • Localités : GeoNames CC BY 4.0. Les prévisions peuvent évoluer.",
    "Dados: Open-Meteo • Mapas: OpenStreetMap • Fronteiras: Natural Earth • Locais: GeoNames CC BY 4.0. As previsões podem mudar.",
    "Datos: Open-Meteo • Mapas: OpenStreetMap • Fronteras: Natural Earth • Localidades: GeoNames CC BY 4.0. Las previsiones pueden cambiar."
  ],
  [
    "Scegli il luogo di cui vuoi consultare tutti i dati meteo, vento e mare.",
    "Choose a location to see its weather, wind and sea data.",
    "Choisissez une localité pour consulter météo, vent et mer.",
    "Escolha um local para consultar dados de tempo, vento e mar.",
    "Elige una localidad para consultar datos de tiempo, viento y mar."
  ],
  [
    "Condividi Card Meteo",
    "Share weather card",
    "Partager la carte météo",
    "Compartilhar cartão meteorológico",
    "Compartir tarjeta meteorológica"
  ],
  [
    "Condividi Card",
    "Share card",
    "Partager la carte",
    "Compartilhar cartão",
    "Compartir tarjeta"
  ],
  [
    "📱 Condividi sui Social",
    "📱 Share on social media",
    "📱 Partager sur les réseaux sociaux",
    "📱 Compartilhar nas redes sociais",
    "📱 Compartir en redes sociales"
  ],
  [
    "⬇ Scarica Immagine (PNG)",
    "⬇ Download image (PNG)",
    "⬇ Télécharger l’image (PNG)",
    "⬇ Baixar imagem (PNG)",
    "⬇ Descargar imagen (PNG)"
  ],
  [
    "Nessuna pubblicità, profilazione o analytics. Preferenze e cache restano nel browser; i dati meteo arrivano dai provider descritti nell’informativa.",
    "No ads, profiling or analytics. Preferences and cache stay in your browser; weather data comes from the providers listed in the privacy policy.",
    "Aucune publicité, aucun profilage ni suivi analytique. Préférences et cache restent dans le navigateur ; les données météo proviennent des fournisseurs cités dans la politique de confidentialité.",
    "Sem anúncios, perfilamento ou análises de uso. Preferências e cache ficam no navegador; os dados vêm dos provedores indicados na política de privacidade.",
    "Sin anuncios, perfiles ni analítica. Las preferencias y la caché permanecen en el navegador; los datos proceden de los proveedores indicados en la política de privacidad."
  ]
];
  for(const row of homeAuditCopy)for(const [index,code] of ['en','fr','pt-BR','es'].entries())lexicons[code][row[0]]=row[index+1];

  const sharedAuditCopy=[["Quanto è affidabile la previsione?","How reliable is the forecast?","Quelle est la fiabilité des prévisions ?","Qual é a confiabilidade da previsão?","¿Qué fiabilidad tiene la previsión?"],["È una stima orientativa dell’orizzonte temporale, non una probabilità certificata del singolo evento.","This is an indicative estimate of forecast range, not a certified probability for an individual event.","Il s’agit d’une estimation indicative liée à l’échéance, pas d’une probabilité certifiée pour un événement particulier.","É uma estimativa indicativa do horizonte temporal, não uma probabilidade certificada para um evento específico.","Es una estimación orientativa del horizonte temporal, no una probabilidad certificada de un evento concreto."],["Meteo AI applica criteri specifici per sicurezza, comfort e decisioni operative. I dati professionali aggiuntivi vengono caricati soltanto quando servono.","Meteo AI applies specific criteria for safety, comfort and operational decisions. Additional professional data loads only when needed.","Meteo AI applique des critères spécifiques de sécurité, de confort et de décision. Les données professionnelles supplémentaires sont chargées uniquement si nécessaire.","O Meteo AI aplica critérios específicos de segurança, conforto e decisões operacionais. Dados profissionais adicionais são carregados somente quando necessários.","Meteo AI aplica criterios específicos de seguridad, comodidad y decisiones operativas. Los datos profesionales adicionales se cargan solo cuando se necesitan."],["Energia del moto ondoso","Wave energy","Énergie des vagues","Energia das ondas","Energía del oleaje"],["Esplora le condizioni in un corridoio geografico","Explore conditions along a geographic corridor","Explorer les conditions dans un corridor géographique","Explore as condições em um corredor geográfico","Explora las condiciones en un corredor geográfico"],["Mi serve l’ombrello?","Will I need an umbrella?","Ai-je besoin d’un parapluie ?","Vou precisar de guarda-chuva?","¿Necesitaré paraguas?"],["Posso fare sport?","Can I exercise?","Puis-je faire du sport ?","Posso praticar esporte?","¿Puedo hacer deporte?"],["Tutte le funzioni incluse sono accessibili senza piano a pagamento.","All included features are available without a paid plan.","Toutes les fonctions incluses sont accessibles sans abonnement payant.","Todas as funções incluídas estão disponíveis sem plano pago.","Todas las funciones incluidas están disponibles sin plan de pago."],["La tua scheda meteo personalizzata generata al volo.","Your personalised weather card, generated instantly.","Votre carte météo personnalisée, générée instantanément.","Seu cartão meteorológico personalizado, gerado na hora.","Tu tarjeta meteorológica personalizada, generada al instante."],["Eventi nelle aree sorvegliate","Events in watched areas","Événements dans les zones surveillées","Eventos nas áreas monitoradas","Eventos en las zonas vigiladas"],["Gestisci località","Manage locations","Gérer les localités","Gerenciar locais","Gestionar localidades"],["Località sorvegliate","Watched locations","Localités surveillées","Locais monitorados","Localidades vigiladas"],["Criticità minima","Minimum severity","Gravité minimale","Gravidade mínima","Gravedad mínima"],["Usa località meteo","Use weather location","Utiliser la localité météo","Usar local da previsão","Usar localidad meteorológica"],["Quando andare al mare?","When should I go to the beach?","Quand aller à la plage ?","Quando ir à praia?","¿Cuándo ir a la playa?"],["Meteo AI distingue la qualità indicativa in base alla distanza temporale: più ci si allontana da oggi, maggiore è l’incertezza.","Meteo AI shows indicative quality based on forecast range: uncertainty increases farther from today.","Meteo AI indique une qualité indicative selon l’échéance : l’incertitude augmente avec le temps.","O Meteo AI indica a qualidade conforme o horizonte da previsão: a incerteza aumenta nos dias mais distantes.","Meteo AI indica la calidad según el horizonte de la previsión: la incertidumbre aumenta con la distancia temporal."],["Confronto esplorativo, non navigazione","Exploratory comparison, not navigation","Comparaison exploratoire, pas navigation","Comparação exploratória, não navegação","Comparación exploratoria, no navegación"],["segue la località meteo","follows the weather location","suit la localité météo","acompanha o local da previsão","sigue la localidad meteorológica"]];
  for(const row of sharedAuditCopy)for(const [index,code] of ['en','fr','pt-BR','es'].entries())lexicons[code][row[0]]=row[index+1];

  const runtimeAuditCopy=[["Non cercare giorno per giorno. Dicci cosa vuoi fare e analizzeremo le prossime 168 ore per trovare i momenti migliori.","Tell us what you want to do and we will analyse the next 168 hours to find the best times.","Dites-nous ce que vous souhaitez faire : nous analyserons les 168 prochaines heures pour trouver les meilleurs créneaux.","Diga o que deseja fazer e analisaremos as próximas 168 horas para encontrar os melhores horários.","Dinos qué quieres hacer y analizaremos las próximas 168 horas para encontrar los mejores momentos."],["Onde, temperatura dell’acqua, correnti e momento migliore nelle vicinanze della località selezionata. L’analisi parte automaticamente.","Waves, water temperature, currents and the best time near the selected location. Analysis starts automatically.","Vagues, température de l’eau, courants et meilleur créneau près de la localité choisie. L’analyse démarre automatiquement.","Ondas, temperatura da água, correntes e melhor horário perto do local selecionado. A análise começa automaticamente.","Olas, temperatura del agua, corrientes y mejor horario cerca de la localidad elegida. El análisis comienza automáticamente."],["Nessuna domanda viene inviata a servizi AI esterni.","No question is sent to external AI services.","Aucune question n’est envoyée à des services IA externes.","Nenhuma pergunta é enviada a serviços externos de IA.","Ninguna pregunta se envía a servicios externos de IA."],["Aggiornamento in corso...","Updating...","Actualisation...","Atualizando...","Actualizando..."],["Località già salvata","Location already saved","Localité déjà enregistrée","Local já salvo","Localidad ya guardada"],["Località salvata soltanto su questo dispositivo","Location saved only on this device","Localité enregistrée uniquement sur cet appareil","Local salvo apenas neste dispositivo","Localidad guardada solo en este dispositivo"],["Impossibile confrontare questa località.","Unable to compare this location.","Impossible de comparer cette localité.","Não foi possível comparar este local.","No se ha podido comparar esta localidad."],["Inserisci una località","Enter a location","Saisissez une localité","Informe um local","Introduce una localidad"]];
  for(const row of runtimeAuditCopy)for(const [index,code] of ['en','fr','pt-BR','es'].entries())lexicons[code][row[0]]=row[index+1];

  const worldRuntimeCopy=[["Aggiornamento degli eventi reali…","Updating observed events…","Actualisation des événements observés…","Atualizando eventos observados…","Actualizando eventos observados…"],["Fonti momentaneamente non raggiungibili","Sources temporarily unreachable","Sources temporairement inaccessibles","Fontes temporariamente inacessíveis","Fuentes temporalmente inaccesibles"],["non raggiungibile: le altre fonti restano attive.","unreachable: the other sources remain active.","inaccessible : les autres sources restent actives.","inacessível: as outras fontes continuam ativas.","inaccesible: las demás fuentes siguen activas."],["Nessun evento visibile","No visible events","Aucun événement visible","Nenhum evento visível","Ningún evento visible"],["Nessun evento con questi filtri","No events match these filters","Aucun événement avec ces filtres","Nenhum evento com estes filtros","No hay eventos con estos filtros"],["Prova un periodo più ampio oppure seleziona “Tutti”.","Try a longer period or select “All”.","Essayez une période plus longue ou sélectionnez « Tous ».","Tente um período maior ou selecione “Todos”.","Prueba un período más amplio o selecciona «Todos»."],["Percentuale non disponibile","Percentage unavailable","Pourcentage indisponible","Percentual indisponível","Porcentaje no disponible"],["IMPATTO AI SU","AI IMPACT ON","IMPACT IA SUR","IMPACTO IA EM","IMPACTO IA EN"],["Rilevanza elevata","High relevance","Forte pertinence","Alta relevância","Relevancia alta"],["Da seguire","Worth watching","À suivre","Acompanhar","A seguir"],["Rilevanza limitata","Limited relevance","Pertinence limitée","Relevância limitada","Relevancia limitada"],["Rilevanza molto bassa","Very low relevance","Très faible pertinence","Relevância muito baixa","Relevancia muy baja"],["Indice orientativo, non probabilità né allerta ufficiale.","Indicative score, not a probability or official warning.","Indice indicatif, pas une probabilité ni une alerte officielle.","Índice indicativo, não uma probabilidade ou alerta oficial.","Índice orientativo, no una probabilidad ni una alerta oficial."],["LETTURA METEO AI","METEO AI INTERPRETATION","INTERPRÉTATION METEO AI","INTERPRETAÇÃO METEO AI","INTERPRETACIÓN METEO AI"],["Cosa significa per la tua località","What it means for your location","Conséquences pour votre localité","O que significa para seu local","Qué significa para tu localidad"],["EVENTO OSSERVATO","OBSERVED EVENT","ÉVÉNEMENT OBSERVÉ","EVENTO OBSERVADO","EVENTO OBSERVADO"],["PROBABILITÀ O CERTEZZA UFFICIALE","OFFICIAL PROBABILITY OR CERTAINTY","PROBABILITÉ OU CERTITUDE OFFICIELLE","PROBABILIDADE OU CERTEZA OFICIAL","PROBABILIDAD O CERTEZA OFICIAL"],["Nessuna percentuale inventata","No invented percentages","Aucun pourcentage inventé","Nenhum percentual inventado","Ningún porcentaje inventado"],["LIVELLO DELLA FONTE","SOURCE LEVEL","NIVEAU DE LA SOURCE","NÍVEL DA FONTE","NIVEL DE LA FUENTE"],["La terminologia appartiene alla fonte indicata e può avere significati diversi secondo il tipo di evento.","Terminology belongs to the named source and may have different meanings depending on the event type.","La terminologie appartient à la source indiquée et peut varier selon le type d’événement.","A terminologia pertence à fonte indicada e pode variar conforme o tipo de evento.","La terminología pertenece a la fuente indicada y puede variar según el tipo de evento."],["Nessuna località sorvegliata","No watched locations","Aucune localité surveillée","Nenhum local monitorado","Ninguna localidad vigilada"],["Aggiungi una città oppure usa la posizione del dispositivo.","Add a city or use your device’s location.","Ajoutez une ville ou utilisez la position de l’appareil.","Adicione uma cidade ou use a localização do dispositivo.","Añade una ciudad o usa la ubicación del dispositivo."],["Non supportate da questo browser.","Not supported by this browser.","Non prises en charge par ce navigateur.","Não suportadas por este navegador.","No compatibles con este navegador."],["Attive: gli avvisi vengono mostrati durante gli aggiornamenti.","Enabled: notices appear during updates.","Actives : les avis apparaissent lors des mises à jour.","Ativas: os avisos aparecem durante as atualizações.","Activas: los avisos aparecen durante las actualizaciones."],["Notifiche attive","Notifications enabled","Notifications actives","Notificações ativas","Notificaciones activas"],["Bloccate nelle impostazioni del browser.","Blocked in browser settings.","Bloquées dans les paramètres du navigateur.","Bloqueadas nas configurações do navegador.","Bloqueadas en los ajustes del navegador."],["Notifiche bloccate","Notifications blocked","Notifications bloquées","Notificações bloqueadas","Notificaciones bloqueadas"],["Serve il tuo consenso; nessuna autorizzazione viene chiesta automaticamente.","Your consent is needed; permission is never requested automatically.","Votre consentement est nécessaire ; aucune autorisation n’est demandée automatiquement.","Seu consentimento é necessário; nenhuma permissão é solicitada automaticamente.","Se necesita tu consentimiento; no se solicita permiso automáticamente."]];
  for(const row of worldRuntimeCopy)for(const [index,code] of ['en','fr','pt-BR','es'].entries())lexicons[code][row[0]]=row[index+1];

  function normalise(value){
    const code=String(value||'').trim().replace('_','-');
    const lower=code.toLowerCase();
    if(lower==='it'||lower.startsWith('it-'))return'it';
    if(lower==='en'||lower.startsWith('en-'))return'en';
    if(lower==='fr'||lower.startsWith('fr-'))return'fr';
    if(lower==='pt'||lower.startsWith('pt-'))return'pt-BR';
    if(lower==='es'||lower.startsWith('es-'))return'es';
    return null;
  }
  function languageFromPath(pathname=global.location?.pathname||''){
    const first=pathname.split('/').filter(Boolean)[0]?.toLowerCase();
    return first==='pt-br'?'pt-BR':first==='en'||first==='fr'||first==='es'?first:null;
  }
  function detected(){
    const explicit=normalise(global.__METEO_LOCALE__)||languageFromPath();
    if(explicit)return explicit;
    try{const stored=normalise(localStorage.getItem(STORAGE_KEY));if(stored)return stored}catch(_){}
    for(const candidate of navigator.languages||[navigator.language]){const match=normalise(candidate);if(match)return match}
    return'en';
  }
  let language=detected();
  const originals=new WeakMap();
  let applying=false;
  function interpolate(value,params={}){return String(value).replace(/\{(\w+)\}/g,(_,key)=>params[key]??`{${key}}`)}
  function t(key,params){const table=messages[language]||messages.en;return interpolate(table[key]??messages.en[key]??messages.it[key]??key,params)}
  function escaped(value){return value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  const compiledTranslations=new Map();
  function translationRules(lang){
    if(compiledTranslations.has(lang))return compiledTranslations.get(lang);
    const dictionary=lexicons[lang]||lexicons.en;
    const exact=new Map(Object.entries(dictionary).map(([source,target])=>[source.toLocaleLowerCase(),target]));
    const entries=Object.entries(dictionary).filter(([source])=>source.includes(' ')||/^\p{Lu}/u.test(source)).sort((a,b)=>b[0].length-a[0].length);
    const patterns=entries.map(([source])=>{const boundary=/^[\p{L}\p{N}]/u.test(source)&&/[\p{L}\p{N}]$/u.test(source);return `${boundary?'(?<![\\p{L}])':''}${escaped(source)}${boundary?'(?![\\p{L}])':''}`});
    const rules={exact,pattern:new RegExp(patterns.join('|'),'giu')};compiledTranslations.set(lang,rules);return rules;
  }
  function translateString(value,lang=language){
    if(lang==='it'||!value||!/[A-Za-zÀ-ÿ]/.test(value))return value;
    const exactKey=Object.keys(messages.it).find(key=>messages.it[key]===value.trim());
    if(exactKey){const translated=(messages[lang]||messages.en)[exactKey];return value.replace(value.trim(),translated)}
    let result=value;
    const rules=translationRules(lang),exact=rules.exact.get(value.trim().toLocaleLowerCase());
    if(exact!==undefined)return value.replace(value.trim(),exact);
    // Translate each source span once; never run translated text through later rules.
    result=result.replace(rules.pattern,match=>rules.exact.get(match.toLocaleLowerCase())??match);
    return result;
  }
  function applyText(node){
    let record=originals.get(node);
    if(!record||typeof record!=='object'||!('source'in record)){const marker=node.previousSibling,marked=marker?.nodeType===8&&marker.nodeValue?.startsWith('meteo-i18n:')?marker.nodeValue.slice(11):'';let source=node.nodeValue;if(marked)try{source=decodeURIComponent(marked)}catch(_){}record={source,rendered:node.nodeValue}}
    else if(node.nodeValue!==record.rendered)record.source=node.nodeValue;
    record.rendered=translateString(record.source);
    originals.set(node,record);
    if(node.nodeValue!==record.rendered)node.nodeValue=record.rendered;
  }
  const attrs=['placeholder','aria-label','title','alt'];
  function applyElement(element){
    if(element.closest?.('[data-no-i18n],.brand,script,style,code,pre'))return;
    for(const attr of attrs){if(element.hasAttribute?.(attr)){const key=`@${attr}`;let record=originals.get(element);if(!record||typeof record!=='object'){record={};originals.set(element,record)}if(!(key in record)){const marked=element.getAttribute(`data-i18n-source-${attr}`);record[key]=marked?decodeURIComponent(marked):element.getAttribute(attr)}element.setAttribute(attr,translateString(record[key]))}}
    for(const node of element.childNodes||[]){if(node.nodeType===3)applyText(node);else if(node.nodeType===1)applyElement(node)}
  }
  function apply(root=document){applying=true;try{applyElement(root.documentElement||root);document.documentElement.lang=localeMap[language];updateSelector();updateManifest();updateSeoLinks()}finally{applying=false}}
  function updateManifest(){const link=document.querySelector('link[rel="manifest"]');if(link)link.href=language==='it'?'/manifest.webmanifest':`/manifest.${language}.webmanifest`}
  function pageKind(pathname=global.location?.pathname||'/'){
    const clean=pathname.replace(/^\/(en|fr|pt-br|es)(?=\/|$)/i,'')||'/';
    if(/world-live(?:\.html)?\/?$/i.test(clean))return'world';
    if(/(?:installa(?:\.html)?|install)\/?$/i.test(clean))return'install';
    return'home';
  }
  function localizedPath(code,kind=pageKind()){
    const locationMatch=(global.location?.pathname||'').match(/^\/(?:meteo|en\/weather|fr\/meteo|pt-br\/previsao|es\/tiempo)(\/[a-z]{2}\/[^/]+\/[^/]+-\d+)$/);
    if(locationMatch)return {it:'/meteo',en:'/en/weather',fr:'/fr/meteo','pt-BR':'/pt-br/previsao',es:'/es/tiempo'}[code]+locationMatch[1];
    const routes={home:{it:'/',en:'/en',fr:'/fr','pt-BR':'/pt-br',es:'/es'},world:{it:'/world-live.html',en:'/en/world-live',fr:'/fr/world-live','pt-BR':'/pt-br/world-live',es:'/es/world-live'},install:{it:'/installa.html',en:'/en/install',fr:'/fr/install','pt-BR':'/pt-br/install',es:'/es/install'}};
    return routes[kind][code];
  }
  function updateSeoLinks(){
    if(!global.location||!document.head)return;
    const kind=pageKind(),origin=global.location.origin;
    const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=origin+localizedPath(language,kind);
    for(const [code,hreflang]of Object.entries({it:'it',en:'en',fr:'fr','pt-BR':'pt-BR',es:'es'})){
      let link=document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);if(!link){link=document.createElement('link');link.rel='alternate';link.hreflang=hreflang;document.head.append(link)}link.href=origin+localizedPath(code,kind);
    }
    let fallback=document.querySelector('link[rel="alternate"][hreflang="x-default"]');if(!fallback){fallback=document.createElement('link');fallback.rel='alternate';fallback.hreflang='x-default';document.head.append(fallback)}fallback.href=origin+localizedPath('it',kind);
    const ogUrl=document.querySelector('meta[property="og:url"]');if(ogUrl)ogUrl.content=origin+localizedPath(language,kind);
    const growth={how:{it:'/come-funziona',en:'/en/how-it-works',fr:'/fr/comment-ca-marche','pt-BR':'/pt-br/como-funciona',es:'/es/como-funciona'},widget:{it:'/widget',en:'/en/widget',fr:'/fr/widget','pt-BR':'/pt-br/widget',es:'/es/widget'},tomorrow:{it:'/meteo-domani',en:'/en/weather-tomorrow',fr:'/fr/meteo-demain','pt-BR':'/pt-br/previsao-amanha',es:'/es/tiempo-manana'}};
    document.querySelectorAll('[data-growth-link]').forEach(link=>{const routes=growth[link.dataset.growthLink];if(routes)link.href=routes[language]});
  }
  function selector(){
    let select=document.getElementById('languageSelect');if(select)return select;
    const host=document.querySelector('.header-actions');if(!host)return null;
    const wrap=document.createElement('label');wrap.className='language-picker';wrap.setAttribute('aria-label',t('languageSelector'));wrap.innerHTML=`<span aria-hidden="true">${flags[language]}</span><select id="languageSelect">${supported.map(code=>`<option value="${code}">${names[code]}</option>`).join('')}</select>`;
    const old=host.querySelector('.language-status');if(old)old.replaceWith(wrap);else host.insertBefore(wrap,host.firstChild);
    select=wrap.querySelector('select');select.value=language;select.addEventListener('change',()=>setLanguage(select.value,true));return select;
  }
  function updateSelector(){const select=selector();if(select){select.value=language;select.closest('label').querySelector('span').textContent=flags[language];select.closest('label').setAttribute('aria-label',t('languageSelector'))}}
  function setLanguage(value,persist=false){const next=normalise(value)||'en';if(persist)try{localStorage.setItem(STORAGE_KEY,next)}catch(_){}if(next===language)return;if(persist&&global.location?.assign){global.location.assign(`${localizedPath(next)}${global.location.search}${global.location.hash}`);return}language=next;apply(document);document.dispatchEvent(new CustomEvent('meteo:languagechange',{detail:{language,locale:localeMap[language]}}))}
  function formatDate(value,options){return new Intl.DateTimeFormat(localeMap[language],options).format(value instanceof Date?value:new Date(value))}
  function formatTime(value,options={hour:'2-digit',minute:'2-digit'}){return formatDate(value,options)}
  function formatNumber(value,options){return new Intl.NumberFormat(localeMap[language],options).format(value)}
  function formatRelative(value,unit){return new Intl.RelativeTimeFormat(localeMap[language],{numeric:'auto'}).format(value,unit)}
  function queryLanguage(){return language==='pt-BR'?'pt':language}

  // Some legacy renderers explicitly passed it-IT. Keep their output aligned
  // with the selected UI locale while those renderers remain API-compatible.
  for(const method of ['toLocaleDateString','toLocaleTimeString','toLocaleString']){
    const original=Date.prototype[method];
    Date.prototype[method]=function(locales,options){return original.call(this,locales==='it-IT'?localeMap[language]:locales,options)};
  }
  const originalNumberLocale=Number.prototype.toLocaleString;
  Number.prototype.toLocaleString=function(locales,options){return originalNumberLocale.call(this,locales==='it-IT'?localeMap[language]:locales,options)};

  const observer=new MutationObserver(records=>{if(applying)return;applying=true;try{for(const record of records){if(record.type==='characterData')applyText(record.target);else for(const node of record.addedNodes){if(node.nodeType===3)applyText(node);else if(node.nodeType===1)applyElement(node)}}}finally{applying=false}});
  global.I18n={supported,messages,names,flags,t,translate:translateString,apply,setLanguage,resolveLanguage:normalise,languageFromPath,localizedPath,get language(){return language},get locale(){return localeMap[language]},formatDate,formatTime,formatNumber,formatRelative,queryLanguage,storageKey:STORAGE_KEY};
  document.documentElement.lang=localeMap[language];
  global.I18n.updateSeoLinks=updateSeoLinks;
  document.addEventListener('DOMContentLoaded',()=>{if(!languageFromPath()&&language!=='it'&&global.location?.replace){global.location.replace(`${localizedPath(language)}${global.location.search}${global.location.hash}`);return}apply(document);observer.observe(document.body,{subtree:true,childList:true,characterData:true})});
})(window);
