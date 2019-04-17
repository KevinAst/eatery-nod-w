import React        from 'react';
import Typography   from '@material-ui/core/Typography';
import CheckedIcon  from '@material-ui/icons/CheckCircle';

/**
 * DiscoveriesFooter displaying the spin control
 */
export default function DiscoveriesFooter() {
  return (
    <>
      <Typography color="inherit" variant="subtitle1">
        toggle check to &nbsp;
      </Typography>
      <CheckedIcon color="secondary"/>
      <Typography color="inherit" variant="subtitle1">
        &nbsp; placing in pool
      </Typography>
    </>
  );
}
