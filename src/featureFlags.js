/**
 * featureFlags (see description below)
 */

export default {

  useWIFI: false, // should app use WIFI? ... regulates various services: real/mocked

  mockGPS: {lat: 30.010479, lng: -90.119414},
                  // should app mock GPS? ... regulates DeviceService.getCurPos():  real/mocked
                  // false: use real device location
                  // true:  mock device location (default to GlenCarbon IL)
                  // {lat, lng}: specify mocked location, example:
                  //             {lat: 40.48643,  lng: -86.1336}   ... Kokomo IN
                  //             {lat: 42.60559,  lng: -83.14993}  ... Troy MI
                  //             {lat: 30.010479, lng: -90.119414} ... New Orleans, LA
                  //             {lat: 38.752209, lng: -89.986610} ... Glen Carbon IL

  log:     false, // should app emit diagnostic logs?
                  // false:     no logs
                  // true:      generate 'non verbose' logs (e.g. actions will NOT include redux state)
                  // 'verbose': generate 'verbose'     logs (e.g. actions WILL     include redux state)

  sandbox: true,  // should app enable diagnostic sandbox controls?
};
