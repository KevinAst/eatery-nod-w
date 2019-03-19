import React              from 'react';
import ReactDOM           from 'react-dom';
import MainLayout         from './util/layout/MainLayout';
import SplashScreen       from './util/SplashScreen';
import AppLayout          from './util/layout/AppLayout';
import TempJunk           from './TempJunk';
import TempList           from './TempList';
import * as serviceWorker from './util/serviceWorker';

function App() {
  // TEMP: various sandboxes (one or the other)
  return <TempList/>;
  return (
    <MainLayout>
      <SplashScreen msg="This is a <SplashScreen> within a <MainLayout> ... NOT using <AppLayout>"/>
    </MainLayout>
  );
  return (
    <AppLayout>
      <SplashScreen msg="This is a <SplashScreen> within a <AppLayout>"/>
    </AppLayout>
  );
  return (
    <SplashScreen msg="This is a <SplashScreen> ALL BY ITSELF ... NO <MainLayout> -or- <AppLayout>"/>
  );
  return (
    <AppLayout title="Pool">
      <TempJunk/>
    </AppLayout>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
