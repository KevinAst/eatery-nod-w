import React                from 'react';
import {createFeature,
        fassetValidations}  from 'feature-u';

import _layout              from './featureName';
import _layoutAct           from './actions';
import reducer              from './state';
import * as _layoutSel      from './state';

import MainLayout           from './comp/MainLayout';
import AppLayout            from './comp/AppLayout';

// feature: layout
//          ?? retrofit description -and- update README.md
//          ?? also maintain the currentView state as a string (full details in README)
//          ?? OLD TRASH:
//          ? promote the app-specific Drawer/SideBar on the app's left
//          ? side.  This feature is app-neutral, as it pulls in it's
//          ? menu items from external features using the
//          ? 'leftNavItem.*' use contract (full details in README)
export default createFeature({
  name: _layout,

  // our public face ...
  fassets: {
    //?? NO NEED FOR THIS ANYMORE
    //? define: {
    //?   'openLeftNav':  openSideBar,  // openLeftNav():  void ... open  the SideBar ... slight naming variation to original
    //?   'closeLeftNav': closeSideBar, // closeLeftNav(): void ... close the SideBar ... slight naming variation to original
    //? },

    define: {
      'actions.changeView': _layoutAct.changeView, // changeView(viewName)
      'sel.getView':        _layoutSel.getView,    // getView(appState): string
    },

    use: [
      // ??$$ NEW ... was 'leftNavItem.*'
      // 'AppLayout.LeftNavItem.*': ... component entries of the left-nav bar
      //                                expecting: <ListItem/>
      ['AppLayout.LeftNavItem.*', {required: false, type: fassetValidations.comp}], // ?? eventually required

      // 'AppLayout.view.*': ...... auxiliary view content that varies per view (the wildcard ('*') is indexed by `currentView`)
      //   ViewAuxiliaryContent: {
      //     TitleComp: () => ..... a component defining the header title
      //                            DEFAULT: rendering of 'Eatery Nod'
      //     FooterComp: () => .... a component defining the entire footer content
      //                            DEFAULT: no footer
      //   }
      ['AppLayout.view.*', {required: false, type: fassetValidations.any}], // expecting: ViewAuxiliaryContent object
    ],
  },

  reducer,

  // inject our various layout components into the root of our app
  appWillStart({fassets, curRootAppElm}) {
    return (
      <MainLayout>
        <AppLayout>
          {curRootAppElm}
        </AppLayout>
      </MainLayout>
    );
  }

});
