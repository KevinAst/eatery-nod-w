import {createFeature}     from 'feature-u';
import _location           from './featureName';
import _locationAct        from './actions';
import reducer,
       {getLocation}       from './state';
import {getCurPos}         from 'util/deviceLocation';

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

    // obtain current device location
    const location = await getCurPos();

    // maintain the current location in our app state
    dispatch( _locationAct.setLocation(location) );
  },

});
