const identityFn = (p) => p;

/**
 * A diagnostic functional directive that conditionally executes,
 * depending on invocation sub-directive, providing an alternative to
 * commenting out code!
 *
 *  + diag$(...)      ... executes
 *  + diag$.skip(...) ... no-ops
 *  + diag$.on(...)   ... executes
 *  + diag$.off(...)  ... no-ops
 *
 * @param {string} msg - the diagnostic message to log (WHEN active).
 *
 * @param {function} [fn] - the function to execute (WHEN active).
 * Defaults to the "identity" function, that no-ops ... for "logging" only.
 *
 *  + fn(msg): any // NOTE: the diagnostic message is supplied to this fn()
 *
 * @return {fn() result | undefined} the result of fn() invocation
 * (WHEN enabled), otherwise undefined.
 */
export default function diag$(msg, fn=identityFn) {
  console.log(`***DIAGNOSTIC*** ${msg}`);
  return fn(msg);
}

diag$.skip = () => undefined;
diag$.on   = diag$;
diag$.off  = diag$.skip;
