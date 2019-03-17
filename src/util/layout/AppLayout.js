import React              from 'react';
import PropTypes          from 'prop-types';
import withStyles         from '@material-ui/core/styles/withStyles';
import MainLayout         from './MainLayout';

import Drawer             from  '@material-ui/core/Drawer';
import AppBar             from  '@material-ui/core/AppBar';
import Toolbar            from  '@material-ui/core/Toolbar';
import List               from  '@material-ui/core/List';
import Typography         from  '@material-ui/core/Typography';
import Divider            from  '@material-ui/core/Divider';
import IconButton         from  '@material-ui/core/IconButton';
import Badge              from  '@material-ui/core/Badge';
import MenuIcon           from  '@material-ui/icons/Menu';
import NotificationsIcon  from  '@material-ui/icons/Notifications';

import AccountCircle      from '@material-ui/icons/AccountCircle';
import Menu               from '@material-ui/core/Menu';
import MenuItem           from '@material-ui/core/MenuItem';

import ListItem           from '@material-ui/core/ListItem';
import ListItemIcon       from '@material-ui/core/ListItemIcon';
import ListItemText       from '@material-ui/core/ListItemText';
import ListItemSecondaryAction  from '@material-ui/core/ListItemSecondaryAction';
import InboxIcon          from '@material-ui/icons/MoveToInbox';
import MailIcon           from '@material-ui/icons/Mail';

import {toast,
        confirm}          from '../notify';


/**
 * AppLayout is a re-usable top-level layout component that
 * establishes the application characteristics like Tool Bar, Left
 * Nav, etc.
 * 
 * The main page content is rendered as children of this component
 * (like eateries and discovery).
 *
 * USAGE:
 * ```
 *   <AppLayout title="Pool">
 *     ... page content here
 *   </AppLayout>
 * ```
 * 
 * NOTE: This implementation was initially gleaned from the MUI
 *       Dashboard page layout example. ? my version is SOO pruned down, not sure I want to even reference this
 *        - Visual: https://material-ui.com/getting-started/page-layout-examples/dashboard/
 *        - Source: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/page-layout-examples/dashboard
 */

const appStyles = (theme) => ({

  app: {
    display: 'flex', // KJB: does not seem to be doing anything
  },

  appBar: {
    //? ***Dashboard Sample***
    //? zIndex:     theme.zIndex.drawer + 1,
    //? transition: theme.transitions.create(['width', 'margin'], {
    //?   easing:   theme.transitions.easing.sharp,
    //?   duration: theme.transitions.duration.leavingScreen,
    //? }),
  },

  bottomBar: {
    top:        'auto',
    bottom:     0,
    alignItems: 'center',
  },

  toolbar: {
    //? ***Dashboard Sample***
    //? paddingRight: 24, // keep right padding when drawer closed
  },

  menuButton: {
    //? marginLeft:  12, //? ...more ***Dashboard Sample***
    marginRight: 36, // proper spacing between menu button and title
  },

  title: {
    flexGrow: 1, // moves right-most toolbar items to the right
  },

  leftNav: {
    width: 250, // make width significant enough to space out our secondary menu icons
  },

  content: {
    flexGrow: 1,
    height: '100vh',                 // content window is height is same as our viewport (100%)
    overflow: 'auto',                // add scrollbar ONLY when necessary

    paddingTop:    '4em', // HACK: so ToolBar doesn't cover up ... must be a better way
    paddingBottom: '4em', // HACK: so BottomBar doesn't cover up ... must be a better way
    // padding: theme.spacing.unit * 3, // ... from sample content ... sample: 8 * 3

    // KJB: temporarily make content window VERY VISIBLE
    // backgroundColor: 'pink',
  },

});


function AppLayout({title, children, classes, bottomBarContent}) {

  //*** Authorization *** ----------------------------------------------------------
  const isAuthorized = true; // pretend user is authorized


  //*** User Menu *** --------------------------------------------------------------
  const [anchorUserMenu, setAnchorUserMenu] = React.useState(null); // KJB: WowZee MY FIRST hook!
  const userMenuOpen = Boolean(anchorUserMenu);

  function handleUserMenuOpen(event) {
    setAnchorUserMenu(event.currentTarget);
  }

  function handleUserMenuClose() {
    setAnchorUserMenu(null);
  }

  function handleSignOut() {
    handleUserMenuClose();
    confirm.warn({ 
      msg: 'Are you sure you wish to sign out?', 
      actions: [
        { txt: 'Sign Out', action: () => toast.success({msg: 'Now pretending you are signed out!'}) },
        { txt: 'Go Back' }
      ]
    });
  }

  //*** Left Nav *** ---------------------------------------------------------------
  const [leftNavVisible, setLeftNavVisible] = React.useState(false);
  const openLeftNav     = () => setLeftNavVisible(true);
  const closeLeftNav    = () => setLeftNavVisible(false);
//const toggleLeftNav   = () => setLeftNavVisible(!leftNavVisible);
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

  // TEMPORARY: pretend we have bottomBarContent
  bottomBarContent = (
    <Typography color="inherit">
      My Bottom Bar
    </Typography>
  );

  //*** Render our AppLayout *** ---------------------------------------------------
  return (
    <MainLayout>
      <div className={classes.app}>

        {/* Title Bar */}
        <AppBar className={classes.appBar}
                position="absolute">
          <Toolbar className={classes.toolbar}
                   disableGutters={false}>

            <IconButton className={classes.menuButton}
                        color="inherit"
                        onClick={openLeftNav}>
              <MenuIcon/>
            </IconButton>

            <Typography component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}>
              {title}
            </Typography>

            <IconButton color="inherit"> {/* KJB: Badge sample  */}
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon/>
              </Badge>
            </IconButton>

            {isAuthorized && /* User Profile Menu - only show authorized ... not really applicable in our case but keep for pattern */ (
               <div>
                 <IconButton color="inherit"
                             onClick={handleUserMenuOpen}>
                   <AccountCircle/>
                 </IconButton>
                 <Menu anchorEl={anchorUserMenu}
                       anchorOrigin={{
                         vertical: 'top',
                         horizontal: 'right',
                       }}
                       transformOrigin={{
                         vertical: 'top',
                         horizontal: 'right',
                       }}
                       open={userMenuOpen}
                       onClose={handleUserMenuClose}>
                   <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                   <MenuItem onClick={handleUserMenuClose}>My account</MenuItem>
                   <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                 </Menu>
               </div>
             )}

          </Toolbar>
        </AppBar>

        {/* Left Nav */}
        {/* AI: have seen some usage of tabIndex in <div> under <Drawer> (unsure if needed)
                tabIndex={0} ... should be focus-able in sequential keyboard navigation, but its order is defined by the document's source order
          */}
        <Drawer open={leftNavVisible}
                onClose={closeLeftNav}>
          <div className={classes.leftNav}
               onClick={closeLeftNav}
               onKeyDown={closeLeftNav}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                  Select a view
                </Typography>
              </Toolbar>
            </AppBar>
            <List>
              {['WowZee', 'WowZee James', 'WooWoo'].map((txt, indx) => myListItem(txt, indx))}
            </List>
            <Divider/>
            <List>
              {['WomBee', 'WomBee Very Long Item', 'WooLoo'].map((txt, indx) => myListItem(txt, indx))}
            </List>
          </div>
        </Drawer>

        {/* Page Content */}
        {/* $$AI: multiple <main> appears to be allowed (although NOT technically correct) ... in this app does NOT seem to matter if THIS is <main> or <div> */}
        <main className={classes.content}>
          {children}
        </main>

        {/* Optional Bottom Bar TODO: ?? look into <BottomNavigation>  */}
        {bottomBarContent && (
           <AppBar className={classes.bottomBar}
                   position="absolute">
             <Toolbar className={classes.toolbar}
                      disableGutters={false}>
               {bottomBarContent}
             </Toolbar>
           </AppBar>
         )}

      </div>
    </MainLayout>
  );
}

AppLayout.propTypes = {
  title:            PropTypes.string.isRequired, // page title
  children:         PropTypes.node.isRequired,   // main page content (like eateries and discovery)
  classes:          PropTypes.object.isRequired,
  bottomBarContent: PropTypes.node,              // optional bottom bar content
};

AppLayout.defaultProps = {
  title: 'Eatery Nod',
};

export default withStyles(appStyles)(AppLayout);
