import React         from 'react';

import {notify,
        toast,
        alert,
        confirm}     from '../../../../../util/notify';

import Divider       from '@material-ui/core/Divider';
import ListItem      from '@material-ui/core/ListItem';
import ListItemIcon  from '@material-ui/core/ListItemIcon';
import ListItemText  from '@material-ui/core/ListItemText';
import MsgIcon       from '@material-ui/icons/LowPriority';


/**
 * SandboxLeftNavItem: our Sandbox entry into the LeftNav.
 */
export default function SandboxLeftNavItem() {

  // render our menu item

  return (
    <>

    {/* Sandbox "toast" tests */}
    <Divider/>
    <ListItem>
      <ListItemText primary="sandbox toasts ... "/>
    </ListItem>
    {doTest("success", ()=>toast.success({msg: 'success toast'}) )}
    {doTest("info",    ()=>toast.info   ({msg: 'info toast'}) )}
    {doTest("warn",    ()=>toast.warn   ({msg: 'warn toast'}) )}
    {doTest("error",   ()=>toast.error  ({
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
       ],
     }) )}

    {/* Sandbox "alert" tests */}
    <Divider/>
    <ListItem>
      <ListItemText primary="sandbox alerts ... "/>
    </ListItem>
    {doTest("success", ()=>alert.success({msg: 'success alert'}) )}
    {doTest("info",    ()=>alert.info   ({msg: 'info alert'}) )}
    {doTest("warn",    ()=>alert.warn   ({msg: 'warn alert'}) )}
    {doTest("error",   ()=>alert.error  ({
       msg: 'error alert',
       actions: [
         {
           txt: 'OK',
         },
         {
           txt:    'WowZee',
           action: () => alert.success({msg: 'WowZee: error alert CB'}),
         },
         {
           txt:    'WooWoo',
           action: () => alert.success({msg: 'WooWoo: error alert CB'}),
         }
       ],
     }) )}

    {/* Sandbox "confirm" tests */}
    <Divider/>
    <ListItem>
      <ListItemText primary="sandbox confirms ... "/>
    </ListItem>
    {doTest("success", ()=>confirm.success({msg: 'success confirm', actions:[{txt:'Okey Dokey'}] }) )}
    {doTest("info",    ()=>confirm.info   ({msg: 'info confirm'   , actions:[{txt:'Okey Dokey'}] }) )}
    {doTest("warn",    ()=>confirm.warn   ({msg: 'warn confirm'   , actions:[{txt:'Okey Dokey'}] }) )}
    {doTest("error",   ()=>confirm.error  ({msg: 'error confirm'  , actions:[{txt:'Okey Dokey'}] }) )}



    {/* Sandbox "notify" tests */}
    <Divider/>
    <ListItem>
      <ListItemText primary="sandbox raw notifies ... "/>
    </ListItem>
    {doTest("notify",   ()=> notify({
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
       ],
     }) )}

    </>
  );
}

const doTest = (label, cb) => (
  <ListItem button
            onClick={cb}>
    <ListItemIcon><MsgIcon/></ListItemIcon>
    <ListItemText primary={label}/>
  </ListItem>
);
