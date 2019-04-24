import firebase          from 'firebase/app';
import firebaseAppConfig from './config/firebaseAppConfig';
import {decode}          from 'util/encoder';

// keep track of invocation
let previouslyInvoked = false;

/**
 * Initialize firebase specifically for the eatery-nod app.

 * This function may be invoked multiple times, because multiple
 * services may be "firebase dependent".  All subsequent invocations
 * (after the first) will simply no-op.
 */
export default function initFireBase() {

  // no-op after initial invocation
  if (previouslyInvoked) {
    return;
  }
  previouslyInvoked = true;

  // initialize firebase using the eatery-nod configuration
  const clearFirebaseAppConfig = decode(firebaseAppConfig);
  firebase.initializeApp(clearFirebaseAppConfig);

  // temp work-around to long timer android warning (using firebase)
  // TODO: check back for ultimate solution: https://github.com/facebook/react-native/issues/12981
  console.ignoredYellowBox = ['Setting a timer for a long period of time'];
}
