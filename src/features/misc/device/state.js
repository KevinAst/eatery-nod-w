import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import _device            from './featureName';
import _deviceAct         from './actions';

// ***
// *** Our feature reducer, managing state for our device.
// ***
const reducer = slicedReducer(_device, combineReducers({

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

                                  /** Device Location: {lat, lng} */
export const getDeviceLoc       = (appState) => gfs(appState).loc;
