import {createFeature}      from 'feature-u';
import DiscoveryServiceAPI  from './DiscoveryServiceAPI';

// feature: discoveryService
//          promote a service API that retrieves restaurant information
//          from a geographical data source, through the
//          `discoveryService` use contract (full details in
//          README)
export default createFeature({
  name: 'discoveryService',

  // our public face ...
  fassets: {
    use: [
      ['discoveryService', {required: true, type: objectOfTypeDiscoveryServiceAPI}],
    ],
  }
});

function objectOfTypeDiscoveryServiceAPI(fassetsValue) {
  return fassetsValue instanceof DiscoveryServiceAPI ? null : 'object of type DiscoveryServiceAPI, NOT: ' + fassetsValue;
}
