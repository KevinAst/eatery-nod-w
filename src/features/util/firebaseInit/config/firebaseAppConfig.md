# firebaseAppConfig.js

The `firebaseAppConfig.js` is gitignored, preventing unauthorized
access from github check-in.

You should supply this file, with **your** firebase app credentials:

```js
/**
 * Promote the FireBase App Configuration in a git ignored resource
 * (preventing unauthorized access from github check-in).
 */
export default {
  apiKey:            "tbd",  // Auth / General Use
  authDomain:        "tbd",  // Auth with popup/redirect
  databaseURL:       "tbd",  // Realtime Database
  projectId:         "tbd",  // Overall Project ID
  storageBucket:     "tbd",  // Storage
  messagingSenderId: "tbd",  // Cloud Messaging
};
```
