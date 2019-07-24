import featureFlags  from 'featureFlags';
import diag$         from 'util/diag$';
import delay         from 'util/delay';

const mockedLocation = featureFlags.useLocation(); // null indicates NOT mocking

/**
 * Return the current device location asynchronously (via a promise).
 * 
 * NOTE: This service method can be mocked via: featureFlags.useLocation()
 *
 * @returns {Promise} the current device location {lat, lng}
 */
export const getCurPos = mockedLocation ? console.log(`***eatery-nod-w*** mocking location to: ${mockedLocation.name}`) || getCurPos_mock
                                        : getCurPos_real;


//***
//*** our REAL implementation
//***

function getCurPos_real() {

  // NOTE: because geolocation.getCurrentPosition() below is NOT promised based,
  //       WE MUST wrap in our own promise (i.e. we cannot use async/await syntax)
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
        // console.log(`xx getCurPos_real() returning: (${position.coords.latitude}, ${position.coords.longitude}) ... full structure: `, position);
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
        // console.log('xx getCurPos_real() geoErr: ', geoErr)
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

async function getCurPos_mock() {

  await diag$.off('Simulate GPS Location Error in long-running process', (errMsg) => delay(3000, errMsg));

  // expose our mocked location
  // ... NOTE: this function is only active if we have a mockedLocation :-)
  return mockedLocation;
}
