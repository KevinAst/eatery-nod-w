import React             from 'react';

import {useSelector,
        useDispatch}     from 'react-redux'
import {makeStyles}      from '@material-ui/core/styles';
import {useForCellPhone} from 'util/responsiveBreakpoints';

import signInFormMeta    from '../signInFormMeta';
import ITextField        from 'util/iForms/comp/ITextField';
import {toast}           from 'util/notify';

import Avatar            from '@material-ui/core/Avatar';
import Button            from '@material-ui/core/Button';
import Dialog            from '@material-ui/core/Dialog';
import DialogContent     from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle       from '@material-ui/core/DialogTitle';
import FormHelperText    from '@material-ui/core/FormHelperText';
import InProgress        from '@material-ui/core/LinearProgress';  // -or- '@material-ui/core/CircularProgress';
import LockIcon          from '@material-ui/icons/LockOpen';
import SignInIcon        from '@material-ui/icons/ExitToApp';
import Typography        from '@material-ui/core/Typography';
import {TransitionZoom}  from 'util/Transition';
import CenterItems       from 'util/CenterItems';


/**
 * SignInScreen: gather user sign-in credentials.
 */
export default function SignInScreen() {

  const dispatch    = useDispatch();
  const formState   = useSelector((appState) => signInFormMeta.formStateSelector(appState), []);
  const isCellPhone = useForCellPhone();
  const classes     = useStyles();

  const iForm = signInFormMeta.IForm(formState, dispatch); // AI: unsure if I should wrap in useMemo()

  const formLabel     = iForm.getLabel();
  const formInProcess = iForm.inProcess();
  const formErrMsg    = iForm.getMsg();

  return (
    <Dialog open={true}
            fullScreen={isCellPhone}
            TransitionComponent={TransitionZoom}>

      <DialogTitle disableTypography className={classes.titleBar}>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Eatery Nod
        </Typography>
      </DialogTitle>

      <DialogContent>

        <form onSubmit={iForm.handleProcess}>
          <fieldset className={classes.invisible} disabled={formInProcess}>

            <CenterItems>
              <Avatar className={classes.lockAvatar}>
                <LockIcon/>
              </Avatar>
            </CenterItems>
            <CenterItems>
              <Typography variant="h6" noWrap>
                {formLabel}
              </Typography>
            </CenterItems>

            <DialogContentText className={classes.entry}>
              Welcome to Eatery Nod ... please {formLabel}!
            </DialogContentText>

            <div className={classes.entry}>
              <ITextField fieldName="email"
                          iForm={iForm}
                          autoFocus
                          required
                          fullWidth
                          type="email"
                          placeholder="jon.snow@gmail.com"
                          helperText="your email is your ID"/>
            </div>

            <div className={classes.entry}>
              <ITextField fieldName="pass"
                          iForm={iForm}
                          required
                          fullWidth
                          type="password"/>
            </div>

            <CenterItems>
              <Button type="submit"
                      variant="contained"
                      color="primary">
                <SignInIcon className={classes.icon}/>
                {formLabel}
              </Button>
            </CenterItems>
            <FormHelperText error>{formErrMsg}</FormHelperText>

            {formInProcess && (
               <div className={classes.entry}>
                 <InProgress className={classes.inProgress} color="secondary"/>
               </div>
             )}

            <div className={classes.entry}>
              <CenterItems>
                <Typography variant="body2" color="secondary">
                  ... don't have an account?
                </Typography>
              </CenterItems>
              <CenterItems>
                <Button variant="contained"
                        color="secondary"
                        onClick={()=>toast.warn({ msg:'Sign Up has not yet been implemented.' })}>
                  <SignInIcon className={classes.icon}/>
                  Sign Up
                </Button>
              </CenterItems>
            </div>

          </fieldset>
        </form>

      </DialogContent>

    </Dialog>
  );

}


const useStyles = makeStyles( theme => ({
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
    margin:          theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
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
    marginRight: theme.spacing(1),
  },
  
  inProgress: {
    margin: theme.spacing(4),
  },

}) );
