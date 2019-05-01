import {createFeature}  from 'feature-u';
import featureFlags     from 'featureFlags'
import SandboxLeftNavItem  from './comp/SandboxLeftNavItem';

// feature: sandbox
//          promote interactive tests (full details in README)
export default createFeature({
  name:    'sandbox',

  enabled: featureFlags.sandbox,

  fassets: {
    defineUse: {
      'AppMotif.LeftNavItem.sandbox': SandboxLeftNavItem, // inject our entries into the LeftNav
    },
  },
});
