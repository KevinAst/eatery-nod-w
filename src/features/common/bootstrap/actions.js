import {generateActions} from 'action-u';
import _bootstrap        from './featureName';

export default generateActions.root({
                   // prefix all actions with our feature name, guaranteeing they unique app-wide!
  [_bootstrap]: { // actions(): Action ... the root IS an action (e.g. bootstrap() action)
                   // > start boostrap initialization process
                   actionMeta: {},

    setStatus: { // actions.setStatus(statusMsg): Action
                 // > set bootstrap status (e.g. 'Waiting for bla bla bla' -or- 'COMPLETE'
                 actionMeta: {
                   traits: ['statusMsg'],
                 },
    },

    // the fundamental action that indicates the bootstrap process is complete
    // ... monitored by down-stream features (to start the app running),
    complete: { // actions.complete(): Action
                // > bootstrap is complete and app is ready to start
                actionMeta: {},
    },
  },
});
