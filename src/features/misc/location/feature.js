import {createFeature}     from 'feature-u';
import {createBootstrapFn} from 'features/misc/bootstrap/bootstrapFn';
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

    defineUse: {
      'bootstrap.location': createBootstrapFn('Waiting for GPS Location',
                                              ({dispatch, fassets}) => {
                                                return getCurPos()
                                                  .then( (location) => {
                                                    // set the current location
                                                    dispatch( _locationAct.setLocation(location) );
                                                  })
                                                  .catch( (err) => {
                                                    // set a fallback location ... Glen Carbon IL
                                                    dispatch( _locationAct.setLocation({lat: 38.752209, lng: -89.986610}) );
                                                                
                                                    // alter the error to be an expected condition
                                                    // ... allowing the bootstrap to: complete -and- disclose to user
                                                    //     NOTE: we also expose the real error (via err.message) so as to identify various conditions
                                                    throw err.defineUserMsg(`Unable to get your GPS location (${err.message}) ... falling back to our base location (Glen Carbon)`);
                                                  })
                                              }),
    },

    // various public "push" resources
    define: {

      //*** public selectors ***
                          // GPS location {lat, lng}
      'sel.getLocation': getLocation,

    }
  },

});
