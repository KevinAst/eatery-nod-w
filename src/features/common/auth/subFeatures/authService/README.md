# authService feature

The **authService** feature promotes a persistent authentication
service (retaining active user) through the `authService` fassets
reference (**feature-u**'s Cross Feature Communication mechanism).


## API

A complete API reference can be found in the
[AuthServiceAPI](AuthServiceAPI.js) class.


## Example

Access is provided through the **feature-u** `fassets` reference:

```js
fassets.authService.signIn(email, pass)
```


## Mocking

This service can be "mocked" through app-specific
[featureFlag](../../../../../featureFlags.js) settings.

This "base" feature merely specifies the `authService` **use
contract**, supporting **feature-u** validation: _a required resource
of type: `AuthServiceAPI`_.

The actual definition of the service is supplied by other features
(through the `defineUse` directive), either real or mocked (as
directed by `featureFlags.useWIFI`).
