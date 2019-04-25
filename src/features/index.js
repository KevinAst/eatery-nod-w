import layout                        from './layout/feature';

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

import bootstrap                     from './common/bootstrap/feature';
import initFirebase                  from './common/initFirebase/feature';
import initGooglePlaces              from './common/initGooglePlaces/feature';
import location                      from './common/location/feature';
import pwa                           from './common/pwa/feature';

import logActions                    from './common/diagnostic/logActions/feature';
import sandbox                       from './common/diagnostic/sandbox/feature';

// accumulate ALL features
// ... see README.md for details
export default [

  layout,

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

  // ... common
  bootstrap,
  initFirebase,
  initGooglePlaces,
  location,
  pwa,

  // ... diagnostic
  logActions,
  sandbox,
];
