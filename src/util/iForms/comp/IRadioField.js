import React             from 'react';

import Radio             from '@material-ui/core/Radio';
import RadioGroup        from '@material-ui/core/RadioGroup';
import FormHelperText    from '@material-ui/core/FormHelperText';
import FormControlLabel  from '@material-ui/core/FormControlLabel';
import FormControl       from '@material-ui/core/FormControl';
import FormLabel         from '@material-ui/core/FormLabel';

import PropTypes         from 'prop-types';
import verify            from 'util/verify';

/**
 * An IForm radio container input element that:
 *   - defines a common visualization,
 *   - manifests validation messages,
 *   - interfacing with IForm (accessors, and handlers)
 *
 * PROPS:
 *   - fieldName:     (a string) the iForm field name
 *   - iForm:         (an IFormMeta) the iFormMeta object in control
 *   - row:           (a boolean) to format buttons in a row (default column)
 *   - helperText:    (a string) to display help user text (default none)
 *   - children:      (<IRadioField.Op>) the radio options to select from
 *   - ...extraProps: (...any) injected directly into <FormControl>
 *                    ex: variant="standard"/"outlined"/"filled" ... AI: currently doesn't work
 *
 * NOTE: Unlike text input, radios always expose validation msgs (i.e. they
 *       are NOT dynamically injected based on touches).
 *       ... HOWEVER: validation is seldomly shown 
 *                    because of the controlled nature of the radio!
 *
 * Usage:
 *   const radioProps = {fieldName: 'myFieldName', iForm};
 *   ...
 *   <IRadioField {...radioProps} row helperText="... help text here">
 *     <IRadioField.Op value="1" label="One" {...radioProps}/>
 *     <IRadioField.Op value="2" label="Two" {...radioProps}/>
 *   </IRadioField>
 */
export default function IRadioField({fieldName, iForm, row, helperText, children, ...extraProps}) {

  // validate properties
  const check = verify.prefix('<IRadioField> property violation: ')

  // ... fieldName
  check(fieldName, 'fieldName is required');

  // ... iForm
  check(iForm, 'iForm is required');
  check(iForm.handleFieldTouched, `iForm prop MUST be an IFormMeta object ... in fieldName: '${fieldName}'`); // NOTE: duck type check

  // ... fieldName must be defined in iForm
  const fieldLabel = iForm.getLabel(fieldName);
  check(fieldLabel, `supplied fieldName '${fieldName}' does NOT exist in the supplied iForm: '${iForm.getLabel()}'`);

  // ... row
  if (row) { // when supplied
    check(row===true || row===false, `row must be a boolean (true/false) ... in fieldName: '${fieldName}'`);
  }
  const rowProp = row ? true : false; // normalize (defaulting to false)

  // ... helperText (just let PropTypes validate)

  // ... insure NO clashes with props we use internally
  //     NOTE: we allow helperText to be supplied (and overwrite on error situations)
  //     NOTE: currently have NONE (commented out)
  // ['have', 'none', 'for', 'now'].forEach(
  //   (prop) => check(!extraProps[prop], `'${prop}' prop cannot be used (it is managed internally) ... for fieldName: '${fieldName}'`)
  // );

  // compute field success/error adornments
  let   msgDom       = null; // optional DOM displaying helperText -or- field validation message
  const managedProps = {};   // NOTE: currently assumed to go in <FormControl>
  const fieldMsg     = iForm.getMsg(fieldName);   // null/undefined for NO msg (i.e. valid/clean)
  if (fieldMsg) { // error adornment
    managedProps.error = true;
    msgDom  = <FormHelperText>{fieldMsg}</FormHelperText>
  }
  else if (helperText) {
    msgDom  = <FormHelperText>{helperText}</FormHelperText>
  }

  // emit IRadioField
  return (
    <FormControl {...extraProps} {...managedProps}>
      <FormLabel>{fieldLabel}</FormLabel>
      <RadioGroup name={fieldName}
                  row={rowProp}
                  value={iForm.getValue(fieldName)}>
        {children}
      </RadioGroup>
      {msgDom}
    </FormControl>
  );
}

IRadioField.propTypes = {
  fieldName:    PropTypes.string.isRequired,
  iForm:        PropTypes.any.isRequired,
  row:          PropTypes.bool,
  helperText:   PropTypes.string,
  children:     PropTypes.node.isRequired, // IRadioField content is required (i.e. the IRadioField.Op's)
};



IRadioField.Op = function ({fieldName, iForm, value, label}) {
  const handleFieldChanged = () => iForm.handleFieldChanged(fieldName, value);
  // NOTE: <FormControlLabel> is used as a drop-in-replacement of Radio/Switch/Checkbox DISPLAYING an extra label
  return (
    <FormControlLabel value={value}
                      control={<Radio/>}
                      label={label}
                      checked={value===iForm.getValue(fieldName)}
                      onChange={handleFieldChanged}/>
  );
}

IRadioField.Op.propTypes = {
  fieldName:    PropTypes.string.isRequired,
  iForm:        PropTypes.any.isRequired,
  value:        PropTypes.string.isRequired,
  label:        PropTypes.string.isRequired,
};
