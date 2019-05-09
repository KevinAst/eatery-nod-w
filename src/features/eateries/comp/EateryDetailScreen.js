import React,
       {useCallback}    from 'react';
import PropTypes        from 'prop-types';

import {useFassets}   from 'util/useFassets'; // ?? really 'feature-u'
import {useSelector,
        useDispatch}  from 'react-redux'

import {withStyles}     from '@material-ui/core/styles';
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
import {TransitionZoom} from 'util/Transition';

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
function EateryDetailScreen({eatery, fullScreen, classes}) {

  const fassets = useFassets();
  const curUser = useSelector((appState) => fassets.sel.curUser(appState), [fassets]);

  const dispatch    = useDispatch();
  const handleClose = useCallback(() => dispatch( _eateriesAct.viewDetail.close() ), []);
  const handleSpin  = useCallback(() => dispatch( _eateriesAct.spin() ),             []);

  return (
    <Dialog open={true}
            onClose={handleClose}
            fullScreen={fullScreen}
            TransitionComponent={TransitionZoom}>

      <DialogTitle disableTypography className={classes.titleBar}>
        
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Eatery
          <Typography color="inherit" inline noWrap>
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

          {eatery.website !== 'not-in-search' &&
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
                    Web Site
                  </Link>
                }/>
          </ListItem>
          }

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
};

const EateryDetailScreenWithStyles = withStyles(styles)(EateryDetailScreen);

// inject responsive `fullScreen` true/false prop based on screen size
// ... breakpoint screen size: xs, sm (DEFAULT), md, lg, xl
export default withMobileDialog({breakpoint: 'xs'})(EateryDetailScreenWithStyles);
