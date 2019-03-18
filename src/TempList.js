import React         from 'react';

import withStyles    from '@material-ui/core/styles/withStyles';

import AppLayout     from './util/layout/AppLayout';
import SplashScreen  from './util/SplashScreen';

import Typography    from '@material-ui/core/Typography';

import ListItemIcon  from '@material-ui/core/ListItemIcon';
import EateryIcon    from '@material-ui/icons/Restaurant';

import List          from '@material-ui/core/List';
import ListItem      from '@material-ui/core/ListItem';
import ListItemText  from '@material-ui/core/ListItemText';

import {toast}       from './util/notify';

const listStyles = (theme) => ({
  list: {
  },
});

const showEateryDetail = () => toast.warn({msg: 'showing selected eatery'});

const myListItems = (num) => { // convenience list item builder (for demo purposes only)
  const myList = [];
  for (let i=0; i<num; i++) { 
    myList.push((
      <ListItem key={`list-item-${i+1}`}
                dense
                button
                divider
                onClick={showEateryDetail}>
        <ListItemIcon>
          <EateryIcon/>
        </ListItemIcon>
        <ListItemText 
            primary={
              <Typography component="span"
                        variant="h6"
                        noWrap>
                        {`Eatery ${i+1}`}
              </Typography>
                    }
            secondary={
              <Typography component="span"
                        variant="subtitle1"
                        noWrap>
                        {`Address ${i+1}-a`}
              </Typography>
                      }/>
      </ListItem>
    ));
  }
  return myList;
};

function TempList({classes}) {

  const [splashVisible, setSplashVisible] = React.useState(false); // KJB: WowZee ANOTHER HOOK!

  function showSplashScreen() {
    setSplashVisible(true);
  }

  return (
    <AppLayout title="Pool List Test">
      <List className={classes.list}>

        <ListItem key="show-SplashScreen"
                  dense
                  button
                  divider
                  onClick={showSplashScreen}>
          <ListItemText primary="Show SplashScreen"/>
        </ListItem>

        {myListItems(50)}
      </List>

      {splashVisible &&
       <SplashScreen msg="This is a test.  I hope it works! Currently I am NOT configured to turn off this Splash :-("/>}
    </AppLayout>
  );
}

export default withStyles(listStyles)(TempList);
