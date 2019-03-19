import React                from 'react';
import {createFeature,
        fassetValidations}  from 'feature-u';
import MainLayout           from './comp/MainLayout';
import AppLayout            from './comp/AppLayout';

// feature: layout
//          ?? retrofit description -and- update README.md
//          ?? OLD TRASH:
//          ? promote the app-specific Drawer/SideBar on the app's left
//          ? side.  This feature is app-neutral, as it pulls in it's
//          ? menu items from external features using the
//          ? 'leftNavItem.*' use contract (full details in README)
export default createFeature({
  name: 'layout',

  // our public face ...
  fassets: {
    //?? NO NEED FOR THIS ANYMORE
    //? define: {
    //?   'openLeftNav':  openSideBar,  // openLeftNav():  void ... open  the SideBar ... slight naming variation to original
    //?   'closeLeftNav': closeSideBar, // closeLeftNav(): void ... close the SideBar ... slight naming variation to original
    //? },


    //?? L8TR: is a required resource
    //use: [
    //  ['leftNavItem.*', {required: true, type: fassetValidations.comp}], // expecting: ?? <ListItem/>
    //],
  },

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
