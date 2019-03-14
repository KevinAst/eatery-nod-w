import React        from 'react';
import Button       from '@material-ui/core/Button';
import Typography   from '@material-ui/core/Typography';
import {notify,
        toast,
        alert,
        confirm}    from './util/notify';
import SplashScreen from './util/SplashScreen';

export default function TempJunk() {
  const spinMsg = 'WowZee WooWoo ... Now is the time for every good man to come to the aid of his country.';
  return (
    <React.Fragment>

      <SplashScreen msg={spinMsg}/>

      <Typography variant="body1">
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
      </Typography>

      <Typography variant="body1">
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
      </Typography>

      <Typography variant="body1">
        alert ...
        <Button onClick={()=>alert.success({msg: 'success alert'})}>success</Button>
        <Button onClick={()=>alert.info(   {msg: 'info alert'   })}>info</Button>
        <Button onClick={()=>alert.warn(   {msg: 'warn alert'   })}>warn</Button>
        <Button onClick={()=>alert.error(  {msg: 'error alert'  })}>error</Button>
      </Typography>

      <Typography variant="body1">
        confirm ...
        <Button onClick={()=>confirm.success({msg: 'success confirm', actions:[{txt:'Okey Dokey'}]})}>success</Button>
        <Button onClick={()=>confirm.info(   {msg: 'info confirm',    actions:[{txt:'Okey Dokey'}]})}>info</Button>
        <Button onClick={()=>confirm.warn(   {msg: 'warn confirm',    actions:[{txt:'Okey Dokey'}]})}>warn</Button>
        <Button onClick={()=>confirm.error(  {msg: 'error confirm',   actions:[{txt:'Okey Dokey'}]})}>error</Button>
      </Typography>

    </React.Fragment>
  );
}
