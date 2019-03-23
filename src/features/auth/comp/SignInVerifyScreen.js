import React         from 'react';
import withState     from '../../../util/withState';
import {Body,
        Button,
        Container,
        Content,
        Form,
        Header,
        Icon,
        Text,
        Title,
        View}        from 'native-base';
import PropTypes     from 'prop-types';
import commonStyles  from '../../commonStyles';
import _authAct      from '../actions';
import * as _authSel from '../state';


/**
 * SignInVerifyScreen requesting email verification completion.
 */
function SignInVerifyScreen({email, checkEmailVerified, resendEmailVerification, signOut}) {
  const verticalSpacing = (spacing=10) => <View style={{paddingVertical: spacing}}/>;

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Body>
          <Title>Eatery Nod - Sign In Verification</Title>
        </Body>
      </Header>
      <Content style={{padding: 10}}>

        <Form>

          {verticalSpacing()}

          <Text>
            Your account email has not yet been verified.
          </Text>

          {verticalSpacing()}

          <Text>
            Please follow the instructions from the email sent to: {email}
          </Text>

          {verticalSpacing()}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text>Once completed ... </Text>
            <Button transparent onPress={checkEmailVerified}>
              <Icon name="done-all"/>
              <Text>Continue</Text>
            </Button>
          </View>

          {verticalSpacing(40)}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Button transparent onPress={resendEmailVerification}>
              <Icon name="mail"/>
              <Text>Resend Email</Text>
            </Button>
          </View>

          {verticalSpacing(40)}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Button transparent onPress={signOut}>
              <Icon name="log-out"/>
              <Text>Sign Out</Text>
            </Button>
          </View>

        </Form>

      </Content>
      
    </Container>
  );
}

SignInVerifyScreen.propTypes = {
  email:                   PropTypes.string.isRequired,
  checkEmailVerified:      PropTypes.func.isRequired,
  resendEmailVerification: PropTypes.func.isRequired,
  signOut:                 PropTypes.func.isRequired,
};

export default /* ?? SignInVerifyScreenWithState = */ withState({
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
