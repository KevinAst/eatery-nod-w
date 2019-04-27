import React                  from 'react';
import * as _discoverySel     from './state';
import {featureRoute, 
        PRIORITY}             from 'feature-router';
import featureName            from './featureName';
import DiscoveryFilterScreen  from './comp/DiscoveryFilterScreen';
import DiscoveryListScreen    from './comp/DiscoveryListScreen';


// ***
// *** The routes for this feature.
// ***

export default [

  featureRoute({
    priority: PRIORITY.HIGH,
    content({fassets, appState}) {
      // display DiscoveryFilterScreen, when form is active (accomplished by our logic)
      // ... this is done as a priority route, because this screen can be used to
      //     actually change the view - so we display it regardless of the state of the active view
      if (_discoverySel.isFormFilterActive(appState)) {
        return <DiscoveryFilterScreen/>;
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

      // display our DiscoveryListScreen
      return <DiscoveryListScreen/>;
    }
  }),

];
