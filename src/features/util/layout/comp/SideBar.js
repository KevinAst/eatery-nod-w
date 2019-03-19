// ?? TRASH THIS ... BUT FIRST:
//    - ?? glean the leftNavItems mapping
//    - ?? glean the signout

import React           from 'react';
import withState       from '../../../../util/withState';
import {withFassets }  from 'feature-u';
import {Body,
        Button,
        Container,
        Content,
        Icon,
        Header,
        List,
        Right,
        Text,
        Title}      from 'native-base';
import commonStyles from '../../../commonStyles';

/**
 * SideBar: our leftNav component, exposed through the Drawer.
 */
function SideBar({guiReady, handleSignOut, leftNavItems}) {

  // fallback to more primitive content when GUI is NOT yet initialized
  // ... part of the device feature initialization process
  if (!guiReady) {
    // console.log('xx rendering <SideBar> GUI NOT READY: fallback to simple <Text> content');
    return (
      <Text style={commonStyles.container}>
        Device NOT ready (i.e. waiting for GUI library to initialize)
      </Text>
    );
  }

  // render our menu
  // console.log('xx rendering <SideBar> GUI IS READY: using REAL Content');
  return (
    <Container style={{...commonStyles.container, backgroundColor:'white'}}>
      <Header>
        <Body>
          <Title>Select a view</Title>
        </Body>
        <Right>
          <Button transparent onPress={handleSignOut}>
            <Icon active name="log-out"/>
          </Button>
        </Right>
      </Header>
      <Content>
        <List>
          {/* pull in leftNav menu items from across all features */}
          {leftNavItems.map( (LeftNavItem, indx) => <LeftNavItem key={indx}/> )}
        </List>
      </Content>
    </Container>
  );
}


// ***
// *** various SideBar utility functions
// ***

let _drawer = null;
export function registerDrawer(drawer) {
  _drawer = drawer;
}

export function openSideBar() {
  _drawer._root.open();
}

export function closeSideBar() {
  setTimeout(() => _drawer._root.close(), 1); // delay so as to have new view up when sidebar closes (HACK)
}


// ***
// *** inject various state items into our component
// ***

const SideBarWithState = withState({
  component: SideBar,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      guiReady: fassets.sel.isGuiReady(appState),
    };
  },
  mapDispatchToProps(dispatch, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      handleSignOut() {
        dispatch( fassets.actions.signOut() );
        closeSideBar();
      },
    };
  },
});


// ***
// *** inject various fassets (feature assets) into our component
// ***

export default withFassets({ // SideBarWithFassets
  component: SideBarWithState,
  mapFassetsToProps: {
    leftNavItems:  'leftNavItem.*', // this is the manifestation of our use contract ... i.e. we use these items
    fassets:       '.',             // introduce fassets into props via the '.' keyword
  }
});
