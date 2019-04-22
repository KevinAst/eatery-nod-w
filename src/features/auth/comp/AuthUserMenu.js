import React        from 'react';
import withState    from '../../../util/withState';
import UserMenuItem from '../../misc/layout/comp/UserMenuItem';
import _authAct     from '../actions';
import {toast,
        confirm}    from '../../../util/notify';

/**
 * AuthUserMenu: our user-profile menu items (in the App Header)
 */
function AuthUserMenu({signOut}) {
  return (
    <>
      <UserMenuItem onClick={doL8tr}>User Profile</UserMenuItem>
      <UserMenuItem onClick={doL8tr}>My Account</UserMenuItem>
      <UserMenuItem onClick={signOut}>Sign Out</UserMenuItem>
    </>
  );
}

export default /* AuthUserMenuWithState = */ withState({
  component: AuthUserMenu,
  mapDispatchToProps(dispatch) {
    return {
      signOut() {
        confirm.warn({ 
          msg: 'Are you sure you wish to sign out?', 
          actions: [
            { txt: 'Sign Out', action: () => dispatch( _authAct.signOut() ) },
            { txt: 'Go Back' }
          ]
        });
      },
    };
  },
});

function doL8tr() {
  toast.warn({msg: 'NOT implemented yet (coming soon)!'})
}
