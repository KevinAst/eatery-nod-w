import React,
       {useCallback}       from 'react';

import {useSelector,
        useDispatch}       from 'react-redux'
import {makeStyles}        from '@material-ui/core/styles';
import {useForWiderDevice} from 'util/responsiveBreakpoints';

import _eateriesAct        from '../actions';
import * as _eateriesSel   from '../state';

import Link                from '@material-ui/core/Link';
import LinkIcon            from '@material-ui/icons/Link';
import List                from '@material-ui/core/List';
import ListItem            from '@material-ui/core/ListItem';
import ListItemIcon        from '@material-ui/core/ListItemIcon';
import ListItemText        from '@material-ui/core/ListItemText';
import NavigationIcon      from '@material-ui/icons/Navigation';
import RestaurantIcon      from '@material-ui/icons/Restaurant';
import Table               from '@material-ui/core/Table';
import TableBody           from '@material-ui/core/TableBody';
import TableCell           from '@material-ui/core/TableCell';
import TableHead           from '@material-ui/core/TableHead';
import TableRow            from '@material-ui/core/TableRow';
import Typography          from '@material-ui/core/Typography';

import EateryDetailScreen  from './EateryDetailScreen';
import SplashScreen        from 'util/SplashScreen';


/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
export default function EateriesListScreen() {

  const filteredEateries = useSelector((appState) => _eateriesSel.getFilteredEateries(appState), []);
  const filter           = useSelector((appState) => _eateriesSel.getListViewFilter(appState),   []);
  const selectedEatery   = useSelector((appState) => _eateriesSel.getSelectedEatery(appState),   []);
  const spinMsg          = useSelector((appState) => _eateriesSel.getSpinMsg(appState),          []);

  const dispatch    = useDispatch();
  const showDetail  = useCallback((eateryId) => {
    //console.log(`xx showDetail for ${eateryId}`);
    dispatch( _eateriesAct.viewDetail(eateryId) );
  }, []);

  const isWiderDevice = useForWiderDevice();

  const classes = useStyles();

  // no-op if our pool entries are NOT yet retrieved
  if (!filteredEateries) {
    return <SplashScreen msg="... waiting for pool entries"/>;
  }

  const orderByDistance = filter.sortOrder === 'distance';


  //***
  //*** inner function to list content for smaller devices (like cell phones)
  //*** ... using <List>
  //***

  let currentDistance = -1;
  function contentAsList() {

    const content = [];

    filteredEateries.forEach( eatery => {

      // optionally supply sub-header when ordered by distance
      if (orderByDistance && eatery.distance !== currentDistance) {
        currentDistance = eatery.distance;
        const subTxt = `${currentDistance} mile${currentDistance===1?'':'s'}`;
        content.push((
          <ListItem key={`subheader${currentDistance}`}
                    dense
                    className={classes.divider}
                    divider>
            <ListItemText primary={subTxt}
                          primaryTypographyProps={{variant:'subtitle1'}}/>
          </ListItem>
        ));
      }

      // supply our primary entry content
      content.push((
        <ListItem key={eatery.id}
                  dense
                  button
                  divider
                  onClick={()=>showDetail(eatery.id)}>
          <ListItemIcon>
            <RestaurantIcon/>
          </ListItemIcon>

          <ListItemText 
              primary={
                <Typography variant="h6"
                  noWrap>
                  {eatery.name}
                  <Typography display="inline" noWrap>
                    &nbsp;({`${eatery.distance} mile${eatery.distance===1?'':'s'}`})
                  </Typography>
                </Typography>
              }
              secondary={
                <Typography variant="subtitle1" noWrap>
                  {eatery.addr}
                </Typography>
              }/>
        </ListItem>
      ));
    });
    return <List>{content}</List>;
  }

  //***
  //*** inner function to list content for larger devices (like tablets or desktops)
  //*** ... using <Table>
  //***

  function contentAsTable() {
    return (
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            {orderByDistance && <TableCell className={classes.tableHeader}>Miles</TableCell>}
            <TableCell className={classes.tableHeader}>Eatery</TableCell>
            <TableCell className={classes.tableHeader}>Phone</TableCell>
            {!orderByDistance && <TableCell className={classes.tableHeader}>Miles</TableCell>}
            <TableCell className={classes.tableHeader}>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { filteredEateries.map( eatery => (
              <TableRow key={eatery.id}
                        hover
                        onClick={()=>showDetail(eatery.id)}>

                {orderByDistance && <TableCell align="right">{eatery.distance}</TableCell>}

                <TableCell>
                  {eatery.name}
                  {eatery.website !== 'not-in-search' &&
                   <>
                     &nbsp;
                     <Link href={eatery.website}
                           target="_blank"
                           color="inherit"
                           underline="none">
                       <LinkIcon className={classes.icon}/>
                     </Link>
                   </>
                  }
                </TableCell>

                <TableCell><Typography variant="body2" noWrap>{eatery.phone}</Typography></TableCell>

                {!orderByDistance && <TableCell align="right">{eatery.distance}</TableCell>}

                <TableCell>
                  <Link href={eatery.navUrl}
                        target="_blank"
                        color="inherit"
                        underline="none">
                    <NavigationIcon className={classes.icon}/>
                  </Link> &nbsp;
                  {eatery.addr}
                </TableCell>

              </TableRow>
            ))}
        </TableBody>
      </Table>
    );
  }

  //***
  //*** render our EateriesListScreen
  //***

  const ListContent = () => isWiderDevice ? contentAsTable() : contentAsList();

  return (
    <>
      <ListContent/>
      {spinMsg        && <SplashScreen msg={spinMsg}/>}
      {selectedEatery && <EateryDetailScreen eatery={selectedEatery}/>}
    </>
  );
}


const useStyles = makeStyles( theme => ({

  // vary background grey intensity based on light/dark theme
  // ... and text auto oscillates
  divider: {
    backgroundColor: theme.palette.divider,
  },

  table: {
    // hack to move table down a bit (so as to not be covered by our App Header)
    marginTop:  15,
  },

  // hack to make table header ALWAYS visible <<< using "sticky"
  tableHeader: {
    top:      0,
    position: "sticky",
    color:    'black',

    // set the table header background to a light grey
    // NOTE: uses  an opacity-level of 1 (NOT TRANSPARENT)
    //       - use technique that does NOT affect our children (via rgba css function)
    //         ... so when scrolling (with the "sticky" attr, the header is NOT obscured
    //       - this is accomplished through the rgba css function
    //         ... i.e. it is NOT possible through the 'opacity' css attr
    //       - for this reason we cannot tap into our theme colors (via theme.palette)
    //       - SO we choose a neutral color (light grey)
    background: 'rgba(200, 200, 200, 1.0)',  // opacity-level of 1 (NOT TRANSPARENT), while NOT affecting children (because of rgba usage)
  },

  icon: {
    width: 16,
    color: theme.palette.secondary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
    verticalAlign: 'middle',             // FIX icon alignment when used in conjunction with text
  },

}) );
