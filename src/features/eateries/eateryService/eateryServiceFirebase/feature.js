import {createFeature}       from 'feature-u';
import featureFlags          from '../../../../featureFlags';
import EateryServiceFirebase from './EateryServiceFirebase';

// feature: eateryServiceFirebase
//          defines the real 'eateryService' (via the Firebase API),
//          conditionally promoted when WIFI is available(i.e. **not**
//          mocking)
export default createFeature({
  name:    'eateryServiceFirebase',

  enabled: featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'eateryService': new EateryServiceFirebase(),
    },
  },

  appWillStart({fassets, curRootAppElm}) { // initialize FireBase (required by this service)
    fassets.initFireBase();
  },

});
