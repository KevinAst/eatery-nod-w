import layout                        from './layout/feature';

import location                      from './misc/location/feature';

import auth                          from './auth/feature';
import authService                   from './auth/authService/feature';
import authServiceFirebase           from './auth/authService/authServiceFirebase/feature';
import authServiceMock               from './auth/authService/authServiceMock/feature';

import eateries                      from './eateries/feature';
import eateryService                 from './eateries/eateryService/feature';
import eateryServiceFirebase         from './eateries/eateryService/eateryServiceFirebase/feature';
import eateryServiceMock             from './eateries/eateryService/eateryServiceMock/feature';

import discovery                     from './discovery/feature';
import discoveryService              from './discovery/discoveryService/feature';
import discoveryServiceGooglePlaces  from './discovery/discoveryService/discoveryServiceGooglePlaces/feature';
import discoveryServiceMock          from './discovery/discoveryService/discoveryServiceMock/feature';

import bootstrap                     from './misc/bootstrap/feature';
import firebaseInit                  from './misc/firebaseInit/feature';
import pwa                           from './misc/pwa/feature';

import logActions                    from './misc/diagnostic/logActions/feature';
import sandbox                       from './misc/diagnostic/sandbox/feature';

// accumulate ALL features
// ... see README.md for details
export default [

  layout,

  location,

  auth,
  authService,
  authServiceFirebase,
  authServiceMock,

  eateries,
  eateryService,
  eateryServiceFirebase,
  eateryServiceMock,

  discovery,
  discoveryService,
  discoveryServiceGooglePlaces,
  discoveryServiceMock,

  // ... misc
  bootstrap,
  firebaseInit,
  pwa,

  // ... diagnostic
  logActions,
  sandbox,
];
