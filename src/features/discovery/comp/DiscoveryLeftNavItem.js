import React,
       {useCallback}   from 'react';

import _discovery      from '../featureName';
import _discoveryAct   from '../actions';

import {useFassets}    from 'util/useFassets'; // ?? really 'feature-u'
import {useDispatch}   from 'react-redux'

import withStyles      from '@material-ui/core/styles/withStyles';

import DiscoveryIcon            from '@material-ui/icons/CloudDone';
import Divider                  from '@material-ui/core/Divider';
import IconButton               from '@material-ui/core/IconButton';
import ListItem                 from '@material-ui/core/ListItem';
import ListItemIcon             from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import ListItemText             from '@material-ui/core/ListItemText';
import SettingsIcon             from '@material-ui/icons/Tune';           // possibilities: Tune PermDataSetting Settings PhonelinkSetup FilterList Filter

/**
 * DiscoveryLeftNavItem: our Discovery entry into the LeftNav.
 */
function DiscoveryLeftNavItem({classes}) {

  const fassets      = useFassets();
  const dispatch     = useDispatch();
  const changeView   = useCallback(() => dispatch( fassets.actions.changeView(_discovery) ), [fassets]);
  const handleFilter = useCallback(() => dispatch( _discoveryAct.filterForm.open() ),        []);

  // render our menu item
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

const styles = (theme) => ({
  major: {
    color: theme.palette.secondary.main, // redish
  },
  minor:{
    color: theme.palette.primary.dark,   // bluish
  },
});

export default /* DiscoveryLeftNavItemWithStyle = */  withStyles(styles)(DiscoveryLeftNavItem);
