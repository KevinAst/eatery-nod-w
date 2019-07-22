import {reducerHash}        from 'astx-redux-util';
import {slicedReducer}      from 'feature-redux';
import {expandWithFassets}  from 'feature-u';
import _location            from './featureName';
import _locationAct         from './actions';

// ***
// *** Our feature reducer, managing state for our location.
// ***

// location: {lat, lng} ... GPS location
const reducer = slicedReducer(_location, expandWithFassets( (fassets) => reducerHash({

  // standard location location retention
  [_locationAct.setLocation]: (state, action) => action.loc,

  // setup guest user
  // ... for "guest" user signIn, force location to the "guest" loc (matching loc of mock data)
  [fassets.actions.signIn.complete]: (state, action) => action.user.guestLoc || state,

  // tear down guest user
  // ... for "guest" user signOut, reset back to original "real" location (for subsequent "real" signin)
  [fassets.actions.signOut]: (state, action) => action.user.originalLoc || state,

}, null))); // initialState

export default reducer;

// ***
// *** Various Selectors
// ***


// NOTE: in this case, our feature state root IS our location (very simple)!
//       ... we use slicedReducer as a single-source-of-truth
export const getLocation = (appState) => reducer.getSlicedState(appState);
