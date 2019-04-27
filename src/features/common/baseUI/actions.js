import {generateActions} from 'action-u';
import _baseUI           from './featureName';

export default generateActions.root({
  [_baseUI]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    toggleUITheme: { // actions.toggleUITheme(): Action
                     // > toggle the UI Theme ('light'/'dark')
                     actionMeta: {},
    },

    changeView: {  // actions.changeView(viewName): Action
                   // > change the curView to the supplied viewName.
                   actionMeta: {
                     traits: ['viewName'],
                   },
    },

  },
});
