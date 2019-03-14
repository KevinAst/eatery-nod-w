import React            from 'react';
import PropTypes        from 'prop-types';
import { withStyles }   from '@material-ui/core/styles';
import Typography       from '@material-ui/core/Typography';
import Paper            from '@material-ui/core/Paper';
import AppBar           from '@material-ui/core/AppBar';
import Toolbar          from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({

  paper: {
    marginTop:     theme.spacing.unit * 8,
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    padding:       `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },

  grow: {
    flexGrow: 1,
    // alignItems:    'center',
  },

  favicon: {
    width: '50%', // NOTE: this is 50% of our container (in this case - paper)
  },

  progress: {
    margin: theme.spacing.unit * 2,
  },
});


/**
 * SplashScreen used when there is nothing else to display.
 */
function SplashScreen({msg, classes}) {
  return (
    <Paper className={classes.paper}> {/* ?? may need to be a dialog ... so we can make it full screen (is this true) */}

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            eatery-nod
          </Typography>
        </Toolbar>
      </AppBar>

      <br/><br/><br/>

      <img className={classes.favicon} src='/eatery.png' alt='eatery-nod'/>

      <CircularProgress className={classes.progress} color="secondary"/>

      <Typography variant="body2">
        {msg}
      </Typography>

      {/* test bigger msg
      <Typography variant="body2">
        Now is the time for every good man to come to the aid of his country.
        Now is the time for every good man to come to the aid of his country.
        Now is the time for every good man to come to the aid of his country.
        I hope this works.
        Now is the time for every good man to come to the aid of his country.
        Now is the time for every good man to come to the aid of his country.
        Now is the time for every good man to come to the aid of his country.
      </Typography>
        */}

    </Paper>
  );

}

SplashScreen.propTypes = {
  msg:     PropTypes.string,
  classes: PropTypes.object.isRequired,
};

SplashScreen.defaultProps = {
  msg: '',
};

export default withStyles(styles)(SplashScreen);
