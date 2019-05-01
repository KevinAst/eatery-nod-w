import {createFeature}     from 'feature-u';
import featureFlags        from 'featureFlags';
import AuthServiceFirebase from './AuthServiceFirebase';

// feature: authServiceFirebase 
//          defines the real 'authService' (via the Firebase API),
//          conditionally promoted when WIFI is available(i.e. **not**
//          mocking)
export default createFeature({
  name:    'authServiceFirebase',

  enabled: featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'authService': new AuthServiceFirebase(),
    },
  },

});
