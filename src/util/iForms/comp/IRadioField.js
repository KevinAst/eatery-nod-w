import React        from 'react';
import {View}       from 'react-native';
import {Item,
        Label,
        Icon,
        Radio,
        Right,
        Text}       from 'native-base';
import PropTypes    from 'prop-types';
import verify       from '../../verify';

/**
 * An IForm radio container input element that:
 *   - defines a common visualization,
 *   - manifests validation messages,
 *   - interfacing with IForm (accessors, and handlers)
 *
 * NOTE: Unlike text input, radios always expose validation msgs (i.e. they
 *       are NOT dynamicly injected based on touches).
 *
 * Usage:
 *   const radioProps = {fieldName: 'myFieldName', iForm};
 *   ...
 *   <IRadioField {...radioProps}>
 *     <IRadioField.Op value="1" label="One" {...radioProps}/>
 *     <IRadioField.Op value="2" label="Two" {...radioProps}/>
 *   </IRadioField>
 */
export default function IRadioField({fieldName, iForm, children}) {

  const fieldLabel   = iForm.getLabel(fieldName);
  verify(fieldLabel, `<IRadioField> supplied fieldName '${fieldName}' is NOT recognized for the supplied iForm: '${iForm.getLabel()}'`);

  // compute field success/error adornments
  let   iconDom        = null; // optional DOM for error/success icon
  let   msgDom         = null; // optional DOM displaying field validation message
  const itemExtraProps = {};
  const fieldMsg       = iForm.getMsg(fieldName);   // null/undefined for NO msg (i.e. valid/clean)
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

  // emit IRadioField
  return (
    <View>
      <Item fixedLabel {...itemExtraProps}>
        <Label>{fieldLabel}</Label>
        {children}
        {iconDom}
      </Item>
      {msgDom}
    </View>
  );
}

IRadioField.propTypes = {
  fieldName:    PropTypes.string.isRequired,
  iForm:        PropTypes.any.isRequired,
};

IRadioField.Op = function ({fieldName, iForm, value, label}) {
  const handleFieldChanged = () => iForm.handleFieldChanged(fieldName, value);
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: 0}}>
      <Radio selected={value===iForm.getValue(fieldName)}
             onPress={handleFieldChanged}/>
      <Text note
            style={{paddingRight: 20, paddingLeft: 5}}
            onPress={handleFieldChanged}>
        {label}
      </Text>
    </View>
  );
}

IRadioField.Op.propTypes = {
  fieldName:    PropTypes.string.isRequired,
  iForm:        PropTypes.any.isRequired,
  value:        PropTypes.string.isRequired,
  label:        PropTypes.string.isRequired,
};
