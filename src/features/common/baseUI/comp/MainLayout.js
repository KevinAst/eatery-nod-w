import React              from 'react';
import PropTypes          from 'prop-types';
import withState          from 'util/withState';
import {withFassets}      from 'feature-u';
import withStyles         from '@material-ui/core/styles/withStyles';
import {MuiThemeProvider,      // NOTE: MuiThemeProvider **SHOULD** be at the root of ALL visible components
        createMuiTheme}   from '@material-ui/core/styles';
import CssBaseline        from '@material-ui/core/CssBaseline';
import AppMotif           from './AppMotif';
import Notify             from 'util/notify';
import {getUITheme}       from '../state';


/**
 * ?? rework description
 *
 * MainLayout is a re-usable top-level component that promotes the
 * proper Material-UI (MUI) theming/styling WITH a reactive layout.
 *
 * ?? rethink this comment:
 * Typically, this is used implicitly through AppMotif, however some
 * components that are NOT part of AppMotif (like SignIn) will use
 * MainLayout explicitly.
 * 
 * USAGE:
 * ```
 *   <MainLayout>
 *     ... content here
 *   </MainLayout>
 * ```
 * 
 * NOTE: This implementation was initially gleaned from the MUI
 *       Sign-in page layout example.
 *        - Visual: https://material-ui.com/getting-started/page-layout-examples/sign-in/
 *        - Source: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/page-layout-examples/sign-in/MainLayout.js
 */

const lightTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },

  palette: {
    type: 'light',
    // AI: More theming to consider
    // primary: {
    //   main: '#37b44e',
    // },
    // secondary: {
    //   main: '#000',
    // },
  },
});

const darkTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'dark',
  },
});

const mainStyles = (theme) => ({
  main: {
    width:        'auto',
    display:      'block', // Fix IE 11 issue.
    //marginLeft:   theme.spacing.unit * 3, // KJB: ?? bad news for the overall layout
    //marginRight:  theme.spacing.unit * 3,

    // reactive design ?? KJB: better understand // KJB: ?? THIS IS CAUSING HAVOC on my main content container overall width
    //? [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    //?   width:       400,
    //?   marginLeft:  'auto',
    //?   marginRight: 'auto',
    //? },
  },
});

function MainLayout({uiTheme, curUser, classes, children}) {
  const themeInUse = uiTheme==='dark' ? darkTheme : lightTheme;
  
  // conditionally inject AppMotif when user is signed-in
  const theRestOfTheStory = curUser.isUserSignedIn() ? (
    <AppMotif>
      {children}
    </AppMotif>
  ) : (
    <>
      {children}
    </>
  );

  return (
    <MuiThemeProvider theme={themeInUse}>
      <CssBaseline/>
      <Notify/>
      <main className={classes.main}>
        {theRestOfTheStory}
      </main>
    </MuiThemeProvider>
  );
}

MainLayout.propTypes = {
  children:     PropTypes.node.isRequired,
  classes:      PropTypes.object.isRequired,
};

const MainLayoutWithState = withState({
  component: MainLayout,
  mapStateToProps(appState, {fassets}) { // ... 2nd param (ownProps) seeded from withFassets() below
    return {
      uiTheme: getUITheme(appState),
      curUser: fassets.sel.curUser(appState),
    };
  },
});

const MainLayoutWithFassets = withFassets({
  component: MainLayoutWithState,
  mapFassetsToProps: {
    fassets: '.', // introduce fassets into props via the '.' keyword
  }
});

export default /* MainLayoutWithStyles = */ withStyles(mainStyles)(MainLayoutWithFassets);
