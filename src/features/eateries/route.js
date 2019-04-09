import React               from 'react';
import * as _eateriesSel   from './state';
import {featureRoute, 
        PRIORITY}          from 'feature-router';
import featureName         from './featureName';
import EateriesListScreen  from './comp/EateriesListScreen';
//? import EateryDetailScreen  from './comp/EateryDetailScreen'; // ?? these components are NOT compilable yet
import EateryFilterScreen  from './comp/EateryFilterScreen'; // ?? these components are NOT compilable yet
import SplashScreen        from '../../util/SplashScreen';

// ***
// *** The routes for this feature.
// ***

export default [

  featureRoute({
    priority: PRIORITY.HIGH,
    content({fassets, appState}) {
      // display EateryFilterScreen, when form is active (accomplished by our logic)
      // ... this is done as a priority route, because this screen can be used to
      //     actually change the view - so we display it regarless of the state of the active view
      if (_eateriesSel.isFormFilterActive(appState)) {
        return <EateryFilterScreen/>;
      }
    }
  }),

  featureRoute({
    content({fassets, appState}) {

      // allow other down-stream features to route, when the active view is NOT ours
      if (fassets.sel.getView(appState) !== featureName) {
        return null;
      }
      
      // ***
      // *** at this point we know the active view is ours
      // ***
      
      //?????????????????? NOW DONE IN EateriesListScreen
      //? // display anotated SplashScreen, when the spin operation is active
      //? const spinMsg = _eateriesSel.getSpinMsg(appState);
      //? if (spinMsg) {
      //?   return <SplashScreen msg={spinMsg}/>;
      //? }
      
      //?????????????????? NOW DONE IN EateriesListScreen
      //? // display an eatery detail, when one is selected
      //? const selectedEatery = _eateriesSel.getSelectedEatery(appState);
      //? if (selectedEatery) {
      //?   return <EateryDetailScreen eatery={selectedEatery}/>;
      //? }
      
      // fallback: display our EateriesListScreen
      return <EateriesListScreen/>;
    }
  }),

];
