import device                        from './device/feature';
import deviceService                 from './device/deviceService/feature';

import auth                          from './auth/feature';
import authService                   from './auth/authService/feature';
import authServiceFirebase           from './auth/authService/authServiceFirebase/feature';
import authServiceMock               from './auth/authService/authServiceMock/feature';

import eateries                      from './eateries/feature';
import eateryService                 from './eateries/eateryService/feature';
import eateryServiceFirebase         from './eateries/eateryService/eateryServiceFirebase/feature';
import eateryServiceMock             from './eateries/eateryService/eateryServiceMock/feature';

//? import discovery                     from './discovery/feature';
//? import discoveryService              from './discovery/discoveryService/feature';
//? import discoveryServiceGooglePlaces  from './discovery/discoveryService/discoveryServiceGooglePlaces/feature';
//? import discoveryServiceMock          from './discovery/discoveryService/discoveryServiceMock/feature';

//? import leftNav                       from './util/leftNav/feature';
import bootstrap                         from './util/bootstrap/feature';
//? import firebaseInit                  from './util/firebaseInit/feature';
import layout                            from './util/layout/feature';

import logActions                    from './util/diagnostic/logActions/feature';
import sandbox                       from './util/diagnostic/sandbox/feature';

// accumulate ALL features
// ... see README.md for details
export default [

  device,
  deviceService,

  auth,
  authService,
  authServiceFirebase,
  authServiceMock,

  eateries,
  eateryService,
  eateryServiceFirebase,
  eateryServiceMock,

  //? discovery,
  //? discoveryService,
  //? discoveryServiceGooglePlaces,
  //? discoveryServiceMock,

  // ... util
  //? leftNav,
  bootstrap,
  //? firebaseInit,
  layout,

  // ... diagnostic
  logActions,
  sandbox,
];
