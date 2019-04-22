import {createFeature}       from 'feature-u';
import _bootstrap            from './featureName';
import {isFassetBootstrapFn} from './bootstrapFn';
import _bootstrapAct         from './actions';
import logic                 from './logic';
import route                 from './route';
import reducer               from './state';

// feature: bootstrap
//          initialize the app through a critical-path app initialization
//          process that must complete before the app can run, using the
//          `'bootstrap.*'` fassets use contract (full details in README)
export default createFeature({
  name: _bootstrap,

  reducer,
  logic,
  route,

  // our public face ...
  fassets: {

    // the 'bootstrap.*' use contract (see 'bootstrap' logic module)
    use: [
      ['bootstrap.*', {required: false, type: isFassetBootstrapFn}],
    ],


    // various public "push" resources
    define: {

      // *** public actions ***
                                   // the fundamental action, 
                                   // monitored by down-stream features (e.g. authorization),
                                   // logically starting our app running!
      'actions.bootstrapComplete': _bootstrapAct.complete, // ... slight naming variation to original action

    }
  },

  appDidStart({fassets, appState, dispatch}) {
    // dispatch our base bootstrap action, that "kicks off" the app's bootstrap initialization process
    dispatch( _bootstrapAct() ); // ... this base "actions" is the bootstrap action
  }

});
