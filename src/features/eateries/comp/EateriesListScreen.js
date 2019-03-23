import React         from 'react';
import {withFassets} from 'feature-u';
import withState     from '../../../util/withState';
import withStyles    from '@material-ui/core/styles/withStyles';

import Typography    from '@material-ui/core/Typography';

import ListItemIcon  from '@material-ui/core/ListItemIcon';
import EateryIcon    from '@material-ui/icons/Restaurant';

import List          from '@material-ui/core/List';
import ListItem      from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';

import SplashScreen      from '../../../util/SplashScreen';

import _eateriesAct      from '../actions';
import * as _eateriesSel from '../state';


const listStyles = (theme) => ({ // ? NOT currently used ... a big fat no-op
  list: {
  },
});


/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
function EateriesListScreen({classes, curUser, filteredEateries, filter, showDetail, handleSpin}) {

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
        const subTxt = `${currentDistance} mile ${currentDistance===1?'':'s'} (as the crow flies)`;
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
      // ?? additional style:
      //    - ? format "(distance x miles)" smaller
      const txt = `${eatery.name} (${eatery.distance} mile ${currentDistance===1?'':'s'})`;
      content.push((

        <ListItem key={eatery.id}
                  dense
                  button
                  divider
                  onClick={()=>showDetail(eatery.id)}>
          <ListItemIcon>
            <EateryIcon/>
          </ListItemIcon>

          <ListItemText 
              primary={
                <Typography component="span"
                            variant="h6"
                            noWrap>
                  {txt}
                </Typography>
              }
              secondary={
                <Typography component="span"
                            variant="subtitle1"
                            noWrap>
                  {eatery.addr}
                </Typography>
              }/>
        </ListItem>
      ));
    });
    return content;
  }

  // ?? retrofit following:
  //    - ? title: 
  //      <Title>Pool <Text note>({curUser.pool})</Text></Title>
  //      {filter.distance && <Text note>(within {filter.distance} mile{filter.distance===1?'':'s'})</Text>}
  //    - ? footer:
  //      <Button vertical
  //              onPress={handleSpin}>
  //        <Icon style={commonStyles.icon} name="color-wand"/>
  //        <Text style={commonStyles.icon}>Spin</Text>
  //      </Button>
  return (
    <List className={classes.list}>
      { listContent() }
    </List>
  );
}

const EateriesListScreenWithState = withState({
  component: EateriesListScreen,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      filteredEateries: _eateriesSel.getFilteredEateries(appState),
      filter:           _eateriesSel.getListViewFilter(appState),
      curUser:          fassets.sel.curUser(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      showDetail(eateryId) {
        //console.log(`xx showDetail for ${eateryId}`);
        dispatch( _eateriesAct.viewDetail(eateryId) );
      },
      handleSpin() {
        dispatch( _eateriesAct.spin() );
      },
    };
  },
});

const EateriesListScreenWithStyles = withStyles(listStyles)(EateriesListScreenWithState);

export default /* EateriesListScreenWithFassets = */ withFassets({
  component: EateriesListScreenWithStyles,
  mapFassetsToProps: {
    fassets:     '.',            // introduce fassets into props via the '.' keyword
  }
});
