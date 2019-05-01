import {createFeature}    from 'feature-u';
import featureFlags       from 'featureFlags';
import EateryServiceMock  from './EateryServiceMock';

// feature: eateryServiceMock
//          defines the mock 'eateryService' implementation,
//          conditionally promoted when WIFI is NOT available(i.e. mocking)
export default createFeature({
  name:    'eateryServiceMock',

  enabled: !featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'eateryService': new EateryServiceMock(),
    },
  },

});
