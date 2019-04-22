import isFunction  from 'lodash.isfunction';
import isString    from 'lodash.isstring';
import verify      from '../../../util/verify';

/**
 * Embellish the supplied function with a `bootstrapWhat` property -
 * used by the `bootstrap` feature to set it's status.
 *
 * A bootstrapFn is required by the `'bootstrap.*'` fassets use
 * contract.
 * 
 * @param {string} what - a description of what is being bootstrapped
 * (e.g. 'Waiting for bla bla bla').
 * 
 * @param {function} fn - the function to be embellished with the
 * `bootstrapWhat` property.  The API of this function is:
 *   + fn({getState, dispatch, fassets})): promise - resolving void (promise used for error handling)
 *
 * @return {bootstrapFn} the supplied fn parameter, embellished with a
 * `bootstrapWhat` property.
 */
export function createBootstrapFn(what, fn) {

  // validate parameters
  const check = verify.prefix('createBootstrapFn() parameter violation: ');

  check(what,           'what is required');
  check(isString(what), 'what must be a string');

  check(fn,             'fn is required');
  check(isFunction(fn), 'fn must be a function');

  // embellish/return the supplied function
  fn.bootstrapWhat = what;
  return fn;
}


/**
 * Return an indicator as to whether the supplied `ref` parameter is a
 * bootstrapFn.
 * 
 * @param {any} ref - the reference item to validate.
 *
 * @return {boolean} true: if bootstrapFn, false otherwise.
 */
export function isBootstrapFn(ref) {
  return ref && isFunction(ref) && ref.bootstrapWhat;
}


/**
 * A bootstrapFn validator conforming to feature-u's fassetValidation
 * API ... see: https://feature-u.js.org/cur/api.html#fassetValidations
 * 
 * @param {any} fassetsValue - the fassets value to validate.
 *
 * @return {string} null: valid bootstrapFn -or-
 *                  'bootstrapFn': NOT a valid bootstrapFn (used in feature-u Error content).
 */
export function isFassetBootstrapFn(fassetsValue) {
  return isBootstrapFn(fassetsValue) ? null : 'bootstrapFn';
}

