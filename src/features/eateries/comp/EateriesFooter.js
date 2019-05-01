import React             from 'react';

import withState         from 'util/withState';
import _eateriesAct      from '../actions';

import Grid              from '@material-ui/core/Grid';
import IconButton        from '@material-ui/core/IconButton';
import SpinIcon          from '@material-ui/icons/SwapCalls'; // ... -OR-  loop, swap_vert, vertical_align_center, done, playlist_add_check, check_box, check, swap_calls, present_to_all 
import Tooltip           from '@material-ui/core/Tooltip';
import Typography        from '@material-ui/core/Typography';


/**
 * EateriesFooter displaying the spin control
 */
function EateriesFooter({handleSpin}) {
  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Typography>&nbsp;</Typography>
      <IconButton color="inherit" onClick={handleSpin}>
        <SpinIcon/>
        <Typography color="inherit" variant="subtitle1">&nbsp;&nbsp;Spin</Typography>
      </IconButton>
      <Tooltip title="powered by Google Firebase">
        <img width="50px" src="/firebaseLogo.png" alt=""/>
      </Tooltip>
    </Grid>
  );
}

export default /* EateriesFooterWithState = */ withState({
  component: EateriesFooter,
  mapDispatchToProps(dispatch) {
    return {
      handleSpin() {
        dispatch( _eateriesAct.spin() );
      },
    };
  },
});
