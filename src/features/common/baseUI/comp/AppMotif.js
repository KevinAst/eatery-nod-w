import React,
       {useMemo}      from 'react';
import PropTypes      from 'prop-types';

import {useFassets}   from 'feature-u';
import {useSelector}  from 'react-redux'

import {makeStyles}   from '@material-ui/core/styles';

import LeftNav        from './LeftNav';
import {openLeftNav}  from './LeftNav';
import UserMenu       from './UserMenu';

import AppBar         from '@material-ui/core/AppBar';
import IconButton     from '@material-ui/core/IconButton';
import MenuIcon       from '@material-ui/icons/Menu';
import Toolbar        from '@material-ui/core/Toolbar';
import Typography     from '@material-ui/core/Typography';


/**
 * AppMotif is a re-usable top-level component that establishes
 * the following application characteristics:
 * 
 * - a **Left Nav** menu
 * - a **User Menu** menu
 * - a **Current View** state _(orchestrating which application view is active)_
 * - a **Tool Bar** with various artifacts (ex: title bar and footer)
 * 
 * While these controls are promoted through AppMotif, it's content
 * is accumulated from external features through various **Use
 * Contracts**.

 * AppMotif is auto injected through the MainLayout component,
 * however, it is only active when an active user is **signed-in**.
 * 
 * The main page content is rendered as children of this component
 * (like eateries, discovery, etc.).
 *
 * USAGE:
 * ```
 *   <AppMotif>
 *     ... app page content here
 *   </AppMotif>
 * ```
 * 
 * Please refer to the **`baseUI` README** for more information.
 */
export default function AppMotif({children}) {

  const fassets = useFassets();

  const curUser = useSelector( (appState) => fassets.sel.curUser(appState), [fassets] );
  const curView = useSelector( (appState) => fassets.sel.curView(appState), [fassets] );

  const classes = useStyles();

  // define our auxiliary view content
  const viewAuxiliaryContent    = fassets.get('AppMotif.auxViewContent.*@withKeys');
  const curViewAuxiliaryContent = useMemo(() => resolveCurViewAuxiliaryContent(curView, viewAuxiliaryContent), [curView, viewAuxiliaryContent]);
  const {TitleComp, FooterComp} = curViewAuxiliaryContent;

  // no-op when no user is signed-in
  if (!curUser.isUserSignedIn()) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <div className={classes.app}>

      {/* Title Bar */}
      <AppBar className={classes.appBar}
              position="absolute">
        <Toolbar className={classes.toolbar}
                 disableGutters={false}>

          {/* Left Nav Activation Button openLeftNav */}
          <IconButton className={classes.menuButton}
                      color="inherit"
                      onClick={openLeftNav}>
            <MenuIcon/>
          </IconButton>

          {/* Title */}
          <div className={classes.title}>
            <TitleComp/>
          </div>

          {/* User Profile Menu */}
          <UserMenu curUser={curUser}/>

        </Toolbar>
      </AppBar>

      {/* Left Nav */}
      <LeftNav/>

      {/* Page Content */}
      <main className={classes.content}>
        {children}
      </main>

      {/* Optional Bottom Bar */}
      {FooterComp && (
         <AppBar className={classes.bottomBar}
                 position="absolute">
           <Toolbar className={classes.toolbar}
                    disableGutters={false}>
             <FooterComp/>
           </Toolbar>
         </AppBar>
       )}

    </div>
  );
}

AppMotif.propTypes = {
  children: PropTypes.node.isRequired, // main page content (like eateries and discovery)
};


const useStyles = makeStyles( theme => ({
  app: {
    display: 'flex', // KJB: does not seem to be doing anything
  },

  appBar: {
    // ***Dashboard Sample***
    // zIndex:     theme.zIndex.drawer + 1,
    // transition: theme.transitions.create(['width', 'margin'], {
    //   easing:   theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen,
    // }),
  },

  bottomBar: {
    top:        'auto',
    bottom:     0,
  },

  toolbar: {
    // ***Dashboard Sample***
    // paddingRight: 24, // keep right padding when drawer closed
  },

  menuButton: {
    marginRight: 36, // proper spacing between menu button and title
  },

  title: {
    flexGrow: 1, // moves right-most toolbar items to the right
  },

  content: {
    flexGrow: 1,
    height: '100vh',                 // content window is height is same as our viewport (100%)
    overflow: 'auto',                // add scrollbar ONLY when necessary

    paddingTop:    '4em', // HACK: so ToolBar doesn't cover up ... must be a better way
    paddingBottom: '4em', // HACK: so BottomBar doesn't cover up ... must be a better way
    // padding: theme.spacing(3), // ... from sample content ... sample: 8 * 3
  },
}) );


function resolveCurViewAuxiliaryContent(curView, viewAuxiliaryContent) {
  const matchKey = `AppMotif.auxViewContent.${curView}`;
  const [, curViewAuxiliaryContent] = viewAuxiliaryContent.find( ([key]) => key === matchKey ) || fallbackViewAuxiliaryContent;
  return curViewAuxiliaryContent;
}

const fallbackViewAuxiliaryContent = ['AppMotif.auxViewContent.FALLBACK', {
  TitleComp: () => (
    <Typography variant="h6"
                color="inherit"
                noWrap>
      App Motif
    </Typography>
  ),
}];
