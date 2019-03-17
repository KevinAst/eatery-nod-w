import React              from 'react';
import PropTypes          from 'prop-types';
import withStyles         from '@material-ui/core/styles/withStyles';
import {MuiThemeProvider,      // NOTE: MuiThemeProvider **SHOULD** be at the root of ALL visible components
        createMuiTheme}   from '@material-ui/core/styles';
import CssBaseline        from '@material-ui/core/CssBaseline';
import Notify             from '../notify';


/**
 * MainLayout is a re-usable top-level component that promotes the
 * proper Material-UI (MUI) theming/styling WITH a reactive layout.
 *
 * Typically, this is used implicitly through AppLayout, however some
 * components that are NOT part of AppLayout (like SignIn) will use
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
    //marginLeft:   theme.spacing.unit * 3, // KJB: bad news for my AppLayout content container
    //marginRight:  theme.spacing.unit * 3,

    // reactive design ?? KJB: better understand // KJB: ?? THIS IS CAUSING HAVOC on my main content container overall width
    //? [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    //?   width:       400,
    //?   marginLeft:  'auto',
    //?   marginRight: 'auto',
    //? },
  },
});

function MainLayout({isThemeLight, children, classes}) {
  const themeInUse = isThemeLight ? lightTheme : darkTheme;
  // console.log('***eatery-nod-w*** <MainLayout> MUI theme in use:', themeInUse)
  return (
    <MuiThemeProvider theme={themeInUse}>
      <CssBaseline/>
      <Notify/>
      <main className={classes.main}>
        {children}
      </main>
    </MuiThemeProvider>
  );
}

MainLayout.propTypes = {
  isThemeLight: PropTypes.bool.isRequired,
  children:     PropTypes.node.isRequired,
  classes:      PropTypes.object.isRequired,
};

MainLayout.defaultProps = {
  isThemeLight: false, // AI: to make isThemeLight dynamically switchable at run-time, simply inject this from maintained redux state
};

export default withStyles(mainStyles)(MainLayout);
