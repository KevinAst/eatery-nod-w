import React               from 'react';
import {withFassets}       from 'feature-u';
import withState           from 'util/withState';
import withStyles          from '@material-ui/core/styles/withStyles';

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

const listStyles = (theme) => ({ // ?? NOT currently used ... a big fat no-op
  list: {
  },
});


/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
function EateriesListScreen({classes, curUser, filteredEateries, filter, selectedEatery, spinMsg, showDetail}) {

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
                  <Typography inline noWrap>
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
      <List className={classes.list}>
        { listContent() }
      </List>
      {spinMsg && <SplashScreen msg={spinMsg}/>}
      {selectedEatery && <EateryDetailScreen eatery={selectedEatery}/>}
    </>
  );
}

const EateriesListScreenWithState = withState({
  component: EateriesListScreen,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      filteredEateries: _eateriesSel.getFilteredEateries(appState),
      filter:           _eateriesSel.getListViewFilter(appState),
      selectedEatery:   _eateriesSel.getSelectedEatery(appState),
      spinMsg:          _eateriesSel.getSpinMsg(appState),
      curUser:          fassets.sel.curUser(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      showDetail(eateryId) {
        //console.log(`xx showDetail for ${eateryId}`);
        dispatch( _eateriesAct.viewDetail(eateryId) );
      },
    };
  },
});

const EateriesListScreenWithFassets =  withFassets({
  component: EateriesListScreenWithState,
  mapFassetsToProps: {
    fassets: '.', // introduce fassets into props via the '.' keyword
  }
});

export default /* EateriesListScreenWithStyles = */ withStyles(listStyles)(EateriesListScreenWithFassets);
