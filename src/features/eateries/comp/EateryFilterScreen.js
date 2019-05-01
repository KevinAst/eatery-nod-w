import React                 from 'react';

import withState             from 'util/withState';
import {withStyles}          from '@material-ui/core/styles';
import withMobileDialog      from '@material-ui/core/withMobileDialog';

import eateryFilterFormMeta  from '../eateryFilterFormMeta';
import ITextField            from 'util/iForms/comp/ITextField';
import IRadioField           from 'util/iForms/comp/IRadioField';

import Button                from '@material-ui/core/Button';
import CloseIcon             from '@material-ui/icons/Close';
import Dialog                from '@material-ui/core/Dialog';
import DialogContent         from '@material-ui/core/DialogContent';
import DialogContentText     from '@material-ui/core/DialogContentText';
import DialogTitle           from '@material-ui/core/DialogTitle';
import FilterIcon            from '@material-ui/icons/FilterList';
import FormHelperText        from '@material-ui/core/FormHelperText';
import Grid                  from '@material-ui/core/Grid';
import IconButton            from '@material-ui/core/IconButton';
import InProgress            from '@material-ui/core/LinearProgress';  // -or- '@material-ui/core/CircularProgress';
import Typography            from '@material-ui/core/Typography';
import {TransitionSlide}     from 'util/Transition';


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
 * EateryFilterScreen: gather filter information (selection criteria) 
 * for our eatery pool view.
 */
function EateryFilterScreen({iForm, fullScreen, classes}) {

  const formLabel       = iForm.getLabel();
  const formInProcess   = iForm.inProcess();
  const sortOrderRadioProps = {
    fieldName: 'sortOrder',
    iForm,
  };

  const formErrMsg = iForm.getMsg();

  return (
    <Dialog open={true}
            onClose={iForm.handleClose}
            fullScreen={fullScreen}
            TransitionComponent={TransitionSlide}>

      <form onSubmit={iForm.handleProcess}>

        <DialogTitle disableTypography className={classes.titleBar}>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            {formLabel}
          </Typography>
          <IconButton color="inherit" onClick={iForm.handleClose}>
            <CloseIcon/>
          </IconButton>
        </DialogTitle>

        <DialogContent>

          <DialogContentText className={classes.entry}>
            filter your pool with these settings ...
          </DialogContentText>

          <div className={classes.entry}>
            <ITextField fieldName="distance"
                        iForm={iForm}
                        autoFocus
                        type="number"
                        helperText="prune entries within this distance (leave blank to view entire pool)"/>
          </div>

          <div className={classes.entry}>
            <IRadioField {...sortOrderRadioProps}
                         row
                         helperText="sort entries by Restaurant (name) or Distance">
              <IRadioField.Op value="name"     label="Restaurant" {...sortOrderRadioProps}/>
              <IRadioField.Op value="distance" label="Distance" {...sortOrderRadioProps}/>
            </IRadioField>
          </div>

          <div className={classes.entry}>
            <CenterItems>
              <Button type="submit"
                      variant="contained"
                      color="primary">
                <FilterIcon className={classes.icon}/>
                Filter Pool
              </Button>
            </CenterItems>
          </div>

          {formErrMsg && (
             <div className={classes.entry}>
               <FormHelperText error>{formErrMsg}</FormHelperText>
             </div>
           )}

          {formInProcess && (
             <div className={classes.entry}>
               <InProgress className={classes.inProgress} color="secondary"/>
             </div>
           )}

        </DialogContent>

      </form>

    </Dialog>
  );
}

const EateryFilterScreenWithState = withState({
  component: EateryFilterScreen,
  mapStateToProps(appState) {
    return {
      formState: eateryFilterFormMeta.formStateSelector(appState),
    };
  },
  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
    //...stateProps,    // unneeded (in this case) ... wonder: does this impact connect() optimization?
    //...dispatchProps, // ditto
      iForm: eateryFilterFormMeta.IForm(stateProps.formState, 
                                        dispatchProps.dispatch),
    };
  },
});

const EateryFilterScreenWithStyles = withStyles(styles)(EateryFilterScreenWithState);

// inject responsive `fullScreen` true/false prop based on screen size
// ... breakpoint screen size: xs, sm (DEFAULT), md, lg, xl
export default withMobileDialog({breakpoint: 'xs'})(EateryFilterScreenWithStyles);
