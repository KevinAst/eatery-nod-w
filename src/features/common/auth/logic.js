import {createLogic}        from 'redux-logic';
import {expandWithFassets}  from 'feature-u';
import _auth                from './featureName';
import _authAct             from './actions';
import {curUser}            from './state';
import signInFormMeta       from './signInFormMeta';
import discloseError        from 'util/discloseError';
import {toast}              from 'util/notify';
import {fetchCredentials,
        storeCredentials,
        removeCredentials}  from './credentialsStorage';

/**
 * Start our authorization process, once the bootstrap initialization process is complete.
 * 
 * NOTE: We could auto-start our auth process (via feature-u app life cycle handlers),
 *       except our downstream processes are dependent on device.loc, so we wait and
 *       trigger the process here.
 */
export const startAuthorization = expandWithFassets( (fassets) => createLogic({

  name: `${_auth}.startAuthorization`,
  type: String(fassets.actions.bootstrapComplete),
  
  process({getState, action}, dispatch, done) {
    dispatch( _authAct.autoSignIn() );
    done();
  },
}));


/**
 * Monitor authorization startup, fetching credentials stored on device (if any).
 */
export const checkDeviceCredentials = createLogic({

  name: `${_auth}.checkDeviceCredentials`,
  type: String(_authAct.autoSignIn),

  process({getState, action, fassets}, dispatch, done) {

    const credentials = fetchCredentials();
    if (credentials) {
      dispatch( _authAct.autoSignIn.haveDeviceCredentials(credentials) );
    }
    else {
      dispatch( _authAct.autoSignIn.noDeviceCredentials() );
    }

    done();
  },

});


/**
 * Auto SignIn, when device credentials exist.
 */
export const autoSignIn = createLogic({

  name: `${_auth}.autoSignIn`,
  type: String(_authAct.autoSignIn.haveDeviceCredentials),
  
  process({getState, action, fassets}, dispatch, done) {
    const {email, pass} = action.credentials;
    dispatch( _authAct.signIn(email, pass) );
    done();
  },

});


/**
 * Manual SignIn, when NO device credentials exist, or user signs out.
 */
export const manualSignIn = createLogic({

  name: `${_auth}.manualSignIn'`,
  type: [
    String(_authAct.autoSignIn.noDeviceCredentials),
    String(_authAct.signOut),
  ],

  process({getState, action}, dispatch, done) {
    dispatch( _authAct.signIn.open() );
    done();
  },

});


/**
 * Interactive SignIn form processor.
 */
export const processSignIn = createLogic({

  name: `${_auth}.processSignIn`,
  type: String(_authAct.signIn.process),
  
  process({getState, action}, dispatch, done) {
    dispatch( _authAct.signIn(action.values.email, action.values.pass) );
    done();
  },

});


/**
 * SignIn logic.
 */
export const signIn = createLogic({

  name: `${_auth}.signIn`,
  type: String(_authAct.signIn),
  warnTimeout: 0, // long-running logic ... UNFORTUNATELY signin using our firebase service is sometimes EXCRUCIATINGLY SLOW!

  process({getState, action, fassets}, dispatch, done) {
    
    fassets.authService.signIn(action.email, action.pass)

           .then( user => { // user has successfully signed in

             // retain these credentials on our device (to streamline subsequent app launch)
             storeCredentials(action.email, action.pass);

             // communicate a new user is in town
             dispatch( _authAct.signIn.complete(user) );

             done();
           })

           .catch( (err) => {
             discloseError({err,
                            showUser: err.isUnexpected()}); // expected errors are shown to the user via the re-direction to the signIn screen (see next step)

             // re-direct to SignIn form, prepopulated with appropriate msg
             dispatch( _authAct.signIn.open(action, err.formatUserMsg()) ); // NOTE: action is a cheap shortcut to domain (contains email/pass) ... pre-populating sign-in form with last user input

             done();
           });
  },

});


/**
 * Supplement signed-in user's originalLoc (in support of re-setting
 * "guest" users on sign-out.
 */
export const supplementSignedInUserLoc = createLogic({

  name: `${_auth}.supplementSignedInUserLoc`,
  type: String(_authAct.signIn.complete),

  transform({getState, action, fassets}, next, reject) {
    action.user.originalLoc = fassets.sel.getLocation(getState());
    next(action);
  },

});


/**
 * Supplement signIn complete action by triggering profile.changed action,
 * causing eateries view to populate.
 */
export const supplementSignInComplete = createLogic({

  name: `${_auth}.supplementSignInComplete`,
  type: String(_authAct.signIn.complete),

  process({getState, action}, dispatch, done) {
    // NOTE: Currently, this is the only place where userProfileChanged is dispatched.
    //       It stimulates the eateries view to get the ball rolling (displaying the correct pool)
    //       In the future, userProfileChanged is dispatched dynamically, when the user has the ability to change their pool.
    dispatch( _authAct.userProfileChanged(action.user) ); // use the same user from our our monitored action!!
    done();
  },

});


/**
 * SignIn cleanup.
 */
export const signInCleanup = createLogic({

  name: `${_auth}.signInCleanup`,
  type: String(_authAct.signIn.complete),

  process({getState, action}, dispatch, done) {
    // console.log(`xx logic ${featureName}.signInCleanup: user.status: '${curUser(getState()).getAuthStatus()}'`);
    dispatch( _authAct.signIn.close() ); // we are done with our signIn form
    done();
  },

});


/**
 * Check to see if account email has been verified.
 */
export const checkEmailVerified = createLogic({

  name: `${_auth}.checkEmailVerified`,
  type: String(_authAct.signIn.checkEmailVerified),

  transform({getState, action, fassets}, next, reject) {

    toast({ msg:`verifying your email: ${curUser(getState()).email}` });
    // fetch the most up-to-date user
    fassets.authService.refreshUser()
           .then( user => {
             // supplement action with the most up-to-date user
             action.user = user;
             next(action);
           })
           .catch( err => {
             // report unexpected error to user
             discloseError({err});

             // nix the entire action
             reject();
           });
  },

});


/**
 * Resend Email Verification.
 */
export const resendEmailVerification = createLogic({

  name: `${_auth}.resendEmailVerification`,
  type: String(_authAct.signIn.resendEmailVerification),

  transform({getState, action, fassets}, next) {
    toast({ msg:`resending email to: ${curUser(getState()).email}` });
    fassets.authService.resendEmailVerification()
    next(action);
  },

});


/**
 * Supplement signOut action with active user (in support of re-setting
 * "guest" users on sign-out.
 */
export const supplementSignOutUser = createLogic({

  name: `${_auth}.supplementSignOutUser`,
  type: String(_authAct.signOut),

  transform({getState, action, fassets}, next, reject) {
    action.user = curUser(getState());
    next(action);
  },

});


/**
 * SignOut logic.
 */
export const signOut = createLogic({

  name: `${_auth}.signOut`,
  type: String(_authAct.signOut),

  process({getState, action, fassets}, dispatch, done) {
    fassets.authService.signOut()
           .catch( (err) => {
             // report unexpected error to user
             discloseError({err});
           });

    removeCredentials();

    done();
  },

});



// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default expandWithFassets( (fassets) => [

  startAuthorization(fassets),

  checkDeviceCredentials,
  autoSignIn,
  manualSignIn,

  // signIn logic (NOTE: form logic just be registered BEFORE app-specific logic)
  ...signInFormMeta.registrar.formLogic(), // inject the standard SignIn form-based logic modules
  processSignIn,

  supplementSignedInUserLoc,
  signIn,
  supplementSignInComplete,
  signInCleanup,

  checkEmailVerified,
  resendEmailVerification,

  supplementSignOutUser,
  signOut,
]);
