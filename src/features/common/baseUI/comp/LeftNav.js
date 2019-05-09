import React,
       {useCallback,
        useMemo}       from 'react';

import {useFassets}    from 'util/useFassets'; // ?? really 'feature-u'
import withStyles      from '@material-ui/core/styles/withStyles';

import AppBar          from '@material-ui/core/AppBar';
import Drawer          from '@material-ui/core/Drawer';
import List            from '@material-ui/core/List';
import Toolbar         from '@material-ui/core/Toolbar';
import Typography      from '@material-ui/core/Typography';


const leftNavStyles = (theme) => ({
  leftNav: {
    width: 250, // make width significant enough to space out our secondary menu icons
  },
});


/**
 * LeftNav: our LeftNav component that accumulates menu items via use contract.
 */
function LeftNav({classes}) {

  const [leftNavVisible, setLeftNavVisible] = React.useState(false);

  _openLeftNav       = useCallback(() => setLeftNavVisible(true),  []);
  const closeLeftNav = useCallback(() => setLeftNavVisible(false), []);

  const leftNavItems        = useFassets('AppMotif.LeftNavItem.*@withKeys');
  const orderedLeftNavItems = useMemo(() => (
    [...leftNavItems].sort(([item1Key], [item2Key]) => item1Key.localeCompare(item2Key))
  ), [leftNavItems]);

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
          {orderedLeftNavItems.map( ([fassetsKey, LeftNavItem]) => <LeftNavItem key={fassetsKey}/> )}
        </List>
      </div>
    </Drawer>
  );
}

export default /* LeftNavWithStyles = */  withStyles(leftNavStyles)(LeftNav);



/**
 * Utility function that opens our left-nav menu.
 */
export function openLeftNav() { // exported for use by our own: AppMotif
  if (_openLeftNav) {
    _openLeftNav();
  }
}
let _openLeftNav = null; // expose our inner function

