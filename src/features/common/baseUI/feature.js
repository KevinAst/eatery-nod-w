import React                from 'react';
import {createFeature,
        fassetValidations}  from 'feature-u';

import _baseUI              from './featureName';
import _baseUIAct           from './actions';
import reducer              from './state';
import * as _baseUISel      from './state';
import logic                from './logic';

import MainLayout           from './comp/MainLayout';
import ToggleUITheme        from './comp/ToggleUITheme';

// feature: layout
//          ?? retrofit description -and- update README.md
//          ?? also maintain the currentView state as a string (full details in README)
//          ?? OLD TRASH:
//          ? promote the app-specific Drawer/SideBar on the app's left
//          ? side.  This feature is app-neutral, as it pulls in it's
//          ? menu items from external features using the
//          ? 'leftNavItem.*' use contract (full details in README)
export default createFeature({
  name: _baseUI,

  // our public face ...
  fassets: {

    define: {
      'actions.changeView': _baseUIAct.changeView, // changeView(viewName)
      'sel.getView':        _baseUISel.getView,    // getView(appState): string
    },

    defineUse: {
      // inject our user-profile menu item to toggle UI Theme ('light'/'dark')
      'AppMotif.UserMenuItem.UIThemeToggle': ToggleUITheme,
    },

    use: [

      // 'AppMotif.UserMenuItem.*': ... component entries of the user-profile menu
      //                                EXPECTING: <UserMenuItem/>
      ['AppMotif.UserMenuItem.*', {required: true, type: fassetValidations.comp}],

      // 'AppMotif.LeftNavItem.*': .... component entries of the left-nav bar
      //                                EXPECTING: <ListItem/>
      ['AppMotif.LeftNavItem.*', {required: true, type: fassetValidations.comp}],

      // 'AppMotif.view.*': ........... auxiliary view content that varies per view
      //                                (the wildcard ('*') is indexed by `currentView`)
      //   ViewAuxiliaryContent: {      EXPECTING: ViewAuxiliaryContent object
      //     TitleComp: () => ......... a component defining the header title
      //                                DEFAULT: rendering of 'Eatery Nod'
      //     FooterComp: () => ........ a component defining the entire footer content
      //                                DEFAULT: no footer
      //   }
      ['AppMotif.view.*', {required: false, type: fassetValidations.any}],
    ],
  },

  reducer,
  logic,

  // inject our various layout components into the root of our app
  appWillStart({fassets, curRootAppElm}) {
    return (
      <MainLayout>
        {curRootAppElm}
      </MainLayout>
    );
  }

});
