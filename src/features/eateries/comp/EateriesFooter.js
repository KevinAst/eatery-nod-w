import React             from 'react';
import withState         from 'util/withState';
import _eateriesAct      from '../actions';
import Typography        from '@material-ui/core/Typography';
import IconButton        from '@material-ui/core/IconButton';
import SpinIcon          from '@material-ui/icons/SwapCalls'; // ... -OR-  loop, swap_vert, vertical_align_center, done, playlist_add_check, check_box, check, swap_calls, present_to_all 


/**
 * EateriesFooter displaying the spin control
 */
function EateriesFooter({handleSpin}) {
  return (
    <IconButton color="inherit" onClick={handleSpin}>
      <SpinIcon/>
      <Typography color="inherit" variant="subtitle1">&nbsp;&nbsp;Spin</Typography>
    </IconButton>
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
