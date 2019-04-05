import React          from 'react';
import {withFassets}  from 'feature-u';

import IconButton     from '@material-ui/core/IconButton';
import Menu           from '@material-ui/core/Menu';
import UserIcon       from '@material-ui/icons/AccountCircle';


/**
 * UserMenu: our UserMenu component that accumulates menu items via use contract.
 */
function UserMenu({userMenuItems}) {

  const [anchorUserMenu, setAnchorUserMenu] = React.useState(null);
  const userMenuOpen = Boolean(anchorUserMenu);

  const openUserMenu = (event) => setAnchorUserMenu(event.currentTarget);
  _closeUserMenu     = ()      => setAnchorUserMenu(null);

  return (
    <div>
      <IconButton color="inherit"
                  onClick={openUserMenu}>
        <UserIcon/>
      </IconButton>
      <Menu anchorEl={anchorUserMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={userMenuOpen}
            onClose={closeUserMenu}>
        {userMenuItems.map( ([fassetsKey, UserMenuItem]) => <UserMenuItem key={fassetsKey}/> )}
      </Menu>
    </div>
  );
}

export default /* UserMenuWithFassets = */ withFassets({
  component: UserMenu,
  mapFassetsToProps: {
    userMenuItems: 'AppLayout.UserMenuItem.*@withKeys',
  }
});

let _closeUserMenu = null;
export function closeUserMenu() {
  if (_closeUserMenu) {
    _closeUserMenu();
  }
}
