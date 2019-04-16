import React             from 'react';
import {withFassets}     from 'feature-u';
import withState         from '../../../util/withState';
import Typography        from '@material-ui/core/Typography';

/**
 * DiscoveriesTitle displaying the discoveries title
 */
function DiscoveriesTitle({curUser}) {
  return (
    <Typography variant="h6"
                color="inherit"
                noWrap>
      Discovery

      <Typography color="inherit"
                  inline={true}
                  noWrap>
        &nbsp;({curUser.pool})
      </Typography>

    </Typography>
  );
}

const DiscoveriesTitleWithState = withState({
  component: DiscoveriesTitle,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      curUser: fassets.sel.curUser(appState),
    };
  },
});

export default /* DiscoveriesTitleWithFassets = */ withFassets({
  component: DiscoveriesTitleWithState,
  mapFassetsToProps: {
    fassets: '.', // introduce fassets into props via the '.' keyword
  }
});
