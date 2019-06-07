import {createFeature}     from 'feature-u';
import featureFlags        from 'featureFlags';
import {createBootstrapFn} from 'features/common/bootstrap/bootstrapFn';
import initializeFirebase  from './initializeFirebase';

// feature: initFirebase
//          initialize the Google Firebase service (when needed)
export default createFeature({
  name: 'initFirebase',

  // firebase is only required when we are using real services (i.e. when WIFI enabled)
  enabled: featureFlags.useWIFI,

  // initialize firebase using our bootstrap process
  fassets: {
    defineUse: {
      'bootstrap.initFirebase': createBootstrapFn( 'Waiting for Firebase Initialization', 
                                                   ({dispatch, fassets}) => initializeFirebase() ),
    },
  },

});
