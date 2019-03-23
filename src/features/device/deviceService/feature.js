import {createFeature}  from 'feature-u';
import DeviceService    from './DeviceService';

// feature: deviceService
//          promotes a simplified abstraction of several device
//          services (both Expo and react-native), through the
//          `deviceService` fassets reference (full details in README)
export default createFeature({
  name: 'deviceService',

  // our public face ...
  fassets: {
    define: {
      'deviceService': new DeviceService(),
    },
  },
});
