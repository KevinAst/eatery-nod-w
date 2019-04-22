import {createLogic}      from 'redux-logic';
import _bootstrap         from './featureName';
import _bootstrapAct      from './actions';
import discloseError      from '../../../util/discloseError';

/**
 * Administer the "bootstrap" initialization process, initiated by
 * dispatching the `bootstrap()` action.
 * 
 * A bootstrapFn is a client-specific critical-path initialization that
 * must be completed before the app can run.
 * 
 * Bootstraps can be supplied by any number of features, under the
 * `'bootstrap.*'` fassets use contract.  These are functions (created
 * through `createBootstrapFn()`), that perform any critical-path
 * client-specific initialization.  All bootstraps will run to
 * completion before this administrative process is finished (as
 * denoted by the `bootstrap.complete()` action).
 * 
 * Actions that are emitted by this process are:
 * 
 *  - bootstrap.setStatus(statusMsg)
 *  
 *    Status is a human interpretable representation of the bootstrap
 *    process (e.g. 'Waiting for bla bla bla' -or- 'COMPLETE').
 * 
 *    This status is used by our SplashScreen, informing the user
 *    of what is going on.
 * 
 *  - client-specific actions
 * 
 *    These actions can optionally emitted by client-specific
 *    bootstrapFns.  As an example, a device feature's bootstrapFn may
 *    need to retain it's GPS location.
 * 
 *  - bootstrap.complete()
 * 
 *    This is a **fundamental result** of the bootstrap process
 *    completion.  It indications that all bootstraps have completed,
 *    and the app is fully initialized and ready to run.
 * 
 *    This action is typically monitored by an external feature to
 *    start the app.
 */
export const bootstrap = createLogic({

  name: `${_bootstrap}`,        // our featureName IS the module name (bootstrap)
  type: String(_bootstrapAct),  // our base actions IS the bootstrap() action
  warnTimeout: 0, // long-running process (runs till all bootstrap initialization has completed)
  
  process({getState, action, fassets}, dispatch, done) {


    // identify the various bootstrap items to process
    // ... employing our use contract
    const bootstrapFns = fassets.get('bootstrap.*'); // bootstrapFn[]

    // initialize all bootstrapFns to an un-processed status
    bootstrapFns.forEach( (bootstrapFn) => bootstrapFn.complete = false );

    // helper to "wrapup" when all bootstrap initialization has completed
    function wrapup() {
      dispatch( _bootstrapAct.setStatus('COMPLETE') ); // maintain our status as complete
      dispatch( _bootstrapAct.complete() );            // the fundamental action that triggers downstream processes
      done();
    }

    // no-op if there are NO bootstrapFns ... there is nothing to do
    if (bootstrapFns.length === 0) {
      wrapup();
      return;
    }

    // helper that monitors the completion of each bootstrapFn
    // ... optionally with the supplied err
    function bootstrapFnFinished(bootstrapFn, err=null) {

      // mark bootstrapFn as completed
      // ... unless there is an unexpected error
      if (!err || !err.isUnexpected()) {
        bootstrapFn.complete = true;
      }

      // handle error conditions
      if (err) {
        // add the "what" context to this raw error
        err.defineAttemptingToMsg(bootstrapFn.bootstrapWhat);

        // disclose the error to the user -and- log it
        discloseError({err, logIt:true});
      }

      // change our status to one of the "open" un-processed bootstrapFns
      // ... giving user visibility of what is being done
      // ... e.g. 'Waiting for bla bla bla'
      const nextBootstrapFn = bootstrapFns.find( (bootstrapFn) => !bootstrapFn.complete );
      if (nextBootstrapFn) {
        dispatch( _bootstrapAct.setStatus(nextBootstrapFn.bootstrapWhat) );
      }

      // when ALL bootstrapFns have completed, we are done!!!
      // ... we have successfully initialized ALL bootstrapFns
      // ... otherwise we keep going
      //     - even when we are hung with one bootstrapFn that errored
      //       ... because this process is a critical path that must complete
      //       ... there is no subsequent work that will be done in the entire app
      if (!nextBootstrapFn) {
        wrapup();
      }

    }

    // "prime the pump" by setting our status to the FIRST bootstrapFn
    // ... giving user visibility of what is being done
    // ... e.g. 'Waiting for bla bla bla'
    dispatch( _bootstrapAct.setStatus(bootstrapFns[0].bootstrapWhat) );
    
    // asynchronously kick off each each bootstrapFn process
    // ... via promise
    bootstrapFns.forEach(bootstrapFn => {
      bootstrapFn({getState, dispatch, fassets})
        .then( () => {
          // console.log(`xx resolving bootstrapFn IN logic processor ... bootstrap.${bootstrapFn.bootstrapWhat}`);
          bootstrapFnFinished(bootstrapFn);
        })
        .catch( (err) => {
          // console.log(`xx error caught invoking bootstrap.${bootstrapFn.bootstrapWhat}: `, err);
          bootstrapFnFinished(bootstrapFn, err);
        });
    });

  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  bootstrap,
];
