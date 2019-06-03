import React                  from 'react';
import {createFeature,
        fassetValidations}    from 'feature-u';

import _baseUI                from './featureName';
import _baseUIAct             from './actions';
import reducer                from './state';
import * as _baseUISel        from './state';
import logic                  from './logic';

import MainLayout             from './comp/MainLayout';
import ToggleUITheme          from './comp/ToggleUITheme';
import MaintainResponsiveMode from './comp/MaintainResponsiveMode';
import About                  from './comp/About';

// feature: baseUI <<< full details in README
//          Provides a UI foundation for an entire application.
//          It manages the following characteristics:
//          - a Responsive Design that auto adjusts for desktops, cell phones, and
//            portable devices.
//          - a UI Theme allowing the user to choose from light/dark renditions
//          - when an active user is signed-in, the following items are also
//            manifest:
//            - a "Left Nav" menu
//            - a "User Menu" menu
//            - a "Current View" state (orchestrating which application view is active)
//            - a "Tool Bar" with various artifacts (ex: title bar and footer)
export default createFeature({
  name: _baseUI,

  // our public face ...
  fassets: {

    define: {
      'actions.changeView': _baseUIAct.changeView, // changeView(viewName)
      'sel.curView':        _baseUISel.curView,    // curView(appState): string
    },

    defineUse: {
      // inject User Menu entries
      // ... to ToggleUITheme ('light'/'dark')
      'AppMotif.UserMenuItem.aa1_UIThemeToggle': ToggleUITheme,
      // ... to MaintainResponsiveMode ('md'/'lg'/'off')
      'AppMotif.UserMenuItem.aa2_MaintainResponsiveMode': MaintainResponsiveMode,
      // ... to display About info (gleaned from package.json)
      'AppMotif.UserMenuItem.zz8_About': About,
    },

    use: [
      // full details in README
      ['AppMotif.UserMenuItem.*',   {required: true,  type: fassetValidations.comp}],
      ['AppMotif.LeftNavItem.*',    {required: true,  type: fassetValidations.comp}],
      ['AppMotif.auxViewContent.*', {required: false, type: fassetValidations.any}],
    ],
  },

  reducer,
  logic,

  // inject our baseUI components into the root of our app
  appWillStart({fassets, curRootAppElm}) {
    return (
      <MainLayout>
        {curRootAppElm}
      </MainLayout>
    );
  }

});
