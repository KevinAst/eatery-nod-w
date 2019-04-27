import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import _baseUI            from './featureName';
import _baseUIAct         from './actions';
import {fetchUITheme}     from './uiThemeStorage';


// ***
// *** Our feature reducer, managing our state.
// ***

const reducer = slicedReducer(_baseUI, combineReducers({

  // uiTheme: 'light'/'dark'
  uiTheme: reducerHash({
    [_baseUIAct.toggleUITheme]: (state, action) => state==='dark' ? 'light' : 'dark',
  }, fetchUITheme() ), // initialState (default to a persistent state)

  // loc: {lat, lng} ... device GPS location
  curView: reducerHash({
    [_baseUIAct.changeView]: (state, action) => action.viewName,
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
export const curView            = (appState) => gfs(appState).curView;
