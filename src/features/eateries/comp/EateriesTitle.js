import React             from 'react';

import {useFassets}      from 'feature-u';
import {useSelector}     from 'react-redux'

import * as _eateriesSel from '../state';
import Typography        from '@material-ui/core/Typography';

/**
 * EateriesTitle displaying the eateries pool title
 */
export default function EateriesTitle() {

  const fassets = useFassets();

  const curUser = useSelector((appState) => fassets.sel.curUser(appState),            [fassets]);
  const filter  = useSelector((appState) => _eateriesSel.getListViewFilter(appState), []);

  return (
    <Typography variant="h6"
                color="inherit"
                noWrap>
      Pool
      <Typography color="inherit" display="inline" noWrap>
        &nbsp;({curUser.pool})
      </Typography>

      {filter.distance && 
       <Typography color="inherit"
                   noWrap>
         ... within {filter.distance} mile{filter.distance===1?'':'s'}
       </Typography>}
    </Typography>
  );
}
