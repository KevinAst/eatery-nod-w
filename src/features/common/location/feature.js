import {createFeature}     from 'feature-u';
import _location           from './featureName';
import _locationAct        from './actions';
import reducer,
       {getLocation}       from './state';
import {getCurPos}         from 'util/deviceLocation';
import discloseError       from 'util/discloseError';

// feature: location
//          initialize the GPS location for use by the app (full details in README)
export default createFeature({
  name: _location,

  reducer,

  // our public face ...
  fassets: {

    // various public "push" resources
    define: {
      //*** public selectors ***
      'sel.getLocation': getLocation,  // GPS location {lat, lng}
    }
  },

  async appInit({showStatus, fassets, appState, dispatch}) {

    // inform user what we are doing
    showStatus('Initializing GPS Location');

    try {
      // obtain current device location
      const location = await getCurPos();

      // maintain the current location in our app state
      dispatch( _locationAct.setLocation(location) );
    }
    catch(err) {
      // any issue, we simply revert to our fallback location ... Glen Carbon IL
      dispatch( _locationAct.setLocation({lat: 38.752209, lng: -89.986610}) );
      
      // communicate this fallback heuristic to the user
      // NOTE: we alter the error to be an expected condition
      //       AND expose the real error (via err.message) so as to identify the underlying cause
      discloseError({
        err:   err.defineUserMsg(`Unable to get your GPS location (${err.message}) ... falling back to our base location (Glen Carbon)`),
        logIt: true
      });
    }
  },

});
