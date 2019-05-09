// KOOL: this is the useFassets() implementation in an eatery-nod-w sandbox (AI: move this feature-u)

import React, {useContext} from 'react';
import {FassetsContext}    from 'feature-u';       // AI: for sandbox, DO THIS
//import {FassetsContext}  from './withFassets';   // AI: for REAL feature-u, DO THIS INSTEAD
import isPlainObject       from 'lodash.isplainobject';
import isString            from 'lodash.isstring';

import verify         from 'util/verify';


// ??? NEW
// + useFassets{fassetsKey='.' | mapFassetsToPropsStruct): fassets | fassets resource | fassetsProps
export function useFassets(p='.') {

  useFassetsCheck(p);

  const fassets = useContext(FassetsContext);

  return isString(p) ? fassets.get(p) : fassetsProps(p, fassets);
}

// check useFassets() usage in a way that is masked as a hook
// (useXyz()), so as to allow execution before real hooks
// ... i.e. fake out the lint rule!!
// ... this includes BOTH verifying:
//     - hooks is available in this version of react
//     - parameter validation
function useFassetsCheck(p) {

  // verify that hooks are available in this version of react
  if (!useContext) {
    throw new Error(`feature-u useFassets() is only available in React versions that have HOOKS (React >=16.8) ... your React Version is: ${React.version}`);
  }

  // parameter validation
  const check = verify.prefix('useFassets() parameter violation: ');

  check(p,                               'single parameter IS required');
  check(isString(p) || isPlainObject(p), `single parameter must either be a string or a structure ... ${p}`);

  // when a mapFassetsToProps is supplied, it must be a set of key/value pairs cataloging strings
  if (isPlainObject(p)) {
    MyObj.entries(p).forEach( ([propKey, fassetsKey]) => {
      check(isString(fassetsKey),
            `invalid mapFassetsToProps - all properties MUST reference a fassetsKey string ... at minimum ${propKey} does NOT`);
    });
  }

}

//********************************************************************************
// ?? TEMP: this is available in real env 
// import {MyObj}              from '../util/mySpace';
// simply lean polyfills EXCEPT in MY space (non-polluting to our client apps)
const MyObj = {

  // Object.entries() 
  // - is NOT available in Node 6 (for some reason)
  //   ... unsure what this has to do with Node 6
  // - although it is a es2017 standard (according to the MDN)
  //   ... see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
  // - technically, this is a "build only" problem on Node 6
  //   ... an antiquated browser would require client to polyfill just as anything else
  // - it is so lean and small, I just punted and included it here
  entries: (obj) => {
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    return resArray;
  },

};


//********************************************************************************
// ?? TEMP: this is available in real env 
// import {fassetsProps}     from './withFassets';
// helper function that translates supplied fassetsToPropsMap to fassetsProps
function fassetsProps(fassetsToPropsMap, fassets) { // export for testing only
  return Object.assign(...MyObj.entries(fassetsToPropsMap).map( ([propKey, fassetsKey]) => ({[propKey]: fassets.get(fassetsKey)}) ));
}
