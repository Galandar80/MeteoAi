if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
try{const storedPlace=JSON.parse(localStorage.getItem('meteo-current-place')||'null');if(storedPlace&&Number.isFinite(Number(storedPlace.latitude))&&Number.isFinite(Number(storedPlace.longitude)))lastPlace=storedPlace}catch(_){}

let historyRequestToken=0;
async function loadHistoricalWeather({silent=false}={}){
  const btn=$('#historyLoadBtn');
  if(!lastPlace||!lastData||!btn)return;
  const token=++historyRequestToken;
  const place={latitude:Number(lastPlace.latitude),longitude:Number(lastPlace.longitude)};
  btn.disabled=true;
  btn.textContent='Aggiornamento…';
  $('#histSampleCount').textContent='Caricamento dati storici…';
  $('#hist10Diff').textContent='Confronto in corso…';
  try{
    const today=new Date(),m=String(today.getMonth()+1).padStart(2,'0'),d=String(today.getDate()).padStart(2,'0');
    const start=`${today.getFullYear()-10}-01-01`,end=`${today.getFullYear()-1}-12-31`;
    const cacheKey=`history-v2-${place.latitude.toFixed(3)}-${place.longitude.toFixed(3)}-${m}-${d}`;
    let archive;
    try{
      const cached=JSON.parse(sessionStorage.getItem(cacheKey)||'null');
      if(cached&&Date.now()-cached.savedAt<86400000)archive=cached.data;
    }catch(_){}
    if(!archive){
      const params=new URLSearchParams({latitude:place.latitude,longitude:place.longitude,start_date:start,end_date:end,timezone:'auto',daily:'temperature_2m_max'});
      const response=await fetchResilient(`https://archive-api.open-meteo.com/v1/archive?${params}`,{}, {timeout:20000,retries:1});
      if(!response.ok)throw Error(`Archivio storico ${response.status}`);
      archive=await response.json();
      try{sessionStorage.setItem(cacheKey,JSON.stringify({savedAt:Date.now(),data:archive}))}catch(_){}
    }
    if(token!==historyRequestToken||place.latitude!==Number(lastPlace.latitude)||place.longitude!==Number(lastPlace.longitude))return;
    const target=`-${m}-${d}`,samples=(archive.daily?.time||[]).map((date,index)=>({date,value:Number(archive.daily.temperature_2m_max?.[index])})).filter(item=>item.date.endsWith(target)&&Number.isFinite(item.value));
    if(samples.length<5)throw Error('Campione storico insufficiente');
    const todayMax=Number(lastData.daily.temperature_2m_max[0]),current=Number(lastData.current.temperature_2m),average=samples.reduce((sum,item)=>sum+item.value,0)/samples.length,difference=todayMax-average;
    $('#histTodayTemp').textContent=`${todayMax.toFixed(1)}°C`;
    $('#histTodayNow').textContent=`Temperatura attuale ${current.toFixed(1)}°C`;
    $('#hist10Temp').textContent=`${average.toFixed(1)}°C`;
    $('#histSampleCount').textContent=`Media di ${samples.length} valori dal ${samples[0].date.slice(0,4)} al ${samples.at(-1).date.slice(0,4)}`;
    $('#histDifference').textContent=`${difference>=0?'+':''}${difference.toFixed(1)}°C`;
    const badge=$('#hist10Diff'),magnitude=Math.abs(difference);
    badge.textContent=magnitude<1?`Oggi è in linea con la media storica`:difference>0?`Oggi è più caldo della media storica`:`Oggi è più fresco della media storica`;
    badge.className=difference>1.5?'anomaly-warm':difference<-1.5?'anomaly-cool':'anomaly-normal';
    btn.textContent='Aggiorna confronto';
  }catch(error){
    if(token!==historyRequestToken)return;
    $('#hist10Temp').textContent='--°C';
    $('#histDifference').textContent='--°C';
    $('#histSampleCount').textContent=error.name==='AbortError'?'Archivio non raggiungibile in tempo':'Archivio storico non disponibile';
    $('#hist10Diff').textContent='Puoi riprovare senza ricaricare la pagina';
    btn.textContent='Riprova';
    if(!silent)toast('Dati storici momentaneamente non disponibili');
  }finally{
    if(token===historyRequestToken)btn.disabled=false;
  }
}
$('#historyLoadBtn').onclick=()=>loadHistoricalWeather();
function resetHistoryComparison(){
  historyRequestToken++;$('#histTodayTemp').textContent='--°C';$('#histTodayNow').textContent='Temperatura attuale --°C';$('#hist10Temp').textContent='--°C';$('#histSampleCount').textContent='In attesa dei dati meteo';$('#histDifference').textContent='--°C';$('#hist10Diff').textContent='Il confronto partirà automaticamente';$('#hist10Diff').className='anomaly-normal';$('#historyLoadBtn').disabled=true;$('#historyLoadBtn').textContent='Aggiornamento automatico';
}














/* Share Card Generator */
function drawShareCard(){
  const canvas=$('#shareCanvas');
  if(!canvas||!lastData)return;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  const grad=ctx.createLinearGradient(0,0,w,h);
  grad.addColorStop(0,'#0d7b57');grad.addColorStop(1,'#102d26');
  ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
  ctx.fillStyle='rgba(201,242,93,.12)';ctx.beginPath();ctx.arc(w-60,60,180,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#c9f25d';ctx.font='800 24px Manrope, sans-serif';ctx.fillText('Meteo AI',40,50);
  ctx.fillStyle='#ffffff';ctx.font='500 16px DM Sans, sans-serif';ctx.fillText(new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),40,75);
  ctx.fillStyle='#ffffff';ctx.font='800 42px Manrope, sans-serif';ctx.fillText(lastPlace.name,40,140);
  if(lastPlace.country){ctx.fillStyle='#a2c4b9';ctx.font='600 20px DM Sans, sans-serif';ctx.fillText(lastPlace.country,40,170);}
  const curTemp=Math.round(lastData.current.temperature_2m),cCode=lastData.current.weather_code,desc=weather(cCode)[0],sym=weather(cCode)[1];
  ctx.fillStyle='#ffffff';ctx.font='800 84px Manrope, sans-serif';ctx.fillText(`${curTemp}°`,40,270);
  ctx.fillStyle='#c9f25d';ctx.font='700 28px DM Sans, sans-serif';ctx.fillText(`${sym} ${desc}`,220,240);
  ctx.fillStyle='#e1ebe7';ctx.font='500 18px DM Sans, sans-serif';ctx.fillText(`Max: ${Math.round(lastData.daily.temperature_2m_max[0])}° • Min: ${Math.round(lastData.daily.temperature_2m_min[0])}°`,220,272);
  const metrics=[
    {label:'Umidità',val:`${lastData.current.relative_humidity_2m}%`},
    {label:'Vento',val:`${Math.round(lastData.current.wind_speed_10m)} km/h`},
    {label:'UV Index',val:`${lastData.daily.uv_index_max[0].toFixed(1)}`},
    {label:'Pioggia',val:`${lastData.daily.precipitation_probability_max[0]}%`}
  ];
  metrics.forEach((m,i)=>{
    const bx=40+i*180,by=350;
    ctx.fillStyle='rgba(255, 255, 255, 0.08)';ctx.beginPath();
    ctx.rect(bx,by,160,90);ctx.fill();
    ctx.fillStyle='#a2c4b9';ctx.font='600 14px DM Sans, sans-serif';ctx.fillText(m.label,bx+16,by+32);
    ctx.fillStyle='#ffffff';ctx.font='800 22px Manrope, sans-serif';ctx.fillText(m.val,bx+16,by+68);
  });
  ctx.fillStyle='#a2c4b9';ctx.font='500 13px DM Sans, sans-serif';ctx.fillText('meteo-ai.vercel.app • Dati Open-Meteo',40,475);
}
$('#shareCardBtn').onclick=()=>{drawShareCard();$('#shareModal').showModal()};
$('#btnDownloadPng').onclick=()=>{
  const canvas=$('#shareCanvas');if(!canvas)return;
  const link=document.createElement('a');link.download=`Meteo-AI-${lastPlace.name}.png`;link.href=canvas.toDataURL('image/png');link.click();
};
$('#btnShareNative').onclick=()=>{
  const canvas=$('#shareCanvas');if(!canvas)return;
  canvas.toBlob(async blob=>{
    if(navigator.share&&blob){
      const file=new File([blob],`meteo-${lastPlace.name}.png`,{type:'image/png'});
      const shareUrl=new URL(location.href);shareUrl.searchParams.set('condiviso','20260723b');
      const shareData={title:`Meteo ${lastPlace.name}`,text:`Ecco le previsioni per ${lastPlace.name} su Meteo AI`,url:shareUrl.href};
      try{
        if(!navigator.canShare||navigator.canShare({files:[file]}))await navigator.share({...shareData,files:[file]});
        else await navigator.share(shareData);
      }catch(error){
        if(error?.name!=='AbortError'){
          try{await navigator.share(shareData)}catch(_){}
        }
      }
    }else{
      try{const shareUrl=new URL(location.href);shareUrl.searchParams.set('condiviso','20260723b');await navigator.clipboard.writeText(shareUrl.href);toast('Link copiato. Puoi incollarlo sui social.')}catch(_){$('#btnDownloadPng').click()}
    }
  });
};


