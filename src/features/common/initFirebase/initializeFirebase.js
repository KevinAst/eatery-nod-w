import firebase  from 'firebase/app';
import {decode}  from 'util/encoder';

// initialize the Google Firebase service
// ... a feature-u app-life-cycle-hook
export default async function initializeFirebase({showStatus, fassets, appState, dispatch}) {

  // inform user what we are doing
  showStatus('Initializing Firebase');
  
  // fetch our FireBase App Configuration from our own deployment site: `public/fbac`
  const resp = await fetch('/fbac');
  
  // console.log(`xx resp.ok: ${resp.ok}, resp.status: ${resp.status} ... resp: `, resp);
  if (!resp.ok) {
    // NOTE: Due to routing considerations, a non-existent resource is allowed,
    //       AND returns the entire content of index.html
    //       IN OTHER WORDS: this condition is NEVER EXECUTED (i.e. resp.ok is ALWAYS true)
    //       ... (see check below)
    throw new Error(`**ERROR** Accessing /fbac resource was REJECTED with status: ${resp.status}`);
  }
  
  // convert response to text
  const txt = await resp.text();
  
  // check for non-existent resource (see NOTE above)
  if (txt.includes('<html')) {
    // NOTE: this is the only real error we will ever emit
    throw new Error(`**ERROR** Non Existent Resource: /fbac`);
  }
  
  // decode our credentials
  // console.log(`xx /fbac resource content: '${txt}'`);
  const firebaseAppConfig = decode(txt);
  // console.log('xx firebaseAppConfig: ', firebaseAppConfig);
  
  // process our credentials
  // NOTE: THE initializeApp() invocation generates absolutely NO error condition
  //       - for example if the API key is invalid it executes through (even with a try/catch), 
  //         and we receive runtime errors when attempting to use the service (ex: login screen)
  //         ... Error: Your API key is invalid, please check you have copied it correctly.
  await firebase.initializeApp(firebaseAppConfig);
}
