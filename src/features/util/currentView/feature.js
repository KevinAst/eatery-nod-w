import {createFeature}      from 'feature-u';
import _currentView         from './featureName';
import _currentViewAct      from './actions';
import reducer              from './state';
import * as _currentViewSel from './state';

// feature: currentView
//          maintain the currentView state as a string (full details in README)
export default createFeature({
  name: _currentView,

  // our public face ...
  fassets: {
    define: {
      'actions.changeView': _currentViewAct.changeView, // changeView(viewName)

      'sel.getView': _currentViewSel.getView, // getView(appState): string
    },
  },

  reducer,
});
