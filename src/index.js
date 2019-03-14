import React              from 'react';
import ReactDOM           from 'react-dom';
import MainLayout         from './util/layout/MainLayout';
import TempJunk           from './TempJunk';
import * as serviceWorker from './util/serviceWorker';

function App() {
  return (
    <MainLayout>
      <TempJunk/>
    </MainLayout>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
