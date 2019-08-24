/**
 * Standardize the ability to handle ALL errors more generically, by
 * adding these value-added extensions to ALL Error objects (via this
 * Error class polyfill - a monkey patch).
 * 
 * All Error instances (created anywhere) are extended to include the
 * following characteristics:
 * 
 * - A new error.userMsg property is defined.
 * 
 *   This message is intended to be seen by users, so it should be
 *   suitable for human consumption:
 *     - both in meaning, 
 *     - and in sanitation (so as to not reveal any internal
 *       architecture)
 * 
 *   By default, error.userMsg = 'Unexpected Condition'
 *   and can be changed by: 
 *     + error.defineUserMsg(userMsg): error
 * 
 * - There is a delineation of expected vs. unexpected conditions.  For
 *   example:
 * 
 *     - An error communicating "invalid password" is an expected
 *       condition, because it is stimulated by user input.
 * 
 *     - Contrast that with an error communicating "DB is down", which is
 *       an unexpected condition, because this is outside the user's
 *       control.
 * 
 *   This distinction is controlled by whether an error.userMsg has
 *   been defined (expected) or not (unexpected).
 * 
 *   In other words, all errors start out as unexpected, and can be
 *   changed to expected by simply invoking:
 *     + error.defineUserMsg(userMsg): error
 * 
 *   This distinction may be programmatically delineated through one of
 *   the following methods:
 *     + error.isExpected(): boolean
 *     + error.isUnexpected(): boolean
 * 
 * - A new error.attemptingToMsg property is defined.
 * 
 *   This message is also intended to be seen by users, and provides
 *   additional detail of what was being attempted (over and above the
 *   error.userMsg).
 * 
 *   By default, error.attemptingToMsg = ''
 *   and can be changed by: 
 *     + error.defineAttemptingToMsg(attemptingToMsg): error
 * 
 * - A new error.formatUserMsg() is provided that combines all
 *   user-specific messages (userMsg and attemptingToMsg).
 * 
 *     + error.formatUserMsg(): string
 * 
 * - The toString() method has been extended to suffix the base
 *   toString() with user-specific messages.
 * 
 * - All of the new "defining" methods return the receiving error,
 *   so as to allow them to be conveniently chained.  For example:
 * 
 *     throw new Error('catastrophic details here').defineAttemptingToMsg('sign in');
 * 
 * **Usage Scenarios** are as follows:
 * 
 * - Error Origination
 * 
 *   In throwing a new Error, you can:
 *     throw new Error('internal technical error details')
 *                 .defineUserMsg('You did not bla')           // ONLY INVOKE if this is an expected condition - otherwise default to: 'Unexpected Condition'
 *                 .defineAttemptingToMsg('log into the app'); // optionally provide additional clarification in either case (expected/unexpected)
 * 
 * - Error Pass Through
 * 
 *   Within a mid-level service, you may capture an error from a lower
 *   point and supplement it as follows:
 * 
 *     catch(err) {
 *       throw err.defineUserMsg('You did not bla')           // ONLY INVOKE if this is an expected condition - otherwise default to: 'Unexpected Condition'
 *                .defineAttemptingToMsg('log into the app'); // optionally provide additional clarification in either case (expected/unexpected)
 *     }
 * 
 * - Error Consumption (by client)
 * 
 *   Using these enhancements, the client can abstractly apply various
 *   heuristics, such as:
 *
 *     - if logging is necessary
 *       * if so, reveal complete context (internal details and user context)
 *     - if user notification necessary
 *       * if so supply info suitable for human consumption
 * 
 *   For more usage scenarios, please refer to the discloseError.js utility.
 */

/* eslint-disable no-extend-native */  // we are very careful NOT to break native behavior of the Error object

if (!Error.prototype.defineUserMsg) { // key off of one of several extension points

  /**
   * Define a user-specific message, that is applicable for human
   * consumption:
   *  - both in meaning, 
   *  - and in sanitization (so as to not reveal any internal architecture).
   *
   * This method also delineates the error as an expected condition.
   *
   * @param {String} userMsg the user message to define
   *
   * @return {Error} self, supporting convenient Error method chaining.
   */
  Error.prototype.defineUserMsg = function(userMsg) {
    this.userMsg  = userMsg;
    this.expected = true;
    return this;
  };
  Error.prototype.userMsg = "Unexpected Condition"; // prototype provides the default


  /**
   * Return an indicator as to whether this error was
   * expected (say user input error),
   * or not (say a catastrophic error).
   *
   * @return {boolean} error expected (true) or not (false).
   */
  Error.prototype.isExpected = function() {
    return this.expected;
  };
  Error.prototype.expected = false; // prototype provides the default


  /**
   * Return an indicator as to whether this error was
   * unexpected (say a catastrophic error),
   * or not (say user input error).
   *
   * @return {boolean} error unexpected (true) or not (false).
   */
  Error.prototype.isUnexpected = function() {
    return !this.expected;
  };


  /**
   * Define a user-specific 'attempting to' message, that provides
   * additional details of what was being attempted.
   *
   * Errors with this context are prefixed with ' ... attempting to: ',
   * so word your phrasing appropriately.
   * 
   * Multiple attempting-to phrases can be used, which will be
   * combined with the ', -and- ' phrase.
   *
   * @param {String} attemptingToMsg the user-specific attempting
   * to' message.
   *
   * @return {Error} self, supporting convenient Error method chaining.
   */
  Error.prototype.defineAttemptingToMsg = function(attemptingToMsg) {
    if (this.attemptingToMsg) // append multiples
      this.attemptingToMsg += `, -and- ${attemptingToMsg}`;
    else                      // initial definition
      this.attemptingToMsg += ` ... attempting to: ${attemptingToMsg}`;
    return this;
  };
  Error.prototype.attemptingToMsg = ''; // prototype provides the default


  /**
   * Format a user-specific message, combining all user-specific contexts.
   *
   * @return {string} formatted user message.
   */
  Error.prototype.formatUserMsg = function() {
    return this.userMsg + this.attemptingToMsg;
  };


  /**
   * Extend the Error toString() to prefix user-specific context.
   */
  const prior_toString = Error.prototype.toString; // monkey patch
  Error.prototype.toString = function() {
    return prior_toString.call(this) + '\n\nUser Msg: ' + this.formatUserMsg();
  };


  // L8TR:
  // /**
  //  * Define an indicator as to the cause of this error ... used to apply
  //  * various heuristics, such as whether logging is necessary.
  //  *
  //  * The following indicators are available:
  //  *   Error.Cause {
  //  *     UNEXPECTED_CONDITION        [default]
  //  *     RECOGNIZED_USER_ERROR
  //  *   }
  //  *
  //  * @param {String} cause one of Error.Cause.
  //  *
  //  * @return {Error} self, supporting convenient Error method chaining.
  //  */
  // Error.prototype.defineCause = function(cause) {
  //   this.cause = cause;
  //   return this;
  // };
  // 
  // Error.Cause = {
  //   UNEXPECTED_CONDITION:    'UNEXPECTED_CONDITION',
  //   RECOGNIZED_USER_ERROR: 'RECOGNIZED_USER_ERROR'
  // };
  // 
  // Error.prototype.cause = Error.Cause.UNEXPECTED_CONDITION; // prototype provides the default

}
