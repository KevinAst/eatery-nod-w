import {decode}  from 'util/encoder';

// initialize the Google Places service
export default function initializeGooglePlaces() {

  // ERROR PROCESSING NOTE: 
  // - we wrap our code in a promise to handle error processing correctly
  // - there is NO NEED to append err.defineAttemptingToMsg('Initialize Google Places')
  //   BECAUSE this is already accomplished through the bootstrap process that executes us
  return new Promise( (resolve, reject) => {
    
    // fetch our Google Places API Key: `public/gpak`
    fetch('/gpak')

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
          return reject( new Error(`**ERROR** Accessing /gpak resource was REJECTED with status: ${resp.status}`) );
        }
      })

      .then((txt)  => {
        // check for non-existent resource (see NOTE above)
        if (txt.includes('<html')) {
          // NOTE: this is the only real error we will ever emit
          // ?? TEST
          return reject( new Error(`**ERROR** Non Existent Resource: /gpak`) );
        }
        
        //***
        //*** process our credentials
        //***
        else {
          console.log(`?? /gpak resource content: '${txt}'`);
          const googlePlacesApiKey = decode(txt);
          console.log('?? googlePlacesApiKey: ', googlePlacesApiKey);

          // bootstrap the script tag required by Google Places API
          // NOTE: Due to the nature of injecting a script tag (with the credentials)
          //       it is NOT possible to detect an error condition for invalid credentials.
          //       ... the only indication of invalid credentials is a logged error in the console
          //           AND and subsequent Google Places retrievals simply hang.
          const scriptTag = document.createElement('script');
          scriptTag.type = 'text/javascript';
          scriptTag.src  = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesApiKey}&libraries=places`;
          document.body.appendChild(scriptTag);

          resolve(null); // resolve promise to allow bootstrap to continue
        }
      })
      .catch((err) => { // NEVER executes this (see NOTE above)
        console.log(`ERROR: reading /gpak: ${err} ... `, err);
        return reject( err );
      });
    
  });

}
