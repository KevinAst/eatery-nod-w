import {createLogic}        from 'redux-logic';
import eateryFilterFormMeta from './eateryFilterFormMeta';
import _eateries            from './featureName';
import * as _eateriesSel    from './state';
import _eateriesAct         from './actions';
import {expandWithFassets}  from 'feature-u';
import discloseError        from 'util/discloseError';
import {toast}              from 'util/notify';
import EateryServiceMock    from './subFeatures/eateryServiceMock/EateryServiceMock';


/**
 * Our persistent monitor that manages various aspects of a given pool.
 */
let curPoolMonitor = {   // current "pool" monitor (initially a placebo)
  pool:   null,          // type: string
  wrapUp: () => 'no-op', // type: function(): void ... cleanup existing monitored resources
};

let   originalEateryService = null;


/**
 * Setup any "guest" user to use a "mocked" eatery service backed by
 * an in-memory DB.
 */
export const setupGuestUser = expandWithFassets( (fassets) => createLogic({

  name: `${_eateries}.setupGuestUser`,
  type: String(fassets.actions.signIn.complete),

  transform({getState, action, fassets}, next) { // transform() so as to swap out service quickly (before it is needed)

    if (action.user.isGuest()) {

      // swap out our eatery service with a mocked in-memory source
      originalEateryService = fassets.eateryService;
      fassets.eateryService = new EateryServiceMock(); // AI: we are mutating fassets ... may be a  code smell

      // inform user of what is going on
      toast({ msg:'as a "guest" user, your Eatery pool is a "mocked" in-memory data source'});
    }

    next(action);
  },

}) );


/**
 * Tear-down any "guest" user, reverting to the original eatery
 * service.
 */
export const tearDownGuestUser = expandWithFassets( (fassets) => createLogic({

  name: `${_eateries}.tearDownGuestUser`,
  type: String(fassets.actions.signOut),

  process({getState, action, fassets}, dispatch, done) { // process() so as to allow the action to be supplemented with user
    if (action.user.isGuest()) {
      // revert our eatery service to the original service
      fassets.eateryService = originalEateryService; // AI: we are mutating fassets ... may be a  code smell
    }
    done();
  },

}) );


/**
 * This is the primary logic module, which initially loads (and
 * monitors changes) in the real-time DB for the pool eateries of our
 * active user.
 *
 * The key that drives this is the active User.pool identifier.
 * Therefore, we trigger the process off of the 'userProfileChanged'
 * action (where the User.pool is obtained).  This action is emitted:
 *  - on initial startup of our app
 *  - and when the User profile changes (TODO: a future enhancement of the app)
 */
export const monitorDbPool = expandWithFassets( (fassets) => createLogic({

  name:        `${_eateries}.monitorDbPool`,
  type:        String(fassets.actions.userProfileChanged), // NOTE: action contains: User object (where we obtain the pool)
  warnTimeout: 0, // long-running logic

  validate({getState, action, fassets}, allow, reject) {

    // no-op if we are already monitoring this same pool
    if (action.user.pool === curPoolMonitor.pool) {
      reject(action); // other-logic/middleware/reducers: YES, self's process(): NO
      return;
    }

    // allow self's process()
    allow(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    // close prior monitor
    curPoolMonitor.wrapUp();

    // create new monitor (retaining needed info for subsequent visibility)
    curPoolMonitor = {
      pool:   action.user.pool,
      wrapUp() {
        done();
      }
    };

    // register our real-time DB listener for the set of eateries in our pool
    fassets.eateryService.monitorDbEateryPool(
      action.user.pool,
      fassets.sel.getLocation(getState()),
      (eateries) => {

        // broadcast a notification of a change in our eateries (or the initial population)
        dispatch( _eateriesAct.dbPool.changed(eateries) );

      });
  },

}) );


/**
 * Close down any real-time monitor of our real-time DB pool (at sign-out time).
 */
export const closeDbPool = expandWithFassets( (fassets) => createLogic({

  name: `${_eateries}.closeDbPool`,
  type: String(fassets.actions.signOut),

  process({getState, action, fassets}, dispatch, done) {

    // close prior monitor
    curPoolMonitor.wrapUp();

    // create new placebo monitor
    curPoolMonitor = {
      pool:   null,          // type: string
      wrapUp: () => 'no-op', // type: function(): void ... cleanup existing monitored resources
    };

    done();
  },

}) );


/**
 * Default the actions.filterForm.open() domain param from the
 * appState filter.
 */
export const defaultFilter = createLogic({

  name: `${_eateries}.defaultFilter`,
  type: String(_eateriesAct.filterForm.open),

  transform({getState, action, fassets}, next) {
    if (!action.domain) {
      action.domain = _eateriesSel.getListViewFilter(getState());
    }
    next(action);
  },

});


/**
 * Process eatery filter.
 */
export const processFilter = createLogic({

  name: `${_eateries}.processFilter`,
  type: String(_eateriesAct.filterForm.process),
  
  process({getState, action, fassets}, dispatch, done) {

    // console.log(`xx logic: eatery.processFilter, action is: `, action);
    //   action: {
    //     "domain": {
    //       "distance":  6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //     "type": "eateries.filter.process",
    //     "values": {
    //       "distance": 6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //   }
    
    // show our view
    dispatch( fassets.actions.changeView(_eateries) );

    // close eatery form filter
    dispatch( _eateriesAct.filterForm.close() );

    done();
  },

});


export const spin = createLogic({

  name: `${_eateries}.spin`,
  type: String(_eateriesAct.spin),

  transform({getState, action, fassets}, next, reject) {

    const appState         = getState();
    const filteredEateries = _eateriesSel.getFilteredEateries(appState);

    // supplement action with spinMsg
    action.spinMsg = `... selecting your eatery from ${filteredEateries.length} entries!`;
    next(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    setTimeout( () => {

      const appState = getState();
      const filteredEateries  = _eateriesSel.getFilteredEateries(appState);

      // algorithm from MDN ... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const min      = Math.ceil(0);                        // min is inclusive (in usage below)
      const max      = Math.floor(filteredEateries.length); // max is exclusive (in usage below)
      const randIndx = Math.floor(Math.random() * (max - min)) + min;
      
      const randomEateryId = filteredEateries[randIndx].id;

      dispatch( _eateriesAct.spin.complete(randomEateryId) );
      done();

    }, 1200);

  },

});

export const spinComplete = createLogic({

  name: `${_eateries}.spinComplete`,
  type: String(_eateriesAct.spin.complete),

  process({getState, action, fassets}, dispatch, done) {
    dispatch( _eateriesAct.viewDetail(action.eateryId) );
    done();
  },

});


export const addToPoolPrep = createLogic({

  name: `${_eateries}.addToPoolPrep`,
  type: String(_eateriesAct.dbPool.add),

  async process({getState, action, fassets}, dispatch, done) {
    try {
      const eatery = await fassets.discoveryService.fetchEateryDetail(action.eateryId);
      dispatch( _eateriesAct.dbPool.add.eateryDetail(eatery) );
    }
    catch(err) {
      dispatch( _eateriesAct.dbPool.add.eateryDetail.fail(action.eateryId, err) );

      // report unexpected error to user
      discloseError({err: err.defineAttemptingToMsg('DiscoveryService.fetchEateryDetail()')});
    }
    finally {
      done();
    }
  },

});



export const addToPool = createLogic({

  name: `${_eateries}.addToPool`,
  type: String(_eateriesAct.dbPool.add.eateryDetail),

  async transform({getState, action, fassets}, next, reject) {
    try {
      // add the new eatery
      await fassets.eateryService.addEatery(action.eatery);
      next(action);
    }
    catch(err) {
      // report unexpected error to user
      discloseError({err});
      reject(action);
    }
  },

});


export const removeFromPool = createLogic({

  name: `${_eateries}.removeFromPool`,
  type: String(_eateriesAct.dbPool.remove),

  async transform({getState, action, fassets}, next, reject) {
    try {
      // remove the supplied eatery
      await fassets.eateryService.removeEatery(action.eateryId)
      next(action);
    }
    catch(err) {
      // report unexpected error to user
      discloseError({err});
      reject(action);
    }
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default expandWithFassets( (fassets) => [
  setupGuestUser(fassets),
  tearDownGuestUser(fassets),
  monitorDbPool(fassets),
  closeDbPool(fassets),
  ...eateryFilterFormMeta.registrar.formLogic(), // inject the standard eatery filter form-based logic modules
  defaultFilter,
  processFilter,
  spin,
  spinComplete,
  addToPoolPrep,
  addToPool,
  removeFromPool,
] );
