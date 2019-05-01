import verify         from 'util/verify';
import isString       from 'lodash.isstring';
import isPlainObject  from 'lodash.isplainobject';


/**
 * Encode the supplied ref into a string representation.
 *
 * - supporting an optional safeguard (obfuscate content making it
 *   obscure to public visibility)
 *
 * - employing embedded-recognition so the process can be reversed using
 *   self-recognition
 *
 * TERMINOLOGY:
 *
 * - encode:  package content into a string representation (which can
 *            be reversed) ... ex: obj2str
 *
 * - decode:  reverse the process of encode()
 *
 * - safeguard: obfuscate content so as to make it obscure to public
 *              visibility
 *              NOTE: this is a "lighter weight" process than full
 *                    encryption
 *
 * - embedded-recognition: the ability to recognize and reverse the
 *                         process of either encoding and/or
 *                         safeguarding, producing the original
 *                         ref (that was originally encoded)
 *
 * @param {string|jsonObj} ref the reference to encode
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * result should be obfuscated (true) or not (false - the DEFAULT).
 * 
 * @return {string} an encoded representation of the supplied ref.
 */
export function encode(ref, safeguard=false) {

  // validate our parameters
  const check = verify.prefix('encode(ref) parameter violation: ');

  // ... ref
  check(ref,                                 'ref is required');
  check(isString(ref) || isPlainObject(ref), 'ref must be a string -or- an object literal. NOT: ', ref);

  // ... safeguard
  check(safeguard===true || safeguard===false, 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // encode the supplied ref into a string representation
  let encoding = ref;            // ... by default, a string is left un-touched
  if (isPlainObject(encoding)) { // ... encode objects
    encoding = demarkObjEncoding + JSON.stringify(encoding);
  }

  // safeguard, when requested
  if (safeguard) {
    encoding = demarkSafeguard + obfuscate(encoding);
  }

  // thats all folks :-)
  return encoding;
}


/**
 * Decode the supplied ref, reversing the process of `encode()`.
 * 
 * NOTE: `decode()` can be invoked on a non-encoded ref, in which case
 *       it will simply pass-through the un-encoded ref.  This is a
 *       convenience, and is made possible by embedded-recognition.
 * 
 * @param {any} ref the reference object to decode ... either the
 * output of `encode()` (a recognized encoded string), or any other
 * reference (simply passed-through).
 * 
 * @return {any} the decoded representation of the supplied ref.
 */
export function decode(ref) {

  // validate our parameters
  const check = verify.prefix('decode(ref) parameter violation: ');

  // ... ref
  check(ref, 'ref is required');

  // simply pass-through any non-strig ref
  if (!isString(ref)) {
    return ref;
  }

  // KEY: at this point we know ref is a string :-)
  let result = ref;

  // unwind any safeguards
  if (result.indexOf(demarkSafeguard) === 0) {
    result = result.substring(demarkSafeguard.length);
    result = deobfuscate(result);
  }

  // unwind any encodings
  if (result.indexOf(demarkObjEncoding) === 0) {
    result = result.substring(demarkObjEncoding.length);
    result = JSON.parse(result);
  }

  // thats all folks :-)
  return result;
}

// embedded-recognition keywords
const demarkObjEncoding = 'obj2str:';
const demarkSafeguard   = 'afesa'; // ... use a obsecure phrase, so as to NOT "stand out"
                                   //     - pig Latin for "safe"
                                   //     - preventing it from being uniquely identified
                                   //       and harvested within a global deployment


function obfuscate(str) {
  if (!window.btoa) {
    throw new Error('*** ERROR *** encode(): ENCODING NOT supported by this browser (btoa).');
  }
  const encoding = window.btoa(str);
  return encoding;
}

function deobfuscate(str) {
  if (!window.atob) {
    throw new Error('*** ERROR *** encode(): DECODING NOT supported by this browser (atob).');
  }
  const clearTxt = window.atob(str);
  return clearTxt;
}
