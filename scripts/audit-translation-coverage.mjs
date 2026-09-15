import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{__METEO_LOCALE__:'en'},document:{documentElement:{},addEventListener(){}},navigator:{languages:['en']},localStorage:{getItem(){}},MutationObserver:class{observe(){}},Intl,URLSearchParams};
vm.runInNewContext(fs.readFileSync(new URL('../i18n.js',import.meta.url),'utf8'),context);
for(const file of ['index.html','world-live.html']){
 const html=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,'');
 const sources=[...new Set(html.split(/<[^>]*>/).map(s=>s.trim()).filter(s=>/[A-Za-zÀ-ÿ]{3}/.test(s)))];
 for(const source of sources){const unchanged=['en','fr','pt-BR','es'].filter(lang=>context.window.I18n.translate(source,lang)===source);if(unchanged.length)console.log(JSON.stringify({source,unchanged}));}
}
