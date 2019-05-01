import {createLogic}        from 'redux-logic';
import _baseUI              from './featureName';
import _baseUIAct           from './actions';
import {getUITheme}         from './state';
import {storeUITheme}       from './uiThemeStorage';

/**
 * Monitor UI Theme changes, persisting the latest theme in our device storage.
 */
export const persistUITheme = createLogic({

  name: `${_baseUI}.persistUITheme`,
  type: String(_baseUIAct.toggleUITheme),

  process({getState, action, fassets}, dispatch, done) {
    storeUITheme( getUITheme(getState()) );
    done();
  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  persistUITheme,
];
