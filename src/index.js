import React              from 'react';
import ReactDOM           from 'react-dom';
//import AppLayout          from './util/layout/AppLayout';
//import TempJunk           from './TempJunk';
import TempList           from './TempList';
import * as serviceWorker from './util/serviceWorker';

function App() {
  // ?? OLD
  //? return (
  //?   <AppLayout title="Pool">
  //?     <TempJunk/>
  //?   </AppLayout>
  //? );
  return <TempList/>;
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
