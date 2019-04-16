import React           from 'react';
import _discovery      from '../featureName';
import _discoveryAct   from '../actions';

import {withFassets}   from 'feature-u';
import withState       from '../../../util/withState';
import withStyles      from '@material-ui/core/styles/withStyles';

//?? check imports
import Divider                  from '@material-ui/core/Divider';
import ListItem                 from '@material-ui/core/ListItem';
import ListItemIcon             from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import ListItemText             from '@material-ui/core/ListItemText';
import DiscoveryIcon            from '@material-ui/icons/CloudDone';
import SettingsIcon             from '@material-ui/icons/Tune';           // possibilities: Tune PermDataSetting Settings PhonelinkSetup FilterList Filter
import IconButton               from '@material-ui/core/IconButton';

// ?? TRASH
//? import {Body,
//?         Button,
//?         Icon,
//?         Left,
//?         ListItem,
//?         Right,
//?         Text}       from 'native-base';

/**
 * DiscoveryLeftNavItem: our Discovery entry into the LeftNav.
 */
function DiscoveryLeftNavItem({classes, changeView, handleFilter}) {

  // render our menu item
  // ?? L8TR: HOW to make color green (or something)
  return (
    <>
      <ListItem button
                onClick={changeView}>
        <ListItemIcon className={classes.major}><DiscoveryIcon/></ListItemIcon>
        <ListItemText primaryTypographyProps={{className:classes.major}} primary="Discovery"/>
        <ListItemSecondaryAction onClick={handleFilter}>
          <ListItemIcon><IconButton className={classes.minor}><SettingsIcon/></IconButton></ListItemIcon>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider/>
    </>
  );
}

const DiscoveryLeftNavItemWithState = withState({
  component: DiscoveryLeftNavItem,
  mapDispatchToProps(dispatch, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      changeView() {
        dispatch( fassets.actions.changeView(_discovery) );
      },
      handleFilter() {
        dispatch( _discoveryAct.filterForm.open() );
      },
    };
  },
});

const DiscoveryLeftNavItemWithFassets = withFassets({
  component: DiscoveryLeftNavItemWithState,
  mapFassetsToProps: {
    fassets: '.', // ... introduce fassets into props via the '.' keyword
  }
});

const styles = (theme) => ({
  major: {
    color: theme.palette.secondary.main, // redish
  },
  minor:{
    color: theme.palette.primary.dark,   // bluish
  },
});

export default /* DiscoveryLeftNavItemWithStyle = */  withStyles(styles)(DiscoveryLeftNavItemWithFassets);
