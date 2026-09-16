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
