# location feature

Initializes and promotes the GPS location for use by the app.

It accomplishes the following:

 - Initializes the location through the appInit()
   application-life-cycle-hook

 - Promotes the location through `fassets.sel.getLocation(appState)`.


## State Transition

For a high-level overview of how actions, logic, and reducers interact
together to maintain this feature's state, please refer to the [State
Transition](docs/StateTransition.txt) diagram.
