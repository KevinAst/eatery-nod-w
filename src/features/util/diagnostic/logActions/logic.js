import {createLogic}      from 'redux-logic';
import _logActions        from './featureName';
import featureFlags       from '../../../featureFlags';

let lastState = null;

const rawJson2Str    = (obj) => JSON.stringify(obj);
const prettyJson2Str = (obj) => JSON.stringify(obj, '\n', 2);

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

    console.log('Dispatched Action: ' + prettyJson2Str(action));

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
        console.log('Current State: ' + rawJson2Str(curState));
      }
      lastState = curState;
    }

    done();
  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  actionLogger,
];
