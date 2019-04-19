import React             from 'react';
import {withFassets}     from 'feature-u';
import withState         from '../../../util/withState';
import * as _eateriesSel from '../state';
import Typography        from '@material-ui/core/Typography';
import Tooltip           from '@material-ui/core/Tooltip';
import Grid              from '@material-ui/core/Grid';

/**
 * EateriesTitle displaying the eateries pool title
 */
function EateriesTitle({curUser, filter}) {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Typography variant="h6"
                  color="inherit"
                  noWrap>
        Pool
        <Typography color="inherit"
                    inline={true}
                    noWrap>
          &nbsp;({curUser.pool})
        </Typography>

        {filter.distance && 
         <Typography color="inherit"
                     noWrap>
           ... within {filter.distance} mile{filter.distance===1?'':'s'}
         </Typography>}
      </Typography>
      <Tooltip title="powered by Firebase">
        <img width="50px" src="/firebaseLogo.png" alt=""/>
      </Tooltip>
    </Grid>
  );
}

const EateriesTitleWithState = withState({
  component: EateriesTitle,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      curUser: fassets.sel.curUser(appState),
      filter:  _eateriesSel.getListViewFilter(appState),
    };
  },
});

export default /* EateriesTitleWithFassets = */ withFassets({
  component: EateriesTitleWithState,
  mapFassetsToProps: {
    fassets: '.', // introduce fassets into props via the '.' keyword
  }
});
