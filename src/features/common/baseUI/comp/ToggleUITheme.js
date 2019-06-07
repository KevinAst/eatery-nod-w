import React,
       {useMemo,
        useCallback} from 'react';

import {useSelector,
        useDispatch} from 'react-redux'

import _baseUIAct    from '../actions';
import {getUITheme}  from '../state';

import Chip          from '@material-ui/core/Chip';
import Divider       from '@material-ui/core/Divider';
import MoonIcon      from '@material-ui/icons/Brightness3';
import SunIcon       from '@material-ui/icons/WbSunny';
import UserMenuItem  from 'features/common/baseUI/comp/UserMenuItem';


/**
 * ToggleUITheme: our user-profile menu items (in the App Header)
 * 
 * NOTE: Because this is a "custom" component that is held in Menu
 *       (a ButtonBase MenuItem) it must be able to hold a ref ... hence
 *       the React.forwardRef()!
 *       see: https://material-ui.com/guides/migration-v3/#button
 *            https://material-ui.com/guides/composition/#caveat-with-refs
 *            AVOIDS following log:
 *            Warning: Function components cannot be given refs. Attempts to access
 *                     this ref will fail. Did you mean to use React.forwardRef()?
 * NOTE: Subsequent Discovery: I think this is really due to the fact that
 *       we were injecting <Divider/> too!
 *       This React.forwardRef() was NOT needed in src/features/common/auth/comp/AuthUserMenu.js,
 *       where it simply injected a series of <UserMenuItem>s in a React.Fragment ... hmmmm
 */
const ToggleUITheme = React.forwardRef( (props, ref) => {
  const uiTheme = useSelector((appState) => getUITheme(appState), []);

  const ChipIcon = useMemo(() => uiTheme==='light' ? MoonIcon  : SunIcon,    [uiTheme]);
  const label    = useMemo(() => uiTheme==='light' ? 'to dark' : 'to light', [uiTheme]);

  const dispatch      = useDispatch();
  const toggleUITheme = useCallback(() => dispatch( _baseUIAct.toggleUITheme() ), []);

  return (
    <span {...props} ref={ref}>
      <UserMenuItem onClick={toggleUITheme}>
        <Chip label={label}
              icon={<ChipIcon/>}/>
      </UserMenuItem>
      <Divider/>
    </span>
  );
});  
export default ToggleUITheme;
