import React         from 'react';

import {alert}       from 'util/notify';

import Divider       from '@material-ui/core/Divider';
import UserMenuItem  from 'features/common/baseUI/comp/UserMenuItem';


/**
 * About: display info about this app (gleaned from package.json)
 *
 * NOTE: These env vars require the following .env file (in your project root per CRA):
 *
 *   .env
 *   ====
 *   REACT_APP_NAME=$npm_package_name
 *   REACT_APP_VERSION=$npm_package_version
 *   REACT_APP_DESCRIPTION=$npm_package_description
 *   REACT_APP_ABOUT_DOCS=$npm_package_about_docs
 *   REACT_APP_ABOUT_HIST=$npm_package_about_hist
 *
 * NOTE: Because this is a "custom" component that is held in Menu
 *       (a ButtonBase MenuItem) it must be able to hold a ref ... hence
 *       the React.forwardRef()!
 *       see: https://material-ui.com/guides/migration-v3/#button
 *            https://material-ui.com/guides/composition/#caveat-with-refs
 *            AVOIDS following log:
 *            Warning: Function components cannot be given refs. Attempts to access
 *                     this ref will fail. Did you mean to use React.forwardRef()?
 * NOTE: Subsequent Discovery: I think this is really due to the fact that
 *       we were injecting <Divider/> too!
 *       This React.forwardRef() was NOT needed in src/features/common/auth/comp/AuthUserMenu.js,
 *       where it simply injected a series of <UserMenuItem>s in a React.Fragment ... hmmmm
 */
const About = React.forwardRef( (props, ref) => (
  <span {...props} ref={ref}>
    <Divider/>
    <UserMenuItem onClick={showAbout}>About ...</UserMenuItem>
  </span>
) );
export default About;

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
