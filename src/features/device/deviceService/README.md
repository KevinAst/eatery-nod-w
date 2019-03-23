# deviceService feature

The **deviceService** feature promotes a simplified abstraction of
several device services (both Expo and react-native), through the
`deviceService` fassets reference (**feature-u**'s Cross Feature
Communication mechanism).

This provices a consistent "GO TO" for device related resources.

## API

A complete API reference can be found in the
[DeviceService](DeviceService.js) class.


## Example

Access is provided through the **feature-u** `fassets` reference:

```js
fassets.deviceService.getCurPos()
```


## Mocking

Some services are "mockable", at an individual method level, as
specified by our featureFlags.
