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
      <UserMenuItem onClick={showAbout}>About ...</UserMenuItem>
    </>
  );
}

function showAbout() {
  const name    = process.env.REACT_APP_NAME        || 'UNKNOWN name (from package.json: name)';
  const desc    = process.env.REACT_APP_DESCRIPTION || 'UNKNOWN desc (from package.json: description)';
  const ver     = process.env.REACT_APP_VERSION     || 'UNKNOWN (from package.json: version)';
  const docsUrl = process.env.REACT_APP_ABOUT_DOCS;
  const histUrl = process.env.REACT_APP_ABOUT_HIST;

  const msg = `${name}\n\n${desc}\n\nversion: ${ver}`;

  const actions = [];
  if (docsUrl)
    actions.push({ txt: 'Docs',    action: () => window.open(docsUrl, '_blank') });
  if (histUrl)
    actions.push({ txt: 'History', action: () => window.open(histUrl, '_blank') });
  actions.push({ txt: 'Close' });

  alert.success({msg, actions});
}
