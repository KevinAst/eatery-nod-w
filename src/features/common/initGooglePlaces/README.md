# initGooglePlaces feature

The **initGooglePlaces** feature initializes the Google Places service.

This is done conditionally _(via feature enablement)_ when we are using
real services (_i.e. when WIFI is enabled_: `featureFlags.useWIFI`).

## Credentials

The credentials are defined through the **Google Places API Key**
resource located in the deployment site: `public/gpak`.  This
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

Here is a sample Google Places API Key resource, before it is encoded:

**Google Places API Key**
```js
tbd
```

Here is the same resource, after it is encoded _(in it's gitignored
deployment site)_:

**`public/gpak`**
```
afesadGJk
```
