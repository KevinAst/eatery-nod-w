import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import _layout            from './featureName';
import _layoutAct         from './actions';
import deviceService      from 'features/misc/device/deviceService/DeviceService'; // NOTE: Special Case - need deviceService early (import it vs. fassets.deviceService)

// ***
// *** Our feature reducer, managing the currentView state.
// ***

const reducer = slicedReducer(_layout, combineReducers({

  // uiTheme: 'light'/'dark'
  uiTheme: reducerHash({
    [_layoutAct.toggleUITheme]: (state, action) => state==='dark' ? 'light' : 'dark',
  }, deviceService.fetchUITheme() ), // initialState (default to a persistent state)

  // loc: {lat, lng} ... device GPS location
  currentView: reducerHash({
    [_layoutAct.changeView]: (state, action) => action.viewName,
  }, 'uninitialized'), // initialState

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

                                  /** current view (ex: 'eateries') */
export const getView            = (appState) => gfs(appState).currentView;
