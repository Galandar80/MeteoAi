const $=selector=>document.querySelector(selector);
const $$=selector=>document.querySelectorAll(selector);

async function fetchResilient(input,init={},options={}){
  const timeout=options.timeout||12000;
  const retries=options.retries??1;
  let lastError;
  for(let attempt=0;attempt<=retries;attempt++){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeout);
    try{
      return await window.fetch(input,{...init,signal:init.signal||controller.signal});
    }catch(error){
      lastError=error;
      if(init.signal?.aborted||attempt===retries)throw error;
    }finally{
      clearTimeout(timer);
    }
  }
  throw lastError;
}

const codes={
  0:['Sereno','☀'],1:['Prevalentemente sereno','🌤'],2:['Parzialmente nuvoloso','⛅'],3:['Nuvoloso','☁'],
  45:['Nebbia','🌫'],48:['Nebbia con brina','🌫'],51:['Pioviggine lieve','🌦'],53:['Pioviggine','🌦'],
  55:['Pioviggine intensa','🌧'],61:['Pioggia lieve','🌦'],63:['Pioggia','🌧'],65:['Pioggia intensa','🌧'],
  71:['Neve lieve','🌨'],73:['Neve','🌨'],75:['Neve intensa','❄'],80:['Rovesci lievi','🌦'],81:['Rovesci','🌧'],
  82:['Rovesci intensi','⛈'],95:['Temporale','⛈'],96:['Temporale con grandine','⛈'],99:['Temporale forte','⛈']
};

let map,marker,lastData,lastMarine;
let lastPlace={name:'Messina',country:'Italia',country_code:'IT',latitude:38.1939,longitude:15.554};
let unit='c',selectedSpecialProfile='children',professionalData=null,professionalLoading=false,professionalPlaceKey='';
let marineAutoPending=false,marineAutoFailed=false;

function weather(code){
  return codes[code]||['Variabile','🌤'];
}

function iconHTML(code,size='normal'){
  let body='';
  if(code===0)body='<circle cx="24" cy="24" r="7"/><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.5 10.5l3.5 3.5M34 34l3.5 3.5M37.5 10.5L34 14M14 34l-3.5 3.5"/>';
  else if([1,2].includes(code))body='<circle cx="18" cy="17" r="6"/><path d="M18 5v4M7 17h4M9.5 8.5l3 3M32 35H15a8 8 0 0 1 1-16 11 11 0 0 1 21 5 6 6 0 0 1-5 11Z"/>';
  else if([3,45,48].includes(code))body='<path d="M35 36H14a9 9 0 0 1 1-18 12 12 0 0 1 23 5 7 7 0 0 1-3 13Z"/>';
  else if([71,73,75].includes(code))body='<path d="M35 29H14a9 9 0 0 1 1-18 12 12 0 0 1 23 5 7 7 0 0 1-3 13Z"/><path d="M15 36h.1M24 40h.1M34 36h.1"/>';
  else if(code>=95)body='<path d="M36 26H14a8 8 0 0 1 1-16 12 12 0 0 1 23 6 7 7 0 0 1-2 10Z"/><path d="m25 28-5 9h6l-3 7 10-12h-7l3-4"/>';
  else body='<path d="M36 28H14a8 8 0 0 1 1-16 12 12 0 0 1 23 6 7 7 0 0 1-2 10Z"/><path d="M16 34l-2 5M25 34l-2 5M34 34l-2 5"/>';
  return `<svg class="weather-svg ${size}" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function toast(message){
  $('#toast').textContent=message;
  $('#toast').classList.add('show');
  setTimeout(()=>$('#toast').classList.remove('show'),2500);
}
