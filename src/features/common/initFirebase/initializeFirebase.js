import firebase  from 'firebase/app';
import {decode}  from 'util/encoder';

// initialize the Google Firebase service
export default function initializeFirebase() {

  // ERROR PROCESSING NOTE: 
  // - we wrap our code in a promise to handle error processing correctly
  // - there is NO NEED to append err.defineAttemptingToMsg('Initialize Firebase')
  //   BECAUSE this is already accomplished through the bootstrap process that executes us
  return new Promise( (resolve, reject) => {
  
    // fetch our FireBase App Configuration: `public/fbac`
    fetch('/fbac')

      .then((resp) => {
        // console.log(`xx resp.ok: ${resp.ok}, resp.status: ${resp.status} ... resp: `, resp);
        if (resp.ok) {
          return resp.text();
        }
        else {
          // NOTE: Due to routing considerations, a non-existent resource is allowed,
          //       AND returns the entire content of index.html
          //       IN OTHER WORDS, resp.ok is ALWAYS true
          //       ... (see check below)
          return reject( new Error(`**ERROR** Accessing /fbac resource was REJECTED with status: ${resp.status}`) );
        }
      })

      .then((txt)  => {
        // check for non-existent resource (see NOTE above)
        if (txt.includes('<html')) {
          // NOTE: this is the only real error we will ever emit
          return reject( new Error(`**ERROR** Non Existent Resource: /fbac`) );
        }
  
        //***
        //*** process our credentials
        //***
        else {
          // console.log(`xx /fbac resource content: '${txt}'`);
          const firebaseAppConfig = decode(txt);
          // console.log('xx firebaseAppConfig: ', firebaseAppConfig);

          // NOTE: THE initializeApp() invocation generates absolutely NO error condition
          //       - for example if the API key is invalid it executes through (even with a try/catch), 
          //         and we receive runtime errors when attempting to use the service (ex: login screen)
          //         ... Error: Your API key is invalid, please check you have copied it correctly.
          firebase.initializeApp(firebaseAppConfig);

          resolve(null); // resolve promise to allow bootstrap to continue
        }
      })
      .catch((err) => { // NEVER executes this (see NOTE above)
        console.log(`ERROR: reading /fbac: ${err} ... `, err);
        return reject( err );
      });
  
  });

}
