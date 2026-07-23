# Meteo AI

**Meteo AI — Il meteo reale calcolato dall'intelligenza artificiale** è un sito statico mondiale con previsioni, mappe e strumenti decisionali eseguiti nel browser.

## Avvio locale

```bash
python3 -m http.server 8080
```

## Pagine SEO delle località

Le pagine sotto `/meteo/{nazione}/{regione}/{localita-id}` vengono generate su richiesta dalla funzione Vercel `api/meteo-page.js`. Il catalogo e le sitemap derivano dal dump ufficiale GeoNames `cities15000`, che include circa 25.000 città con più di 15.000 abitanti o capoluoghi.

Per rigenerare catalogo e sitemap:

```bash
node scripts/generate-location-seo.mjs /percorso/alla/cartella/geonames
```

La cartella indicata deve contenere `cities15000.txt`, `admin1CodesASCII.txt` e `countryInfo.txt`.

Località: [GeoNames](https://www.geonames.org/), licenza [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).

Apri `http://localhost:8080`.

## Funzioni incluse

- ricerca mondiale, suggerimenti e geolocalizzazione;
- condizioni correnti, dettaglio orario e previsioni a 14 giorni;
- qualità dell'aria, alba, tramonto, UV e ore di luce;
- situazione dei venti con direzione, raffiche, scala Beaufort, andamento orario e finestra più tranquilla;
- Mare AI su richiesta con temperatura superficiale, onde, periodo e correnti;
- previsione marina giornaliera e dettaglio orario fino a 8 giorni;
- Atlante dei mari sempre aperto che segue automaticamente la nazione della località scelta, con copertura mondiale e previsioni costiere a 8 giorni;
- confronto meteo fra porti con campionamento multipunto, indice del corridoio e linea geografica esplicitamente non utilizzabile per la navigazione;
- profili specializzati per pesca, vela, surf, bambini, animali e droni; Pesca, Vela e Surf caricano automaticamente Mare AI quando vengono selezionati;
- modalità professionali per agricoltura, edilizia, escursionismo e fotografia, con indicatori e soglie specifiche;
- avvisi previsionali Meteo AI su temporali, raffiche, pioggia, temperature, UV e mare, affiancati dal collegamento agli avvisi ufficiali;
- consenso adattivo su richiesta fra Best Match locale, ECMWF, GFS e ICON, con pesi geografici e temporali e probabilità calcolate da 51 simulazioni ECMWF ensemble;
- località selezionata sempre visibile, cambio rapido e menu completo delle sezioni;
- indicatore trasparente dell'attendibilità orientativa per ogni giorno;
- mappa OpenStreetMap interattiva;
- Mondo Live con mappa mondiale, terremoti USGS, eventi naturali NASA EONET e copertura tsunami internazionale tramite NOAA/PTWC-NTWC, JMA e BMKG;
- Radar personale con località sorvegliate, raggio, tipo di evento e soglia di criticità configurabili, avvisi geolocalizzati e notifiche browser/PWA con consenso esplicito;
- grafico delle prossime 24 ore e confronto fra due località;
- Finestra Meteo: analisi delle prossime 168 ore per sei attività;
- assistente locale per domande su pioggia, sport, mare, bucato, eventi, vento, UV e abbigliamento;
- assistente viaggio con criticità e lista della valigia;
- preferiti e tema chiaro/scuro salvati solo sul dispositivo;
- PWA installabile e interfaccia responsive.

L’interfaccia pubblicata è attualmente solo in italiano. Le precedenti traduzioni parziali inglese e spagnola sono state rimosse finché contenuti statici, messaggi dinamici, accessibilità e testi legali non potranno essere tradotti e verificati integralmente.

## Architettura leggera

Questa versione non usa API generative, database, account, pagamenti, pubblicità o analytics. L'analisi intelligente è deterministica e viene eseguita in JavaScript nel browser usando i dati meteo ricevuti.

Il codice condiviso di rete, stato e formattazione è raccolto in `app-core.js`; l’interfaccia principale resta in `app.js`, mentre mare, assistenti, funzioni aggiuntive e testi legali sono separati rispettivamente in `app-marine.js`, `app-assistants.js`, `app-features.js` e `app-legal.js`. `app-bootstrap.js` avvia l’app soltanto dopo il caricamento di tutti i moduli.

Il dominio pubblico e i file tecnici per i motori di ricerca sono già configurati su `https://meteo-ai.vercel.app`.

## Indicizzazione automatica delle località

Le pagine in `/meteo/paese/regione/localita-id` sono renderizzate sul server con titolo, descrizione, URL canonico, dati strutturati e previsioni specifiche. Il catalogo comprende le città GeoNames con almeno 15.000 abitanti e le capitali: non è quindi necessario inserire manualmente ogni località in Google o Bing.

Il file `sitemap.xml` è un indice che collega la sitemap statica e sette sitemap di località, per un totale di oltre 34.000 URL. Le località sono suddivise nei file `data/localities-*.json` per restare compatibili con i limiti di pubblicazione e vengono attribuite a GeoNames secondo licenza CC BY 4.0.

Per rigenerare catalogo e sitemap partendo dai dump ufficiali `cities15000.txt`, `admin1CodesASCII.txt` e `countryInfo.txt`:

```powershell
node scripts/generate-location-seo.mjs C:\percorso\alla\cartella-geonames
node scripts/test-location-seo.mjs
```

## Limiti reali del costo zero

Il codice non genera addebiti diretti, ma il costo zero non può essere garantito per traffico illimitato. Le API pubbliche e i provider di hosting applicano limiti e condizioni d'uso. L'endpoint pubblico di Open-Meteo è adatto al progetto non commerciale entro i limiti dichiarati dal fornitore. Prima di attivare pubblicità, abbonamenti o un uso commerciale bisogna verificare le licenze e migrare a un'infrastruttura compatibile.

Per ridurre le richieste, la PWA memorizza localmente i file dell'interfaccia. I dati meteo restano aggiornati tramite Open-Meteo e le tessere della mappa tramite OpenStreetMap.

Le previsioni già richieste vengono riutilizzate per 10 minuti nella stessa sessione, evitando chiamate duplicate quando l'utente riapre una località. I dati marini locali partono automaticamente dopo il caricamento del meteo e restano in cache per 30 minuti; il pulsante della sezione serve soltanto per aggiornarli. L'Atlante riconosce il codice ISO della località, legge localmente il confine nazionale semplificato, distingue coste e confini terrestri e invia in una sola richiesta multipunto soltanto campioni verificati sul lato marino. Solo la geolocalizzazione GPS o territori non presenti nella carta locale richiedono un controllo geografico esterno, memorizzato per 7 giorni. Le modalità professionali caricano su richiesta una sola previsione aggiuntiva con suolo, VPD, nuvole, visibilità, evapotraspirazione, neve e durata delle precipitazioni, riutilizzata per 30 minuti da tutti e quattro i profili. Le rotte porto–porto e l'analisi probabilistica restano in cache per 60 minuti. Quest'ultima è volutamente su richiesta perché l'ensemble pesa più di una previsione normale. Mondo Live conserva i feed pubblici per dieci minuti e limita i marker visibili per mantenere la mappa fluida. Le informazioni sul vento viaggiano nella richiesta meteo principale e non aggiungono una chiamata separata.

Mondo Live distingue sempre evento osservato, livello ufficiale, probabilità dichiarata dalla fonte e indice d'impatto calcolato localmente. Non tenta di prevedere terremoti o eruzioni e non trasforma giudizi qualitativi in percentuali inventate. Le richieste esterne hanno timeout e un tentativo automatico aggiuntivo. I feed NOAA CAP, JMA XML o BMKG possono comunque non essere raggiungibili da tutti gli hosting statici per CORS, disponibilità o condizioni del fornitore: in quel caso la pagina segnala la singola fonte momentaneamente indisponibile e continua a usare le altre. BMKG richiede l'attribuzione della fonte, già presente nell'interfaccia.

I dati marini sono modellistici. Il punto selezionato può essere distante dalla località cercata e l'interfaccia mostra tale distanza. I marker dell'Atlante rappresentano aree campione. La linea porto–porto è geometrica e non tiene conto di rotte ufficiali, ostacoli, traffico o decisioni delle compagnie. Mare AI non è uno strumento di navigazione e non sostituisce bollettini, ordinanze, compagnie di navigazione o autorità marittime.

La carta mondiale semplificata è derivata da Natural Earth tramite `world-atlas`; il collegamento tra codici ISO e nomi dei Paesi usa dati `world-countries`. Natural Earth è di pubblico dominio, mentre i relativi pacchetti e dati mantengono le attribuzioni e licenze indicate dai rispettivi progetti. Il fallback geografico usa Nominatim/OpenStreetMap con cache e senza richieste automatiche ripetute.

Gli “Avvisi Meteo AI” sono segnalazioni automatiche basate su soglie previsionali, non allerte ufficiali. Il sito rimanda sempre a MeteoAlarm per la verifica. L'analisi probabilistica usa realmente i membri ensemble: per esempio, “pioggia ≥ 1 mm: 60%” significa che il 60% delle simulazioni disponibili supera quella soglia. Non è una certificazione e l'affidabilità resta legata alla qualità dei modelli.

Il consenso adattivo assegna più peso al Best Match locale nei primi tre giorni, quando i modelli regionali ad alta risoluzione possono fornire il maggior dettaglio. Dal terzo al settimo giorno il peso viene progressivamente riequilibrato verso ECMWF, GFS e ICON. I pesi descrivono copertura, risoluzione e orizzonte disponibile: non sono una classifica storica certificata dell'accuratezza. Le probabilità di evento restano separate e derivano dai membri ensemble.

## Possibile fase futura

Account, sincronizzazione cloud e push a sito completamente chiuso sono volutamente esclusi: richiedono un server push e una gestione continuativa. Le località sorvegliate restano invece nel dispositivo e le notifiche funzionano senza account durante gli aggiornamenti della pagina o della PWA aperta/attiva, mantenendo l'architettura senza costi obbligatori.
