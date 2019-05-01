/**
 * AuthServiceAPI is a "pseudo" interface specifying the AuthService API
 * which all implementations (i.e. derivations) must conform.
 * 
 * NOTE: This represents a persistent service, where the active user
 *       is retained between service invocations.
 */
export default class AuthServiceAPI {

  /**
   * Sign in to our authorization provider (asynchronously).
   * 
   * @param {String} email the identifying user email
   * @param {String} pass the user password
   *
   * @returns {User via promise} the signed-in eatery-nod User object.
   * NOTE: This returned user may still be in an unverified state.
   */
  signIn(email, pass) {
    throw new Error(`***ERROR*** ${this.constructor.name}.signIn() is a required service method that has NOT been implemented`);
  }


  /**
   * Refresh the current signed-in user.
   *
   * This method is typically used to insure the authorization status
   * is up-to-date.
   * 
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   * 
   * @returns {User via promise} the refreshed signed-in eatery-nod
   * User object.  NOTE: The returned user may still be in an
   * unverified state.
   */
  refreshUser() {
    throw new Error(`***ERROR*** ${this.constructor.name}.refreshUser() is a required service method that has NOT been implemented`);
  }


  /**
   * Resend an email notification to the current signed-in user.
   *
   * This method is used, upon user request, to resend the email
   * containing instructions on how to verify their identity.
   * 
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   */
  resendEmailVerification() {
    throw new Error(`***ERROR*** ${this.constructor.name}.resendEmailVerification() is a required service method that has NOT been implemented`);
  }


  /**
   * Sign-out the current signed-in user.
   *
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   * 
   * @returns {void via promise} a void promise is needed to capture
   * async errors.
   */
  signOut() {
    throw new Error(`***ERROR*** ${this.constructor.name}.signOut() is a required service method that has NOT been implemented`);
  }

};
