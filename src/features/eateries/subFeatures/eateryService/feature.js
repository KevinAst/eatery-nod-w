import {createFeature}   from 'feature-u';
import EateryServiceAPI  from './EateryServiceAPI';

// feature: eateryService
//          promote a service API that manages a real-time persistent
//          "Eateries" DB, through the `eateryService` use contract
//          (full details in README)
export default createFeature({
  name: 'eateryService',

  // our public face ...
  fassets: {
    use: [
      ['eateryService', {required: true, type: objectOfTypeEateryServiceAPI}],
    ],
  }
});

function objectOfTypeEateryServiceAPI(fassetsValue) {
  return fassetsValue instanceof EateryServiceAPI ? null : 'object of type EateryServiceAPI, NOT: ' + fassetsValue;
}
