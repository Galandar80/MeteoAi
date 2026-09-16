# SEO: interventi e misurazioni del 16 settembre 2026

## Correzioni di questa tranche
- Riepilogo meteo principale e relativi consigli: frasi parametrizzate nelle cinque lingue, senza sostituzioni sui nomi delle città. Completate le etichette delle condizioni meteo utilizzate dal client e alcune etichette di stato.
- Il traduttore automatico rispetta i nodi testuali esclusi dalla traduzione anche negli aggiornamenti dinamici.
- Sitemap: con archivio configurato ma non raggiungibile all'avvio, risposta 503 no-store e Retry-After 300 anziché una lista ridotta. Una lista completa già caricata viene mantenuta durante il guasto. Senza archivio configurato resta intenzionalmente disponibile il catalogo iniziale.
- GPS automatico solo quando il permesso è già concesso; negli altri casi resta disponibile il pulsante esplicito. Nessuna modifica alle autorizzazioni del browser.
- Aggiornato il test che cercava ancora il vecchio file sitemap.xml rimosso nel precedente deploy: ora verifica l'indice dinamico e impedisce la reintroduzione del conflitto statico.

## Search Console: fotografia, non effetto delle nuove modifiche
Report consultati in sola lettura il 16 settembre. Indicizzazione: 2.074 URL indicizzati, 414 esclusi (95 reindirizzamenti; 1 noindex; 263 rilevati ma non indicizzati; 51 scansionati ma non indicizzati; 4 vecchi 404). I quattro URL /meteo/gw, /meteo/th, /meteo/es e /meteo/ve oggi rispondono 308 verso la home: la convalida risultava già avviata. Non modificati né riconvalidati indiscriminatamente. I reindirizzamenti alla home non dimostrano una corrispondenza semantica: da valutare separatamente se creare vere destinazioni paese.

Il campione delle pagine scansionate escluse mostra scansioni del 5 settembre, precedenti alle correzioni del 15 settembre. Nicastro in inglese risponde oggi 200 con canonical coerente. Non è una prova che tutte le 51 pagine siano corrette né che Google debba indicizzarle.

Rendimento nel grafico mostrato (22 luglio–13 settembre): 30 clic, 18.198 impressioni, CTR arrotondato 0,2%, posizione media 39,6. Questi aggregati non misurano gli interventi appena eseguiti.

| Pagina | Clic | Impressioni |
| --- | ---: | ---: |
| Napoli, italiano | 12 | 540 |
| Hyderabad, inglese | 8 | 1.078 |
| Surat, inglese | 3 | 55 |

Paesi: Italia 15 clic / 3.519 impressioni; India 11 / 3.414; USA 1 / 904; Brasile 1 / 757; Francia 1 / 751; Spagna 1 / 484. Campione piccolo: priorità provvisoria a italiano/inglese, senza eliminare le altre lingue. Le query generiche portoghesi e spagnole hanno molte impressioni ma nessun clic nel campione; non attribuire la causa al solo titolo senza posizione e contesto della query.

## Prestazioni
Search Console: dati reali insufficienti sia mobile sia desktop negli ultimi 90 giorni.
PageSpeed mobile del sito pubblico alle 15:20 CEST, prima di queste modifiche: prestazioni 73, accessibilità 100, best practice 96, SEO automatico 100. FCP 2,7 s; LCP 5,6 s; TBT 120 ms; CLS 0,058; Speed Index 2,9 s. Moto G Power simulato e rete 4G lenta, singola misurazione, non Core Web Vitals reali. I controlli di attribuzione LCP hanno restituito errore: non è stata attribuita arbitrariamente la lentezza a mappe o font. Rilevata richiesta di geolocalizzazione al caricamento, corretta nel codice.

[Report PageSpeed](https://pagespeed.web.dev/analysis/https-meteo-ai-vercel-app/nluzoh49pn?utm_source=search_console&form_factor=mobile&hl=it)

## Verifiche e limiti
Test aggiunti per guasto/ripristino sitemap, frasi meteo in cinque lingue con rami pioggia/UV e consenso GPS. Verifiche browser locali: riepiloghi francese e spagnolo corretti dopo caricamento dei dati; nessun errore console rilevato nel campione spagnolo. Pagine pubbliche Napoli, Hyderabad, Surat e Nicastro: 200 e canonical coerente al controllo.

Non sono completate tutte le traduzioni dei profili professionali, dei consigli mare, della finestra meteo e dell'assistente domande/viaggi. Nessuna certificazione integrale di tutte le lingue. Il LCP richiede una traccia diagnostica affidabile e un confronto prima/dopo prima di modificare il caricamento dei moduli. Non aggiunti contenuti generici, pagine di massa, monitoraggi ricorrenti o richieste di indicizzazione.

## Sequenza successiva
1. Completare la migrazione a frasi parametrizzate dei moduli avanzati, con test delle interazioni.
2. Tracciare il LCP su home e pagina località e ottimizzare soltanto i colli di bottiglia verificati.
3. Approfondire i canonical scelti da Google e gli altri gruppi di esclusione con campioni mirati.
4. Misurare Napoli/Hyderabad/Surat e le query domani dopo un periodo comparabile; solo allora valutare cambi editoriali e collegamenti interni mirati.

## Continuazione: strumenti avanzati e diagnosi LCP
- Tradotti con messaggi parametrizzati Finestra Meteo, riepiloghi e messaggi di errore dei viaggi, risposte dell'assistente. Nomi delle località preservati; nell'HTML dei viaggi vengono escapati dopo interpolazione.
- Aggiunti intenti e date in spagnolo (mañana, pasado mañana, giorni della settimana). Restano i limiti di un riconoscitore locale per parole chiave, non una comprensione linguistica generale.
- Completate direzioni e descrizioni del vento mediante chiavi esplicite, senza sostituire nomi cardinali globalmente nel testo. Tradotte le frasi dei consigli dei dieci profili e parametrizzati i messaggi fotografici con alba/tramonto.
- Verificata nel browser una domanda spagnola sul giorno successivo: risposta interamente spagnola con località preservata. Nuovi test coprono cinque lingue, finestre disponibili/assenti, date spagnole, viaggi con nomi contenenti caratteri HTML, errori e campioni dei dieci profili.
- Audit Lighthouse CLI 13.0.1 su /fr pubblico: LCP 2,4 s, FCP 2,2 s, prestazioni 77. L'elemento LCP è il titolo H1; risorse bloccanti includono i18n.js, font, CSS Leaflet e styles.css. Non confrontabile direttamente con il precedente PageSpeed su / (ambiente e URL diversi).
- Esperimento locale con script defer: prima LCP 3,72 s / TBT 178,5 ms / CLS 0,146 / punteggio 75; dopo LCP 4,07 s / TBT 214,5 ms / CLS 0,078 / punteggio 79. Singole prove variabili, nessuna dimostrazione di miglioramento LCP. La modifica defer è stata ANNULLATA: non inclusa nella PR e nessun miglioramento di velocità dichiarato.
- I tre report Lighthouse JSON restano locali, esclusi da Git. Non contengono una verifica di Core Web Vitals reali.
- Restano da coprire integralmente gli stati del modulo marino/atlante/corridoio, messaggi dinamici dello storico e degli avvisi e casi limite dei profili. Le parti completate non equivalgono alla certificazione linguistica integrale dell'app.

## Continuazione: avvisi, storico e riepilogo mare
- Parametrizzati i valori degli avvisi in cinque lingue, senza modificare le soglie; tradotti titoli e messaggi dello storico.
- Corretto lo storico: i valori nulli dell'archivio non vengono più convertiti in zero, ma esclusi dalla media. Con un campione insufficiente resta lo stato di indisponibilità.
- Localizzati riepilogo mare, direzioni, distanza del punto modellistico, correnti orarie e principali stati di caricamento/errore dell'atlante. Conservate le avvertenze sui limiti dei dati e sui bollettini marini.
- Nuovo test automatico in cinque lingue per valori degli avvisi, media storica con dati mancanti, errore con campione vuoto e riepilogo marino. Aggiornata la versione della cache PWA.
- Restano da verificare e completare i testi dei dettagli marini futuri, dei popup e del corridoio nautico. Nessuna modifica a URL, criteri di indicizzazione, Search Console o caricamento degli script in questo passaggio. Il lavoro resta nella PR in bozza, non in produzione.
