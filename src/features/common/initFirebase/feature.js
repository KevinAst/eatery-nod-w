import {createFeature}     from 'feature-u';
import featureFlags        from 'featureFlags';
import initializeFirebase  from './initializeFirebase';

// feature: initFirebase
//          initialize the Google Firebase service (when needed)
export default createFeature({
  name: 'initFirebase',

  // firebase is only required when we are using real services (i.e. when WIFI enabled)
  enabled: featureFlags.useWIFI,

  appInit: initializeFirebase,
});
