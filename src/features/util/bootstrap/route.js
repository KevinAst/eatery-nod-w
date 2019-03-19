import React                   from 'react';
import {isBootstrapComplete,
        getBootstrapStatusMsg} from './state';
import {featureRoute, 
        PRIORITY}              from 'feature-router';
import SplashScreen            from '../../../util/SplashScreen';


// ***
// *** The routes for this feature.
// ***

export default featureRoute({

  priority: PRIORITY.HIGH+10,

  content({fassets, appState}) {

    // promote a simple SplashScreen (with status) until the bootstrap process is complete
    // NOTE: Errors from bootstrap hooks are promoted through independent user notifications (toasts)
    if (!isBootstrapComplete(appState)) {
      // console.log(`xx bootstrap feature router ... NOT COMPLETE: route -> SplashScreen with msg: ${getBootstrapStatusMsg(appState)}`);
      return <SplashScreen msg={getBootstrapStatusMsg(appState)}/>;
    }

    return null;
  },

});
