import {createFeature}  from 'feature-u';
import initFireBase     from './initFireBase';

// feature: firebaseInit
//          provides an API by which "firebase dependent" services can
//          initialize themselves via `fassets.initFireBase()` (full
//          details in README)
export default createFeature({
  name: 'firebaseInit',

  // our public face ...
  fassets: {
    define: {
      initFireBase,
    },
  },

});
