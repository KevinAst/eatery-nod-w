import {createLogic}          from 'redux-logic';
import _baseUI                from './featureName';
import _baseUIAct             from './actions';
import {getUITheme,
        getResponsiveMode}    from './state';
import {storeUITheme}         from './uiThemeStorage';
import {storeResponsiveMode}  from './responsiveModeStorage';

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


/**
 * Monitor responsiveMode changes, persisting the latest in our device storage.
 */
export const persistResponsiveMode = createLogic({

  name: `${_baseUI}.persistResponsiveMode`,
  type: String(_baseUIAct.setResponsiveMode),

  process({getState, action, fassets}, dispatch, done) {
    storeResponsiveMode( getResponsiveMode(getState()) );
    done();
  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  persistUITheme,
  persistResponsiveMode,
];
