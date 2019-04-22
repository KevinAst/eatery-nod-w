import {createFeature}     from 'feature-u';
import _device             from './featureName';
import {createBootstrapFn} from 'features/misc/bootstrap/bootstrapFn';
import ToggleUITheme       from './comp/ToggleUITheme';
import _deviceAct          from './actions';
import reducer,
       {getUITheme,
        getDeviceLoc}      from './state';
import logic               from './logic';

// feature: device
//          initialize the device for use by the app (full details in README)
export default createFeature({
  name: _device,

  reducer,
  logic,

  // our public face ...
  fassets: {

    // various 'bootstrap.*' resources to initialize
    defineUse: {
      // inject our user-profile menu item to toggle UI Theme ('light'/'dark')
      'AppLayout.UserMenuItem.UIThemeToggle': ToggleUITheme,

      'bootstrap.location': createBootstrapFn('Waiting for Device Location',
                                              ({dispatch, fassets}) => {
                                                return fassets.deviceService.getCurPos()
                                                              .then( (location) => {
                                                                // set the current location
                                                                dispatch( _deviceAct.setLoc(location) );
                                                              })
                                                              .catch( (err) => {
                                                                // set a fallback location ... Glen Carbon IL
                                                                dispatch( _deviceAct.setLoc({lat: 38.752209, lng: -89.986610}) );
                                                                
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

                          // UI Theme: 'light'/'dark'
      'sel.getUITheme':   getUITheme,

                          // device location {lat, lng}
      'sel.getDeviceLoc': getDeviceLoc,

    }
  },

});
