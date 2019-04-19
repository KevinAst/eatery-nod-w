import apiKey  from './googlePlacesApiKey';

export default function initGooglePlaces(deviceService) {

  // ?? L8TR: decrypt AppKey (via deviceService)

  // bootstrap the script tag required by Google Places API
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.src  = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  document.body.appendChild(scriptTag);
}
