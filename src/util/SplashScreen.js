import React         from 'react';
//? import PropTypes     from 'prop-types';
import { withStyles }   from '@material-ui/core/styles';
import Typography       from '@material-ui/core/Typography';
import Paper            from '@material-ui/core/Paper';
import AppBar           from '@material-ui/core/AppBar';
import Toolbar          from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';

//? import commonStyles  from '../../features/commonStyles'; ?? what about this

const styles = theme => ({

  main: {
    width:       'auto',
    display:     'block', // Fix IE 11 issue.
    marginLeft:  theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,

    // ?? play with more breakpoints
    // display size ??UP, limit main width to 400
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width:       400,
      marginLeft:  'auto',
      marginRight: 'auto',
    },
  },

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
  // ?? use Typography in place of <p>
  return (
    <main className={classes.main}> {/* ?? wonder if this should go in root */}

      <Paper className={classes.paper}>

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              eatery-nod
            </Typography>
          </Toolbar>
        </AppBar>

        <br/><br/><br/>

        <img className={classes.favicon} src='/eatery.png' alt='eatery-nod'/>

        {/* ?? color="secondary" */}
        <CircularProgress className={classes.progress}/>

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

    </main>
  );

  // ?? OLD: 
  //? return (
  //?   <Container style={commonStyles.container}>
  //?     <Header>
  //?       <Left/>
  //?       <Body>
  //?         <Title>Eatery Nod</Title>
  //?       </Body>
  //?       <Right/>
  //?     </Header>
  //?     <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
  //?       <Image style={{width: 100, height: 100}}
  //?              source={require("../../../assets/icons/eatery.png")}/>
  //?       <Spinner color="blue"/>
  //?       <Text>{msg}</Text>
  //?     </Content>
  //?   </Container>
  //? );
}

// ?? DO THIS but need to install prop-types util
// ? SplashScreen.propTypes = {
// ?   msg:     PropTypes.string,
// ?   classes: PropTypes.object.isRequired,
// ? };
// ? 
SplashScreen.defaultProps = {
  msg: '',
};

export default withStyles(styles)(SplashScreen);
