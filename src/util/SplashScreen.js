import React, {useState} from 'react';
import PropTypes         from 'prop-types';

import {makeStyles}      from '@material-ui/core/styles';
import {useForCellPhone} from 'util/responsiveBreakpoints';

import Progress          from '@material-ui/core/LinearProgress';  // -or- '@material-ui/core/CircularProgress';
import Dialog            from '@material-ui/core/Dialog';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogTitle       from '@material-ui/core/DialogTitle';
import Typography        from '@material-ui/core/Typography';
import {TransitionZoom}  from 'util/Transition';


/**
 * A modal SplashScreen used when there is nothing else to display :-)
 *
 * The SplashScreen will responsively/dynamically utilize the full
 * screen for cell phone devices.
 *
 * The SplashScreen can be instantiated with a direct message to display:
 * ```js
 * <SplashScreen msg="hello world"/>
 * ```
 * 
 * In support of the programmatic API, a single SplashScreen must be statically
 * instantiated in the root of your DOM (without any msg):
 * ```js
 * <SplashScreen/>
 * ```
 *
 * Supporting the following programmatic API:
 * ```js
 *   + splash(msg): void ... display the supplied msg in the programmatic SplashScreen
 *   + splash(): void    ... clear the programmatic SplashScreen
 * ```
 */
export default function SplashScreen({msg}) {

  const isCellPhone = useForCellPhone();
  const classes     = useStyles();

  // conditionally render SplashScreenProgrammatic when NO msg is supplied
  return msg ? <SplashScreenCommon msg={msg} open={true} fullScreen={isCellPhone} classes={classes} />
             : <SplashScreenProgrammatic                 fullScreen={isCellPhone} classes={classes} />;
}

SplashScreen.propTypes = {
  msg: PropTypes.string,
};

SplashScreen.defaultProps = {
  msg: '',
};

const useStyles = makeStyles( theme => ({
  title: {
    color:           theme.palette.common.white,
    backgroundColor: theme.palette.primary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
  },

  progress: {
    margin: theme.spacing(4),
  },
}) );


// ***
// *** Our programmatic API (see docs above)
// ***

// <SplashScreenProgrammatic fullScreen= classes= />
function SplashScreenProgrammatic({fullScreen, classes}) {

  // maintain our programmatic state ... the msg to display
  const [msg, setMsg] = useState('');

  // broaden the scope of our msg setter (used in our `splash(msg)` programmatic API)
  if (_setMsg && _setMsg!==setMsg) { // validate that only one instance exists
    throw new Error('***ERROR*** <SplashScreen/> (supporting the programmatic `splash(msg)` API) should only be instantiated ONE TIME (in the app root DOM)');
  }
  _setMsg = setMsg; // THIS should work ... no need for: _setMsg = useCallback((msg) => setMsg(msg),  []);

  // render our component
  return <SplashScreenCommon msg={msg} open={msg ? true : false} fullScreen={fullScreen} classes={classes} />;
}

// our programmatic API
export function splash(msg='') {
  // implement in terms of <SplashScreenProgrammatic> state
  if (!_setMsg) {
    throw new Error('***ERROR*** the programmatic `splash(msg)` API requires <SplashScreen/> be instantiated in the app root DOM');
  }
  _setMsg(msg);
}
let _setMsg = null; // expose our inner function


// ***
// *** Our "common" rendering agent shared by BOTH `<SplashScreen>` and `<SplashScreenProgrammatic>`
// ***

// <SplashScreenCommon msg= open= fullScreen= classes= />
function SplashScreenCommon({msg, open, fullScreen, classes}) {
  return (
    <Dialog open={open}
            fullScreen={fullScreen}
            TransitionComponent={TransitionZoom}>
      
      <DialogTitle className={classes.title}>
        <center className={classes.title}>Eatery Nod</center>
      </DialogTitle>
      
      <DialogContent>
        <center>
          <br/>
          <img width="120px" src='/eatery.png' alt='eatery-nod'/>
          <br/>
          <Progress className={classes.progress} color="secondary"/>
          <Typography variant="body2">{msg}</Typography>
          <br/>
        </center>
      </DialogContent>
      
    </Dialog>
  );
}
