import React                   from 'react';
import {launchApp}             from 'feature-u';
import features                from 'features';
import {applyMiddleware,
        compose,
        createStore}           from 'redux';
import {createLogicMiddleware} from 'redux-logic';
import {featureRoute, 
        PRIORITY}              from 'feature-router';
import SplashScreen            from 'util/SplashScreen';
import diag$                   from 'util/diag$';


// ***
// *** feature-u Ingegration Tests ---------------------------------------------
// ***

export default function configureFeatureUIntegrationTests(reducerAspect, logicAspect, routeAspect) {

  // NOTE: run following tests mutually exclusive

  // --- feature-redux -----------------------------------------------------------

  diag$.skip('feature-redux plugin: test PUBLIC allowNoReducers$', () => {
    test_allowNoReducers$();
  });

  diag$.skip('feature-redux plugin: test HIDDEN createReduxStore$', () => {
    // override reducerAspect's creation of redux store (showing default implementation -WITH- our log)
    reducerAspect.config.createReduxStore$ = function (appReducer, middlewareArr) {
      console.log('OVERRIDING createReduxStore$ ... LOOK FOR THIS LOG');
      return  middlewareArr.length === 0
               ? createStore(appReducer)
               : createStore(appReducer,
                             compose(applyMiddleware(...middlewareArr)));
    };
  });

  // --- feature-redux-logic -----------------------------------------------------

  diag$.skip('feature-redux-logic plugin: test PUBLIC allowNoLogic$', () => {
    test_allowNoLogic$();
  });
  
  diag$.skip('feature-redux-logic plugin: test HIDDEN createLogicMiddleware$', () => {
    // override logicAspect's creation of redux-logic middleware (showing default implementation)
    logicAspect.config.createLogicMiddleware$ = function(app, appLogic) {
      console.log('OVERRIDING createLogicMiddleware$ ... LOOK FOR THIS LOG');
      return createLogicMiddleware(appLogic,
                                   { // inject our app as a redux-logic dependancy
                                     app,
                                   });
    };
  });

  // --- feature-router ----------------------------------------------------------

  // NOTE: PUBLIC routeAspect.config.fallbackElm$: reactElm ... fallback when NO routes are in effect (REQUIRED CONFIGURATION)
  //       is tested by eatery-nod directly

  // NOTE: PUBLIC routeAspect.config.componentWillUpdateHook$: void ... invoked during react componentWillUpdate() life-cycle (OPTIONAL)
  //       is tested by eatery-nod directly

  diag$.skip('feature-router plugin: test PUBLIC allowNoRoutes$', () => {
    test_allowNoRoutes$();
  });

  // --- rename Aspect.name ----------------------------------------------------------

  diag$.skip('TEST ability to rename Aspect.name (on various plugin projects)', () => {
    test_renameAspectName();
  });



  // ***
  // *** test_allowNoReducers$() -------------------------------------------------
  // ***

  function test_allowNoReducers$() {

    diag$('test_allowNoReducers$() test PUBLIC allowNoReducers$ ... disable feature-u logging, so as to see forced logs', () => {
      launchApp.diag.logf.disable();
    });

    function removeAllReducers() {
      features.forEach( (feature) => {
        if (feature.reducer)
          delete feature.reducer;
      });
    };

    // NOTE: run following sub-tests mutually exclusive

    diag$.skip('test_allowNoReducers$() 1st: insure allowNoReducers$ is NOT referenced when our features HAVE reducers ... should run normally', () => {
      reducerAspect.config.allowNoReducers$ = (s) => "MY REDUCER";
    });
    // expecting app to run normally!


    diag$.skip('test_allowNoReducers$() 2nd: test DEFAULT EXCEPTION ... when our features HAVE NO reducers ... expecting: thrown exception', () => {
      removeAllReducers();
    });
    // expecting Exception:
    //   ***ERROR*** feature-redux found NO reducers within your features
    //               ... did you forget to register Feature.reducer aspects in your features?
    //               (please refer to the feature-redux docs to see how to override this behavior).


    diag$.skip('test_allowNoReducers$() 3rd: test allowNoReducers$ = true ... when our features HAVE NO reducers ... expecting: forced log', () => {
      removeAllReducers();
      reducerAspect.config.allowNoReducers$ = true;
    });
    // expecting Forced Log:
    //   ***feature-u*** - ***feature-redux*** reducerAspect: 
    //                     WARNING: NO reducers were found in your features (i.e. Feature.reducer),
    //                              but client override (reducerAspect.config.allowNoReducers$=truthy;)
    //                              directed a continuation WITH the identity reducer.


    diag$.skip('test_allowNoReducers$() 4th: test allowNoReducers$ = reducerFn ... when our features HAVE NO reducers ... expecting: forced log', () => {
      removeAllReducers();
      reducerAspect.config.allowNoReducers$ = (s) => 'MY REDUCER';
    });
    // expecting Forced Log:
    //   ***feature-u*** - ***feature-redux*** reducerAspect: 
    //                     WARNING: NO reducers were found in your features (i.e. Feature.reducer),
    //                              but client override (reducerAspect.config.allowNoReducers$=reducerFn;)
    //                              directed a continuation WITH the specified reducer.

  } // end of ... test_allowNoReducers$


  // ***
  // *** test_allowNoLogic$() -------------------------------------------------
  // ***

  function test_allowNoLogic$() {

    diag$('test_allowNoLogic$() test PUBLIC allowNoLogic$ ... disable feature-u logging, so as to see forced logs', () => {
      launchApp.diag.logf.disable();
    });

    function removeAllLogic() {
      features.forEach( (feature) => {
        if (feature.logic)
          delete feature.logic;
      });
    };

    // NOTE: run following sub-tests mutually exclusive

    diag$.skip('test_allowNoLogic$() 1st: insure allowNoLogic$ is NOT referenced when our features HAVE logic ... should run normally', () => {
      logicAspect.config.allowNoLogic$ = ['simulatedLogicNotSoWell'];
    });
    // expecting app to run normally!


    diag$.skip('test_allowNoLogic$() 2nd: test DEFAULT EXCEPTION ... when our features HAVE NO logic ... expecting: thrown exception', () => {
      removeAllLogic();
    });
    // expecting Exception:
    //   ***ERROR*** feature-redux-logic found NO logic modules within your features
    //               ... did you forget to register Feature.logic aspects in your features?
    //               (please refer to the feature-redux-logic docs to see how to override this behavior).

    diag$.skip('test_allowNoLogic$() 3rd: test allowNoLogic$ = true ... when our features HAVE NO logic ... expecting: forced log', () => {
      removeAllLogic();
      logicAspect.config.allowNoLogic$ = true;
    });
    // expecting Forced Log:
    //   ***feature-u*** - ***feature-redux-logic*** logicAspect: 
    //                     WARNING: NO logic modules were found in your Features (i.e. Feature.logic),
    //                              but client override (logicAspect.config.allowNoLogic$=truthy;)
    //                              directed a continuation WITHOUT redux-logic.

    diag$.skip('test_allowNoLogic$() 4th: test allowNoLogic$ = [myLogic] ... when our features HAVE NO logic ... expecting: forced log', () => {
      removeAllLogic();
      logicAspect.config.allowNoLogic$ = ['simulatedLogicNotSoWell'];
    });
    // expecting Forced Log:
    //   ***feature-u*** - ***feature-redux-logic*** logicAspect:
    //                     WARNING: NO logic modules were found in your Features (i.e. Feature.logic),
    //                              but client override (logicAspect.config.allowNoLogic$=[{logicModules}];)
    //                              directed a continuation WITH specified logic modules.

  } // end of ... test_allowNoLogic$


  // ***
  // *** test_allowNoRoutes$() -------------------------------------------------
  // ***

  function test_allowNoRoutes$() {

    diag$('test_allowNoRoutes$() test PUBLIC allowNoRoutes$ ... disable feature-u logging, so as to see forced logs', () => {
      launchApp.diag.logf.disable();
    });

    function removeAllRoutes() {
      features.forEach( (feature) => {
        if (feature.route)
          delete feature.route;
      });
    };

    const fallbackRoute = featureRoute({
      priority: PRIORITY.HIGH,
      content({app, appState}) {
        return <SplashScreen msg="KOOL: This is a route supplied by routeAspect.config.allowNoRoutes$ !!!"/>;
      },
    });


    // NOTE: run following sub-tests mutually exclusive

    diag$.skip('test_allowNoRoutes$() 1st: insure allowNoRoutes$ is NOT referenced when our features HAVE routes ... should run normally', () => {
      routeAspect.config.allowNoRoutes$ = [fallbackRoute];
    });
    // expecting app to run normally!

    diag$.skip('test_allowNoRoutes$() 2nd: test DEFAULT EXCEPTION ... when our features HAVE NO routes ... expecting: thrown exception', () => {
      removeAllRoutes();
    });
    // expecting Exception:
    //   ***ERROR*** feature-router found NO routes within your features
    //               ... did you forget to register Feature.route aspects in your features?
    //               (please refer to the feature-router docs to see how to override this behavior).

    diag$.skip('test_allowNoRoutes$() 3rd: test allowNoRoutes$ = true ... when our features HAVE NO routes ... expecting: forced log', () => {
      removeAllRoutes();
      routeAspect.config.allowNoRoutes$ = true;
    });
    // expecting Forced Log:
    //   ***feature-u*** - ***feature-router*** routeAspect: 
    //                     WARNING: NO routes were found in your Features (i.e. Feature.route),
    //                              but client override (routeAspect.config.allowNoRoutes$=truthy;)
    //                              directed a continuation WITHOUT feature-router.

    diag$.skip('test_allowNoRoutes$() 4th: test allowNoRoutes$ = [routes] ... when our features HAVE NO routes ... expecting: forced log', () => {
      removeAllRoutes();
      routeAspect.config.allowNoRoutes$ = [fallbackRoute];
    });
    // expecting Forced Log:
    //   ***feature-u*** - ***feature-router*** routeAspect: 
    //                     WARNING: NO routes were found in your Features (i.e. Feature.route),
    //                              but client override (routeAspect.config.allowNoRoutes$=[{routes}];)
    //                              directed a continuation WITH specified routes.

  } // end of ... test_allowNoRoutes$


  // ***
  // *** test_renameAspectName() -------------------------------------------------
  // ***

  function test_renameAspectName() {

    diag$('test_renameAspectName() TEST ability to rename Aspect.name ... enable feature-u logging, so as to see the fun', () => {
      launchApp.diag.logf.enable();
    });

    // NOTE: you may run following sub-tests together if you like

    diag$('test_renameAspectName() RENAME Aspect.name:reducer TO: Aspect.name:reducerX', () => {

      // rename Aspect.name:reducer
      reducerAspect.name = 'reducerX';         

      // rename all feature usage of Feature.reducer TO Feature.reducerX
      features.forEach( (feature) => {
        if (feature.reducer) {
          feature.reducerX = feature.reducer;
          delete feature.reducer;
        }
      });
      // WORKED!!!
      // ... analyzing logs occurances (old name NEVER appears):
      // >>> .reducer   ... 11
      //     .reducerX  ... 11
      // >>> :reducer   ... 22
      //     :reducerX  ... 22
    });

    diag$('test_renameAspectName() RENAME Aspect.name:logic TO: Aspect.name:logicX', () => {

      // rename Aspect.name:logic
      logicAspect.name = 'logicX';         

      // rename all feature usage of Feature.logic TO Feature.logicX
      features.forEach( (feature) => {
        if (feature.logic) {
          feature.logicX = feature.logic;
          delete feature.logic;
        }
      });
      // WORKED!!!
      // ... analyzing logs occurances (old name NEVER appears):
      // >>> .logic   ...  8
      //     .logicX  ...  8
      // >>> :logic   ... 15
      //     :logicX  ... 15
    });

    diag$('test_renameAspectName() RENAME Aspect.name:route TO: Aspect.name:routeX', () => {

      // rename Aspect.name:route
      routeAspect.name = 'routeX';         

      // rename all feature usage of Feature.route TO Feature.routeX
      features.forEach( (feature) => {
        if (feature.route) {
          feature.routeX = feature.route;
          delete feature.route;
        }
      });
      // WORKED!!!
      // ... analyzing logs occurances (old name NEVER appears):
      // >>> .route   ...  4
      //     .routeX  ...  4
      // >>> :route   ... 17
      //     :routeX  ... 17
    });

  } // end of ... test_renameAspectName

} // end of ... configureFeatureUIntegrationTests


