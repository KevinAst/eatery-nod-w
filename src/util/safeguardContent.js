import verify         from 'util/verify';
import isString       from 'lodash.isstring';
import isPlainObject  from 'lodash.isplainobject';


/**
 * Encode the supplied ref.
 * 
 * @param {string|jsonObj} ref the reference to encode
 * 
 * @return {string} an encoded representation of the supplied ref.
 */
export function encodeContent(ref) {

  // validate our parameters
  const check = verify.prefix('encodeContent(ref) parameter violation: ');

  // ... ref
  check(ref,                                 'ref is required');
  check(isString(ref) || isPlainObject(ref), 'ref must be a string -or- and object literal');

  // process request
  if (isString(ref)) {
    // encode supplied string
    return demarkEncryptedStr + encode(ref);
  }
  else if (isPlainObject(ref)) {
    // encode supplied object
    return demarkEncryptedObj + encode(JSON.stringify(ref) );
  }
}


/**
 * Decode the supplied ref.
 * 
 * @param {any} ref the reference to decode ... either a recognized
 * encoded string, or any other reference (simply passed through).
 * 
 * @return {any} the decoded representation of the supplied ref
 * ... either a decoded ref (a clear string -or- JsonObj) -OR- the
 * supplied ref passed through.
 */
export function decodeContent(ref) {

  // validate our parameters
  const check = verify.prefix('decodeContent(ref) parameter violation: ');

  // ... ref
  check(ref, 'ref is required');

  // process request
  if (isString(ref)) { // ... we are dealing with a string input

    // handle an encoded string
    if (ref.indexOf(demarkEncryptedStr) === 0) {
      const encodedPayload = ref.substring(demarkEncryptedStr.length);
      return decode(encodedPayload);
    }

    // handle an encoded object
    else if (ref.indexOf(demarkEncryptedObj) === 0) {
      const encodedPayload = ref.substring(demarkEncryptedObj.length);
      return JSON.parse( decode(encodedPayload) );
    }
  }

  // when ref is NOT a recognized encoding, simply pass it through
  return ref;
}

// keywords embedded in our encoding to recognize encoded strings (demarcate)
// ... we use common phases, so as to NOT stand out
//     (preventing it from being uniquely identified and harvested within a global deployment)
const demarkEncryptedStr = 'there';
const demarkEncryptedObj = 'their';


function encode(ref) {
  if (!window.btoa) {
    throw new Error('*** ERROR *** encodeContent(): ENCODING NOT supported by this browser (btoa).');
  }

  const encoding = window.btoa(ref);
  return encoding;
}

function decode(ref) {
  if (!window.atob) {
    throw new Error('*** ERROR *** encodeContent(): DECODING NOT supported by this browser (atob).');
  }

  const clearTxt = window.atob(ref);
  return clearTxt;
}
