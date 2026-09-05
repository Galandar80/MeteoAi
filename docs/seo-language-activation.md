# Attivazione SEO per lingua e località

Le URL già pubblicate restano indicizzabili tramite la modalità predefinita `legacy`: ogni località attiva conserva italiano, inglese, francese, portoghese brasiliano e spagnolo. Ogni nuova ricerca registra anche la coppia `lingua:placeId` nel set Redis `meteo-ai:seo-active-language-localities`.

L’infrastruttura supporta una futura modalità `pair` tramite `SEO_LANGUAGE_ACTIVATION_MODE=pair`. In tale modalità la sitemap includerebbe soltanto le coppie realmente usate, più:

- italiano come versione di fallback;
- inglese per le città con almeno un milione di abitanti;
- lingua locale quando è supportata (Italia, Francia, Brasile/Portogallo e Spagna).

## Migrazione prudente

Non attivare `pair` nella stessa distribuzione che introduce il tracciamento. Raccogliere almeno 28 giorni completi di dati Search Console e confrontare per pagina/lingua impressioni, clic, CTR, posizione e stato di indicizzazione. Esportare un allowlist delle combinazioni che ricevono impressioni o clic e unirlo alle coppie registrate.

Solo dopo il confronto si può attivare `pair` in anteprima, verificare sitemap e `hreflang`, quindi distribuirlo. Le vecchie URL non vanno messe automaticamente in `noindex`: le combinazioni escluse richiedono una decisione separata basata sui dati, con monitoraggio per altri 28 giorni. Un rollback consiste nel rimuovere la variabile d’ambiente e torna immediatamente alla modalità retrocompatibile.
