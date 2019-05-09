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
 */
export default function ToggleUITheme() {
  
  const uiTheme = useSelector((appState) => getUITheme(appState), []);

  const ChipIcon = useMemo(() => uiTheme==='light' ? MoonIcon  : SunIcon,    [uiTheme]);
  const label    = useMemo(() => uiTheme==='light' ? 'to dark' : 'to light', [uiTheme]);

  const dispatch      = useDispatch();
  const toggleUITheme = useCallback(() => dispatch( _baseUIAct.toggleUITheme() ), []);

  return (
    <>
      <UserMenuItem onClick={toggleUITheme}>
        <Chip label={label}
              icon={<ChipIcon/>}/>
      </UserMenuItem>
      <Divider/>
    </>
  );
}
