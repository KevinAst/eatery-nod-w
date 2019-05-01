import React               from 'react';
import * as _eateriesSel   from './state';
import {featureRoute, 
        PRIORITY}          from 'feature-router';
import featureName         from './featureName';
import EateriesListScreen  from './comp/EateriesListScreen';
import EateryFilterScreen  from './comp/EateryFilterScreen';

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
      if (fassets.sel.curView(appState) !== featureName) {
        return null;
      }
      
      // ***
      // *** at this point we know the active view is ours
      // ***
      
      // display our EateriesListScreen
      return <EateriesListScreen/>;
    }
  }),

];
