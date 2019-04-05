import React        from 'react';
import UserMenuItem from '../../util/layout/comp/UserMenuItem';
import {toast,
        confirm}    from '../../../util/notify'; // ?? temporary

// ?? temporary ... test onClick argument passthrough
function testArgPassthrough(myArg) {
  console.log('?? testing onClick argument passthrough (expecting event): ', myArg );
}

// ?? temporary
function handleSignOut() {
  confirm.warn({ 
    msg: 'Are you sure you wish to sign out?', 
    actions: [
      { txt: 'Sign Out', action: () => toast.success({msg: 'Now pretending you are signed out!'}) },
      { txt: 'Go Back' }
    ]
  });
}

/**
 * AuthUserMenu: gather user sign-in credentials.
 */
export default function AuthUserMenu() {
  return (
    <>
      <UserMenuItem onClick={testArgPassthrough}>Test Arg Passthrough</UserMenuItem>
      <UserMenuItem disableGutters>My account</UserMenuItem> {/* GREAT: test props pass-through with disableGutters */}
      <UserMenuItem onClick={handleSignOut}>Sign Out</UserMenuItem>
    </>
  );
}
