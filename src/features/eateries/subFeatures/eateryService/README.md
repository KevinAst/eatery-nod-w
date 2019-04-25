# eateryService feature

The **eateryService** feature promotes a persistent "Eateries" DB
service (monitoring real-time Eatery DB activity) through the
`eateryService` fassets reference (**feature-u**'s Cross Feature
Communication mechanism).


## API

A complete API reference can be found in the
[EateryServiceAPI](EateryServiceAPI.js) class.


## Example

Access is provided through the **feature-u** `fassets` reference:

```js
fassets.eateryService.monitorDbEateryPool(...)
```


## Mocking

This service can be "mocked" through app-specific
[featureFlag](../../../util/featureFlags.js) settings.

This "base" feature merely specifies the `eateryService` **use
contract**, supporting **feature-u** validation: _a required resource
of type: `EateryServiceAPI`_.

The actual definition of the service is supplied by other features
(through the `defineUse` directive), either real or mocked (as
directed by `featureFlags.useWIFI`).
