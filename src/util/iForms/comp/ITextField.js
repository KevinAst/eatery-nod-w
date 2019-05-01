import React        from 'react';
import TextField    from '@material-ui/core/TextField';
import PropTypes    from 'prop-types';
import verify       from 'util/verify';

/**
 * An IForm text input element that:
 *   - defines a common visualization,
 *   - manifests validation messages,
 *   - interfacing with IForm (accessors, and handlers)
 *
 * Usage:
 *   <ITextField fieldName="myFieldName" ... the IFormMeta fieldName
 *               iForm={IForm}
 *               ... extra props from material-ui TextField comp
 *                   EX:
 *                   autoFocus
 *                   type="number"
 *                   helperText="... help text here"/>
 *                   ... etc.
 */
export default function ITextField({fieldName, iForm, ...extraProps}) {

  // validate properties
  const check = verify.prefix('<ITextField> property violation: ')

  // ... fieldName
  check(fieldName, 'fieldName is required');

  // ... iForm
  check(iForm, 'iForm is required');
  check(iForm.handleFieldTouched, `iForm prop MUST be an IFormMeta object ... in fieldName: '${fieldName}'`); // NOTE: duck type check

  // ... fieldName must be defined in iForm
  const fieldLabel = iForm.getLabel(fieldName);
  check(fieldLabel, `supplied fieldName '${fieldName}' does NOT exist in the supplied iForm: '${iForm.getLabel()}'`);

  // ... insure NO clashes with props we use internally
  //     NOTE: we allow helperText to be supplied (and overwrite on error situations)
  ['label', 'value', 'disabled', 'onChange', 'onBlur', 'error'].forEach(
    (prop) => check(!extraProps[prop], `'${prop}' prop cannot be used (it is managed internally) ... for fieldName: '${fieldName}'`)
  );

  // compute field success/error adornments
  // ... dynamically exposed based on user field touches
  const managedProps = {};
  if (iForm.isValidationExposed(fieldName)) {
    const fieldMsg = iForm.getMsg(fieldName);   // null/undefined for NO msg (i.e. valid/clean)
    if (fieldMsg) { // error adornment
      managedProps.error      = true;     // mark field with error color
      managedProps.helperText = fieldMsg; // overwrite helperText to hold the field error message
    }
  }

  // emit an ITextField that is auto-wired to the supplied iForm
  return (
    <TextField label={fieldLabel}
               value={iForm.getValue(fieldName)}
               disabled={iForm.inProcess()}
               onChange={(event) => iForm.handleFieldChanged(fieldName, event.target.value)}
               onBlur={() => iForm.handleFieldTouched(fieldName)}
               {...extraProps}
               {...managedProps}/>
  );
}

ITextField.propTypes = {
  fieldName:    PropTypes.string.isRequired,
  iForm:        PropTypes.any.isRequired,
};
