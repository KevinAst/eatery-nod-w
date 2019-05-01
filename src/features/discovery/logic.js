import {createLogic}           from 'redux-logic';
import discoveryFilterFormMeta from './discoveryFilterFormMeta';
import _discoveryAct           from './actions';
import _discovery              from './featureName';
import * as _discoverySel      from './state';
import {expandWithFassets}     from 'feature-u';
import discloseError           from 'util/discloseError';

/**
 * Initially retrieve discoveries, on 'discovery' view change.
 */
export const initialRetrieve = expandWithFassets( (fassets) => createLogic({

  name: `${_discovery}.initialRetrieve`,
  type: String(fassets.actions.changeView),

  process({getState, action, fassets}, dispatch, done) {

    const appState = getState();

    if (action.viewName                        === _discovery  && // ... our view
        _discoverySel.getDiscoveries(appState) === null        && // ... discoveries in initial state
        !_discoverySel.getInProgress(appState)) {                 // ... no discovery retrieval is in-progress
      // initial retrieval using default filter (located in our app state)
      const location = fassets.sel.getLocation(appState);
      dispatch( _discoveryAct.retrieve({..._discoverySel.getFilter(appState),
                                        loc: [location.lat, location.lng]}) );
    }

    done();
  },

}) );


/**
 * Default the filter.open() domain param from the appState
 * filter.
 */
export const defaultFilter = createLogic({

  name: `${_discovery}.defaultFilter`,
  type: String(_discoveryAct.filterForm.open),

  transform({getState, action, fassets}, next) {
    if (!action.domain) {
      action.domain = _discoverySel.getFilter(getState());
    }
    next(action);
  },

});



/**
 * Process discovery filter.
 */
export const processFilter = createLogic({

  name: `${_discovery}.processFilter`,
  type: String(_discoveryAct.filterForm.process),
  
  process({getState, action, fassets}, dispatch, done) {
    // retrieve using new filter from form
    const appState  = getState();
    const filter    = action.domain;
    const location = fassets.sel.getLocation(appState);
    dispatch( _discoveryAct.retrieve({...filter, 
                                      loc: [location.lat, location.lng]}) );
    
    // show our view view
    dispatch( fassets.actions.changeView(_discovery) );

    // close our form filter
    dispatch( _discoveryAct.filterForm.close() );

    done();
  },

});


/**
 * Perform discovery retrieval.
 */
export const retrieve = createLogic({

  name: `${_discovery}.retrieve`,
  type: String(_discoveryAct.retrieve),
  warnTimeout: 0, // long-running logic ... UNFORTUNATELY GooglePlaces is sometimes EXCRUCIATINGLY SLOW!

  process({getState, action, fassets}, dispatch, done) {

    fassets.discoveryService.searchDiscoveries(action.filter)
       .then(discoveriesResp => { 
         // console.log(`xx here is our discoveriesResp: `, discoveriesResp);
         dispatch( _discoveryAct.retrieve.complete(action.filter, discoveriesResp) );
         done();
       })
       .catch(err => {
         dispatch( _discoveryAct.retrieve.fail(err) );

         // report unexpected error to user
         discloseError({err: err.defineAttemptingToMsg('DiscoveryService.searchDiscoveries()')});

         done();
       });
  },

});



/**
 * Perform next-page discovery retrieval.
 */
export const nextPage = createLogic({

  name: `${_discovery}.nextPage`,
  type: String(_discoveryAct.nextPage),
  warnTimeout: 0, // long-running logic ... UNFORTUNATELY GooglePlaces is sometimes EXCRUCIATINGLY SLOW!

  process({getState, action, fassets}, dispatch, done) {

    fassets.discoveryService.searchDiscoveriesNextPage(action.pagetoken)
       .then(discoveriesResp => {
         // console.log(`xx here is our discoveriesRes: `, discoveriesResp);
         dispatch( _discoveryAct.nextPage.complete(discoveriesResp) );
         done();
       })
       .catch(err => {
         dispatch( _discoveryAct.nextPage.fail(err) );

         // report unexpected error to user
         discloseError({err: err.defineAttemptingToMsg('DiscoveryService.searchDiscoveriesNextPage()')});

         done();
       });
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default expandWithFassets( (fassets) => [
  ...discoveryFilterFormMeta.registrar.formLogic(), // discoveryFilter iForm logic modules
  defaultFilter,
  initialRetrieve(fassets),
  processFilter,
  retrieve,
  nextPage,
] );
