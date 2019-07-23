import {toast, alert} from 'util/notify';
import verify         from 'util/verify';

const DYNAMIC_DEFAULT = 'DYNAMIC_DEFAULT';

/**
 * The discloseError() utility provides a standard way to 
 * disclose errors both to the user (toasts) and logs.
 *
 * This utility uses the heuristics defined by the
 * ErrorExtensionPolyfill, and therefore require it to be present.
 *
 * The emission of both user notifications and logs can be controlled,
 * through parameters that dynamically default (based on "expected"
 * vs. "unexpected" error status).
 *
 * All user notifications occur through toasts, and are sanitized:
 *  - showing appropriate user-level detail,
 *  - with more information available via a button click
 *
 * Log formats are also standardized.
 *
 * **Please Note** this function uses named parameters.
 *
 * @param {Error} err the Error object to be disclosed (logged and
 * user-notified).
 *
 * @param {boolean} [showUser=true] an indicator as to whether the
 * user should be shown this error.
 *
 * @param {boolean} [logIt=DYNAMIC_DEFAULT] an indicator as to whether
 * a log entry should be emitted, dynamically defaulted (LOG when err
 * is Unexpected, NO-LOG when Expected).
 */
export default function discloseError({err,
                                       showUser=true,         // DEFAULT: true ................. i.e. always SHOW
                                       logIt=DYNAMIC_DEFAULT, // DEFAULT: err.isUnexpected() ... i.e. LOG when Unexpected, NO-LOG when Expected
                                       ...unknownArgs}={}) {

  // validate parameters
  try {
    const check = verify.prefix('discloseError() parameter violation: ')
    // ... err
    check(err,           'err is required');
    check(err instanceof Error, 'err must be an Error object, NOT: ', err);
    // ... showUser
    showUser = showUser===DYNAMIC_DEFAULT ? err.isExpected() : showUser; // dynamic DEFAULT semantics
    check(showUser===true || showUser===false, 'showUser must be a boolean');
    // ... logIt
    logIt = logIt===DYNAMIC_DEFAULT ? err.isUnexpected() : logIt; // dynamic DEFAULT semantics
    check(logIt===true || logIt===false, 'logIt must be a boolean');
    // ... unrecognized named parameter
    const unknownArgKeys = Object.keys(unknownArgs);
    check(unknownArgKeys.length === 0,  `unrecognized named parameter(s): ${unknownArgKeys}`);
    // ... unrecognized positional parameter (NOTE: when defaulting entire struct, arguments.length is 0)
    check(arguments.length === 0 || arguments.length === 1, 'unrecognized positional parameters (only named parameters can be specified)');
  }
  // NOTE: this handler CANNOT throw an error, 
  //       because it is typically used inside a promise.catch()
  //       which will generate an "Unhandled promise rejection"
  catch(e) {
    console.log('YIKES ... eatery-nod-w\'s discloseError() was attempting to report on err: ', err);
    console.log('HOWEVER AN INVOCATION PROBLEM was detected in the parameters passed to discloseError()!\n' +
                '... discloseError() CANNOT throw an error (when used in a promise an "Unhandled promise rejection" will result)!!\n' +
                '... PLEASE FIX THE FOLLOWING INVOCATION PROBLEM: ', e);
    return; // cannot throw(e) ... see log (above)
  }

  // show user when requested
  if (showUser) {
    // unexpended errors display as error toasts with additional details link
    if (err.isUnexpected()) {
      toast.error({  // ... will auto close -OR- when "details" is clicked
        msg: err.formatUserMsg(),
        actions: [
          { txt:    'details',
            action: () => {
              alert.error({ msg: `An unexpected error occurred:

${err}

If this problem persists, please contact your tech support.`
              });
            }},
        ]
      });
    }

    // expended errors display as warning toasts with NO additional detail
    else {
      toast.warn({  // ... will auto close
        msg: err.formatUserMsg()
      });
    }
        
  }

  // generate log entry when requested
  if (logIt) {

    // log the details of the error (with traceback) for tech review
    // NOTE 1: we refrain from using console.warn() and console.error() 
    //         because of BAD semantics inferred by react-native/expo:
    //          - console.warn():  generates yellow popup
    //          - console.error(): kills app with "red screen of death"
    // NOTE 2: react-native/expo appears to be doing something non standard
    //         when passing error as the 2nd parameter of log():
    //             log('msg', error)
    //         ... in this case is merely emitting error.toString()
    //         ... we can however receive a stack trace by calling log(error) as the first parameter
    const prefix = err.isUnexpected() ? '*** Unexpected Error:\n\n' : '*** Expected Error:\n\n';
    console.log(prefix + err);
    if (err.isUnexpected()) { // produce stack traces only for unexpected errors
      console.log('Stack Trace ...');
      console.log(err);
    }
  }

}
