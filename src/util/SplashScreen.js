import React, {useState} from 'react';
import PropTypes         from 'prop-types';

import {makeStyles}      from '@material-ui/core/styles';
import {useForCellPhone} from 'util/responsiveBreakpoints';

import Button            from '@material-ui/core/Button';
import Progress          from '@material-ui/core/LinearProgress';  // -or- '@material-ui/core/CircularProgress';
import Dialog            from '@material-ui/core/Dialog';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogTitle       from '@material-ui/core/DialogTitle';
import Typography        from '@material-ui/core/Typography';
import {TransitionZoom}  from 'util/Transition';
import {alert}           from 'util/notify';


/**
 * A modal SplashScreen used when there is nothing else to display :-)
 *
 * The SplashScreen will responsively/dynamically utilize the full
 * screen for cell phone devices.
 *
 * The SplashScreen can be instantiated with a direct message to display:
 * ```js
 * <SplashScreen msg="hello world" [err={error}]/>
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
 *   + splash(msg, [err]): void ... display the supplied msg/err in the programmatic SplashScreen
 *   + splash(): void           ... clear the programmatic SplashScreen
 * ```
 */
export default function SplashScreen({msg, err}) {

  const isCellPhone = useForCellPhone();
  const classes     = useStyles();

  // conditionally render SplashScreenProgrammatic when NO msg is supplied
  return msg ? <SplashScreenCommon msg={msg} err={err} open={true} fullScreen={isCellPhone} classes={classes}/>
             : <SplashScreenProgrammatic                           fullScreen={isCellPhone} classes={classes}/>;
}

SplashScreen.propTypes = {
  msg: PropTypes.string,
  err: PropTypes.object,
};

SplashScreen.defaultProps = {
  msg: '',
  err: null,
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

  // maintain our programmatic state ... the msg/err to display
  const [splashState, setSplashState] = useState({
    msg: '',
    err: null,
  });

  // broaden the scope of our splashState setter (used in our `splash(msg, [err])` programmatic API)
  if (_setSplashState && _setSplashState!==setSplashState) { // validate that only one instance exists
    throw new Error('***ERROR*** <SplashScreen/> (supporting the programmatic `splash(msg, [err])` API) should only be instantiated ONE TIME (in the app root DOM)');
  }
  _setSplashState = setSplashState; // THIS should work ... no need for: _setSplashState = useCallback(...);

  // render our component
  return <SplashScreenCommon msg={splashState.msg} err={splashState.err} open={splashState.msg ? true : false} fullScreen={fullScreen} classes={classes} />;
}

// our programmatic API
export function splash(msg='', err=null) {
  // implement in terms of <SplashScreenProgrammatic> state
  if (!_setSplashState) {
    throw new Error('***ERROR*** the programmatic `splash(msg, [err])` API requires <SplashScreen/> be instantiated in the app root DOM');
  }
  _setSplashState({msg, err});
}
let _setSplashState = null; // expose our inner function


// ***
// *** Our "common" rendering agent shared by BOTH `<SplashScreen>` and `<SplashScreenProgrammatic>`
// ***

let _errLastReported = null;

// <SplashScreenCommon msg= open= fullScreen= classes= />
function SplashScreenCommon({msg, err, open, fullScreen, classes}) {

  // setup any error rendering constructs
  const errCntl = !err ? null : (
    <>
      <br/>
      <Typography variant="subtitle2" color="secondary">Encountered ERROR: {err.formatUserMsg()}</Typography>
      <Button variant="contained" color="secondary" onClick={handleErr}>
        <Typography variant="subtitle2">Show Detail</Typography>
      </Button>
    </>
  );
  function handleErr() {
    alert.error({ msg: `An unexpected error occurred:

${err}

If this problem persists, please contact your tech support.`
    });
  }

  // when supplied, log the details of the error (with traceback) for tech review
  // NOTE 1: we refrain from using console.warn() and console.error() 
  //         because of BAD semantics inferred by react-native/expo:
  //          - console.warn():  generates yellow popup
  //          - console.error(): kills app with "red screen of death"
  // NOTE 2: react-native/expo appears to be doing something non standard
  //         when passing error as the 2nd parameter of log():
  //             log('msg', error)
  //         ... in this case is merely emitting error.toString()
  //         ... we can however receive a stack trace by calling log(error) as the first parameter
  if (err && err !== _errLastReported) {
    _errLastReported = err;
    const prefix = err.isUnexpected() ? '*** Unexpected Error:\n\n' : '*** Expected Error:\n\n';
    console.log(prefix + err);
    if (err.isUnexpected()) { // produce stack traces only for unexpected errors
      console.log('Stack Trace ...');
      console.log(err);
    }
  }

  // render our component
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
          {errCntl}
          <br/>
        </center>
      </DialogContent>
      
    </Dialog>
  );
}
