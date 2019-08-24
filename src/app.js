import ReactDOM     from 'react-dom';
import {launchApp}  from 'feature-u';
import features     from 'features';
import aspects      from 'aspects';
import {splash}     from 'util/SplashScreen';

// launch our app, exposing the Fassets object (facilitating cross-feature-communication)
export default launchApp({

  features,
  aspects,

  registerRootAppElm(rootAppElm) {
    ReactDOM.render(rootAppElm,
                    document.getElementById('root'));
  },

  showStatus(msg='', err=null) {
    splash(msg, err);
  },
});
