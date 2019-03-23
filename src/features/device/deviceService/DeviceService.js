//? import {Location,
//?         Permissions}   from 'expo';                   // ?? THERE IS NO expo
//? import {AsyncStorage}  from 'react-native';           // ?? THERE IS NO react-native
import featureFlags    from '../../../featureFlags';

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
export default class DeviceService {

  /**
   * Instantiate the DeviceService service object.
   */
  constructor() {
    // conditionally mock various service methods, as directed by featureFlags
    mock_getCurPos_asNeeded(this);
  }


  /**
   * Fetch credentials stored on local device (if any).
   * 
   * @return {promise} a promise resolving to encodedCredentials (use
   * decodeCredentials() to decode), or null (when non-existent).
   */
  fetchCredentials() {
    //? return AsyncStorage.getItem(credentialsKey);
  }


  /**
   * Store credentials on local device.
   * 
   * @return {promise} a promise strictly for error handling.
   */
  storeCredentials(email, pass) {
    //? return AsyncStorage.setItem(credentialsKey, this.encodeCredentials(email, pass));
  }


  /**
   * Remove credentials on local device.
   * 
   * @return {promise} a promise strictly for error handling.
   */
  removeCredentials() {
    //? return AsyncStorage.removeItem(credentialsKey);
  }


  /**
   * Encode the supplied email/pass into a string.
   */
  encodeCredentials(email, pass) {
    return email+credentialsSeparator+pass;
  }


  /**
   * Decode the supplied encodedCredentials, resulting in:
   *    {
   *      email: string,
   *      pass:  string
   *    }
   * -or-
   *    null (if non-existent).
   */
  decodeCredentials(encodedCredentials) {
    if (encodedCredentials) {
      const parts = encodedCredentials.split(credentialsSeparator);
      return {
        email: parts[0],
        pass:  parts[1],
      };
    }
    else {
      return null;
    }
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
