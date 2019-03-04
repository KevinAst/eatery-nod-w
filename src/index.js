import React    from 'react';
import ReactDOM from 'react-dom';
import SplashScreen from './util/SplashScreen';
import * as serviceWorker from './util/serviceWorker';

function App() {
  const spinMsg = 'WowZee WooWoo ... Now is the time for every good man to come to the aid of his country.';
  return <SplashScreen msg={spinMsg}/>;
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
