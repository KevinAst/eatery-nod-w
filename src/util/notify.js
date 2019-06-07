import React              from 'react';
import verify             from 'util/verify';
import {SnackbarProvider,
        withSnackbar}     from 'notistack';
import {makeStyles}       from '@material-ui/core/styles';
import Button             from "@material-ui/core/Button";
import isString           from 'lodash.isstring';
import isFunction         from 'lodash.isfunction';

/* eslint-disable react/jsx-pascal-case */  // for: <NotifyAPI_withSnackBar>

/**
 * The Notify component provides user notifications through a visual
 * message dialog.
 *
 * User messages are initiated through a programmatic invocation,
 * using the functional notify() API.  Supplied directives support
 * a variety of scenarios, including:
 *   - action buttons (for acknowledgment, or confirmation, etc.)
 *   - timed closure of the message
 *   - msg levels of success, info, warn, error (impacting the dialog style/color)
 *   - modal and non-modal
 *
 * Notify is the fundamental component which is the basis of various
 * UI notifications (i.e. Toasts, Alerts, Confirmations, etc.).  It
 * can be used stand-alone, or indirectly through various wrappers
 * (promoted through named exports).  The following functions are
 * summarized as follows:
 *
 * ```
 *                                                                 auto-close         variant-color      screen           ??TODO client
 *                 params:                         msg             duration           level              position         modal  actions
 *                 ============================    ==============  =================  =================  ===============  =====  ==========================
 *   - notify .... ({msg,                          msg to display  1-20 seconds       'success': green   'top-left'       false  [ {txt, [action]}, ... ]
 *                   duration=5,                   ... supports    null: close        'info':    blue    'top-center'     true   - where action: () => void
 *                   level='success',                  cr/lf             via          'warn':    yellow  'top-right'             - actions ARE OPTIONAL
 *                   position='bottom-left',                             client       'error':   red     'bottom-left'           - ALL actions auto close
 *                   modal=false,                                        action                          'bottom-center'  
 *                   actions=[]})                                        DEFAULT: OK                     'bottom-right'
 *                   
 *   - toast ..... ({msg, duration=5, actions})                    ditto              via toast.xyz()    'bottom-left'    false  ditto
 *   - alert ..... ({msg, actions})                                null               via alert.xyz()    'top-center'     true   ditto
 *   - confirm ... ({msg, actions})                                null               via confirm.xyz()  'top-right'      true   requires client action(s)
 * ```
 *
 * **Setup**:
 *
 *   The Notify component is tightly controlled as a single instance
 *   within an entire app.  Therefore, one and only one Notify
 *   instance must be pre-instantiated (initially hidden) somewhere at
 *   the top-level of your app.
 *
 *     ```
 *       <React.Fragment>
 *         <Notify/>
 *         {app content}
 *       </React.Fragment>

 *       -or-
 *       <Notify>
 *         {app content}
 *       <Notify>
 *     ```
 * 
 * **Usage**:
 * 
 *   see docs below: `notify()`, `toast()`, `alert()`, `confirm()`
 * 
 * **Module Note**:
 *
 *   This utility is housed in a lower-case `notify.js` module,
 *   because the general public API is a series of lower-case "named
 *   exported" functions: `notify()`, `toast()`, `alert()`,
 *   `confirm()`.
 * 
 *   There is a "default exported" Notify component (which is somewhat
 *   unusual to find in a lower-case module), but is only used once at
 *   app startup, so is therefore justified (in this case).
 */

//***
//*** the top-level Notify component conveniently auto-injects the notistack <SnackbarProvider>
//*** (required for our programmatic interface)
//***

export default function Notify(props) {

  const classes = useStyles();

  return (
    <SnackbarProvider maxSnack={3} dense={true} className={classes.variantSuccess}>
      <NotifyAPI_withSnackBar>
        {props.children}
      </NotifyAPI_withSnackBar>
    </SnackbarProvider>
  );
}

// apply snackbar variant style changes in support cr/lf
// ... via: whiteSpace of 'pre-line'
// ... this honors cr/lf within our snackbar items
const useStyles = makeStyles( theme => ({
  variantSuccess: {
    whiteSpace: 'pre-line',
  },
  variantInfo: {
    whiteSpace: 'pre-line',
  },
  variantWarning: {
    whiteSpace: 'pre-line',
  },
  variantError: {
    whiteSpace: 'pre-line',
  },
}) );


//***
//*** keep track of our one-and-only instance
//***

let _singleton = null;


//***
//*** the NotifyAPI component provides our internal programmatic API
//*** (see .display()), used by notify(), toast(), etc.
//***

class NotifyAPI extends React.Component {

  static propTypes = { // expected component props
  }

  constructor(...args) {
    super(...args);

    // keep track of our one-and-only instance
    verify(!_singleton, '<Notify> only ONE Notify instance should be instantiated in the app (at the top-level).');
    _singleton = this;
  }

  // display() is the interface point to our programmatic API (notify(), toast(), etc.)
  display({msg,
           duration=5, // auto close duration in seconds ... DEFAULT: 5 ... use null - manual close (via actions [default to OK])
           level='success',
           position='bottom-left',
           modal=false,
           actions=[],
           ...unknownArgs}={}) {

    // validate the named parameters (i.e. the directive)
    const check = verify.prefix('notify() parameter violation: '); // NOTE: we pretend we are: notify() (the public access point)

    // ... msg
    check(msg, 'directive.msg is required');
    check(isString(msg),  'msg must be a string');

    // ... duration
    if (duration !== null) {
      check(duration >= 1 && duration <= 20, `supplied duration (${duration}) must be a number between 1 and 20 (inclusive).`);
    }

    // ... level
    check(levelVariant[level], `invalid level: '${level}', expecting one of ${Object.keys(levelVariant)}.`);

    // ... position
    check(anchorOrigin[position], `invalid position: '${position}', expecting one of ${Object.keys(anchorOrigin)}.`);

    // ... modal
    check(modal===true || modal===false, `supplied modal (${modal}) must be a boolean true/false.`);

    // ... actions
    check(actions,                'actions must be an Action[] array'); // defaulted to [] ... this is user error of like null or something
    check(Array.isArray(actions), 'actions must be an Action[] array');
    actions.forEach( (action, indx) => {
      check(action.txt,           `action[${indx}].txt is required`);
      check(isString(action.txt), `action[${indx}].txt be a string ... NOT: ${action.txt}`);
      if (action.action) {
        check(isFunction(action.action), `action[${indx}].action (when supplied) must be a function ... NOT: ${action.action}`);
      }
    });

    // ... unknown args
    const unknownArgKeys = Object.keys(unknownArgs);
    check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);

    // maintain our display duration
    const autoHideDuration = duration ? duration*1000 : null; // convert to seconds ... null indicates manual close (via actions [default to OK])

    // interpret any client-supplied actions

    // ... provide a default OK when NO duration and NO actions are defined
    //     NOTE: When NO duration is supplied, only way to close notification is through an action!
    //           If client has NO actions, we will supply one (a default OK)
    if (!duration && actions.length===0) {
      actions = [{txt: 'OK'}]; // do NOT mutate client-supplied actions
    }

    // ... maintain a actions callback map indexed by .txt (default to identityFn)
    const actionsCbMap = actions.reduce( (map, action) => {
      map[action.txt] = action.action || identityFn;
      return map;
    }, {} );
    // ... define our actionButtons (supplied to enqueueSnackbar) ... empty array is ignored
    const actionButtons = actions.map( (action, indx) => <Button key={indx} color="default" size="small">{action.txt}</Button> );


    // KEY: display the notification ... using notistack's enqueueSnackbar(...)
    const snackbarKey = this.props.enqueueSnackbar(msg, {
      variant: levelVariant[level],
      autoHideDuration,
      anchorOrigin: anchorOrigin[position],
      action: actionButtons,
      onClickAction: (e) => {
        // close this notification
        this.props.closeSnackbar(snackbarKey);

        // invoke client-supplied callback
        // ... on delay to make any client-notification transitions more intuitive
        const clientAction = actionsCbMap[e.target.textContent];
        setTimeout( () => clientAction(), 400);
      },
    });

  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}

// our level variant (indirectly defines color -and- provides level validation)
const levelVariant = { // color NOT used
  success: 'success',
  info:    'info',
  warn:    'warning',
  error:   'error',
};

// our anchorOrigin, indexed by position keyword
const anchorOrigin = {
  'top-left':      { vertical: 'top',    horizontal: 'left'   },
  'top-center':    { vertical: 'top',    horizontal: 'center' },
  'top-right':     { vertical: 'top',    horizontal: 'right'  },
  'bottom-left':   { vertical: 'bottom', horizontal: 'left'   },
  'bottom-center': { vertical: 'bottom', horizontal: 'center' },
  'bottom-right':  { vertical: 'bottom', horizontal: 'right'  },
};

// a convenient identity function
const identityFn = (p)=>p;


//***
//*** the withSnackbar() HOC provides access to the Snackbar run-time methods:
//***   + props.enqueueSnackbar(...)
//***   + props.closeSnackbar(...)
//*** 

const NotifyAPI_withSnackBar = withSnackbar(NotifyAPI);
NotifyAPI_withSnackBar.displayName = 'NotifyAPI_withSnackBar'; // ... for react debugging (NOT accomplished in withSnackbar() ... grrrrr)



/**
 * Display a user notification - the general purpose access point,
 * using named directives.
 *
 * @param {string} directive.msg the message to be displayed (cr/lf
 * are supported).
 *
 * @param {number} [directive.duration] the number of seconds to
 * display the msg before automatically closing the dialog.  If not
 * supplied, the dialog must be explicitly closed through a button
 * click.
 *
 * @param {string} [directive.level] the category level associated
 * with this notification (impacting background color).  One of:
 *  - 'success' ... the default
 *  - 'info'
 *  - 'warn'
 *  - 'error'
 *
 * @param {string} [directive.position] the position to display this
 * notification. One of:
 *  - 'top-left'
 *  - 'top-center'
 *  - 'top-right'
 *  - 'bottom-left' ... the default
 *  - 'bottom-center'
 *  - 'bottom-right'
 *
 * @param {boolean} [directive.modal] an indicator as to whether the
 * notification dialog is modal (true) or not (false) the default.
 *
 * @param {Action[]} [directive.actions] one or more actions -
 * button/action combinations.  The required Action.txt defines the
 * button label, and the Action.action is an option client-supplied
 * callback.  Each defined action will implicitly close the dialog,
 * in addition to invoking the optional client-supplied callback.
 *
 * NOTE: When NO duration and NO actions are defined, a default OK 
 *       action is injected that will close the dialog when clicked.
 *
 * Example:
 * ```
 *   notify({
 *     msg:      'You have un-saved changes.\nif you leave, your changes will NOT be saved!',
 *     duration: seconds,
 *     level:    'warn',
 *     position: 'bottom-right',
 *     modal:    true,
 *     actions: [
 *       { txt: 'Discard Changes', action: () => ...callback-logic-here... },
 *       { txt: 'Go Back' }
 *     ]
 *   });
 * ```
 */
export function notify(directive) {
  // validate that an <Notify> has been instantiated
  verify(_singleton, 'notify(): NO <Notify> instance has been established in the app root.');

  // pass-through to our instance method
  _singleton.display(directive);
}


/**
 * The toast() function is a convenience wrapper around notify() that
 * displays the supplied msg as a "toast" ... a non-modal dialog
 * located at the bottom-left of the screen, which is typically closed
 * after 5 seconds.
 *
 * Various levels can be accomplished via toast.success(),
 * toast.info(), toast.warn(), toast.error() ... all of which have the
 * same signature.  NOTE: toast() is the same as toast.success().
 *
 * @param {string} directive.msg the message to be displayed (cr/lf are
 * supported).
 *
 * @param {number} [directive.duration] the number of seconds before
 * automatically closing the dialog (default: 5).  A null defers to
 * supplied actions to close (which in turn defaults to an OK).
 *
 * @param {Action[]} [directive.actions] one or more actions -
 * button/action combinations.  The required Action.txt defines the
 * button label, and the Action.action is an option client-supplied
 * callback.  Each defined action will implicitly close the dialog,
 * in addition to invoking the optional client-supplied callback.
 *
 * NOTE: When NO duration and NO actions are defined, a default OK 
 *       action is injected that will close the dialog when clicked.
 *
 * Example:
 * ```
 *
 *   toast({ msg:'Hello World' });    // will close in 6 secs
 *
 *   toast.error({ msg:     `An error occurred: ${err}`, 
 *                 duration: null }); // OK button will close
 *
 *   toast.warn({                     // will close in 3 secs -OR- when "undo" is clicked
 *     msg: 'Your item was deleted', 
 *     actions: [
 *       { txt: 'undo', action: () => ...callback-logic-here... },
 *     ]
 *    })
 * ```
 */
function toastBase({msg, duration=5, actions, ...unknownArgs}, level) {

  // validate toast-specific characteristics (other validation done by notify())
  const funcQual = level ? `.${level}` : '';
  const check    = verify.prefix(`toast${funcQual}() parameter violation: `);

  // NOTE: as a general rule, validations are provided by the root notify()
  // checking msg explicitly avoids unknownArgKeys weirdness (below) when msg is passed as a non-named param
  check(msg, 'msg named parameter is required');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);

  // defer to our general-purpose notify() utility
  notify({
    msg,
    duration,
    level,    // NOTE: level is defaulted by the root notify()
    position: 'bottom-left',
    modal: false,
    actions,
  });
}
export function  toast(directive) { toastBase(directive);          }
toast.success  = function(directive) { toastBase(directive, 'success'); }
toast.info     = function(directive) { toastBase(directive, 'info');    }
toast.warn     = function(directive) { toastBase(directive, 'warn');    }
toast.error    = function(directive) { toastBase(directive, 'error');   }


/**
 * The alert() function is a convenience wrapper around notify() that
 * displays the supplied msg as a "alert" ... a modal dialog located
 * at the top-center of the screen, that must be acknowledged by the
 * user with either the default OK button, or a client-supplied
 * action.
 *
 * Various levels can be accomplished via alert.success(),
 * alert.info(), alert.warn(), alert.error() ... all of which have the
 * same signature.  NOTE: alert() is the same as alert.success().
 *
 * @param {string} directive.msg the message to be displayed (cr/lf
 * are supported).
 *
 * @param {Action[]} [directive.actions] one or more actions -
 * button/action combinations.  The required Action.txt defines the
 * button label, and the Action.action is an option client-supplied
 * callback.  Each defined action will implicitly close the dialog,
 * in addition to invoking the optional client-supplied callback.
 *
 * NOTE: When NO actions are defined, a default OK  action is injected
 *       that will close the dialog when clicked.
 *
 * Example:
 * ```
 *   alert({ msg:'Hello World' });
 *   alert.warn({
 *     msg:`Your limit (${limit}) has been reached!`
 *     actions: [
 *       { txt: 'increase', action: () => ...callback-logic-here... },
 *     ]
 *   });
 * ```
 */
function alertBase({msg, actions, ...unknownArgs}, level) {

  // validate alert-specific characteristics (other validation done by notify())
  const funcQual = level ? `.${level}` : '';
  const check    = verify.prefix(`alert${funcQual}() parameter violation: `);

  // NOTE: as a general rule, validations are provided by the root notify()
  // checking msg explicitly avoids unknownArgKeys weirdness (below) when msg is passed as a non-named param
  check(msg, 'msg named parameter is required');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);

  // defer to our general-purpose notify() utility
  notify({
    msg,
    duration: null, // force user acknowledgment
    level,          // NOTE: level is defaulted by the root notify()
    position: 'top-center',
    modal: true,
    actions,
  });
}
export function  alert(directive) { alertBase(directive);          }
alert.success  = function(directive) { alertBase(directive, 'success'); }
alert.info     = function(directive) { alertBase(directive, 'info');    }
alert.warn     = function(directive) { alertBase(directive, 'warn');    }
alert.error    = function(directive) { alertBase(directive, 'error');   }


/**
 * The confirm() function is a convenience wrapper around notify()
 * that displays the supplied msg as a "confirmation" ... a modal
 * dialog located at the bottom-right of the screen, that must be
 * acknowledged through client-supplied action buttons.
 *
 * Various levels can be accomplished via confirm.success(),
 * confirm.info(), confirm.warn(), confirm.error() ... all of which
 * have the same signature.  NOTE: confirm() is the same as
 * confirm.success().
 *
 * @param {string} directive.msg the message to be displayed (cr/lf
 * are supported).
 *
 * @param {Action[]} directive.actions one or more actions - button/action
 * combinations.  The required Action.txt defines the button label,
 * and the Action.action is an option client-supplied callback.  Each
 * defined action will implicitly close the dialog, in addition to
 * invoking the optional client-supplied callback.
 *
 * Example:
 * ```
 *   confirm.warn({ 
 *     msg: 'This is an confirm warning.\nYou must explicitly acknowledge it.', 
 *     actions: [
 *       { txt: 'Discard Changes', action: () => console.log('xx Discarding Changes') },
 *       { txt: 'Go Back' }
 *     ]
 *   });
 * ```
 */
function confirmBase({msg, actions, ...unknownArgs}, level) {

  // validate confirm-specific characteristics (other validation done by notify())
  const funcQual = level ? `.${level}` : '';
  const check    = verify.prefix(`confirm${funcQual}() parameter violation: `);

  // NOTE: as a general rule, validations are provided by the root notify()
  // checking msg explicitly avoids unknownArgKeys weirdness (below) when msg is passed as a non-named param
  check(msg, 'msg named parameter is required');

  // confirm() requires client-supplied actions
  check(actions && actions.length>0, 'client-specific actions are required.');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);

  // defer to our general-purpose notify() utility
  notify({
    msg,
    duration: null, // force user acknowledgment
    level,          // NOTE: level is defaulted by the root notify()
    position: 'top-right',
    modal: true,
    actions,
  });
}
export function  confirm(directive) { confirmBase(directive);          }
confirm.success  = function(directive) { confirmBase(directive, 'success'); }
confirm.info     = function(directive) { confirmBase(directive, 'info');    }
confirm.warn     = function(directive) { confirmBase(directive, 'warn');    }
confirm.error    = function(directive) { confirmBase(directive, 'error');   }
