import React,
       {useMemo}          from 'react';
import {useSelector}      from 'react-redux'
import PropTypes          from 'prop-types';
import withStyles         from '@material-ui/core/styles/withStyles';
import {MuiThemeProvider,      // NOTE: MuiThemeProvider **SHOULD** be at the root of ALL visible components
        createMuiTheme}   from '@material-ui/core/styles';
import CssBaseline        from '@material-ui/core/CssBaseline';
import AppMotif           from './AppMotif';
import Notify             from 'util/notify';
import {getUITheme}       from '../state';


/**
 * MainLayout is a re-usable top-level component that promotes the
 * proper Material-UI (MUI) theming/styling WITH a responsive layout.
 * 
 * The following items are provided through this component:
 *
 * - a **Responsive Design** that auto adjusts for desktops, cell
 *   phones, and portable devices
 *
 * - a **UI Theme** allowing the user to choose from light/dark
 *   renditions
 *
 * - an **About Dialog** is promoted from information gleaned from the
 *   `package.json`
 *
 * - the **Notify** utility is activated, supporting programmatic
 *   **toasts, alerts, and confirmations**
 * 
 * Please refer to the **`baseUI` README** for more information.
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
    //marginLeft:   theme.spacing.unit * 3, // AI: ?? bad news for the overall layout
    //marginRight:  theme.spacing.unit * 3,

    // reactive design // AI: ?? THIS IS CAUSING HAVOC on my main content container overall width
    //? [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
    //?   width:       400,
    //?   marginLeft:  'auto',
    //?   marginRight: 'auto',
    //? },
  },
});

function MainLayout({classes, children}) {

  const uiTheme    = useSelector((appState) => getUITheme(appState), []);
  const themeInUse = useMemo(() => uiTheme==='dark' ? darkTheme : lightTheme, [uiTheme]);

  return (
    <MuiThemeProvider theme={themeInUse}>
      <CssBaseline/>
      <Notify/>
      <main className={classes.main}>
        <AppMotif>
          {children}
        </AppMotif>
      </main>
    </MuiThemeProvider>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default /* MainLayoutWithStyles = */ withStyles(mainStyles)(MainLayout);
