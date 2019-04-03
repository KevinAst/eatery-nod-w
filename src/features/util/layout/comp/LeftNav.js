import React           from 'react';
import {withFassets }  from 'feature-u';
import withStyles         from '@material-ui/core/styles/withStyles';

import Drawer             from '@material-ui/core/Drawer';
import List               from '@material-ui/core/List';
import AppBar             from '@material-ui/core/AppBar';
import Toolbar            from '@material-ui/core/Toolbar';
import Typography         from '@material-ui/core/Typography';

// ?? TEMP IMPORTS
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import {toast}            from '../../../../util/notify';
import ListItem           from '@material-ui/core/ListItem';
import ListItemIcon       from '@material-ui/core/ListItemIcon';
import ListItemText       from '@material-ui/core/ListItemText';
import InboxIcon          from '@material-ui/icons/MoveToInbox';
import MailIcon           from '@material-ui/icons/Mail';
import Divider            from '@material-ui/core/Divider';



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
 * LeftNav: our leftNav component (accumulating menu items via use contract).
 */
function LeftNav({classes, leftNavItems}) {

  const [leftNavVisible, setLeftNavVisible] = React.useState(false);
  _openLeftNav          = () => setLeftNavVisible(true);
  const closeLeftNav    = () => setLeftNavVisible(false);

  // ?? use NEW leftNavItems
  // ?? temp start
  const handleLeftNavOp = (txt) => toast.success({msg: `doing ${txt}`});
  const myListItem = (txt, indx) => ( // convenience list item builder (for demo purposes only)
    <ListItem button
              key={`${txt}_${indx}`}
              onClick={()=>handleLeftNavOp(txt)}>
      <ListItemIcon>{indx%2 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
      <ListItemText primary={txt}/>
      <ListItemSecondaryAction onClick={()=>handleLeftNavOp(`SECONDARY: ${txt}`)}>
        <ListItemIcon>{indx%2 ? <MailIcon/> : <InboxIcon/>}</ListItemIcon>
      </ListItemSecondaryAction>
    </ListItem>
  );
  // ?? temp end

  // AI: ?? have seen some usage of tabIndex in <div> under <Drawer> (unsure if needed)
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
          {['Poo WowZee', 'Poo WowZee James', 'Poo WooWoo'].map((txt, indx) => myListItem(txt, indx))}
        </List>
        <Divider/>
        <List>
          {['Pee WomBee', 'Pee WomBee Very Long Item', 'Pee WooLoo'].map((txt, indx) => myListItem(txt, indx))}
        </List>
      </div>
    </Drawer>
  );
}

const LeftNavWithFassets = withFassets({
  component: LeftNav,
  mapFassetsToProps: {
    // <ListItem>s to inject in our left-nav (the manifestation of our use contract)
    leftNavItems:  'AppLayout.LeftNavItem.*',
  }
});

export default /* LeftNavWithStyles = */  withStyles(leftNavStyles)(LeftNavWithFassets);
