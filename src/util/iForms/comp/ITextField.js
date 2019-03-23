import React        from 'react';
import {View}       from 'react-native';
import {Item,
        Label,
        Icon,
        Input,
        Right,
        Text}       from 'native-base';
import PropTypes    from 'prop-types';
import verify       from '../../verify';

/**
 * An IForm text input element that:
 *   - defines a common visualization,
 *   - manifests validation messages,
 *   - interfacing with IForm (accessors, and handlers)
 *
 * Usage:
 *   <ITextField fieldName="myFieldName"
 *               iForm={IForm}
 *               ... extra props from native-base Input comp
 *                   EX:
 *                   placeholder='John'
 *                   keyboardType='email-address'
 *                   secureTextEntry
 */
export default function ITextField({fieldName, iForm, ...inputExtraProps}) {

  const fieldLabel   = iForm.getLabel(fieldName);
  verify(fieldLabel, `<ITextField> supplied fieldName '${fieldName}' is NOT recognized for the supplied iForm: '${iForm.getLabel()}'`);
  const fieldValue   = iForm.getValue(fieldName);
  const fieldValidationIsExposed = iForm.isValidationExposed(fieldName);

  // compute field success/error adornments, dynamically exposed based field touches
  let   iconDom = null; // optional DOM for error/success icon
  let   msgDom  = null; // optional DOM displaying field validation message
  const itemExtraProps = {};

  if (fieldValidationIsExposed) {
    const fieldMsg = iForm.getMsg(fieldName);   // null/undefined for NO msg (i.e. valid/clean)
    if (fieldMsg) { // error adornment
      itemExtraProps.error = true;
      iconDom = <Icon name="close-circle"/>;
      // NOTE: had to use <View> with style (for some reason, <Item> usage errors in middleware
      msgDom  = <View style={{flexDirection: 'row', paddingRight: 10}}>
                  <Right>
                    <Text style={{color:'red'}}>{fieldMsg}</Text>
                  </Right>
                </View>;
    }
    else {  // success adornment
      itemExtraProps.success = true;
      iconDom = <Icon name="checkmark-circle"/>;
    }
  }

  // emit ITextField
  // console.log(`?? field: '${fieldName}', inputExtraProps: `, inputExtraProps);
  return (
    <View>
      <Item fixedLabel {...itemExtraProps}>
        <Label>{fieldLabel}</Label>
        <Input value={fieldValue}
               editable={!iForm.inProcess()}
               onChangeText={(txt) => iForm.handleFieldChanged(fieldName, txt)}
               onEndEditing={()    => iForm.handleFieldTouched(fieldName)}
               {...inputExtraProps}/>
        {iconDom}
      </Item>
      {msgDom}
    </View>
  );
}

ITextField.propTypes = {
  fieldName:    PropTypes.string.isRequired,
  iForm:        PropTypes.any.isRequired,
};
