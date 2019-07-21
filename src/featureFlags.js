/**
 * Various featureFlags used throughout the application.
 */
export default {

  // should app use WIFI? ... regulates various services: real/mocked
  useWIFI: true,

  // provide the location to use (regulating real/mocked getCurPos() @util/deviceLocation.js)
  //  - null:      use "actual" device location
  //  - otherwise: interpret as a "mocked" location
  useLocation() {
    // when our services are mocked (i.e. NO WIFI),
    // we force a location mock of New Orleans
    // ... because this is where the mocked data is seeded
    if (!this.useWIFI)
      return LOCATION.NewOrleansLA;

    // otherwise, we use the desired location directive
    //  - PRODUCTION: LOCATION.DEVICE       (actual device location)
    //  - DEMO:       LOCATION.GlenCarbonIL (using WIFI outside of GC, but persistent data is in GC)
    //  - OTHER:      LOCATION.whatever     (mock to whatever you want)
    return LOCATION.GlenCarbonIL;
  },

  // should app emit diagnostic logs?
  log:     false, // false:     no logs
                  // true:      generate 'non verbose' logs (e.g. actions will NOT include redux state)
                  // 'verbose': generate 'verbose'     logs (e.g. actions WILL     include redux state)

  // should app enable diagnostic sandbox controls?
  sandbox: false,
};


/**
 * Various GPS locations.
 */
const LOCATION = {
  DEVICE:        null, // actual device location (null directive)
  GlenCarbonIL:  {lat: 38.752209, lng: -89.986610, name: 'Glen Carbon, IL'},
  NewOrleansLA:  {lat: 30.010479, lng: -90.119414, name: 'New Orleans, LA'},
  KokomoIN:      {lat: 40.48643,  lng: -86.1336,   name: 'Kokomo, IN'},
  TroyMI:        {lat: 42.60559,  lng: -83.14993,  name: 'Troy, MI'},
};
