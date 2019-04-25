import {createFeature}     from 'feature-u';
import featureFlags        from 'featureFlags';
import {decode}            from 'util/encoder';
import googlePlacesApiKey  from './config/googlePlacesApiKey';

// feature: initGooglePlaces
//          initialize the Google Places service for the eatery-nod app (when needed)
export default createFeature({
  name: 'initGooglePlaces',

  // Google Places is only required when we are using real services (i.e. when WIFI enabled)
  enabled: featureFlags.useWIFI,

  // initialize Google Places using eatery-nod's embedded configuration
  appWillStart({fassets, curRootAppElm}) {

    const apiKey = decode(googlePlacesApiKey);

    // bootstrap the script tag required by Google Places API
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src  = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    document.body.appendChild(scriptTag);
  },

});
