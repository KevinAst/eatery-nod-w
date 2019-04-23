import {generateActions} from 'action-u';
import _layout           from './featureName';

export default generateActions.root({
  [_layout]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    toggleUITheme: { // actions.toggleUITheme(): Action
                     // > toggle the UI Theme ('light'/'dark')
                     actionMeta: {},
    },

    changeView: {  // actions.changeView(viewName): Action
                   // > change the currentView to the supplied viewName.
                   actionMeta: {
                     traits: ['viewName'],
                   },
    },

  },
});
