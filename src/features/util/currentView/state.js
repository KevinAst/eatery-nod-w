import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import _currentView       from './featureName';
import _currentViewAct    from './actions';

// ***
// *** Our feature reducer, managing our currentView state.
// ***

const reducer = slicedReducer(`view.${_currentView}`, reducerHash({
  [_currentViewAct.changeView]: (state, action) => action.viewName,
}, 'uninitialized') ); // initialState

export default reducer;


// ***
// *** Various Selectors
// ***

                        // NOTE: in this case, our feature state root IS our currentView (very simple)!
                        //       ... we use slicedReducer as a single-source-of-truth
export const getView  = (appState) => reducer.getSlicedState(appState);
