import apiKey          from './googlePlacesApiKey';
import {decodeContent} from 'util/safeguardContent';

export default function initGooglePlaces(deviceService) {

  const clearApiKey = decodeContent(apiKey);

  // bootstrap the script tag required by Google Places API
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.src  = `https://maps.googleapis.com/maps/api/js?key=${clearApiKey}&libraries=places`;
  document.body.appendChild(scriptTag);
}
