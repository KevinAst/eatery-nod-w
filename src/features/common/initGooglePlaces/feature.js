import {createFeature}         from 'feature-u';
import featureFlags            from 'featureFlags';
import {createBootstrapFn}     from 'features/common/bootstrap/bootstrapFn';
import initializeGooglePlaces  from './initializeGooglePlaces';

// feature: initGooglePlaces
//          initialize the Google Places service (when needed)
export default createFeature({
  name: 'initGooglePlaces',

  // Google Places is only required when we are using real services (i.e. when WIFI enabled)
  enabled: featureFlags.useWIFI,

  // initialize Google Places using our bootstrap process
  fassets: {
    defineUse: {
      'bootstrap.initGooglePlaces': createBootstrapFn( 'Waiting for Google Places Initialization', 
                                                       ({dispatch, fassets}) => initializeGooglePlaces() ),
    },
  },

});
