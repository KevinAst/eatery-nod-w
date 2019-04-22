import React         from 'react';
import _eateries     from '../featureName';
import _eateriesAct  from '../actions';

import withStyles    from '@material-ui/core/styles/withStyles';
import {withFassets} from 'feature-u';
import withState     from 'util/withState';

import Divider                  from '@material-ui/core/Divider';
import ListItem                 from '@material-ui/core/ListItem';
import ListItemIcon             from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import ListItemText             from '@material-ui/core/ListItemText';
import PoolIcon                 from '@material-ui/icons/RestaurantMenu'; // possibilities: Restaurant RestaurantMenu Star StarRate Stars BlurOn AllOut DragIndicator GroupWork Reorder Apps Whatshot
import SettingsIcon             from '@material-ui/icons/Tune';           // possibilities: Tune PermDataSetting Settings PhonelinkSetup FilterList Filter
import IconButton               from '@material-ui/core/IconButton';

/**
 * EateryLeftNavItem: our Eatery entry into the LeftNav.
 */
function EateryLeftNavItem({classes, changeView, handleFilter}) {

  // render our menu item
  return (
    <>
      <ListItem button
                onClick={changeView}>
        <ListItemIcon className={classes.major}><PoolIcon/></ListItemIcon>
        <ListItemText primaryTypographyProps={{className:classes.major}} primary="Pool"/>
        <ListItemSecondaryAction onClick={handleFilter}>
          <ListItemIcon><IconButton className={classes.minor}><SettingsIcon/></IconButton></ListItemIcon>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider/>
    </>
  );
}

const EateryLeftNavItemWithState = withState({
  component: EateryLeftNavItem,
  mapDispatchToProps(dispatch, {fassets}) {// ... fassets available in ownProps (via withFassets() below)
    return {
      changeView() {
        dispatch( fassets.actions.changeView(_eateries) );
      },
      handleFilter() {
        dispatch( _eateriesAct.filterForm.open() );
      },
    };
  },
});

const EateryLeftNavItemWithFassets = withFassets({
  component: EateryLeftNavItemWithState,
  mapFassetsToProps: {
    fassets: '.', // ... introduce fassets into props via the '.' keyword
  }
});

const styles = (theme) => ({
  major: {
    color: theme.palette.grey.A200, // light grey (or redish: theme.palette.secondary.main
  },
  minor:{
    color: theme.palette.primary.dark,   // bluish
  },
});

export default /* EateryLeftNavItemWithStyle = */  withStyles(styles)(EateryLeftNavItemWithFassets);
