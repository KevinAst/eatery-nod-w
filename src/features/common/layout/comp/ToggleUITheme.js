import React         from 'react';

import withState     from 'util/withState';

import _layoutAct    from '../actions';
import {getUITheme}  from '../state';

import Chip          from '@material-ui/core/Chip';
import MoonIcon      from '@material-ui/icons/Brightness3';
import SunIcon       from '@material-ui/icons/WbSunny';
import UserMenuItem  from 'features/common/layout/comp/UserMenuItem';


/**
 * ToggleUITheme: our user-profile menu items (in the App Header)
 */
function ToggleUITheme({uiTheme, toggleUITheme}) {
  const ChipIcon = uiTheme==='light' ? MoonIcon  : SunIcon;
  const label    = uiTheme==='light' ? 'to dark' : 'to light';
  return (
    <UserMenuItem onClick={toggleUITheme}>
      <Chip label={label}
            icon={<ChipIcon/>}/>
    </UserMenuItem>
  );
}

export default /* ToggleUIThemeWithState = */ withState({
  component: ToggleUITheme,
  mapStateToProps(appState) {
    return {
      uiTheme: getUITheme(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      toggleUITheme() {
        dispatch( _layoutAct.toggleUITheme() );
      },
    };
  },
});
