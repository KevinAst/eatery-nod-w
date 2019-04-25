import {createLogic}      from 'redux-logic';
import _logActions        from './featureName';
import featureFlags       from 'featureFlags';

let lastState = null;

/**
 * Log all dispatched actions.
 *
 * TODO: retrofit to use real logger:
 *       using the following Log levels:
 *         - TRACE:   see dispatched actions
 *         - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 */
export const actionLogger = createLogic({

  name: `${_logActions}.actionLogger`,
  type: '*', // monitor ALL action types

  transform({getState, action}, next) {

    if (featureFlags.log === 'verbose') { // group action/state together
      console.group(`Action: ${action.type}`);
    }

    console.log('Dispatched Action: ', action);

    // TODO: retrofit to use log-u:
    // // log dispatched action
    // if (log.isVerboseEnabled()) {
    //   log.verbose(()=> `Dispatched Action: ${FMT(action.type)} with content:\n${FMT(action)}`);
    // }
    // else {
    //   log.trace(()=>   `Dispatched Action: ${FMT(action.type)}`);
    // }

    // continue processing
    next(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    if (featureFlags.log === 'verbose') { // state can be big ... log conditionally

      const curState = getState();
      if (curState === lastState) {
        console.log('Current State: UNCHANGED');
      }
      else {
        console.log('Current State: ', curState);
      }
      lastState = curState;

      console.groupEnd();
    }

    done();
  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  actionLogger,
];
