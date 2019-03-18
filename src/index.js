import React              from 'react';
import ReactDOM           from 'react-dom';
//import MainLayout         from './util/layout/MainLayout';
//import SplashScreen       from './util/SplashScreen';
//import AppLayout          from './util/layout/AppLayout';
//import TempJunk           from './TempJunk';
import TempList           from './TempList';
import * as serviceWorker from './util/serviceWorker';

function App() {
  // TEMP: various sandboxes (one or the other)
  return <TempList/>;
  //? return (
  //?   <AppLayout title="Pool">
  //?     <TempJunk/>
  //?   </AppLayout>
  //? );
  //? return (
  //?   <MainLayout>
  //?     <SplashScreen msg="This is a test outside of AppLayout"/>
  //?   </MainLayout>
  //? );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
