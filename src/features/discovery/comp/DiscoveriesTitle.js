import React          from 'react';

import {useFassets}   from 'feature-u';
import {useSelector}  from 'react-redux'

import Typography     from '@material-ui/core/Typography';

/**
 * DiscoveriesTitle displaying the discoveries title
 */
export default function DiscoveriesTitle() {

  const fassets = useFassets();
  const curUser = useSelector( (appState) => fassets.sel.curUser(appState), [fassets] );

  return (
    <Typography variant="h6"
                color="inherit"
                noWrap>
      Discovery
      <Typography color="inherit"  display="inline" noWrap>
        &nbsp;({curUser.pool})
      </Typography>
    </Typography>
  );
}
