# eatery-nod-w app

The **eatery-nod-w** application is composed of the following **features**:

 - [**eateries**](eateries/README.md): manages and promotes the eateries view
   - [**eateryService**](eateries/subFeatures/eateryService/README.md): a persistent "Eateries" DB service, monitoring real-time Eatery DB activity
     - [**eateryServiceFirebase**](eateries/subFeatures/eateryServiceFirebase/EateryServiceFirebase.js): the **real** EateryServiceAPI derivation based on Firebase
     - [**eateryServiceMock**](eateries/subFeatures/eateryServiceMock/EateryServiceMock.js):             the **mock** EateryServiceAPI derivation
 - [**discovery**](discovery/README.md): manages and promotes the discovery view
   - [**discoveryService**](discovery/subFeatures/discoveryService/README.md): retrieves restaurant information from a geographical data source, emitting Discovery/Eatery objects
     - [**discoveryServiceGooglePlaces**](discovery/subFeatures/discoveryServiceGooglePlaces/DiscoveryServiceGooglePlaces.js): the **real** DiscoveryServiceAPI derivation based on GooglePlaces API
     - [**discoveryServiceMock**](discovery/subFeatures/discoveryServiceMock/DiscoveryServiceMock.js):                         the **mock** DiscoveryServiceAPI derivation
 - [**common**](common/README.md): a collection of **app-neutral** features
   - [**baseUI**](common/baseUI/README.md): provides a **UI Foundation** for the entire application _(in an **app neutral** way)_,  including: **Responsive Design**, **UI Theme**, **Notify** utility activation, **Left Nav** menu items, **User Menu**, **Current View** state, and **Tool Bars**
   - [**auth**](common/auth/README.md): promotes complete user authentication
     - [**authService**](common/auth/subFeatures/authService/README.md): a persistent authentication service (retaining active user)
       - [**authServiceFirebase**](common/auth/subFeatures/authServiceFirebase/AuthServiceFirebase.js): the **real** AuthServiceAPI derivation based on Firebase
       - [**authServiceMock**](common/auth/subFeatures/authServiceMock/AuthServiceMock.js):             the **mock** AuthServiceAPI derivation
   - [**bootstrap**](common/bootstrap/README.md): provide critical-path app initialization through the `'bootstrap.*'` use contract
   - [**initFirebase**](common/initFirebase/README.md): initializes the Google Firebase service when WIFI is enabled
   - [**initGooglePlaces**](common/initGooglePlaces/README.md): initializes the Google Places service service when WIFI is enabled
   - [**location**](common/location/README.md): Initializes and promotes the GPS location for use by the app.
   - [**pwa**](common/pwa/README.md): orchestrates the Progressive Web App hooks (as defined by Create React App).
   - [**diagnostic**](common/diagnostic/README.md): a collection of **diagnostic-related** features
     - [**logActions**](common/diagnostic/logActions/README.md): logs all dispatched actions and resulting state
     - [**sandbox**](common/diagnostic/sandbox/README.md):       promotes a variety of interactive tests, used in development, that can easily be disabled
