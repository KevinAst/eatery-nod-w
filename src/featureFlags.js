// GPS location defined constants (a convenience)
const LOCATION = {
  DEVICE:        null, // PRODUCTION: actual device location (null directive)
  GlenCarbonIL:  {lat: 38.752209, lng: -89.986610, name: 'Glen Carbon, IL'},
  NewOrleansLA:  {lat: 30.010479, lng: -90.119414, name: 'New Orleans, LA'},
  KokomoIN:      {lat: 40.48643,  lng: -86.1336,   name: 'Kokomo, IN'},
  TroyMI:        {lat: 42.60559,  lng: -83.14993,  name: 'Troy, MI'},
};


// various featureFlags used throughout the application
export default {

  // should app use WIFI?
  // ... regulates various services (real/mocked)
  useWIFI: true,

  // GPS location (real/mocked)
  //  - PRODUCTION: LOCATION.DEVICE       (actual device location)
  //  - DEMO:       LOCATION.GlenCarbonIL (using WIFI at DEMO, outside of GC, but persistent data is in GC)
  //  - OTHER:      LOCATION.whatever     (mock to whatever you want)
  location: LOCATION.GlenCarbonIL,

  // value-added GPS location heuristic
  // ... regulates getCurPos() service (real/mocked)
  useLocation() {
    // when our services are mocked (i.e. NO WIFI),
    //   we force a New Orleans mock location
    //   ... because this is where the mocked data is seeded
    // otherwise, we use the desired location directive
    return this.useWIFI ? this.location : LOCATION.NewOrleansLA;
  },

  // should app emit diagnostic logs?
  //  - false:     no logs
  //  - true:      generate 'non verbose' logs (e.g. actions will NOT include redux state)
  //  - 'verbose': generate 'verbose'     logs (e.g. actions WILL     include redux state)
  log:     false,

  // should app enable diagnostic sandbox controls?
  sandbox: false,
};
