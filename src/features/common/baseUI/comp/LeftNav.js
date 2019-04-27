import React           from 'react';

import {withFassets }  from 'feature-u';
import withStyles      from '@material-ui/core/styles/withStyles';

import AppBar          from '@material-ui/core/AppBar';
import Drawer          from '@material-ui/core/Drawer';
import List            from '@material-ui/core/List';
import Toolbar         from '@material-ui/core/Toolbar';
import Typography      from '@material-ui/core/Typography';


let _openLeftNav = null; // expose our inner function

/**
 * Open our left-nav menu (our publicly promoted function).
 */
export function openLeftNav() {
  if (_openLeftNav) {
    _openLeftNav();
  }
}


const leftNavStyles = (theme) => ({
  leftNav: {
    width: 250, // make width significant enough to space out our secondary menu icons
  },
});


/**
 * LeftNav: our LeftNav component that accumulates menu items via use contract.
 */
function LeftNav({classes, leftNavItems}) {

  const [leftNavVisible, setLeftNavVisible] = React.useState(false);
  _openLeftNav          = () => setLeftNavVisible(true);
  const closeLeftNav    = () => setLeftNavVisible(false);

  // AI: have seen some usage of tabIndex in <div> under <Drawer> (unsure if needed)
  //     tabIndex={0} ... should be focus-able in sequential keyboard navigation, but its order is defined by the document's source order */}
  return (
    <Drawer open={leftNavVisible}
            onClose={closeLeftNav}>
      <div className={classes.leftNav}
           onClick={closeLeftNav}
           onKeyDown={closeLeftNav}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Select a view
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {leftNavItems.map( ([fassetsKey, LeftNavItem]) => <LeftNavItem key={fassetsKey}/> )}
        </List>
      </div>
    </Drawer>
  );
}

const LeftNavWithFassets = withFassets({
  component: LeftNav,
  mapFassetsToProps: {
    // <ListItem>s to inject in our left-nav (the manifestation of our use contract)
    leftNavItems: 'AppMotif.LeftNavItem.*@withKeys',
  }
});

export default /* LeftNavWithStyles = */  withStyles(leftNavStyles)(LeftNavWithFassets);
