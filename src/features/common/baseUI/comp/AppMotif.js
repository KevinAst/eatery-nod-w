import React          from 'react';
import PropTypes      from 'prop-types';
import withStyles     from '@material-ui/core/styles/withStyles';
import {withFassets}  from 'feature-u';
import withState      from 'util/withState';

import LeftNav        from './LeftNav';
import {openLeftNav}  from './LeftNav';
import UserMenu       from './UserMenu';

import AppBar         from '@material-ui/core/AppBar';
import IconButton     from '@material-ui/core/IconButton';
import MenuIcon       from '@material-ui/icons/Menu';
import Toolbar        from '@material-ui/core/Toolbar';
import Typography     from '@material-ui/core/Typography';


/**
 * ?? rework description
 * 
 * AppMotif is a re-usable top-level layout component that
 * establishes the application characteristics like Tool Bar, Left
 * Nav, etc.
 * 
 * The main page content is rendered as children of this component
 * (like eateries and discovery).
 *
 * USAGE:
 * ```
 *   <AppMotif>
 *     ... page content here
 *   </AppMotif>
 * ```
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

  content: {
    flexGrow: 1,
    height: '100vh',                 // content window is height is same as our viewport (100%)
    overflow: 'auto',                // add scrollbar ONLY when necessary

    paddingTop:    '4em', // HACK: so ToolBar doesn't cover up ... must be a better way
    paddingBottom: '4em', // HACK: so BottomBar doesn't cover up ... must be a better way
    // padding: theme.spacing.unit * 3, // ... from sample content ... sample: 8 * 3
  },

});

function AppMotif({curView, viewAuxiliaryContent, classes, children}) {

  // define our auxiliary view content
  const curViewAuxiliaryContent = resolveCurViewAuxiliaryContent(curView, viewAuxiliaryContent);
  const {TitleComp, FooterComp} = curViewAuxiliaryContent;

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
          <UserMenu/>

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


const AppMotifWithState = withState({
  component: AppMotif,
  mapStateToProps(appState, {fassets}) { // ... 2nd param (ownProps) seeded from withFassets() below
    return {
      curView:  fassets.sel.getView(appState),
    };
  },
});

const AppMotifWithFassets = withFassets({
  component: AppMotifWithState,
  mapFassetsToProps: {
    fassets:              '.', // introduce fassets into props via the '.' keyword
    viewAuxiliaryContent: 'AppMotif.view.*@withKeys',
  }
});

export default /* AppMotifWithStyles = */ withStyles(appStyles)(AppMotifWithFassets);




function resolveCurViewAuxiliaryContent(curView, viewAuxiliaryContent) {
  const matchKey = `AppMotif.view.${curView}`;
  const [, curViewAuxiliaryContent] = viewAuxiliaryContent.find( ([key]) => key === matchKey ) || fallbackViewAuxiliaryContent;
  return curViewAuxiliaryContent;
}

const fallbackViewAuxiliaryContent = ['AppMotif.view.FALLBACK', {
  TitleComp: () => (
    <Typography variant="h6"
                color="inherit"
                noWrap>
      Eatery Nod
    </Typography>
  ),
}];
