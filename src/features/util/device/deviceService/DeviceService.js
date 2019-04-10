//? import {Location,
//?         Permissions}   from 'expo';                   // ?? THERE IS NO expo
import featureFlags    from '../../../../featureFlags';
import noOp            from '../../../../util/noOp';

const credentialsKey       = 'eatery-nod:credentials';
const credentialsSeparator = '/';


/**
 * DeviceService promotes a simplified abstraction of several device
 * services (both Expo and react-native), providing a consistent "GO
 * TO" for device related resources.
 *
 * Some services are "mockable", at an individual method level, as
 * specified by our featureFlags.
 */
class DeviceService {

  /**
   * Instantiate the DeviceService service object.
   */
  constructor() {
    // conditionally mock various service methods, as directed by featureFlags
    mock_getCurPos_asNeeded(this);
  }


  /**
   * Fetch the UI Theme stored on local device (if any).
   * 
   * @return {string} the persisted UI Theme (null for none - suitable
   * to be used as initial redux state (vs. undefined)).
   */
  fetchUITheme() {
    return deviceStorage.getItem('uiTheme') || null;
  }


  /**
   * Store the supplied UI Theme on local device.
   * 
   * @param {string} uiTheme the UI Theme to store.
   */
  storeUITheme(uiTheme) {
    deviceStorage.setItem('uiTheme', uiTheme);
  }


  /**
   * Fetch credentials stored on local device (if any).
   * 
   * @return {string} the encodedCredentials if any.  Use
   * decodeCredentials() to decode (null for none -
   * i.e. non-existent).
   */
  fetchCredentials() {
    return deviceStorage.getItem(credentialsKey) || null;
  }


  /**
   * Store credentials on local device in an encoded form.
   * 
   * @param {string} email the email (id) to store.
   * @param {string} pass the password to store.
   */
  storeCredentials(email, pass) {
    deviceStorage.setItem(credentialsKey, this.encodeCredentials(email, pass));
  }


  /**
   * Remove credentials on local device.
   */
  removeCredentials() {
    deviceStorage.removeItem(credentialsKey);
  }


  /**
   * Encode the supplied email/pass into a string.
   * 
   * @param {string} email the email (id) to encode.
   * @param {string} pass the password to encode.
   * 
   * @return {string} the encoded credentials.
   */
  encodeCredentials(email, pass) {
    // TODO: ?? really encode this
    return email+credentialsSeparator+pass;
  }


  /**
   * Decode the supplied encodedCredentials.
   * 
   * @param {string} encodedCredentials the encoded credentials to
   * decode (falsy for none).
   * 
   * @return {object} the decoded credentials as follows (null when
   * encodedCredentials undefined):
   *   {
   *     email: string,
   *     pass:  string
   *   }
   */
  decodeCredentials(encodedCredentials) {
    if (!encodedCredentials) {
      return null;
    }

    // TODO: ?? really decode this
    const [email, pass] = encodedCredentials.split(credentialsSeparator);
    return {
      email,
      pass,
    };
  }


  /**
   * Return the current device location asynchronously (via a promise).
   * 
   * NOTE: This service method can be mocked via: featureFlags.mockGPS
   *
   * @returns {Promise} the current device location {lat, lng}
   */
  getCurPos() {

    return new Promise( (resolve, reject) => {

      //?? need a real production implementation
      //?Permissions.askAsync(Permissions.LOCATION)
      //?           .then( ({status}) => {
      //?
      //?             // Device LOCATION permission denied
      //?             if (status !== 'granted') {
      //?               return reject(
      //?                 new Error(`Device LOCATION permission denied, status: ${status}`)
      //?                   .defineClientMsg('No access to device location')
      //?                   .defineAttemptingToMsg('obtain current position')
      //?               );
      //?             }
      //?
      //?             // obtain device geo location
      //?             Location.getCurrentPositionAsync({})
      //?                     .then( (location) => {
      //?                       // console.log(`xx Obtained Device Location: `, location);
      //?                       // Obtained Device Location: {
      //?                       //   "coords": {
      //?                       //     "accuracy":   50,
      //?                       //     "altitude":   0,
      //?                       //     "heading":    0,
      //?                       //     "latitude":   38.7657446, // of interest
      //?                       //     "longitude": -89.9923039, // of interest
      //?                       //     "speed":      0,
      //?                       //   },
      //?                       //   "mocked":    false,
      //?                       //   "timestamp": 1507050033634,
      //?                       // }
      //?
      //?                       // communicate device location
      //?                       return resolve({lat: location.coords.latitude, 
      //?                                       lng: location.coords.longitude});
      //?                     })
      //?                     .catch( err => {
      //?                       return reject(err.defineClientMsg('Could not obtain device location'));
      //?                     });
      //?           })
      //?
      //?           .catch( err => {
      //?             return reject(err.defineAttemptingToMsg('obtain current position'));
      //?           });
    });
  }

}


// conditionally mock getCurPos(), as directed by featureFlags
function mock_getCurPos_asNeeded(deviceService) {

  if (featureFlags.mockGPS) { // ... if requested by featureFlags

    const GlenCarbonIL = {lat: 38.752209, lng: -89.986610};
    const defaultLoc   = GlenCarbonIL;
    const mockLoc      = featureFlags.mockGPS.lat ? featureFlags.mockGPS : defaultLoc;

    deviceService.getCurPos = () => { // override method with our mock
      // console.log(`xx DeviceService.getCurPos() request ... mocked to: `, mockLoc);
      return new Promise( (resolve, reject) => {
        //setTimeout(() => { // TEMPORARY: for testing delay just a bit

        // TEMPORARY: for testing, simulate error condition
        //            ... NOTE: reject() passes error into .catch(), throw does NOT
        // return reject(new Error('Simulated Error in Expo GPS Location acquisition') );

        // communicate device location
        return resolve(mockLoc);
        //}, 10000); // TEMPORARY: for testing delay just a bit
      });
    };
  }

}

// export our instantiated service directly
// ... because in select cases it is needed early, 
//     and therefore imported directly
//     (ex: src/features/device/state.js)
export default new DeviceService();


//***
//*** Abstract the Web Storage API (gracefully no-oping for unsupported browsers)
//***
//***  NOTE 1: This API is synchronous!
//***  NOTE 2: Apparently this API is available on both http (non SSL) as well as https (SSL).
//***

// feature detection
// ... NOTE: can't just assert window.localStorage exists
//           see: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
const _localStorageAvailable = storageAvailable('localStorage');
function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
           // acknowledge QuotaExceededError only if there's something already stored
           (storage && storage.length !== 0);
  }
}

// log warning when deviceStorage is NOT in affect
if (!_localStorageAvailable) {
  console.warn('***WARNING*** DeviceService feature ... localStorage (Web Storage API) is NOT available in this browser ... all deviceStorage usage will silently no-op!!');
}

// our localStorage pass-through that gracefully no-ops for unsupported browsers
const deviceStorage = _localStorageAvailable ? {
  setItem:    (keyName, keyValue) => window.localStorage.setItem(keyName, keyValue),
  getItem:    (keyName)           => window.localStorage.getItem(keyName),
  removeItem: (keyName)           => window.localStorage.removeItem(keyName),
} : {
  setItem:    noOp,
  getItem:    noOp,
  removeItem: noOp,
};

// TEMP crude test of deviceStorage ... invoke these separately!
// deviceStorage.setItem('WowZeeKey', 'WowZeeValue');
// console.log(`test deviceStorage ... '${deviceStorage.getItem('WowZeeKey')}'`);
