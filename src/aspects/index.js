import React                  from 'react';
import {createReducerAspect}  from 'feature-redux';
import {createLogicAspect}    from 'feature-redux-logic';
import {createRouteAspect}    from 'feature-router';
import SplashScreen           from 'util/SplashScreen';
import configureEateryNodDiagnostics  from 'util/configureEateryNodDiagnostics';


//***
//*** define/configure the aspects representing our app's run-time stack
//***

// redux - extending: Feature.reducer
const reducerAspect = createReducerAspect();

// redux-logic - extending: Feature.logic
const logicAspect   = createLogicAspect();

// Feature Routes - extending: Feature.route
const routeAspect   = createRouteAspect();
// ... define fallback screen (used when no routes are in effect)
routeAspect.config.fallbackElm$ = <SplashScreen msg="I'm trying to think but it hurts!"/>;


//***
//*** configure our app's overall diagnostics (non-production code)
//***

configureEateryNodDiagnostics(reducerAspect, logicAspect, routeAspect);


//***
//*** promote the aspects representing our app's run-time stack
//***

export default [
  reducerAspect,
  logicAspect,
  routeAspect,
];
