import React,
       {useCallback} from 'react';

import {useFassets}  from 'util/useFassets'; // ?? really 'feature-u'
import {useSelector,
        useDispatch} from 'react-redux'

import withStyles    from '@material-ui/core/styles/withStyles';

import _discoveryAct      from '../actions';
import * as _discoverySel from '../state';

import Button         from '@material-ui/core/Button';
import CheckedIcon    from '@material-ui/icons/CheckCircle';
import IconButton     from '@material-ui/core/IconButton';
import List           from '@material-ui/core/List';
import ListItem       from '@material-ui/core/ListItem';
import ListItemIcon   from '@material-ui/core/ListItemIcon';
import ListItemText   from '@material-ui/core/ListItemText';
import NextPageIcon   from '@material-ui/icons/FastForward';   // -or- PlaylistPlay FastForward NavigateNext ArrowForward ArrowForwardIos MoreHorizontal TrendingFlat SkipNext Redo
import Progress       from '@material-ui/core/LinearProgress'; // -or- CircularProgress
import SettingsIcon   from '@material-ui/icons/Tune';          // -or- Tune PermDataSetting Settings PhonelinkSetup FilterList Filter
import Typography     from '@material-ui/core/Typography';
import UnCheckedIcon  from '@material-ui/icons/Check';

const listStyles = (theme) => ({
  list: {
  },
  progress: {
    margin: theme.spacing.unit * 4,
  },
  nextPage: {
    fontStyle: 'italic',
  },
});

/**
 * DiscoveryListScreen displaying our discoveries.
 */
function DiscoveryListScreen({classes}) {

  // ***
  // *** setup
  // ***

  const fassets    = useFassets();

  const inProgress    = useSelector( (appState) => _discoverySel.getInProgress(appState),    [] );
  const discoveries   = useSelector( (appState) => _discoverySel.getDiscoveries(appState),   [] );
  const nextPageToken = useSelector( (appState) => _discoverySel.getNextPageToken(appState), [] );
  const eateryPool    = useSelector( (appState) => fassets.sel.getEateryDbPool(appState),    [fassets] );

  const dispatch = useDispatch();

  const handleNextPage        = useCallback((nextPageToken) => dispatch( _discoveryAct.nextPage(nextPageToken) ), []);
  const handleFilterDiscovery = useCallback(() => dispatch( _discoveryAct.filterForm.open() ),                    []);
  const toggleEateryPool      = useCallback((discovery, eateryPool) => {
    if (eateryPool[discovery.id]) { // in pool
      // console.log(`xx delete ${discovery.name} from pool`);
      dispatch( fassets.actions.removeEatery(discovery.id) );
    }
    else { // NOT in pool
      // console.log(`xx add ${discovery.name} to pool`);
      dispatch( fassets.actions.addEatery(discovery.id) );
    }
  }, []);


  // ***
  // *** define page content
  // ***

  let content = null;

  // case for discoveries retrieval in-progress
  if (discoveries===null || inProgress==='retrieve') { // just to be safe ... discoveries===null
    content = [
      <ListItem key="inProgress">
        <ListItemText>
          <Typography variant="subtitle1" align="center" noWrap><br/><br/><br/><br/><br/>retrieval in progress</Typography>
        </ListItemText>
      </ListItem>,

      <ListItem key="inProgressSpin">
        <ListItemText>
          <Progress className={classes.progress} color="secondary"/>
        </ListItemText>
      </ListItem>
    ];
  }

  // case for NO discoveries found (in retrieval)
  else if (discoveries.length === 0) {
    content = [
      <ListItem key="noEntries">
        <ListItemText>
          <Typography variant="subtitle1" align="center" noWrap>
            No entries match your filter &nbsp;&nbsp;
            <Button variant="contained" color="primary" onClick={handleFilterDiscovery}>
              <SettingsIcon/>
              <Typography color="inherit" variant="body2">&nbsp;Adjust Filter</Typography>
            </Button>
          </Typography>
        </ListItemText>
      </ListItem>
    ];
  }

  // case for displaying retrieved discoveries
  else {
    function renderPoolButton(discovery) {
      if (eateryPool[discovery.id]) { // in pool
        return <CheckedIcon color="secondary"/>;
      }
      else { // NOT in pool
        return <UnCheckedIcon/>;
      }
    }
    
    // generate list content
    content =
      discoveries.map( discovery => (

        <ListItem key={discovery.id}
                  dense
                  divider>
          <ListItemIcon onClick={()=>toggleEateryPool(discovery, eateryPool)}>
            <IconButton>
              {renderPoolButton(discovery)}
            </IconButton>
          </ListItemIcon>

          <ListItemText 
              primary={
                <Typography variant="h6" noWrap>
                  {discovery.name}
                </Typography>
                      }
              secondary={
                <Typography variant="subtitle1" noWrap>
                  {discovery.addr}
                </Typography>
                        }/>

        </ListItem>
      ));
  
    // provide CRUDE next page mechanism
    if (nextPageToken) { // there is a next page
      if (inProgress==='next') { // the next page retrieval is "in progress"
        content.push(
          <ListItem key="nextPage">
            <ListItemText>
              <Progress className={classes.progress}  color="secondary"/>
            </ListItemText>
          </ListItem>
        );
      }
      else { // the next page retrieval is NOT "in progress" ... provide a control to retrieve it
        content.push(
          <ListItem key="nextPageCntl"
                    dense
                    button
                    onClick={()=>handleNextPage(nextPageToken)}>
            <ListItemIcon>
              <IconButton color="primary">
                <NextPageIcon/>
              </IconButton>
            </ListItemIcon>
            <ListItemText>
              <Typography color="primary" variant="h6" className={classes.nextPage}>next page ...</Typography>
            </ListItemText>
          </ListItem>
        );
      }
    }
    // notify user when 60 entry limitation has been met (a limitation of the "free" Google Places API)
    else if (content.length === 60) {
      content.push(

        <ListItem key="maxEntriesHit"
                  dense
                  button
                  onClick={handleFilterDiscovery}>
          <ListItemIcon>
            <IconButton color="primary">
              <SettingsIcon/>
            </IconButton>
          </ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle1">
              We are limited to 60 entries.
            </Typography>
            <Typography variant="subtitle2">
              ... adjust filter with city or restaurant
            </Typography>
            <Button variant="contained" color="primary">
              <SettingsIcon/>
              <Typography color="inherit" variant="body2">&nbsp;Adjust Filter</Typography>
            </Button>
          </ListItemText>
        </ListItem>
      );
    }
  }

  // ***
  // *** render page
  // ***

  return (
    <List className={classes.list}>
      { content }
    </List>
  );
}

export default /* DiscoveryListScreenWithStyles = */ withStyles(listStyles)(DiscoveryListScreen);
