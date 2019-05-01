import * as Yup            from 'yup';
import IFormMeta           from 'util/iForms/IFormMeta';
import _discoveryAct       from './actions';
import * as _discoverySel  from './state';

/* eslint-disable no-whitespace-before-property */  // special case here (for readability)

const distanceMsg = 'Miles should be a number between 1 and 30';
const minpriceMsg = 'Price should be a number between 0 and 4';

export default IFormMeta({
  formDesc:  'Discovery Filter',
  formSchema: Yup.object().shape({
    searchText: Yup.string().label('Search'),
    distance:   Yup.number().label('Distance')    .typeError(distanceMsg) .required() .min(1, distanceMsg) .max(30, distanceMsg),
    minprice:   Yup.string().label('Price Range') .typeError(minpriceMsg) .required() .matches(/[0-4]/, minpriceMsg),
  }),
  formActionsAccessor: ()         => _discoveryAct.filterForm,
  formStateSelector:   (appState) => _discoverySel.getFormFilter(appState),
});
