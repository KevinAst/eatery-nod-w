import {createFeature}  from 'feature-u';
import _logActions      from './featureName';
import logic            from './logic';
import featureFlags     from 'featureFlags';

// feature: logActions
//          log all dispatched actions and resulting state (full details in README)
export default createFeature({
  name:    _logActions,
  enabled: featureFlags.log ? true : false, // NOTE: feature-u requires boolean, but featureFlags.log can be a string (e.g. 'verbose')
  logic,
});
