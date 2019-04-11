import React             from 'react';

import withState         from '../../../util/withState';
import {withStyles}      from '@material-ui/core/styles';
import withMobileDialog  from '@material-ui/core/withMobileDialog';

import _authAct          from '../actions';
import * as _authSel     from '../state';

import Avatar            from '@material-ui/core/Avatar';
import Button            from '@material-ui/core/Button';
import CheckIcon         from '@material-ui/icons/Check';
import Dialog            from '@material-ui/core/Dialog';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle       from '@material-ui/core/DialogTitle';
import Grid              from '@material-ui/core/Grid';
import LockIcon          from '@material-ui/icons/LockOpen';
import MailIcon          from '@material-ui/icons/Mail';
import SignOutIcon       from '@material-ui/icons/ExitToApp';
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

  lockAvatar: {
    margin:          theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
  },

  entry: {
    margin:   '30px 0px',
  },

  icon: {
    marginRight: theme.spacing.unit,
  },
  
  inProgress: {
    margin: theme.spacing.unit * 4,
  },

});

function CenterItems({children}) {
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      {children}
    </Grid>
  );
}

/**
 * SignInVerifyScreen requesting email verification completion.
 */
function SignInVerifyScreen({email, checkEmailVerified, resendEmailVerification, signOut, fullScreen, classes}) {

  return (
    <Dialog open={true}
            fullScreen={fullScreen}
            TransitionComponent={TransitionZoom}>

      <DialogTitle disableTypography className={classes.titleBar}>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Eatery Nod
        </Typography>
      </DialogTitle>

      <DialogContent>

        <CenterItems>
          <Avatar className={classes.lockAvatar}>
            <LockIcon/>
          </Avatar>
        </CenterItems>
        <CenterItems>
          <Typography variant="h6" noWrap>
            Sign In Verification
          </Typography>
        </CenterItems>

        <DialogContentText className={classes.entry}>
          Your account email has not been verified.
        </DialogContentText>

        <DialogContentText className={classes.entry}>
          Please follow the instructions from the email sent to: {email}
        </DialogContentText>

        <div className={classes.entry}>
          <CenterItems>
            <Typography variant="body2">
              ... once completed:
            </Typography>
          </CenterItems>
          <CenterItems>
            <Button variant="contained"
                    color="primary"
                    onClick={checkEmailVerified}>
              <CheckIcon className={classes.icon}/>
              Continue
            </Button>
          </CenterItems>
        </div>

        <div className={classes.entry}>
          <CenterItems>
            <Button variant="contained"
                    color="secondary"
                    onClick={resendEmailVerification}>
              <MailIcon className={classes.icon}/>
              Resend Email
            </Button>
          </CenterItems>
        </div>

        <div className={classes.entry}>
          <CenterItems>
            <Button variant="contained"
                    color="secondary"
                    onClick={signOut}>
              <SignOutIcon className={classes.icon}/>
              Sign Out
            </Button>
          </CenterItems>
        </div>

      </DialogContent>

    </Dialog>
  );
}

const SignInVerifyScreenWithState = withState({
  component: SignInVerifyScreen,
  mapStateToProps(appState) {
    return {
      email: _authSel.curUser(appState).email,
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      checkEmailVerified() {
        dispatch( _authAct.signIn.checkEmailVerified() );
      },
      resendEmailVerification() {
        dispatch( _authAct.signIn.resendEmailVerification() );
      },
      signOut() {
        dispatch( _authAct.signOut() );
      },
    };
  },
});

const SignInVerifyScreenWithStyles = withStyles(styles)(SignInVerifyScreenWithState);

// inject responsive `fullScreen` true/false prop based on screen size
// ... breakpoint screen size: xs, sm (DEFAULT), md, lg, xl
export default withMobileDialog({breakpoint: 'xs'})(SignInVerifyScreenWithStyles);
