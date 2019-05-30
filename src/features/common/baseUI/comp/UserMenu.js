import React,
       {useState,
        useCallback,
        useMemo}      from 'react';
import PropTypes      from 'prop-types';

import {useFassets}   from 'feature-u';

import IconButton     from '@material-ui/core/IconButton';
import Menu           from '@material-ui/core/Menu';
import UserIcon       from '@material-ui/icons/AccountCircle';
import Typography     from '@material-ui/core/Typography';


/**
 * UserMenu: our UserMenu component that accumulates menu items via use contract.
 */
export default function UserMenu({curUser}) {

  const [anchorUserMenu, setAnchorUserMenu] = useState(null);
  const userMenuOpen = useMemo(() => Boolean(anchorUserMenu), [anchorUserMenu]);

  const openUserMenu = useCallback((event) => setAnchorUserMenu(event.currentTarget), []);
  _closeUserMenu     = useCallback(()      => setAnchorUserMenu(null),                []);

  const userMenuItems        = useFassets('AppMotif.UserMenuItem.*@withKeys');
  const orderedUserMenuItems = useMemo(() => (
    [...userMenuItems].sort(([item1Key], [item2Key]) => item1Key.localeCompare(item2Key))
  ), [userMenuItems]);

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
        {orderedUserMenuItems.map( ([fassetsKey, UserMenuItem]) => <UserMenuItem key={fassetsKey}/> )}
      </Menu>
    </div>
  );
}

UserMenu.propTypes = {
  curUser: PropTypes.object.isRequired,
};



/**
 * Utility function that closes our user menu.
 */
export function closeUserMenu() { // exported for use by our own: UserMenuItem
  if (_closeUserMenu) {
    _closeUserMenu();
  }
}
let _closeUserMenu = null;
