import React,
       {useCallback} from 'react';
import {useDispatch} from 'react-redux'
import UserMenuItem  from 'features/common/baseUI/comp/UserMenuItem';
import _authAct      from '../actions';
import {toast,
        confirm}     from 'util/notify';

/**
 * AuthUserMenu: our user-profile menu items (in the App Header)
 */
export default function AuthUserMenu() {

  const dispatch = useDispatch();
  const signOut  = useCallback(() => {
    confirm.warn({ 
      msg: 'Are you sure you wish to sign out?', 
      actions: [
        { txt: 'Sign Out', action: () => dispatch( _authAct.signOut() ) },
        { txt: 'Go Back' }
      ]
    });
  }, []);

  return (
    <>
      <UserMenuItem onClick={doL8tr}>User Profile</UserMenuItem>
      <UserMenuItem onClick={signOut}>Sign Out</UserMenuItem>
    </>
  );
}

function doL8tr() {
  toast.warn({msg: 'NOT implemented yet (coming soon)!'})
}
