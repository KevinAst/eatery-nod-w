import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import _device            from './featureName';
import _deviceAct         from './actions';

// ***
// *** Our feature reducer, managing state for our device.
// ***
const reducer = slicedReducer(_device, combineReducers({

  // guiReady: boolean ... has GUI been initialized, and ready to use?
  // - The native-base library requires specific fonts to be loaded :-(
  //   * When these fonts are NOT loaded, native-base will continuously
  //     generate the following error:
  //       ERROR: fontFamily 'Roboto_medium' is not a system font and has not
  //              been loaded through Font.loadAsync.
  //   * Any uncaught errors generate the "red screen of death" by react-native,
  //     and in a production deployment, expo will STOP the app!
  //   * Technically, the GUI runs (in development mode), but in the context
  //     of react-native/expo, there are constant "red screen of death"
  //     (which in production STOPs the app).
  // - Obviously, these fonts ARE loaded very early in the app start-up process!
  // - HOWEVER: For GUI components that render EARLY in the app start-up process,
  //   they must fall-back to more primitive content
  //   >>> CONTROLLED BY THIS STATE!!
  // - There are only a few components that are impacted:
  //   KNOWN COMPONENTS AFFECTED:
  //   * SplashScreen ... visible during app startup
  //   * SideBar      ... NOT visible during app startup, HOWEVER is injected in our root DOM
  guiReady: reducerHash({
    [_deviceAct.guiIsReady]: (state, action) => true,
  }, false), // initialState

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

                                  /** Can FULL GUI be used (e.g. native-base components)?
                                      Needed by a limited few GUI components (that render EARLY), 
                                      driving a "more primitive content" fallback when GUI is NOT yet initialized
                                      ... see: state.js description */
export const isGuiReady         = (appState) => gfs(appState).guiReady;

                                  /** Device Location: {lat, lng} */
export const getDeviceLoc       = (appState) => gfs(appState).loc;
