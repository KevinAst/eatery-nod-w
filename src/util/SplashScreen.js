import React            from 'react';
import PropTypes        from 'prop-types';

import {makeStyles,
        useTheme}       from '@material-ui/core/styles';
import useMediaQuery    from '@material-ui/core/useMediaQuery';

import Progress         from '@material-ui/core/LinearProgress';  // -or- '@material-ui/core/CircularProgress';
import Dialog           from '@material-ui/core/Dialog';
import DialogContent    from '@material-ui/core/DialogContent';
import DialogTitle      from '@material-ui/core/DialogTitle';
import Typography       from '@material-ui/core/Typography';
import {TransitionZoom} from 'util/Transition';


/**
 * A modal SplashScreen used when there is nothing else to display :-)
 *
 * The SplashScreen will responsively/dynamically utilize the full
 * screen for cell phone devices.
 *
 * NOTE: Currently we dynamically size based on the message content,
 *       within the constraint of the screen.  Not sure if I like
 *       this or not ... it is good for cell phones, but can be rather
 *       small for browsers (typically the message is pretty small).
 *       FYI: This is pretty much the default behavior of <Dialog>.
 *            I spend a small amount of time to override this without
 *            any success.
 */
export default function SplashScreen({msg}) {

  const theme      = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes    = useStyles();

  return (
    <Dialog open={true}
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
