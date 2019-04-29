import React        from 'react';
import CheckedIcon  from '@material-ui/icons/CheckCircle';
import Grid         from '@material-ui/core/Grid';
import Tooltip      from '@material-ui/core/Tooltip';
import Typography   from '@material-ui/core/Typography';

/**
 * DiscoveriesFooter displaying the spin control
 */
export default function DiscoveriesFooter() {
  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Typography>&nbsp;</Typography>
      <Typography color="inherit" variant="subtitle1">
        toggle check as &nbsp;
        <CheckedIcon color="secondary" inline/>
        &nbsp; to place in pool
      </Typography>
      <Tooltip title="powered by Google Places">
        <img width="25px" src="/googleLogo.png" alt=""/>
      </Tooltip>
    </Grid>
  );
}
