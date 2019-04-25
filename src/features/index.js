import eateries                      from './eateries/feature';
import eateryService                 from './eateries/eateryService/feature';
import eateryServiceFirebase         from './eateries/eateryService/eateryServiceFirebase/feature';
import eateryServiceMock             from './eateries/eateryService/eateryServiceMock/feature';

import discovery                     from './discovery/feature';
import discoveryService              from './discovery/discoveryService/feature';
import discoveryServiceGooglePlaces  from './discovery/discoveryService/discoveryServiceGooglePlaces/feature';
import discoveryServiceMock          from './discovery/discoveryService/discoveryServiceMock/feature';

import auth                          from './common/auth/feature';
import authService                   from './common/auth/authService/feature';
import authServiceFirebase           from './common/auth/authService/authServiceFirebase/feature';
import authServiceMock               from './common/auth/authService/authServiceMock/feature';
import bootstrap                     from './common/bootstrap/feature';
import initFirebase                  from './common/initFirebase/feature';
import initGooglePlaces              from './common/initGooglePlaces/feature';
import layout                        from './common/layout/feature';
import location                      from './common/location/feature';
import pwa                           from './common/pwa/feature';

import logActions                    from './common/diagnostic/logActions/feature';
import sandbox                       from './common/diagnostic/sandbox/feature';

// accumulate ALL features
// ... see README.md for details
export default [

  eateries,
  eateryService,
  eateryServiceFirebase,
  eateryServiceMock,

  discovery,
  discoveryService,
  discoveryServiceGooglePlaces,
  discoveryServiceMock,

  // ... common
  auth,
  authService,
  authServiceFirebase,
  authServiceMock,
  bootstrap,
  initFirebase,
  initGooglePlaces,
  layout,
  location,
  pwa,

  // ... common diagnostic
  logActions,
  sandbox,
];
