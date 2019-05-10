import auth                          from './common/auth/feature';
import authService                   from './common/auth/subFeatures/authService/feature';
import authServiceFirebase           from './common/auth/subFeatures/authServiceFirebase/feature';
import authServiceMock               from './common/auth/subFeatures/authServiceMock/feature';
import bootstrap                     from './common/bootstrap/feature';
import discovery                     from './discovery/feature';
import discoveryService              from './discovery/subFeatures/discoveryService/feature';
import discoveryServiceGooglePlaces  from './discovery/subFeatures/discoveryServiceGooglePlaces/feature';
import discoveryServiceMock          from './discovery/subFeatures/discoveryServiceMock/feature';
import eateries                      from './eateries/feature';
import eateryService                 from './eateries/subFeatures/eateryService/feature';
import eateryServiceFirebase         from './eateries/subFeatures/eateryServiceFirebase/feature';
import eateryServiceMock             from './eateries/subFeatures/eateryServiceMock/feature';
import initFirebase                  from './common/initFirebase/feature';
import initGooglePlaces              from './common/initGooglePlaces/feature';
import baseUI                        from './common/baseUI/feature';
import location                      from './common/location/feature';
import logActions                    from './common/diagnostic/logActions/feature';
import pwa                           from './common/pwa/feature';
import sandbox                       from './common/diagnostic/sandbox/feature';

// accumulate/promote ALL features that make up our app
export default [


  //***
  //*** app-specific features
  //***

  eateries,
  eateryService,
  eateryServiceFirebase,
  eateryServiceMock,

  discovery,
  discoveryService,
  discoveryServiceGooglePlaces,
  discoveryServiceMock,


  //***
  //*** common app-neutral features
  //***

  baseUI,
  
  auth,
  authService,
  authServiceFirebase,
  authServiceMock,
  
  bootstrap,
  
  initFirebase,
  initGooglePlaces,
  
  location,
  
  pwa,

  // diagnostic features ...
  logActions,
  sandbox,
];
