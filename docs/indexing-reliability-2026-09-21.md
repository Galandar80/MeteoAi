# Affidabilità dell'indicizzazione — 21 settembre 2026

## Evidenze

- Search Console: 27 esempi 5xx con scansioni del 17–18 settembre. Al controllo del 21 settembre, tutti rispondono 200. Non è una prova dell'assenza di errori intermittenti.
- Dashboard Vercel autenticata: il piano Hobby consente i log dell'ultima ora; gli intervalli storici richiedono un piano superiore. Nessun acquisto o cambio piano. Nell'intervallo 15:23–16:23 circa: 74 risposte 200, un 404, nessun 5xx elencato. Parte del traffico proviene dai nostri controlli.
- La causa delle risposte storiche non è dimostrata. Il codice pubblicato interrompeva il recupero meteo dopo 1,8 secondi; senza cache restituiva 503, quindi esiste un percorso riproducibile di errore per fornitori lenti.
- `/meteo/pk/sindh/installa.html` restituisce 404; l'origine da un vecchio collegamento relativo è un'ipotesi. La home contieneva ancora due collegamenti relativi all'installazione.
- `/meteo/gw`, `/meteo/th`, `/meteo/es`, `/meteo/ve` reindirizzavano alla home, ma non esistono pagine paese equivalenti. La directory attuale è un elenco internazionale delle località attive, non una destinazione specifica per questi paesi.

## Modifiche

- Tempo per tentativo 4 secondi; al massimo due tentativi e 6 secondi complessivi, compresa una pausa di 150 ms. Il secondo tentativo è limitato a timeout, errori di rete fetch e HTTP 500/502/503/504 senza Retry-After. Nessun tentativo aggiuntivo per 429, altri 4xx, JSON non valido o dati vuoti.
- Restano cache condivisa tra richieste della stessa istanza, deduplicazione delle richieste simultanee, limite di sei ore e limite del giorno locale. Nessuna estensione a dati di giorni precedenti o nuovo servizio a pagamento.
- Log strutturato del fallimento con ID della località, categoria, stato del fornitore e numero di tentativi; nessun identificativo dell'utente o segreto.
- Quando manca del tutto una previsione utilizzabile resta 503, no-store e Retry-After 300.
- Reindirizzamento permanente solo dell'URL di installazione errata osservata verso `/installa.html`; collegamenti della home resi assoluti rispetto alla radice.
- Le URL paese senza contenuto ora ricevono il vero 404 con noindex e collegamento di navigazione, attraverso il gestore esistente. Non creare pagine vuote o reindirizzamenti non pertinenti per azzerare il rapporto.

## Verifiche e pubblicazione

La suite `test-indexing-reliability.mjs` simula lentezza oltre il vecchio limite, recupero da errori temporanei, limiti del fornitore, budget esaurito, richieste concorrenti, dati scaduti e cambio del giorno locale. Verifica inoltre risposta HTML recuperata 200, indisponibilità 503, reindirizzamento mirato, veri 404 e collegamenti localizzati.

Dopo la pubblicazione verificare URL e risposte pubbliche, quindi richiedere la convalida 5xx. Non riconvalidare come corretta l'intera categoria 404: le quattro URL paese sono intenzionalmente inesistenti e possono restare escluse. La URL di installazione va invece ricontrollata dopo il redirect. La cache rimane in memoria per istanza: questi interventi riducono alcuni errori transitori ma non garantiscono l'assenza di futuri 5xx.
