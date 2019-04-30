import * as Yup          from 'yup';
import {generateActions} from 'action-u';
import IFormMeta         from '../IFormMeta'; // module under test


describe('IFormMeta tests', () => {

  const formDesc = 'Sign In';

  const formSchema = Yup.object().shape({
    name:    Yup.string().required(),
    age:     Yup.number().required().positive().integer(),
    email:   Yup.string().email().label('Email Address'),
    website: Yup.string().url(),
  });

  const formActionsAccessor = ()         => 'FAKE_formActions';
  const formStateSelector   = (appState) => 'FAKE_formState';


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  describe('parameter validation', () => {

    test('formDesc parameter required', () => {
      // ERROR EX: IFormMeta() parameter violation: formDesc is required
      expect(()=>IFormMeta()).toThrow(/formDesc.*required/);
    });

    test('invalid formDesc parameter', () => {
      // ERROR EX: IFormMeta() parameter violation: invalid formDesc (expecting a string)
      expect(()=>IFormMeta({formDesc:9})).toThrow(/invalid formDesc/);
    });

    test('formSchema parameter required', () => {
      // ERROR EX: IFormMeta() parameter violation: formSchema is required
      expect(()=>IFormMeta({formDesc})).toThrow(/formSchema.*required/);
    });
    
    test('invalid formSchema parameter', () => {
      // ERROR EX: IFormMeta() parameter violation: invalid formSchema (expecting a Yup Schema)
      expect(()=>IFormMeta({formDesc, formSchema:'bad'})).toThrow(/invalid formSchema/);
    });

    test('formActionsAccessor parameter required', () => {
      // ERROR EX: IFormMeta() parameter violation: formActionsAccessor is required
      expect(()=>IFormMeta({formDesc, formSchema})).toThrow(/formActionsAccessor.*required/);
    });
    
    test('invalid formActionsAccessor parameter', () => {
      // ERROR EX: IFormMeta() parameter violation: invalid formActionsAccessor (expecting a function)
      expect(()=>IFormMeta({formDesc, formSchema, formActionsAccessor:'bad'})).toThrow(/invalid formActionsAccessor/);
    });


    test('formStateSelector parameter required', () => {
      // ERROR EX: IFormMeta() parameter violation: formStateSelector is required
      expect(()=>IFormMeta({formDesc, formSchema, formActionsAccessor})).toThrow(/formStateSelector.*required/);
    });
    
    test('invalid formStateSelector parameter', () => {
      // ERROR EX: IFormMeta() parameter violation: invalid formStateSelector (expecting a function)
      expect(()=>IFormMeta({formDesc, formSchema, formActionsAccessor, formStateSelector:'bad'})).toThrow(/invalid formStateSelector/);
    });

    
    test('unrecognized named parameter(s)', () => {
      // ERROR EX: IFormMeta() parameter violation: unrecognized named parameter(s): badParm1,badParm2
      expect(()=>IFormMeta({formDesc, 
                            formSchema,
                            formActionsAccessor,
                            formStateSelector,
                            badParm1:'bad',
                            badParm2:'really bad'}))
        .toThrow(/unrecognized.*badParm1.*badParm2/);
    });
    
    test('non-object parameter passed', () => {
      // ERROR EX: IFormMeta() parameter violation: formDesc is required
      expect(()=>IFormMeta('ouch', 123)).toThrow(/parameter violation/);
    });
    
    test('valid parameters', () => {
      expect.assertions(1);
      IFormMeta({formDesc, formSchema, formActionsAccessor, formStateSelector});
      expect(1).toBe(1);
    });

  });


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  describe('test auto generated action creators', () => {

    const signInMetaForm = IFormMeta({formDesc, formSchema, formActionsAccessor, formStateSelector});
    
    const actions = generateActions({
      auth: {
        signIn: signInMetaForm.registrar.formActionGenesis(),
      },
    });
    
    const formActions = actions.auth.signIn;
    
    test('fieldChanged action creator exists', () => {
      // cheap check ... action type
      expect(String(formActions.fieldChanged)).toBe('auth.signIn.fieldChanged');
    });
    
    test('fieldChanged action creator basic parameter validation', () => {
      // ERROR EX: TypeError: ERROR: action-u action creator: auth.signIn.fieldChanged(fieldName,value) expecting 2 parameters, but received 0
      expect(()=>formActions.fieldChanged())
        .toThrow(/auth.signIn.fieldChanged.*expecting 2 parameters.*but received 0/);
    });
  
    // optimization: bypass detailed validation because is a controlled invocation (by IForm components)
    // test('fieldChanged action creator detailed parameter validation', () => {
    //   // ERROR EX: auth.signIn.fieldChanged() action creator ... fieldName value: 'badFieldName' is NOT one of the expected fields: name,age,email,website
    //   expect(()=>formActions.fieldChanged('badFieldName', 'newValue'))
    //     .toThrow(/auth.signIn.fieldChanged.*badFieldName.*is NOT one of the expected fields/);
    // });
  
  });

});
