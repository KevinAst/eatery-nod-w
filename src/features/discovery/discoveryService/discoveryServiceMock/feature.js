import {createFeature}      from 'feature-u';
import featureFlags         from '../../../../featureFlags';
import DiscoveryServiceMock from './DiscoveryServiceMock';

// feature: discoveryServiceMock
//          defines the mock 'discoveryService' implementation,
//          conditionally promoted when WIFI is NOT available(i.e. mocking)
export default createFeature({
  name: 'discoveryServiceMock',

  enabled: !featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'discoveryService': new DiscoveryServiceMock(),
    },
  },

});
