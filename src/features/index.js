import eateries                      from './eateries/feature';
import eateryService                 from './eateries/subFeatures/eateryService/feature';
import eateryServiceFirebase         from './eateries/subFeatures/eateryServiceFirebase/feature';
import eateryServiceMock             from './eateries/subFeatures/eateryServiceMock/feature';

import discovery                     from './discovery/feature';
import discoveryService              from './discovery/subFeatures/discoveryService/feature';
import discoveryServiceGooglePlaces  from './discovery/subFeatures/discoveryServiceGooglePlaces/feature';
import discoveryServiceMock          from './discovery/subFeatures/discoveryServiceMock/feature';

import auth                          from './common/auth/feature';
import authService                   from './common/auth/subFeatures/authService/feature';
import authServiceFirebase           from './common/auth/subFeatures/authServiceFirebase/feature';
import authServiceMock               from './common/auth/subFeatures/authServiceMock/feature';
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

  eateries, // ... ORDER: before discovery feature to promote Pool left-nav FIRST
  eateryService,
  eateryServiceFirebase,
  eateryServiceMock,

  discovery,
  discoveryService,
  discoveryServiceGooglePlaces,
  discoveryServiceMock,

  // ... common
  layout, // ... ORDER: before auth feature to promote UITheme user-menu FIRST
  auth,
  authService,
  authServiceFirebase,
  authServiceMock,
  bootstrap,
  initFirebase,
  initGooglePlaces,
  location,
  pwa,

  // ... common diagnostic
  logActions,
  sandbox,
];
