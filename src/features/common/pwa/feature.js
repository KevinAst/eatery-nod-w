import {createFeature}    from 'feature-u';
import * as serviceWorker from './serviceWorker';

// feature: pwa
//          orchestrates the Progressive Web App hooks (as defined by Create React App)
export default createFeature({
  name:    'pwa',

  appInit({showStatus, fassets, appState, dispatch}) {
    // FROM: CRA (Create React App):
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: http://bit.ly/CRA-PWA
    serviceWorker.unregister();
  }
});
