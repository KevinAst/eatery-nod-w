import {createFeature}  from 'feature-u';
import featureFlags     from 'featureFlags';
import AuthServiceMock  from './AuthServiceMock';

// feature: authServiceMock
//          defines the mock 'authService' implementation,
//          conditionally promoted when WIFI is NOT available(i.e. mocking)
export default createFeature({
  name:    'authServiceMock',

  enabled: !featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'authService': new AuthServiceMock(),
    },
  },

});
