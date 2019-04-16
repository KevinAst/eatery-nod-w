import {generateActions}        from 'action-u';
import _discovery               from './featureName';
import discoveryFilterFormMeta  from './discoveryFilterFormMeta';

export default generateActions.root({

  [_discovery]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    filterForm: discoveryFilterFormMeta.registrar.formActionGenesis(),

    retrieve: { // actions.retrieve([filter]): Action
                // > retrieval of discoveries using supplied filter
                actionMeta: {
                  traits: ['filter']
                },

      complete: { // actions.retrieve.complete(filter, discoveriesResp): Action
                  // > discoveries retrieval complete, with supplied response
                  actionMeta: {
                    traits: ['filter', 'discoveriesResp'],
                  },
      },

      fail: { // actions.retrieve.fail(err): Action
              // > discoveries retrieval failed, with supplied err
              actionMeta: {
                traits: ['err'],
              },
      },

    },

    nextPage: { // actions.nextPage(pagetoken): Action
                // > retrieve next-page, via supplied pagetoken
                actionMeta: {
                  traits: ['pagetoken'],
                },

      complete: { // actions.nextPage.complete(discoveriesResp): Action
                  // > discoveries nextPage retrieval complete, with supplied response
                  actionMeta: {
                    traits: ['discoveriesResp'],
                  },
      },

      fail: { // actions.nextPage.fail(err): Action
              // > discoveries nextPage retrieval failed, with supplied err
              actionMeta: {
                traits: ['err'],
              },
      },

    },

  },
});
