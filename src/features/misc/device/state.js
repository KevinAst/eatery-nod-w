import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import _device            from './featureName';
import _deviceAct         from './actions';
import deviceService      from 'features/misc/device/deviceService/DeviceService'; // NOTE: Special Case - need deviceService early (import it vs. fassets.deviceService)

// ***
// *** Our feature reducer, managing state for our device.
// ***
const reducer = slicedReducer(_device, combineReducers({

  // uiTheme: 'light'/'dark'
  uiTheme: reducerHash({
    [_deviceAct.toggleUITheme]: (state, action) => state==='dark' ? 'light' : 'dark',
  }, deviceService.fetchUITheme() ), // initialState (default to a persistent state)

  // loc: {lat, lng} ... device GPS location
  loc: reducerHash({
    [_deviceAct.setLoc]: (state, action) => action.loc,
  }, null), // initialState

}) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                  /** Our feature state root (via slicedReducer as a single-source-of-truth) */
const getFeatureState           = (appState) => reducer.getSlicedState(appState);
const gfs = getFeatureState;      // ... concise alias (used internally)

                                  /** UI Theme: 'light'/'dark' */
export const getUITheme         = (appState) => gfs(appState).uiTheme || 'light'; // default to 'light' (on first occurrence -or- deviceStorage() NOT supported)

                                  /** Device Location: {lat, lng} */
export const getDeviceLoc       = (appState) => gfs(appState).loc;
