(function(){
  document.addEventListener('click',event=>{
    if(event.target.closest('a[data-place]'))event.preventDefault();
  });
  const params=new URLSearchParams(location.search);
  const latitude=Number(params.get('lat')),longitude=Number(params.get('lon'));
  const hasSharedLocation=params.get('localita')&&Number.isFinite(latitude)&&Number.isFinite(longitude);
  if(hasSharedLocation){
    lastPlace={
      name:params.get('localita'),
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
  let locationMode='';
  try{locationMode=localStorage.getItem('meteo-location-mode')||''}catch(_){}
  if(!hasSharedLocation&&locationMode!=='manual'){
    window.setTimeout(()=>useDeviceLocation({silent:true}),300);
  }
})();
