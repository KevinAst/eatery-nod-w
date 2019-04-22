import React               from 'react';
import * as _authSel       from './state';
import {featureRoute, 
        PRIORITY}          from 'feature-router';

import SignInVerifyScreen  from './comp/SignInVerifyScreen';
import SignInScreen        from './comp/SignInScreen';
import SplashScreen        from 'util/SplashScreen';

// ***
// *** The routes for this feature.
// ***

export default featureRoute({

  priority: PRIORITY.HIGH,

  content({fassets, appState}) {

    const user = _authSel.curUser(appState);

    // when user is FULLY signedIn/verified
    // ... allow down-stream features to route further (i.e. app-specific screens)
    if (user.isUserSignedIn()) {
      return null;
    }

    // when user is signed in BUT unverified
    // ... display email verification screen
    if (user.isUserSignedInUnverified()) {
      return <SignInVerifyScreen/>;
    }


    // ***
    // *** at this point we know user is unauthorized (either signed out, or in-transition)
    // ***

    // display interactive SignIn, when form is active (accomplished by our logic)
    if (_authSel.isSignInFormActive(appState)) {
      return <SignInScreen/>;
    }

    // display interactive SignUp, when form is active (accomplished by our logic)
    // TODO: check for signUpForm (WHEN SUPPORTED)
    
    // fallback: communicate route transition condition
    // NOTES:
    //  1) we MUST issue a route to prevent downstream feature visualization too early
    //  2) it can occur under the following conditions:
    //     a) a slow server-side sign-in process
    //        ... and so the message wording should NOT convey an error
    //     b) during transition between startup/auth features
    //        ... where logic is in the process of activating one of the auth form screens
    //        ... and so the message wording should NOT convey an error
    //     c) an error condition (say some change that impacts our route logic)
    //        ... this is an unexpected condition
    //        ... SO, we expose the user-status context in the message (for diagnostics)
    const msg = `authorization in progress (${user.getAuthStatus()})`;
    return <SplashScreen msg={msg}/>;
  },

});
