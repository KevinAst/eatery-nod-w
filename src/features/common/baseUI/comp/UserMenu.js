import React          from 'react';
import PropTypes      from 'prop-types';

import {withFassets}  from 'feature-u';

import IconButton     from '@material-ui/core/IconButton';
import Menu           from '@material-ui/core/Menu';
import UserIcon       from '@material-ui/icons/AccountCircle';
import Typography     from '@material-ui/core/Typography';


/**
 * UserMenu: our UserMenu component that accumulates menu items via use contract.
 */
function UserMenu({curUser, userMenuItems}) {

  const [anchorUserMenu, setAnchorUserMenu] = React.useState(null);
  const userMenuOpen = Boolean(anchorUserMenu);

  const openUserMenu = (event) => setAnchorUserMenu(event.currentTarget);
  _closeUserMenu     = ()      => setAnchorUserMenu(null);

  return (
    <div>
      <IconButton color="inherit"
                  onClick={openUserMenu}>
        <UserIcon/>
        <Typography variant="subtitle2" color="inherit" noWrap>
          &nbsp;{curUser.name}
        </Typography>
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

UserMenu.propTypes = {
  curUser: PropTypes.object.isRequired,
};

export default /* UserMenuWithFassets = */ withFassets({
  component: UserMenu,
  mapFassetsToProps: {
    userMenuItems: 'AppMotif.UserMenuItem.*@withKeys',
  }
});

let _closeUserMenu = null;
export function closeUserMenu() {
  if (_closeUserMenu) {
    _closeUserMenu();
  }
}
