import * as Yup      from 'yup';
import IFormMeta     from 'util/iForms/IFormMeta';
import _authAct      from './actions';
import * as _authSel from './state';

/* eslint-disable no-whitespace-before-property */  // special case here (for readability)

export default IFormMeta({
  formDesc:  'Sign In',
  formSchema: Yup.object().shape({
    email:    Yup.string().required().email()        .label('Email'),
    pass:     Yup.string().required().min(6).max(9)  .label('Password'), // TODO: add password regex check: https://dzone.com/articles/use-regex-test-password
  }),
  formActionsAccessor: ()         => _authAct.signIn,
  formStateSelector:   (appState) => _authSel.getUserSignInForm(appState),
});
