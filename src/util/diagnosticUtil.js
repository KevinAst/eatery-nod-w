import noOp from './noOp';

/**
 * A set of diagnostic conditional functions:
 *   - that logs a description of the activity
 *   - and enables/disables logic (an alternative to commenting out code)
 *
 * @param {string} desc - a description used to log activity (WHEN
 * enabled).
 *
 * @param {function} doThis - the logic to execute (WHEN enabled).
 * 
 * @private
 */

// ... do$/skip$ ... nice in that you can find ALL directives pretty fast (both enabled/disabled)

export function do$(desc, doThis=noOp) {
  console.log(`***DIAGNOSTIC*** ${desc}`);
  return doThis();
}

export function skip$(desc, doThis) {
  // no-op
  return null;
}

//***
//*** various aliases
//***

// ... diag$ / diag$.skip ... nice in that the semantics are better for LOG only
export const diag$ = do$;
diag$.skip = skip$;

// ... YES$ / NO$ ... hmmm
export const YES$ = do$;
export const NO$  = skip$;
