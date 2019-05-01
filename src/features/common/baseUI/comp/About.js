import React         from 'react';

import {alert}       from 'util/notify';

import Divider       from '@material-ui/core/Divider';
import UserMenuItem  from 'features/common/baseUI/comp/UserMenuItem';


/**
 * About: display info about this app (gleaned from package.json)
 */
export default function About() {
  return (
    <>
      <Divider/>
      <UserMenuItem onClick={showAbout}>About</UserMenuItem>
    </>
  );
}

function showAbout() {
  alert.success({
    msg: `${process.env.REACT_APP_NAME}\n\n${process.env.REACT_APP_DESCRIPTION}\n\nversion: ${process.env.REACT_APP_VERSION}`,
    actions: [
      { txt: 'Docs',    action: () => window.open(process.env.REACT_APP_ABOUTDOCS, '_blank') },
      { txt: 'History', action: () => window.open(process.env.REACT_APP_ABOUTHIST, '_blank') },
      { txt: 'Close' },
    ]
  });
}
