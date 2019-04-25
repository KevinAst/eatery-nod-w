import {createLogic}        from 'redux-logic';
import _layout              from './featureName';
import _layoutAct           from './actions';
import {getUITheme}         from './state';
import {storeUITheme}       from './uiThemeStorage';

/**
 * Monitor UI Theme changes, persisting the latest theme in our device storage.
 */
export const persistUITheme = createLogic({

  name: `${_layout}.persistUITheme`,
  type: String(_layoutAct.toggleUITheme),

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
