import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import _location          from './featureName';
import _locationAct       from './actions';

// ***
// *** Our feature reducer, managing state for our location.
// ***

// location: {lat, lng} ... GPS location
const reducer = slicedReducer(_location, reducerHash({
  [_locationAct.setLocation]: (state, action) => action.loc,
}, null) ); // initialState

export default reducer;

// ***
// *** Various Selectors
// ***


// NOTE: in this case, our feature state root IS our location (very simple)!
//       ... we use slicedReducer as a single-source-of-truth
export const getLocation = (appState) => reducer.getSlicedState(appState);
