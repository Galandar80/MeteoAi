(function(){
  document.addEventListener('click',event=>{
    if(event.target.closest('a[data-place]'))event.preventDefault();
  });
  const params=new URLSearchParams(location.search);
  const latitude=Number(params.get('lat')),longitude=Number(params.get('lon'));
  const hasSharedLocation=Boolean(params.get('lat')?.trim()&&params.get('lon')?.trim())&&Number.isFinite(latitude)&&Math.abs(latitude)<=90&&Number.isFinite(longitude)&&Math.abs(longitude)<=180;
  if(hasSharedLocation){
    lastPlace={
      name:params.get('localita')||I18n.translate('Posizione attuale'),
      country:params.get('country')||'',
      country_code:params.get('cc')||'',
      admin1:params.get('admin1')||'',
      id:Number(params.get('id'))||undefined,
      latitude,
      longitude
    };
    if(typeof syncLocationSeo==='function')syncLocationSeo(lastPlace,true);
  }
  initMap();initSeaAtlas();initPortPlanner();renderSaved();loadWeather(lastPlace);
  // A name-only search needs disambiguation, not invented zero coordinates.
  if(params.get('localita')&&!hasSharedLocation){
    openLocationModal();
    $('#locationInput').value=params.get('localita');
    $('#locationInput').dispatchEvent(new Event('input',{bubbles:true}));
  }
  let locationMode='';
  try{locationMode=localStorage.getItem('meteo-location-mode')||''}catch(_){}
  if(!hasSharedLocation&&!params.get('localita')&&locationMode!=='manual'){
    window.setTimeout(()=>useDeviceLocation({silent:true}),300);
  }
  document.addEventListener('meteo:languagechange',()=>{
    if(lastData)render(lastData);
    if(lastMarine)renderMarine(lastMarine);
    renderSaved();
    if(typeof drawShareCard==='function'&&$('#shareModal')?.open)drawShareCard();
  });
})();
