import {generateActions} from 'action-u';
import _device           from './featureName';

export default generateActions.root({
  [_device]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    guiIsReady: { // actions.guiIsReady(): Action
                  // > the full GUI can now be used (i.e. react-native components is now fully initialized)
                  actionMeta: {},
    },

    setLoc: { // actions.setLoc(loc): Action
              // > set device GPS location
              actionMeta: {
                traits: ['loc'],
              },
    },            

  },
});
