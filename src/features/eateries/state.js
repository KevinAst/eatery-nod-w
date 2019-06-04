import {combineReducers}     from 'redux';
import {reducerHash}         from 'astx-redux-util';
import {expandWithFassets}   from 'feature-u';
import {slicedReducer}       from 'feature-redux';
import {createSelector}      from 'reselect';
import _eateries             from './featureName';
import eateryFilterFormMeta  from './eateryFilterFormMeta';
import _eateriesAct          from './actions';

// ***
// *** Our feature reducer, managing state for our eateries process.
// ***

// NOTE: expandWithFassets() is used NOT for app injection,
//       but RATHER to delay expansion (avoiding circular dependencies
//       in selector access from eateryFilterFormMeta.js)
//       >>> subsequently, fassets is now used to access fassets.actions.signOut action
const reducer = slicedReducer(`view.${_eateries}`, expandWithFassets( (fassets) => combineReducers({

  // raw eatery entries synced from our realtime DB
  dbPool: reducerHash({
    [_eateriesAct.dbPool.changed]: (state, action) => action.eateries,
    [fassets.actions.signOut]:     (state, action) => null, // same as initialState ... AI: streamline in "INITIALIZATION" journal entry
  }, null), // initialState

  listView: combineReducers({

    // standard iForm for our EateryFilterForm
    filterForm: eateryFilterFormMeta.registrar.formReducer(),

    // filter used in visualizing listView
    filter: reducerHash({
      [_eateriesAct.filterForm.process]: (state, action) => action.domain,
      [fassets.actions.signOut]:         (state, action) => ({distance: null, sortOrder: 'name'}), // same as initialState ... AI: streamline in "INITIALIZATION" journal entry
    }, { // initialState
      distance: null,    // distance in miles (default: null - for any distance)
      sortOrder: 'name', // sortOrder: 'name'/'distance'
    }),

  }),

  // selectedEateryId: eateryId ... id of selected eatery to "display details for" (null for none)
  selectedEateryId: reducerHash({
    [_eateriesAct.viewDetail]:       (state, action) => action.eateryId,
    [_eateriesAct.viewDetail.close]: (state, action) => null,
  }, null), // initialState

  // spin: string ... msg to display when spin operation is in place, null for spin NOT in place
  spin: reducerHash({
    [_eateriesAct.spin]:          (state, action) => action.spinMsg,
    [_eateriesAct.spin.complete]: (state, action) => null,
  }, null), // initialState

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                   /** Our feature state root (via slicedReducer as a single-source-of-truth) */
const getFeatureState            = (appState) => reducer.getSlicedState(appState);
const gfs = getFeatureState;       // ... concise alias (used internally)

export const getDbPool           = (appState) => gfs(appState).dbPool;

export const isFormFilterActive  = (appState) => gfs(appState).listView.filterForm ? true : false;
export const getFormFilter       = (appState) => gfs(appState).listView.filterForm;

export const getListViewFilter   = (appState) => gfs(appState).listView.filter;

export const getFilteredEateries  = createSelector(
  getDbPool,
  getListViewFilter,
  (dbPool, filter) => {

    if (!dbPool) {
      return null; // NO dbPool yet ... waiting for pool entries
    }

    // apply filter to dbPool
    // filteredEateries: Eatery[]
    const entries = Object.values(dbPool)
                          .filter(entry => { // filter entries
                            // apply distance (when supplied in filter)
                            return filter.distance ? entry.distance <= filter.distance : true;
                          })
                          .sort((e1, e2) => ( // sort entries ... order by:
                            // distance (when requested)
                            (filter.sortOrder==='distance' ? e1.distance-e2.distance : 0) ||
                            // name - either secondary (within distance), or primary (when no distance)
                            e1.name.localeCompare(e2.name)
                          ));

    return entries;
  }
);

export const getSelectedEatery   = (appState) => {
  const  selectedEateryId = gfs(appState).selectedEateryId;
  return selectedEateryId ? gfs(appState).dbPool[selectedEateryId] : null;
};

export const getSpinMsg          = (appState) => gfs(appState).spin;
