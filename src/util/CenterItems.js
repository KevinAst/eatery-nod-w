import React from 'react';
import Grid  from '@material-ui/core/Grid';

/**
 * A component that centers all contained children within a Grid.
 */
export default function CenterItems({children}) {
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      {children}
    </Grid>
  );
}
