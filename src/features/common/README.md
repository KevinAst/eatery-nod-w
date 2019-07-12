# common directory

The **common** directory is a collection of **app-neutral** features.

- [**baseUI**](baseUI/README.md): provides a **UI Foundation** for the entire application _(in an **app neutral** way)_,  including: **Responsive Design**, **UI Theme**, **Notify** utility activation, **Left Nav** menu items, **User Menu**, **Current View** state, and **Tool Bars**
- [**auth**](auth/README.md): promotes complete user authentication
  - [**authService**](auth/subFeatures/authService/README.md): a persistent authentication service (retaining active user)
    - [**authServiceFirebase**](auth/subFeatures/authServiceFirebase/AuthServiceFirebase.js): the **real** AuthServiceAPI derivation based on Firebase
    - [**authServiceMock**](auth/subFeatures/authServiceMock/AuthServiceMock.js):             the **mock** AuthServiceAPI derivation
- [**initFirebase**](initFirebase/README.md): initializes the Google Firebase service when WIFI is enabled
- [**initGooglePlaces**](initGooglePlaces/README.md): initializes the Google Places service service when WIFI is enabled
- [**location**](location/README.md): Initializes and promotes the GPS location for use by the app.
- [**pwa**](pwa/README.md): orchestrates the Progressive Web App hooks (as defined by Create React App).
- [**diagnostic**](diagnostic/README.md): a collection of **diagnostic-related** features
  - [**logActions**](diagnostic/logActions/README.md): logs all dispatched actions and resulting state
  - [**sandbox**](diagnostic/sandbox/README.md):       promotes a variety of interactive tests, used in development, that can easily be disabled

