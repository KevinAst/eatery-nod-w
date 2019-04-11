import React            from 'react';
import PropTypes        from 'prop-types';

import {withFassets}    from 'feature-u';
import {withStyles}     from '@material-ui/core/styles';
import withState        from '../../../util/withState';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import _eateriesAct     from '../actions';

import CloseIcon        from '@material-ui/icons/Close';
import Dialog           from '@material-ui/core/Dialog';
import DialogActions    from '@material-ui/core/DialogActions';
import DialogContent    from '@material-ui/core/DialogContent';
import DialogTitle      from '@material-ui/core/DialogTitle';
import IconButton       from '@material-ui/core/IconButton';
import Link             from '@material-ui/core/Link';
import LinkIcon         from '@material-ui/icons/Link';
import List             from '@material-ui/core/List';
import ListItem         from '@material-ui/core/ListItem';
import ListItemIcon     from '@material-ui/core/ListItemIcon';
import ListItemText     from '@material-ui/core/ListItemText';
import NavigationIcon   from '@material-ui/icons/Navigation';
import PhoneIcon        from '@material-ui/icons/Phone';
import SpinIcon         from '@material-ui/icons/SwapCalls';
import Typography       from '@material-ui/core/Typography';
import {TransitionZoom} from '../../../util/Transition';

const styles = theme => ({
  titleBar: {
    display:         'flex',
    alignItems:      'center', // vertically align title text with close (X) to it's right
    padding:         '10px 15px',
    color:           theme.palette.common.white,
    backgroundColor: theme.palette.primary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
  },

  title: {
    flexGrow: 1, // moves right-most toolbar items to the right
  },

  bottomBar: {
    color:           theme.palette.common.white,
    backgroundColor: theme.palette.primary.main, // theme.palette.primary.main (bluish) or theme.palette.secondary.main (redish)
  },
});


/**
 * EateryDetailScreen displaying the details of a given eatery.
 */
function EateryDetailScreen({curUser, eatery, handleClose, handleSpin, fullScreen, classes}) {

  return (
    <Dialog open={true}
            onClose={handleClose}
            fullScreen={fullScreen}
            TransitionComponent={TransitionZoom}>

      <DialogTitle disableTypography className={classes.titleBar}>
        
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Eatery
          <Typography color="inherit" inline={true} noWrap>
            &nbsp;({curUser.pool})
          </Typography>
        </Typography>

        <IconButton color="inherit" onClick={handleClose}>
          <CloseIcon />
        </IconButton>

      </DialogTitle>

      <DialogContent>
        <List>

          <ListItem>
            <ListItemText 
                primary={<Typography variant="h6">{eatery.name}</Typography>}/>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <NavigationIcon/>
            </ListItemIcon>
            <ListItemText 
                primary={
                  <Link variant="body1" 
                        href={eatery.navUrl}
                        target="_blank"
                        color="inherit"
                        underline="none">
                    {eatery.addr}
                  </Link>
                }/>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <PhoneIcon/>
            </ListItemIcon>
            <ListItemText 
                primary={
                  <Link variant="body1" 
                        href={`tel:${eatery.phone}`}
                        color="inherit"
                        underline="none">
                    {eatery.phone}
                  </Link>
                }/>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <LinkIcon/>
            </ListItemIcon>
            <ListItemText 
                primary={
                  <Link variant="body1" 
                        href={eatery.website}
                        target="_blank"
                        color="inherit"
                        underline="none">
                    Web: {eatery.website}
                  </Link>
                }/>
          </ListItem>

        </List>
      </DialogContent>

      <DialogActions className={classes.bottomBar}>
        <IconButton color="inherit" onClick={handleSpin}>
          <SpinIcon/>
          <Typography color="inherit" variant="subtitle1">&nbsp;&nbsp;Spin Again</Typography>
        </IconButton>
      </DialogActions>

    </Dialog>
  );
}

EateryDetailScreen.propTypes = {
  eatery:     PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
};

const EateryDetailScreenWithState = withState({
  component: EateryDetailScreen,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      curUser: fassets.sel.curUser(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      handleClose() {
        dispatch( _eateriesAct.viewDetail.close() );
      },
      handleSpin() {
        dispatch( _eateriesAct.spin() );
      },
    };
  },
});

const EateryDetailScreenWithFassets = withFassets({
  component: EateryDetailScreenWithState,
  mapFassetsToProps: {
    fassets: '.', // introduce fassets into props via the '.' keyword
  }
});

const EateryDetailScreenWithStyles = withStyles(styles)(EateryDetailScreenWithFassets);

// inject responsive `fullScreen` true/false prop based on screen size
// ... breakpoint screen size: xs, sm (DEFAULT), md, lg, xl
export default withMobileDialog({breakpoint: 'xs'})(EateryDetailScreenWithStyles);
