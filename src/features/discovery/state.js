import {combineReducers}        from 'redux';
import {reducerHash}            from 'astx-redux-util';
import {expandWithFassets}      from 'feature-u';
import {slicedReducer}          from 'feature-redux';
import _discovery               from './featureName';
import discoveryFilterFormMeta  from './discoveryFilterFormMeta';
import _discoveryAct            from './actions';

// ***
// *** Our feature reducer, managing state for our discovery process.
// ***

// NOTE: expandWithFassets() is used NOT for app injection,
//       but RATHER to delay expansion (avoiding circular dependancies
//       in selector access from discoveryFilterFormMeta.js)
const reducer = slicedReducer(`view.${_discovery}`, expandWithFassets( () => combineReducers({

  // retrieval in-progress (used by BOTH filtered retrieval, and next page)
  // ... null/'retrieve'/'next'
  inProgress: reducerHash({

    [_discoveryAct.retrieve]:          (state, action) => 'retrieve',
    [_discoveryAct.retrieve.complete]: (state, action) => null,
    [_discoveryAct.retrieve.fail]:     (state, action) => null,

    [_discoveryAct.nextPage]:          (state, action) => 'next',
    [_discoveryAct.nextPage.complete]: (state, action) => null,
    [_discoveryAct.nextPage.fail]:     (state, action) => null,

  }, null),  // initialState

  // standard iForm reducer for our DiscoveryFilterForm
  filterForm: discoveryFilterFormMeta.registrar.formReducer(),

  // selection criteria (filter)
  filter: reducerHash({
    [_discoveryAct.retrieve.complete]: (state, action) => action.filter,
  }, { // initialState
    searchText: '',
    distance:   10,
    minprice:   '1',
  }),

  // next page token (for paging)
  nextPageToken: reducerHash({
    [_discoveryAct.retrieve.complete]: (state, action) => action.discoveriesResp.pagetoken,
    [_discoveryAct.nextPage.complete]: (state, action) => action.discoveriesResp.pagetoken,
  }, null), // initialState

  // discoveries (data records)
  discoveries: reducerHash({
    [_discoveryAct.retrieve.complete]: (state, action) => action.discoveriesResp.discoveries,
    [_discoveryAct.nextPage.complete]: (state, action) => [...state, ...action.discoveriesResp.discoveries], // append to state
  }, null), // initialState

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                   /** Our feature state root (via slicedReducer as a single-source-of-truth) */
const getFeatureState            = (appState) => reducer.getSlicedState(appState);
const gfs = getFeatureState;       // ... concise alias (used internally)

export const getInProgress       = (appState) => gfs(appState).inProgress;

export const isFormFilterActive  = (appState) => gfs(appState).filterForm ? true : false;
export const getFormFilter       = (appState) => gfs(appState).filterForm;

export const getFilter           = (appState) => gfs(appState).filter;

export const getNextPageToken    = (appState) => gfs(appState).nextPageToken;

export const getDiscoveries      = (appState) => gfs(appState).discoveries;
