import 'util/ErrorExtensionPolyfill';
import React                  from 'react';
import ReactDOM               from 'react-dom';
import {launchApp}            from 'feature-u';
import {createReducerAspect}  from 'feature-redux';
import {createLogicAspect}    from 'feature-redux-logic';
import {createRouteAspect}    from 'feature-router';
import features               from 'features';
import SplashScreen, {splash} from 'util/SplashScreen';
import discloseError          from 'util/discloseError';
import configureEateryNodDiagnostics  from 'util/configureEateryNodDiagnostics';

// launch our application, exposing the feature-u Fassets object (facilitating cross-feature-communication)!
export default launchApp({
  aspects: appAspects(),
  features,
  registerRootAppElm(rootAppElm) {
    ReactDOM.render(rootAppElm,
                    document.getElementById('root'));
  },
  //? showStatus(msg='', err=null) { // ?? defensive: default parameters
  //?   splash(msg + (err ? ` ... WITH ERROR: ${err.formatUserMsg()}` : ''));
  //?   if (err) {
  //?     discloseError({err, logIt:true});
  //?   }
  //? }
});


// accumulate/configure the Aspect plugins matching our app's run-time stack
function appAspects() {

  // define our framework run-time stack
  const reducerAspect = createReducerAspect();
  const logicAspect   = createLogicAspect();
  const routeAspect   = createRouteAspect();
  const aspects = [
    reducerAspect, // redux          ... extending: Feature.reducer
    logicAspect,   // redux-logic    ... extending: Feature.logic
    routeAspect,   // Feature Routes ... extending: Feature.route
  ];

  // configure Aspects (as needed)
  // ... StateRouter fallback screen (when no routes are in effect)
  routeAspect.config.fallbackElm$ = <SplashScreen msg="I'm trying to think but it hurts!"/>;

  // configure our app's overall diagnostics (non-production code)
  configureEateryNodDiagnostics(reducerAspect, logicAspect, routeAspect);

  // beam me up Scotty :-)
  return aspects;
}
