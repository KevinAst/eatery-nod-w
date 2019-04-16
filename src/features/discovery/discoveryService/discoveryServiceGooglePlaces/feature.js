import {createFeature}  from 'feature-u';
import featureFlags     from '../../../../featureFlags';
import DiscoveryServiceGooglePlaces from './DiscoveryServiceGooglePlaces';

// feature: discoveryServiceGooglePlaces
//          defines the real 'discoveryService' (via the GooglePlaces API),
//          conditionally promoted when WIFI is available(i.e. **not**
//          mocking)
export default createFeature({
  name: 'discoveryServiceGooglePlaces',

  enabled: featureFlags.useWIFI,

  // our public face ...
  fassets: {
    defineUse: {
      'discoveryService': new DiscoveryServiceGooglePlaces(),
    },
  },

});
