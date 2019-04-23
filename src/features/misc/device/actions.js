import {generateActions} from 'action-u';
import _device           from './featureName';

export default generateActions.root({
  [_device]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    setLoc: { // actions.setLoc(loc): Action
              // > set device GPS location
              actionMeta: {
                traits: ['loc'],
              },
    },            

  },
});
