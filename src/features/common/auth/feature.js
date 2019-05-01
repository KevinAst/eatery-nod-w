import {createFeature}  from 'feature-u';
import _auth            from './featureName';
import _authAct         from './actions'; // TODO: QUIRKINESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (signInFormMeta)
import reducer,
       {curUser}        from './state';
import logic            from './logic';
import route            from './route';
import AuthUserMenu     from './comp/AuthUserMenu';

// feature: auth
//          promote complete user authentication service (full details in README)
export default createFeature({
  name: _auth,

  // our public face ...
  fassets: {
    define: {
      // actions:
      'actions.userProfileChanged': _authAct.userProfileChanged, // userProfileChanged(user) NOTE: PUBLIC for eateries to monitor, and for future use (when user can change their pool)
      'actions.signOut':            _authAct.signOut,            // signOut()

      // selectors:
      'sel.curUser': curUser, // full blown User object
    },

    defineUse: {
      // inject our user-profile menu items (in the App Header)
      'AppMotif.UserMenuItem.AuthUserMenu': AuthUserMenu,
    },
  },

  reducer,
  logic,
  route,
});
