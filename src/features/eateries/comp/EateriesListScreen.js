import React,
       {useCallback}       from 'react';

import {useSelector,
        useDispatch}       from 'react-redux'

import _eateriesAct        from '../actions';
import * as _eateriesSel   from '../state';

import Typography          from '@material-ui/core/Typography';
import ListItemIcon        from '@material-ui/core/ListItemIcon';
import RestaurantIcon      from '@material-ui/icons/Restaurant';
import List                from '@material-ui/core/List';
import ListItem            from '@material-ui/core/ListItem';
import ListItemText        from '@material-ui/core/ListItemText';

import EateryDetailScreen  from './EateryDetailScreen';
import SplashScreen        from 'util/SplashScreen';


/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
export default function EateriesListScreen({classes}) {

  const filteredEateries = useSelector((appState) => _eateriesSel.getFilteredEateries(appState), []);
  const filter           = useSelector((appState) => _eateriesSel.getListViewFilter(appState),   []);
  const selectedEatery   = useSelector((appState) => _eateriesSel.getSelectedEatery(appState),   []);
  const spinMsg          = useSelector((appState) => _eateriesSel.getSpinMsg(appState),          []);

  const dispatch    = useDispatch();
  const showDetail  = useCallback((eateryId) => {
    //console.log(`xx showDetail for ${eateryId}`);
    dispatch( _eateriesAct.viewDetail(eateryId) );
  }, []);

  if (!filteredEateries) {
    return <SplashScreen msg="... waiting for pool entries"/>;
  }

  let currentDistance = -1;

  function listContent() {
    const content = [];
    filteredEateries.forEach( eatery => {
      // optionally supply sub-header when ordered by distance
      if (filter.sortOrder === 'distance' && eatery.distance !== currentDistance) {
        currentDistance = eatery.distance;
        // ?? additional style: ... NOTE have not yet seen this rendering
        //    - ? red color (or secondary
        //    - ? format "(as the crow flies)" on second line -and- smaller
        const subTxt = `${currentDistance} mile${currentDistance===1?'':'s'} (as the crow flies)`;
        content.push((
          <ListItem key={`subheader${currentDistance}`}
                    dense
                    button
                    divider>
            <ListItemText primary={subTxt}/>
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
                    &nbsp;({`${eatery.distance} mile${currentDistance===1?'':'s'}`})
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
    return content;
  }

  return (
    <>
      <List>
        { listContent() }
      </List>
      {spinMsg        && <SplashScreen msg={spinMsg}/>}
      {selectedEatery && <EateryDetailScreen eatery={selectedEatery}/>}
    </>
  );
}
