import {createLogic}        from 'redux-logic';
import _layout              from './featureName';
import _layoutAct           from './actions';
import {expandWithFassets}  from 'feature-u';

/**
 * Monitor UI Theme changes, persisting the latest theme in our device storage.
 */
export const persistUITheme = expandWithFassets( (fassets) => createLogic({

  name: `${_layout}.persistUITheme`,
  type: String(_layoutAct.toggleUITheme),

  process({getState, action, fassets}, dispatch, done) {
    fassets.deviceService.storeUITheme( fassets.sel.getUITheme(getState()) );
    done();
  },

}));


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default expandWithFassets( (fassets) => [
  persistUITheme(fassets),
]);
