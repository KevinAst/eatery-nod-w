import {createFeature} from 'feature-u';
import AuthServiceAPI  from './AuthServiceAPI';

// feature: authService
//          promote a persistent authentication service API (retaining
//          active user) through the `authService` use contract
//          (full details in README)
export default createFeature({
  name: 'authService',

  // our public face ...
  fassets: {
    use: [
      ['authService', {required: true, type: objectOfTypeAuthServiceAPI}],
    ],
  }
});

function objectOfTypeAuthServiceAPI(fassetsValue) {
  return fassetsValue instanceof AuthServiceAPI ? null : 'object of type AuthServiceAPI, NOT: ' + fassetsValue;
}
