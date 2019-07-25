import {createFeature}         from 'feature-u';
import featureFlags            from 'featureFlags';
import initializeGooglePlaces  from './initializeGooglePlaces';

// feature: initGooglePlaces
//          initialize the Google Places service (when needed)
export default createFeature({
  name: 'initGooglePlaces',

  // Google Places is only required when we are using real services (i.e. when WIFI enabled)
  enabled: featureFlags.useWIFI,

  appInit: initializeGooglePlaces,
});
