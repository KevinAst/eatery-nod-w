import {generateActions}    from 'action-u';
import _auth                from './featureName';
import signInFormMeta       from './signInFormMeta';

export default generateActions.root({
  [_auth]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    autoSignIn: {  // actions.autoSignIn(): Action
                   // > autoSignIn our authorization process
                   actionMeta: {},

      haveDeviceCredentials: {  // actions.autoSignIn.haveDeviceCredentials(credentials): Action
                                // > credentials were stored on our device
                                actionMeta: {
                                  traits: ['credentials'],
                                },
      },

      noDeviceCredentials: {  // actions.autoSignIn.noDeviceCredentials(): Action
                              // > NO credentials were stored on our device
                              actionMeta: {},
      },
    },

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    signIn: signInFormMeta.registrar.formActionGenesis({
    
      // along with additional app-specific actions:
    
                  // actions.signIn(email, pass): Action
                  // > SignIn with supplied email/pass
                  actionMeta: {
                    traits: ['email', 'pass'],
                  },
    
      complete: { // actions.signIn.complete(user): Action
                  // > signIn completed successfully
                  actionMeta: {
                    traits: ['user'],
                  },
      },
    
      checkEmailVerified: { // actions.signIn.checkEmailVerified(): Action
                            // > check to see if account email has been verified
                            actionMeta: {}, // NOTE: logic supplements the action with the current user
      },
    
      resendEmailVerification: { // actions.signIn.resendEmailVerification(): Action
                                 // > resend email verification
                                 //   NOTE: logic supplements action with most up-to-date user
                                 actionMeta: {},
      },
    
    }),

    signOut: { // actions.signOut(): Action <<< NOTE: logic supplements action.user (with current user that is signing out)
               // > sign out active user
               actionMeta: {},
    },

    userProfileChanged: { // actions.userProfileChanged(user): Action
                          // > user profile changed
                          actionMeta: {
                            traits: ['user'],
                          },
    },

  },

});
