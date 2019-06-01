import React from 'react';
import Grid  from '@material-ui/core/Grid';

/**
 * A component that centers all contained children within a Grid (both horizontally and vertically).
 */
export default function CenterItems({children}) {
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      {children}
    </Grid>
  );
}

/**
 * A component that horizontally centers all contained children within a Grid.
 * AI: Currently not used (added in an attempt to fix icon alignment with text, but found better solution)
 */
export function CenterItemsHorizontally({children}) {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      {children}
    </Grid>
  );
}
