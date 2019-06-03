import {generateActions} from 'action-u';
import _baseUI           from './featureName';

export default generateActions.root({
  [_baseUI]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    toggleUITheme: { // actions.toggleUITheme(): Action
                     // > toggle the UI Theme ('light'/'dark')
                     actionMeta: {},
    },

    setResponsiveMode: {  // actions.setResponsiveMode(responsiveMode): Action
                          // > change the responsiveMode to the supplied value ('md'/'lg'/'off')
                          actionMeta: {
                            traits: ['responsiveMode'],
                          },
    },

    changeView: {  // actions.changeView(viewName): Action
                   // > change the curView to the supplied viewName
                   actionMeta: {
                     traits: ['viewName'],
                   },
    },

  },
});
