import React         from 'react';

import withState     from 'util/withState';
import {withFassets} from 'feature-u';

import _layoutAct    from '../actions';

import Chip          from '@material-ui/core/Chip';
import MoonIcon      from '@material-ui/icons/Brightness3';
import SunIcon       from '@material-ui/icons/WbSunny';
import UserMenuItem  from 'features/layout/comp/UserMenuItem';


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

const ToggleUIThemeWithState = withState({
  component: ToggleUITheme,
  mapStateToProps(appState, {fassets}) { // ... 2nd param (ownProps) seeded from withFassets() below
    return {
      uiTheme: fassets.sel.getUITheme(appState),
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

export default /* ToggleUIThemeWithFassets = */ withFassets({
  component: ToggleUIThemeWithState,
  mapFassetsToProps: {
    fassets: '.', // introduce fassets into props via the '.' keyword
  }
});
