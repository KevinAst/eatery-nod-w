import React                  from 'react';
import {createRouteAspect}    from 'feature-router';
import {createReducerAspect}  from 'feature-redux';
import {createLogicAspect}    from 'feature-redux-logic';
import SplashScreen           from 'util/SplashScreen';
import configureEateryNodDiagnostics  from 'util/configureEateryNodDiagnostics';


//***
//*** define/configure the aspects representing our app's run-time stack
//***

// Feature Routes - extending: Feature.route
const routeAspect   = createRouteAspect({
  // ... configure the fallback screen (used when no routes are in effect)
  fallbackElm: <SplashScreen msg="I'm trying to think but it hurts!"/>
});

// redux - extending: Feature.reducer
const reducerAspect = createReducerAspect();

// redux-logic - extending: Feature.logic
const logicAspect   = createLogicAspect();


//***
//*** configure our app's overall diagnostics (non-production code)
//***

configureEateryNodDiagnostics(reducerAspect, logicAspect, routeAspect);


//***
//*** promote the aspects representing our app's run-time stack
//***

export default [
  routeAspect,
  reducerAspect,
  logicAspect,
];
