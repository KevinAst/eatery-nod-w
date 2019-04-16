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
        View}                  from 'native-base';
import commonStyles            from '../../commonStyles';
import discoveryFilterFormMeta from '../discoveryFilterFormMeta';
import ITextField              from '../../../util/iForms/comp/ITextField';
import IRadioField             from '../../../util/iForms/comp/IRadioField';


/**
 * DiscoveryFilterScreen: gather filter information (selection criteria) 
 * for a discovery retrieval.
 */
function DiscoveryFilterScreen({iForm}) {

  const verticalSpacing = <View style={{paddingVertical: 10}}/>;

  const formLabel       = iForm.getLabel();
  const formInProcess   = iForm.inProcess();
  const priceRadioProps = {
    fieldName: 'minprice',
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
            <Text style={{fontStyle: 'italic'}}>filter your discovery with these settings ...</Text>
          </View>

          {verticalSpacing}

          <ITextField fieldName="searchText"
                      iForm={iForm}
                      placeholder="... restaurant or town"
                      keyboardType="default"/>
          <Note>   ... optional - suggest a restaurant or town</Note>

          <ITextField fieldName="distance"
                      iForm={iForm}
                      placeholder="... enter 1-30"
                      keyboardType="numeric"/>
          <Note>   ... enter 1-30</Note>

          {verticalSpacing}

          <IRadioField {...priceRadioProps}>
            <IRadioField.Op value="0" label="0" {...priceRadioProps}/>
            <IRadioField.Op value="1" label="1" {...priceRadioProps}/>
            <IRadioField.Op value="2" label="2" {...priceRadioProps}/>
            <IRadioField.Op value="3" label="3" {...priceRadioProps}/>
            <IRadioField.Op value="4" label="4" {...priceRadioProps}/>
          </IRadioField>
          <Note>   ... most affordable to most expensive</Note>

          {verticalSpacing}

          {/* form msg  */}
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

DiscoveryFilterScreen.propTypes = {
  iForm: PropTypes.object.isRequired,
};

export default DiscoveryFilterScreenWithState = withState({
  component: DiscoveryFilterScreen,
  mapStateToProps(appState) {
    return {
      formState: discoveryFilterFormMeta.formStateSelector(appState),
    };
  },
  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
    //...stateProps,    // unneeded (in this case) ... wonder: does this impact connect() optimization?
    //...dispatchProps, // ditto
      iForm: discoveryFilterFormMeta.IForm(stateProps.formState, 
                                           dispatchProps.dispatch),
    };
  },
});
