# leftNav feature ?? THIS IS NOW THE layout feature

The **leftNav** feature promotes the app-specific Drawer/SideBar
on the app's left side.

This feature is app-neutral, as it pulls in it's menu items from
external features using the fassets.use 'leftNavItem.*' contract.

?? retrofit docs to include
   - ? injects the notify utility in the root DOM **(appWillStart)**
   - ? uiTheme  ... <<< integrate this directly into the layout feature
                  bootstraped (from perstance via service),
                  persisted (to local storage via service),
                  state management (via reducer)
                  promoted (via selector)
                  UI-control injection (via fassets use contract)

## Screen Flow

![Screen Flow](docs/ScreenFlow.png)

# INCORPORATE curView docs HERE (eliminate any 'curView' feature name ????????????????????????????????

# curView feature

The **curView** feature maintains the curView state (as a string).

This is a **very simple process**.  It merely provides a
cross-communication mechanism to:

 1. set the curView ... `fassets.actions.changeView(viewName)`
 2. get the curView ... `fassets.sel.curView(appState)`

It is up to the various view-specific features to set/interpret.  A
**best practice** would be to maintain the curView value
(`viewName`) using the active feature name.

## State Transition

For a high-level overview of how actions, logic, and reducers interact
together to maintain this feature's state, please refer to the [State
Transition](docs/StateTransition.txt) diagram.
