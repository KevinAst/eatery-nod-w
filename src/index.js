import React    from 'react';
import ReactDOM from 'react-dom';

import Notify   from './util/notify';
import {notify,
        toast,
        alert,
        confirm}  from './util/notify';

import SplashScreen from './util/SplashScreen';
import * as serviceWorker from './util/serviceWorker';

import CssBaseline    from '@material-ui/core/CssBaseline'; // ?? should be centrally baselined ?? unsure if it is doing something (if any, very minimal)
import Button         from '@material-ui/core/Button';


function App() {
  const spinMsg = 'WowZee WooWoo ... Now is the time for every good man to come to the aid of his country.';
  return (
    <React.Fragment>
      <Notify/>
      <CssBaseline/>
      <SplashScreen msg={spinMsg}/>
      <p>
        notify ...
        <Button onClick={()=>notify({
            msg: 'my notify\nNow is the time for every good man to come to the aid of his country ... I really hope this works for a really long line\nnext next line',
            position: 'top-center',
            duration: null, // do this to keep it up (requiring user acknowledgment)
            actions: [
              {
                txt: 'OK',
              },
              {
                txt:    'WowZee',
                action: () => toast.success({msg: 'WowZee: notify CB'}),
              },
              {
                txt:    'WooWoo',
                action: () => toast.success({msg: 'WooWoo: notify CB'}),
              }
            ]
          })}>notify()</Button>
      </p>
      <p>
        toast ...
        <Button onClick={()=>toast.success({msg: 'success toast'})}>success</Button>
        <Button onClick={()=>toast.info(   {msg: 'info toast'   })}>info</Button>
        <Button onClick={()=>toast.warn(   {msg: 'warn toast'   })}>warn</Button>
        <Button onClick={()=>toast.error({
            msg: 'error toast',
            actions: [
              {
                txt: 'OK',
              },
              {
                txt:    'WowZee',
                action: () => toast.success({msg: 'WowZee: error toast CB'}),
              },
              {
                txt:    'WooWoo',
                action: () => toast.success({msg: 'WooWoo: error toast CB'}),
              }
            ]
          })}>error</Button>
      </p>
      <p>
        alert ...
        <Button onClick={()=>alert.success({msg: 'success alert'})}>success</Button>
        <Button onClick={()=>alert.info(   {msg: 'info alert'   })}>info</Button>
        <Button onClick={()=>alert.warn(   {msg: 'warn alert'   })}>warn</Button>
        <Button onClick={()=>alert.error(  {msg: 'error alert'  })}>error</Button>
      </p>
      <p>
        confirm ...
        <Button onClick={()=>confirm.success({msg: 'success confirm', actions:[{txt:'Okey Dokey'}]})}>success</Button>
        <Button onClick={()=>confirm.info(   {msg: 'info confirm',    actions:[{txt:'Okey Dokey'}]})}>info</Button>
        <Button onClick={()=>confirm.warn(   {msg: 'warn confirm',    actions:[{txt:'Okey Dokey'}]})}>warn</Button>
        <Button onClick={()=>confirm.error(  {msg: 'error confirm',   actions:[{txt:'Okey Dokey'}]})}>error</Button>
      </p>
    </React.Fragment>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
