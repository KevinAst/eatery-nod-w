import React,
       {useCallback}   from 'react';

import _discovery      from '../featureName';
import _discoveryAct   from '../actions';

import {useFassets}    from 'feature-u';
import {useDispatch}   from 'react-redux'

import {makeStyles}    from '@material-ui/core/styles';

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
export default function DiscoveryLeftNavItem() {

  const fassets      = useFassets();
  const dispatch     = useDispatch();
  const changeView   = useCallback(() => dispatch( fassets.actions.changeView(_discovery) ), [fassets]);
  const handleFilter = useCallback(() => dispatch( _discoveryAct.filterForm.open() ),        []);
  const classes      = useStyles();

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


const useStyles = makeStyles( theme => ({
  major: {
    color: theme.palette.secondary.main, // redish
  },
  minor:{
    color: theme.palette.primary.dark,   // bluish
  },
}) );
