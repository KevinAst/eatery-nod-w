import {createFeature}   from 'feature-u';
import featureFlags      from 'featureFlags';
import firebase          from 'firebase/app';
import {decode}          from 'util/encoder';
import firebaseAppConfig from './config/firebaseAppConfig';

// feature: initFirebase
//          initialize the Google Firebase service for the eatery-nod app (when needed)
export default createFeature({
  name: 'initFirebase',

  // firebase is only required when we are using real services (i.e. when WIFI enabled)
  enabled: featureFlags.useWIFI,

  // initialize firebase using eatery-nod's embedded configuration
  appWillStart({fassets, curRootAppElm}) {
    const appConfig = decode(firebaseAppConfig);
    firebase.initializeApp(appConfig);
  },

});
