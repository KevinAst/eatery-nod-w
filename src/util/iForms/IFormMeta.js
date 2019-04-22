import {reducerHash}  from 'astx-redux-util';
import {createLogic}  from 'redux-logic';
import isEqual        from 'lodash.isequal';
import isString       from 'lodash.isstring';
import isFunction     from 'lodash.isfunction';
import verify         from 'util/verify';

/**
 * Define the characteristics of an Intelligent Form - a reusable forms
 * utility that is logic-based (using redux-logic).
 * 
 * A form schema provides the details about the form fields (field names,
 * labels, validation, etc.).  This schema is driven by Yup (a
 * light-weight Joi), so it is declarative and dead simple!
 * 
 * Complete aspects of the form is auto generated, including actions,
 * logic, and reducers.  These auto-generated items implement the hard
 * work related to dynamically determining when field validation should
 * be exposed to the user (based on user touches, and form submission).
 * 
 * **Bottom line**: iForms promotes **painless re-usability!** As a
 * **bonus**, it is logic-based, so it is **extremely simple to inject
 * **app-specific logic** to manipulate various business-related
 * **items.
 *
 *
 * Form Input/Output Boundaries (via App Domains)
 * ==============================================
 *
 * When a form is initiated, the `open` action is optionally
 * supplied a domain object, to initialize the form (when not
 * supplied all form fields start out as empty strings).
 *
 * We use the term "domain" in a generic way, that can
 * manifest itself in a variety of different things.  It can
 * be a real application domain object (say from an API
 * call), or another part of your state tree, or any
 * number of other things.
 *
 * Likewise, when the form is processed (via the `process`
 * action), the form values will be mapped back to the domain
 * representation (retained in the `process` action).
 *
 * This makes it convenient for your logic to operate using
 * app-specific structures.
 *
 * You can easily define the mapping between your domain and the form
 * values structure, through the optional
 * mapDomain2Form/mapPropsToValues parameters.  By default (when not
 * supplied), the domain structure is assumed to be "one in the same"
 * as the form values structure (through a straight mapping of the
 * well known iForm fields).
 *
 * @param {string} namedArgs.formDesc a human-interpretable description for
 * this form (ex: 'Sign In').
 *
 * @param {ObjectSchema} namedArgs.formSchema the Yup Schema object defining
 * form fields, labels, and validation characteristics.
 *
 * @param {function} namedArgs.formActionsAccessor an accessor
 * function that promotes our specific formActions.  A function is
 * used to avoid cyclic dependencies in the startup bootstrap process
 * (because BOTH actions and IFormMeta instances are created in-line).
 * API: () => formActions
 *
 * @param {function} namedArgs.formStateSelector a selector function
 * that promotes our specific formState, given the top-level appState.
 * API: (appState) => formState
 *
 * @param {function} [namedArgs.mapDomain2Form] optionally define a
 * mapping between an app domain object and the form values (employed
 * through the `open` action).  When not specified, a straight mapping
 * of any iForm fields is used.
 * API: (domain) => values
 *
 * EX:
 * ```
 *   mapDomain2Form: (domain) => ({
 *     id:        domain.id,
 *     email:     domain.email,
 *     firstName: domain.name.first,
 *     lastName:  domain.name.last
 *   })
 * ```
 *
 * @param {function} [namedArgs.mapForm2Domain] optionally define a
 * mapping between form values and the app domain object (employed
 * through the `process` action).  When not specified, a straight
 * mapping of the iForm values is used (i.e. domain is same as
 * values).
 * API: (castValues) => domain // NOTE: castValues have been "cast" to the appropriate type
 *
 * EX:
 * ```
 *   mapForm2Domain: (castValues) => ({
 *     id:       castValues.id,
 *     email:    castValues.email,
 *     name:  {
 *       first:  castValues.firstName,
 *       last:   castValues.lastName
 *     }
 *   })
 * ```
 *
 * @return {Object} IFormMeta object exposing various aspects of an
 * Intelligent Form ...
 * ```
 *  {
 *    registrar: { // auto-generated items to be externally registered
 *      // iForm action creators to be injected into action-u generateActions()
 *      formActionGenesis([appInjectedFormActions]): ActionGenesis
 *      
 *      // iForm logic modules (providing intelligent validation) to be registered to redux-logic
 *      formLogic(): logic[]
 *      
 *      // iForm reducer to be registered in the redux state management process
 *      formReducer(): function
 *    }
 * 
 *    // the selector that promotes self's specific formState, given the top-level appState
 *    formStateSelector(appState): formState
 *
 *    // create an IForm helper object, providing convenience accessors/handlers, avoiding direct formState interpretation
 *    IForm(formState, dispatch): IForm
 *  }
 * ```
 */
export default function IFormMeta({formDesc,
                                   formSchema,
                                   formActionsAccessor,
                                   formStateSelector,
                                   mapDomain2Form,
                                   mapForm2Domain,
                                   ...unknownArgs}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('IFormMeta() parameter violation: ');

  check(formDesc,            'formDesc is required');
  check(isString(formDesc),  'invalid formDesc (expecting a string)');

  check(formSchema,          'formSchema is required');
  check(formSchema.validate, 'invalid formSchema (expecting a Yup Schema)'); // duck type check

  check(formActionsAccessor,             'formActionsAccessor is required');
  check(isFunction(formActionsAccessor), 'invalid formActionsAccessor (expecting a function)');

  check(formStateSelector,             'formStateSelector is required');
  check(isFunction(formStateSelector), 'invalid formStateSelector (expecting a function)');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);


  // ***
  // *** decompose meta info from the supplied Yup Schema (like fieldNames and labels)
  // ***

  // fieldNames: String[]
  const fieldNames = Object.keys(formSchema.fields);

  // labels: { ... fallback to fieldName when NO schema label supplied
  //   fieldName1: string,
  //   fieldName2: string
  // }
  const labels = fieldNames.reduce( (labels, fieldName) => {
    labels[fieldName] = formSchema.fields[fieldName].describe().label || fieldName;
    return labels;
  }, {FORM: formDesc}); // initial value contains our formDesc



  // ***
  // *** default domain mapping functions with ones that have knowledge of our contextual fieldNames
  // ***

  if (!mapDomain2Form) {
    mapDomain2Form = (domain) => {
      return fieldNames.reduce( (values, fieldName) => {
        values[fieldName] = domain[fieldName] || '';
        values[fieldName] = values[fieldName].toString(); // insure string representation
        return values;
      }, {} );
    };
  }
  check(isFunction(mapDomain2Form), 'invalid mapDomain2Form (expecting a function)');

  if (!mapForm2Domain) {
    mapForm2Domain = (castValues) => castValues;
  }
  check(isFunction(mapForm2Domain), 'invalid mapForm2Domain (expecting a function)');




  // ***
  // *** define the auto-generated iForm action creators to be injected into action-u generateActions()
  // ***

  /**
   * Promote the auto-generated action creators required by self's
   * iForm.
   *
   * @param {ActionGenesis} [appInjectedFormActions] optionally
   * specify additional app-specific action creators to supplement the
   * auto-generated formActions.  This is typically used to introduce
   * fail/complete actions that are spawned out of app-specific logic
   * modules.  NOTE: the formAction root can even become an action
   * creator by promoting a top-level actionMeta node in this
   * structure.
   * 
   * @return {ActionGenesis} the auto-generated action creators
   * required by self's iForm.  This is an action-u ActionGenesis
   * sub-structure that is to be injected into the action-u
   * generateActions() process.  The following standard iForm actions
   * are defined:
   * ```
   *    ${formActionGenesis}: {
   *      open([domain] [,formMsg])      ... activate the form state, initiating form processing
   *      fieldChanged(fieldName, value) ... maintain controlled field state change (with validation)
   *                                         NOTE: IForm logic supplements action with validation msgs
   *      fieldTouched(fieldName)        ... maintain field touched status, impacting validation dynamic exposure
   *                                         NOTE: IForm logic supplements action with validation msgs
   *      process()                      ... process this form
   *                                         NOTE 1: IForm logic will reject this action, when the form is invalid
   *                                         NOTE 2: IForm logic supplements action with values (of appropriate
   *                                                 data types) and domain (in app-specific structure)
   *        reject(msgs)                 ... reject process action with supplied validation msgs
   *      close()                        ... close this form
   *
   *      ...appSpecificActions()        ... app-specific action creators supplementing the auto-generated formActions
   *    }
   * ```
   */
  function formActionGenesis(appInjectedFormActions={}) {

    // NOTE: As an optimization, we bypass detailed action creator validation
    //       because it is a controlled invocation (by IForm components).
    //       ... Even though fieldName is in the developer realm, the fieldName is validated by our IFormElm components
    //       ... Here is an example ratify() for the fieldChanged() action creator:
    //             ratify(fieldName, value) {
    //               verify(isString(fieldName), `'${formDesc}' form fieldChanged() action creator ... fieldName param is NOT a string: ${fieldName}`);
    //               verify(labels[fieldName],   `'${formDesc}' form fieldChanged() action creator ... fieldName: '${fieldName}' is NOT one of the expected fields: ${fieldNames}`);
    //               verify(isString(value),     `'${formDesc}' form fieldChanged() action creator ... value param is NOT a string: ${value}`);
    //               return [fieldName, value];
    //             },

    // define our base auto-generated action creators
    const myFormActions = {

      open: {         // open([domain] [,formMsg]): Action
                      // > activate the form state, initiating form processing
                      actionMeta: {
                        traits: ['domain', 'formMsg'],
                        ratify: (domain=null, formMsg=null) => [domain, formMsg],
                      },
      },

      fieldChanged: { // fieldChanged(fieldName, value): Action
                      // > maintain controlled field state change (with validation)
                      //   NOTE: IForm logic supplements action with validation msgs
                      actionMeta: {
                        traits: ['fieldName', 'value'],
                      },
      },

      fieldTouched: { // fieldTouched(fieldName): Action
                      // > maintain field touched status, impacting validation dynamic exposure
                      //   NOTE: IForm logic supplements action with validation msgs
                      actionMeta: {
                        traits: ['fieldName'],
                      },
      },

      process: {      // process(): Action
                      // > process this form
                      //   NOTE 1: IForm logic will reject this action, when the form is invalid
                      //   NOTE 2: IForm logic supplements action with values (of appropriate
                      //           data types) and domain (in app-specific structure)
                      actionMeta: {
                      },

        reject: {     // reject(msgs): Action
                      // > reject process action with supplied validation msgs
                      actionMeta: {
                        traits: ['msgs'],
                      },
        },

      },

      close: {        // close(): Action
                      // > close this form
                      actionMeta: {
                      },
      },

    };

    // inject any app-specific actions creators
    const check = verify.prefix('IFormMeta.formActionGenesis(): invalid appInjectedFormActions parameter ... ');
    for (const action in appInjectedFormActions) {
      check(!myFormActions[action], `${action} action is reserved as one of the auto-generated iForm actions.`);
      myFormActions[action] = appInjectedFormActions[action];
    }

    // beam me up Scotty!
    return myFormActions;
  }


  const validationOptions = {
    abortEarly: false, // return ALL errors
  };

  /**
   * Validate the supplied values against our schema.
   *
   * @param {Object} values the set of values to validate (keyed by
   * fieldName).
   * 
   * @return {promise} the async promise that resolves to msgs object
   * (keyed by fieldName) containing validation messages for all
   * fields.
   */
  function asyncValidate(values) {
    return formSchema.validate(values, validationOptions)
    .then( () => ({}) )  // empty msgs
    .catch( yupErrs => { // transform all Yup errors into our msgs
      const msgs = {};
      yupErrs.inner.forEach(yupErr => {
        msgs[yupErr.path] = yupErr.message;
      });
      return msgs;
    });
  }


  // ***
  // *** define the auto-generated iForm logic modules (providing intelligent validation) to be registered to redux-logic
  // ***

  /**
   * Promote the redux-logic modules that orchestrates various iForm
   * characteristics, such as validation.
   *
   * @return {logic[]} the redux-logic modules that perform low-level
   * iForm business logic (such as validation).  This should be
   * registered to the app's redux-logic process.
   */
  function formLogic() {

    const formActions = formActionsAccessor();

    // promote our iForm logic[]
    return [

      createLogic({
        name: `validateFields for '${formDesc}' form`,
        type: [String(formActions.fieldChanged),
               String(formActions.fieldTouched)], // if fields have initial value (i.e. never changed) this will be the first time fields are validated

        validate({getState, action, api}, allow, reject) {

          // NOTE: action has: fieldName/value

          // locate our formState (from our appState)
          const formState = formStateSelector( getState() );

          // no-op when form is inProcess
          // ... this is a foolproof catch if the UI fails to prevent these actions from firing
          if (formState.inProcess) {
            reject();
            return;
          }

          // perform field validation
          // ... fieldChanged action has an updated value in action
          const values = action.type === String(formActions.fieldChanged)
                          ? {...formState.values, [action.fieldName]: action.value}
                          : formState.values;
          asyncValidate(values)
          .then(msgs => {

            // retain overall form msg if any
            if (formState.msgs.FORM) {
              msgs.FORM = formState.msgs.FORM;
            }

            // supplement our action with validation msgs
            action.msgs = msgs;

            // continue processing, supporting field updates, and visualizing any validation errors
            allow(action);
          });

        },
      }),


      createLogic({
        name: `process validation for '${formDesc}' form`,
        type: String(formActions.process),

        validate({getState, action, api}, allow, reject) {

          // NOTE: action has: fieldName/value

          // locate our formState (from our appState)
          const formState = formStateSelector( getState() );

          // no-op when form is inProcess
          // ... this is a foolproof catch if the UI fails to prevent these actions from firing
          if (formState.inProcess) {
            reject();
            return;
          }

          // perform validation
          asyncValidate(formState.values)
            .then( msgs => {

              // reject validation problems (via new action)
              if (Object.keys(msgs).length > 0) {

                // inject form msg to further highlight validation issues
                msgs.FORM = 'Please resolve the highlighted issues, and try again.';

                // reject current process action by re-issuing a different process.reject action
                allow( formActions.process.reject(msgs) );
              }

              // allow clean validation (supplementing action with values/domain)
              else {

                // supplement our action with values/domain
                const castValues = formSchema.cast(formState.values);
                const domain     = mapForm2Domain(castValues);
                action.values = castValues;
                action.domain = domain;

                allow(action);
              }
            });

        },
      }),

    ];
  }



  // ***
  // *** define the auto-generated iForm reducer to be registered in the redux state management process
  // ***

  /**
   * Promote the auto-generated reducer required by self's iForm, that
   * maintains our form's redux state.
   * 
   * @return {function} the reducer that maintains our iForm redux
   * state.  This reducer is to be registered in the redux state
   * management process.  The following state shape is maintained:
   * ```
   *    ${formState}: { // ex: appState.auth.signInForm (null for inactive form)
   *
   *      labels: {       // field labels (UI promotion and validation msg content)
   *        FORM:         string, // form desc
   *        <fieldName1>: string,
   *        <fieldName2>: string,
   *      },
   *
   *      values: {       // field values
   *        <fieldName1>: string,
   *        <fieldName2>: string,
   *      },
   *
   *      msgs: {          // validation msgs (if any) ... initial: {}
   *        FORM:          string, // msg spanning entire form ... non-exist for valid
   *        <fieldName1>:  string, // non-exist for valid
   *        <fieldName2>:  string, // non-exist for valid
   *      },
   *
   *      validating: {    // demarks which fields are being validated ... based on whether it has been touched by user (internal use only)
   *        FORM:          boolean, // ALL fields validated (takes precedence)
   *        <fieldName1>:  boolean,
   *        <fieldName2>:  boolean,
   *      },
   *
   *      inProcess: boolean, // is form being processed?
   *    }
   * ```
   */
  function formReducer() {

    const formActions = formActionsAccessor();

    // generate our reducer function
    const myFormReducer = reducerHash({

      [formActions.open]: (state, action) => {
        // define our initial form values
        // ... interpret optional action props
        const values = action.domain
                           // ... either from our supplied domain (if any)
                           //     INTERPRETED by mapDomain2Form(), which can be
                           //     either client supplied or our own default
                         ? mapDomain2Form(action.domain)
                           // ... or inject empty string for each field
                           //     NOTE: we prefer to NOT handle this in mapDomain2Form,
                           //           so as to NOT rely on client logic "to do the right thing"
                         : fieldNames.reduce( (values, fieldName) => { 
                             values[fieldName] = '';
                             return values;
                           }, {});
        // ... insure no miss-matched field introduced in mapDomain2Form()
        //     - comparing our known fields: fieldNames: string[]
        //     - to the generated object:    values:     {field1, field2, etc}
        const normalizedFieldNames = fieldNames.sort();
        const normalizedValueProps = Object.keys(values).sort();
        verify(isEqual(normalizedFieldNames, normalizedValueProps),
               `'${formDesc}' form open reducer ... miss-matched field(s) introduced in app-supplied mapDomain2Form ... generated fields: ${normalizedValueProps} ... expected fields: ${normalizedFieldNames}`);

        const msgs = {};
        if (action.formMsg) { // ... interpret optional action.formMsg
          msgs.FORM = action.formMsg;
        }

        // expand a completely new formState
        return {
          labels,
          values,
          msgs,
          validating: {},
          inProcess: false,
        };
      },

      [formActions.fieldChanged]: (state, action) => {

        // carve out new container (supporting immutable state)
        const newState = {...state};

        // merge new field value
        newState.values = {...state.values, [action.fieldName]: action.value};

        // retain logic-injected validation msgs (within action)
        newState.msgs = action.msgs;

        // that's all folks
        return newState;
      },

      [formActions.fieldTouched]: (state, action) => {
        if (state.validating[action.fieldName]) {
          return state; // validating indicator already set
        }
        else {          // set our field validating indicator to true
          const newState      = {...state};
          newState.validating = {...state.validating, [action.fieldName]: true};
          newState.msgs       = action.msgs; // also retain validation logic-injected msgs
          return newState;
        }
      },

      [formActions.process]: (state, action) => {
        const newState      = {...state};
        newState.inProcess  = true; // mark form as being processed
        newState.validating = {...state.validating, FORM: true}; // mark entire form as being validated
        newState.msgs       = {}; // clear validation msgs (form is clean)
        return newState;
      },

      [formActions.process.reject]: (state, action) => {
        const newState      = {...state};
        newState.validating = {...state.validating, FORM: true}; // mark entire form as being validated
        newState.msgs       = action.msgs; // retain validation logic-injected msgs
        return newState;
      },

      [formActions.close]: (state, action) => null,

    }, null); // initialState

    // promote our iForm reducer function
    return myFormReducer;
  }



  // ***
  // *** define our IForm helper object
  // ***

  /**
   * Create an IForm helper object, providing convenience
   * accessors/handlers, avoiding direct formState interpretation.
   *
   * @param {ReduxState} formState the redux form state supporting
   * self's form.
   *
   * @param {function} dispatch the redux dispatch function, supporting
   * self's handlers.
   * 
   * @return {Object} the IForm helper object, with the following API:
   * ```
   * {
   *   // the label of the supplied field (or form when not supplied)
   *   getLabel(fieldName='FORM'): string
   *
   *   // the value of the supplied field (N/A for form)
   *   getValue(fieldName): string
   *
   *   // is supplied field value valid (or form when not supplied
   *   // ... i.e. all fields in form), irrespective to whether errors are
   *   // exposed to the user or not
   *   isValid(fieldName='FORM'): boolean
   * 
   *   // the validation msg of supplied field (or form when not supplied)
   *   // irrespective to whether errors are exposed to the user or not
   *   // - undefined/null for valid
   *   getMsg(fieldName='FORM'): string
   * 
   *   // the exposed validation msg of supplied field (or form when not
   *   // supplied) - undefined/null for valid.  The exposed msg is tailored 
   *   // to whether validation should be exposed to the user or not 
   *   // (BASED ON user touches).
   *   getExposedMsg(fieldName='FORM'): string
   *
   *   // Should validation messages be exposed for supplied field (or
   *   // form when not supplied), based on user touches.
   *   // 
   *   // This is needed to expose UI success/error icon adornment
   *   // (i.e. no adornment is shown if NOT yet being validated).
   *   //
   *   // NOTE: Form validation (when enabled) takes precedence over
   *   //       individual fields.
   *   isValidationExposed(fieldName='FORM'): boolean
   *
   *   // is form being processed?
   *   inProcess(): boolean
   *
   *   // Service an IForm field value change.
   *   handleFieldChanged(fieldName, value): void
   *
   *   // Service an IForm field touched.
   *   handleFieldTouched(fieldName): void
   *
   *   // Service an IForm process request.
   *   handleProcess(): void
   *
   *   // Service an IForm close request.
   *   handleClose(): void
   * }
   * ```
   */
  function IForm(formState, dispatch) {

    // validate parameters
    const check = verify.prefix('IFormMeta.IForm() parameter violation: ');
    check(formState,                            'formState is required');
    check(formState.labels,                     'invalid formState - does NOT conform to the IForm state');
    check(formState.labels.FORM===formDesc,     `miss-matched formState - expecting ${formDesc} but received ${formState.labels.FORM}`);

    check(dispatch,                             'dispatch is required');
    check(isFunction(dispatch),                 'invalid dispatch (expecting a function)');


    // formActions required for handler methods (below)
    const formActions = formActionsAccessor();


    /**
     * @return {string} the label of the supplied field (or form when
     * not supplied).
     */
    function getLabel(fieldName='FORM') {
      return formState.labels[fieldName];
    }

    /**
     * @return {string} the value of the supplied field (N/A for form).
     */
    function getValue(fieldName) {
      verify(fieldName || fieldName !== 'FORM', `IFormMeta.IForm.getValue() unsupported fieldName: ${fieldName}`);
      return formState.values[fieldName];
    }

    /**
     * Is supplied field value valid (or form when not supplied
     * ... i.e. all fields in form), irrespective to whether errors are
     * exposed to the user or not.
     * @return {boolean} 
     */
    function isValid(fieldName='FORM') {
      return fieldName==='FORM'
               ? Object.keys(formState.msgs).length === 0
               : formState.msgs[fieldName] ? false : true; // eslint-disable-line no-unneeded-ternary
    }

    /**
     * @return {string} the validation msg of supplied field (or form
     * when not supplied) irrespective to whether errors are exposed
     * to the user or not - undefined/null for valid
     */
    function getMsg(fieldName='FORM') {
      return formState.msgs[fieldName];
    }

    /**
     * @return {string} exposed validation msg of supplied field (or
     * form when not supplied) - undefined/null for valid.  The
     * exposed msg is tailored to whether validation should be exposed
     * to the user or not (BASED ON user touches).
     */
    function getExposedMsg(fieldName='FORM') {
      return isValidationExposed(fieldName) ? formState.msgs[fieldName] : null;
    }

    /**
     * Should validation messages be exposed for supplied field (or
     * form when not supplied), based on user touches.
     * 
     * This is needed to expose UI success/error icon adornment
     * (i.e. no adornment is shown if NOT yet being validated).
     *
     * NOTE: Form validation (when enabled) takes precedence over
     *       individual fields.
     *
     * @return {boolean} 
     */
    function isValidationExposed(fieldName='FORM') {
      return formState.validating.FORM || formState.validating[fieldName];
    }

    /**
     * Is form being processed?
     *
     * @return {boolean} 
     */
    function inProcess() {
      return formState.inProcess;
    }



    /**
     * Service an IForm field value change.
     */
    function handleFieldChanged(fieldName, value) {
      dispatch( formActions.fieldChanged(fieldName, value) );
    }

    /**
     * Service an IForm field touch.
     */
    function handleFieldTouched(fieldName) {
      dispatch( formActions.fieldTouched(fieldName) );
    }

    /**
     * Service an IForm process request.
     */
    function handleProcess(event) {
      dispatch( formActions.process() );

      // for <form onSubmit> handlers, prevent anything from being submitted to the server
      // ... old technique would be to "return false" from the handler, 
      //     but this is no longer supported in react
      if (event) {
        event.preventDefault();
      }
    }

    /**
     * Service an IForm close request.
     */
    function handleClose() {
      dispatch( formActions.close() );
    }

    // promote our IForm helper object
    return {
      getLabel,
      getValue,
      isValid,
      getMsg,
      getExposedMsg,
      isValidationExposed,
      inProcess,
      handleFieldChanged,
      handleFieldTouched,
      handleProcess,
      handleClose,
    };

  }



  // ***
  // *** publicly expose needed IFormMeta characteristics
  // ***

  return {
    registrar: {
      formActionGenesis,
      formLogic,
      formReducer,
    },
    formStateSelector,
    IForm,
  };

}
