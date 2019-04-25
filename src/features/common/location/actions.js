import {generateActions} from 'action-u';
import _location         from './featureName';

export default generateActions.root({
  [_location]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    setLocation: { // actions.setLocation(loc): Action
                   // > set current GPS location
                   actionMeta: {
                     traits: ['loc'],
                   },
    },            

  },
});
