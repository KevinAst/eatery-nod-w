# initFirebase feature

The **initFirebase** feature initializes the Google Firebase service.

This is done conditionally _(via feature enablement)_ when we are using
real services (_i.e. when WIFI is enabled_: `featureFlags.useWIFI`).

## Credentials

The credentials are defined through the **Firebase App Config**
resource located in the deployment site: `public/fbac`.  This
resource name is purposely obscure so as not to infer it's sensitive
content.

**For your protection you should**:

- gitignore the resource, preventing unauthorized access from github
  check-in. _**Note:** this resource is still deployed to your
  server_.

- Encode this resource (via `util/encoder`), minimizing it's exposure
  to your deployment site.

- Secure your API Key through the Google Cloud Console _(limiting it's
  usage to only authorized domains, etc.)_.

Here is a sample FireBase App Configuration resource, before it is encoded:

**FireBase App Configuration**
```js
{
  apiKey:            "tbd",  // Auth / General Use
  authDomain:        "tbd",  // Auth with popup/redirect
  databaseURL:       "tbd",  // Realtime Database
  projectId:         "tbd",  // Overall Project ID
  storageBucket:     "tbd",  // Storage
  messagingSenderId: "tbd",  // Cloud Messaging
}
```

Here is the same resource, after it is encoded _(in it's gitignored
deployment site)_:

**`public/fbac`**
```
afesab2JqMnN0cjp7ImFwaUtleSI6InRiZCIsImF1dGhEb21haW4iOiJ0YmQiLCJkYXRhYmFzZVVSTCI6InRiZCIsInByb2plY3RJZCI6InRiZCIsInN0b3JhZ2VCdWNrZXQiOiJ0YmQiLCJtZXNzYWdpbmdTZW5kZXJJZCI6InRiZCJ9
```
