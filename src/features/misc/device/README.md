# device feature

The **device** feature initializes the device for use by the app.

In general, this initialization represents critical-path items that
must be completed before the app can run.

It accomplishes the following:

 - Initializes the following critical-path resources through the
   `'bootstrap.*'` use contract:

   - `'bootstrap.fonts'` ... loads the fonts required by the native-base GUI lib
     
   - `'bootstrap.location'` ... initializes the device GPS location

 - performs device-specific initialization (iOS/Android) through
   the platformSetup() function **(appWillStart)**

 - injects the notify utility in the root DOM **(appWillStart)**


## State Transition

For a high-level overview of how actions, logic, and reducers interact
together to maintain this feature's state, please refer to the [State
Transition](docs/StateTransition.txt) diagram.
