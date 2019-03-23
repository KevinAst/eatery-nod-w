import React        from 'react';
import withState    from '../../../util/withState';
import PropTypes    from 'prop-types';
import {Body,
        Button,
        Container,
        Content,
        Form,
        Icon,
        Header,
        Spinner,
        Text,
        Title,
        View}         from 'native-base';
import commonStyles   from '../../commonStyles';
import signInFormMeta from '../signInFormMeta';
import ITextField     from '../../../util/iForms/comp/ITextField';
import {toast}        from '../../../util/notify';

/**
 * SignInScreen: gather user sign-in credentials.
 */
function SignInScreen({iForm}) {

  const verticalSpacing = <View style={{paddingVertical: 10}}/>;

  const formLabel     = iForm.getLabel();
  const formInProcess = iForm.inProcess();

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Body>
          <Title>Eatery Nod - {formLabel}</Title>
        </Body>
      </Header>
      <Content keyboardShouldPersistTaps="handled">
       <Form>

         {verticalSpacing}

         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
           <Text>Welcome to Eatery Nod, please {formLabel}!</Text>
         </View>

         {verticalSpacing}

         <ITextField fieldName="email"
                     iForm={iForm}
                     placeholder="jon.snow@gmail.com"
                     keyboardType="email-address"/>

         <ITextField fieldName="pass"
                     iForm={iForm}
                     secureTextEntry/>

         {verticalSpacing}

         {/* form msg  */}
         <Text style={{color:'red'}}>{iForm.getMsg()}</Text>

         <Button success full onPress={iForm.handleProcess} disabled={formInProcess}>
           <Icon name="log-in"/>
           <Text>{formLabel}</Text>
         </Button>

         {verticalSpacing}

         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
           <Text>  ... don&apos;t have an account?  </Text>
           <Button transparent
                   onPress={()=>toast({ msg:'Sign Up has not yet been implemented.' })}
                   disabled={formInProcess}>
             <Icon name="log-in"/>
             <Text>Sign Up</Text>
           </Button>
         </View>

        {/* inProcess spinner  */}
        {formInProcess && <Spinner color="blue"/>}

       </Form>
      </Content>
    </Container>
  );
}

SignInScreen.propTypes = {
  iForm: PropTypes.object.isRequired,
};

export default /* ?? SignInScreenWithState = */ withState({
  component: SignInScreen,
  mapStateToProps(appState) {
    return {
      formState: signInFormMeta.formStateSelector(appState),
    };
  },
  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
    //...stateProps,    // unneeded (in this case) ... wonder: does this impact connect() optimization?
    //...dispatchProps, // ditto
      iForm: signInFormMeta.IForm(stateProps.formState, 
                                  dispatchProps.dispatch),
    };
  },
});
