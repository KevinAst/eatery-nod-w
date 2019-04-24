import featureFlags  from 'featureFlags';

/**
 * Return the current device location asynchronously (via a promise).
 * 
 * NOTE: This service method can be mocked via: featureFlags.mockGPS
 *
 * @returns {Promise} the current device location {lat, lng}
 */
export const getCurPos = featureFlags.mockGPS ? getCurPos_mock : getCurPos_real;


//***
//*** our REAL implementation
//***

function getCurPos_real() {

  return new Promise( (resolve, reject) => {

    // insure geolocation is available in this browser
    if ( !('geolocation' in navigator)) {
      // NOTE: reject() passes error into .catch(), throw does NOT
      return reject(new Error('geolocation is NOT available in this browser'));
    }

    // issue the location request
    navigator.geolocation.getCurrentPosition(

      // success callback
      (position) => {
        // communicate device location
        // console.log(`xx DeviceService.getCurPos() returning: (${position.coords.latitude}, ${position.coords.longitude}) ... full structure: `, position);
        return resolve({lat: position.coords.latitude, 
                        lng: position.coords.longitude});
      },

      // error callback
      (geoErr) => {

        // NOTE: this geoErr object is NOT a derivation of JS Error
        //       Therefore we throw our own error.
        //       ... allowing downstream processes to do value-added adornment
        //           via: util/ErrorExtensionPolyfill.js
        //           ex:  err.defineAttemptingToMsg('...')
        // console.log('xx DeviceService.getCurPos() geoErr: ', geoErr)
        const err = new Error(geoErr.message);  // ex: "User denied Geolocation" -or- "Timeout expired" ... etc.

        // hold onto the internals of geoErr (code -and- constants)
        err.code                 = geoErr.code;
        err.PERMISSION_DENIED    = geoErr.PERMISSION_DENIED;    // user denied the request for Geolocation
        err.POSITION_UNAVAILABLE = geoErr.POSITION_UNAVAILABLE; // position information is unavailable
        err.TIMEOUT              = geoErr.TIMEOUT;              // the geo location request timed out

        // that's all we can do :-)
        return reject(err);
      },

      // geolocation options
      {
        enableHighAccuracy: true, // obtain the best possible result      ... DEFAULT: false
        //timeout:          5000, // timeout                              ... DEFAULT: wait FOREVER
        //maximumAge:       0,    // acceptable age of cached loc (mills) ... DEFAULT: 0 - do NOT use cached position
      });
  });
}



//***
//*** our MOCK implementation
//***

function getCurPos_mock() {

  const GlenCarbonIL = {lat: 38.752209, lng: -89.986610};
  const defaultLoc   = GlenCarbonIL;
  const mockLoc      = featureFlags.mockGPS.lat ? featureFlags.mockGPS : defaultLoc;

  // console.log(`xx DeviceService.getCurPos() request ... mocked to: `, mockLoc);
  return new Promise( (resolve, reject) => {
    // setTimeout(() => { // TEMPORARY: for testing delay just a bit

    // TEMPORARY: for testing, simulate error condition
    //            ... NOTE: reject() passes error into .catch(), throw does NOT
    // return reject(new Error('Simulated Error in Expo GPS Location acquisition') );

    // communicate device location
    return resolve(mockLoc);
    // }, 10000); // TEMPORARY: for testing delay just a bit
  });

}
