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
        Left,
        Right,
        Spinner,
        Text,
        Title,
        View}                from 'native-base';
import commonStyles          from '../../commonStyles';
import eateryFilterFormMeta  from '../eateryFilterFormMeta';
import ITextField            from '../../../util/iForms/comp/ITextField';
import IRadioField           from '../../../util/iForms/comp/IRadioField';

/**
 * EateryFilterScreen: gather filter information (selection criteria) 
 * for our eatery pool view.
 */
function EateryFilterScreen({iForm}) {

  const verticalSpacing = <View style={{paddingVertical: 10}}/>;

  const formLabel       = iForm.getLabel();
  const formInProcess   = iForm.inProcess();
  const sortOrderRadioProps = {
    fieldName: 'sortOrder',
    iForm,
  };


  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent onPress={iForm.handleClose}>
            <Icon name="close"/>
          </Button>
        </Left>
        <Body>
          <Title>{formLabel}</Title>
        </Body>
        <Right>
          <Button transparent onPress={iForm.handleProcess} disabled={formInProcess}>
            <Icon name="paper-plane"/>
          </Button>
        </Right>
      </Header>


      <Content keyboardShouldPersistTaps="handled">
        <Form>

          {verticalSpacing}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
            <Text style={{fontStyle: 'italic'}}>filter your pool with these settings ...</Text>
          </View>

          {verticalSpacing}
          <ITextField fieldName="distance"
                      iForm={iForm}
                      keyboardType="numeric"/>
          <Note>   ... optionally prune entries within this distance</Note>
          <Note>   ... leave blank to view entire pool</Note>

          {verticalSpacing}
          <IRadioField {...sortOrderRadioProps}>
            <IRadioField.Op value="name"     label="Restaurant" {...sortOrderRadioProps}/>
            <IRadioField.Op value="distance" label="Distance" {...sortOrderRadioProps}/>
          </IRadioField>

          {verticalSpacing}

          {/* form msg */}
          <Text style={{color:'red'}}>{iForm.getMsg()}</Text>

          {verticalSpacing}

          {/* inProcess spinner  */}
          {formInProcess && <Spinner color="blue"/>}

        </Form>
      </Content>
    </Container>
  );
}

// convenience Note component (internal usage)
function Note({children}) {
  return (
    <Text note style={{paddingRight: 20, paddingLeft: 20}}>
      {children}
    </Text>
  );
}

EateryFilterScreen.propTypes = {
  iForm: PropTypes.object.isRequired,
};

export default /*??EateryFilterScreenWithState = */ withState({
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
