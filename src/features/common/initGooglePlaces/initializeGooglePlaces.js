import {decode}  from 'util/encoder';

// initialize the Google Places service
// ... a feature-u app-life-cycle-hook
export default async function initializeGooglePlaces({showStatus, fassets, getState, dispatch}) {

  // inform user what we are doing
  showStatus('Initializing Google Places');

  // fetch our Google Places API Key from our own deployment site: `public/gpak`
  const resp = await fetch('/gpak');

  // console.log(`xx resp.ok: ${resp.ok}, resp.status: ${resp.status} ... resp: `, resp);
  if (!resp.ok) {
    // NOTE: Due to routing considerations, a non-existent resource is allowed,
    //       AND returns the entire content of index.html
    //       IN OTHER WORDS: this condition is NEVER EXECUTED (i.e. resp.ok is ALWAYS true)
    //       ... (see check below)
    throw new Error(`**ERROR** Accessing /gpak resource was REJECTED with status: ${resp.status}`)
  }
  
  // convert response to text
  const txt = await resp.text();
  
  // check for non-existent resource (see NOTE above)
  if (txt.includes('<html')) {
    // NOTE: this is the only real error we will ever emit
    throw new Error(`**ERROR** Non Existent Resource: /gpak`);
  }

  // decode our credentials
  // console.log(`xx /gpak resource content: '${txt}'`);
  const googlePlacesApiKey = decode(txt);
  // console.log('xx googlePlacesApiKey: ', googlePlacesApiKey);

  // bootstrap the script tag required by Google Places API
  // NOTE: Due to the nature of injecting a script tag (with the credentials)
  //       it is NOT possible to detect an error condition for invalid credentials.
  //       ... the only indication of invalid credentials is a logged error in the console
  //           AND and subsequent Google Places retrievals simply hang.
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.src  = `https://maps.googleapis.com/maps/api/js?key=${googlePlacesApiKey}&libraries=places`;
  document.body.appendChild(scriptTag);
}
