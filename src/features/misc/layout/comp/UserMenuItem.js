import React           from 'react';
import PropTypes       from 'prop-types';
import MenuItem        from '@material-ui/core/MenuItem';
import {closeUserMenu} from './UserMenu';

/**
 * UserMenuItem: our UserMenuItem - a MenuItem wrapper that auto-closes the UserMenu.
 */
export default function UserMenuItem(props) {

  // value-added onClick that auto-closes the UserMenu
  const myOnClick = (...args) => {
    // auto-close the UserMenu
    closeUserMenu()

    // pass-through to client onClick()
    if (props.onClick) {
      props.onClick(...args);
    }
  };

  // wrap <MenuItem>
  return (
    <MenuItem {...props} onClick={myOnClick}>{props.children}</MenuItem>
  );
}

UserMenuItem.propTypes = {
  children: PropTypes.node.isRequired, // UserMenuItem content is required (i.e. the label)
};
