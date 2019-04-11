import React             from 'react';

import withState         from '../../../util/withState';
import {withStyles}      from '@material-ui/core/styles';
import withMobileDialog  from '@material-ui/core/withMobileDialog';

import signInFormMeta    from '../signInFormMeta';
import ITextField        from '../../../util/iForms/comp/ITextField';
import {toast}           from '../../../util/notify';

import Button            from '@material-ui/core/Button';
import Dialog            from '@material-ui/core/Dialog';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle       from '@material-ui/core/DialogTitle';
import FormHelperText    from '@material-ui/core/FormHelperText';
import Grid              from '@material-ui/core/Grid';
import InProgress        from '@material-ui/core/LinearProgress';  // -or- '@material-ui/core/CircularProgress';
import SignInIcon        from '@material-ui/icons/ExitToApp';
import Typography        from '@material-ui/core/Typography';
import {TransitionZoom}  from '../../../util/Transition';

const styles = theme => ({

  titleBar: {
    display:         'flex',
    alignItems:      'center', // vertically align title text with close (X) to it's right (leave this even though we do NOT have a close in this dialog)
    padding:         '10px 15px',
    color:           theme.palette.common.white,
    backgroundColor: theme.palette.primary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
  },

  title: {
    flexGrow: 1, // moves right-most toolbar items to the right
  },

  entry: {
    margin:   '30px 0px',
  },

  // our fieldset is strictly strictly to disable all inputs/submit when form is in-process
  invisible: {
    border:  '0 none',
    margin:  0,
    padding: 0,
  },

  icon: {
    marginRight: theme.spacing.unit,
  },
  
  inProgress: {
    margin: theme.spacing.unit * 4,
  },

});


/**
 * SignInScreen: gather user sign-in credentials.
 */
function SignInScreen({iForm, fullScreen, classes}) {

  const formLabel     = iForm.getLabel();
  const formInProcess = iForm.inProcess();
  const formErrMsg    = iForm.getMsg();

  return (
    <Dialog open={true}
            fullScreen={fullScreen}
            TransitionComponent={TransitionZoom}>

      <DialogTitle disableTypography className={classes.titleBar}>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Eatery Nod - {formLabel}
        </Typography>
      </DialogTitle>

      <DialogContent>

        <form onSubmit={iForm.handleProcess}>
          <fieldset className={classes.invisible} disabled={formInProcess}>

            <DialogContentText className={classes.entry}>
              Welcome to Eatery Nod ... please {formLabel}!
            </DialogContentText>

            <div className={classes.entry}>
              <ITextField fieldName="email"
                          iForm={iForm}
                          autoFocus
                          type="email"
                          placeholder="jon.snow@gmail.com"
                          helperText="your email is your ID"/>
            </div>

            <div className={classes.entry}>
              <ITextField fieldName="pass"
                          iForm={iForm}
                          type="password"/>
            </div>

            <Grid container direction="row" justify="flex-end" alignItems="center">
              <Button type="submit"
                      variant="contained"
                      color="primary">
                <SignInIcon className={classes.icon}/>
                {formLabel}
              </Button>
            </Grid>
            <FormHelperText error>{formErrMsg}</FormHelperText>

            {formInProcess && (
               <div className={classes.entry}>
                 <InProgress className={classes.inProgress} color="secondary"/>
               </div>
             )}

      <div className={classes.entry}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Typography variant="body2" color="secondary">
            ... don't have an account?
          </Typography>
          <Button variant="contained"
                  color="secondary"
                  onClick={()=>toast.warn({ msg:'Sign Up has not yet been implemented.' })}>
            <SignInIcon className={classes.icon}/>
            Sign Up
          </Button>
        </Grid>
      </div>

          </fieldset>
        </form>

      </DialogContent>

    </Dialog>
  );

}

const SignInScreenWithState = withState({
  component: SignInScreen,
  mapStateToProps(appState) {
    return {
      formState: signInFormMeta.formStateSelector(appState),
    };
  },
  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      //...stateProps,    // unneeded (in this case) ... wonder: does this impact connect() optimization?
      //...dispatchProps, // ditto
      iForm: signInFormMeta.IForm(stateProps.formState, 
                                  dispatchProps.dispatch),
    };
  },
});

const SignInScreenWithStyles = withStyles(styles)(SignInScreenWithState);

// inject responsive `fullScreen` true/false prop based on screen size
// ... breakpoint screen size: xs, sm (DEFAULT), md, lg, xl
export default withMobileDialog({breakpoint: 'sm'})(SignInScreenWithStyles);
