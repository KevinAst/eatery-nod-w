import verify from '../../../util/verify';

/**
 * The User object representing the active user within an application,
 * holding their identity, authorization status, and profile.
 *
 * NOTE: Using the default constructor, a User object can always be
 *       made available, even when no user is signed in.
 *       In this case:
 *       - all properties will be null (or false), and
 *       - more importantly the getAuthStatus() and isXyz() methods will
 *         correctly represent the 'signedOut' status.
 */
export default class User {

  /**
   * Instantiate a User object with the supplied named parameters.
   *
   * See NOTE (above) in regard to the default constructor.
   *
   * @param {string} name the user's name (e.g. 'John Doe')
   *
   * @param {string} email the user's email (used as an identifier for
   * authorization credentials).  A null value indicates NO user is
   * signed in.
   *
   * @param {boolean} emailVerified indicates whether the user's
   * email been verified (used in authorization credentials).
   *
   * @param {string} pool the user's eatery pool identifier
   * (e.g. 'DateNightPool').  This identifies the set of pool eateries
   * the user has to choose from, and can be shared with other users.
   */
                                    // INTERNAL NOTES
                                    // =================
  constructor({name=null,           // via app's DB userProfile.name
               email=null,          // via firebase.User.email
               emailVerified=false, // via firebase.User.emailVerified
               pool=null,           // via app's DB userProfile.pool
             //uid=null,            // via firebase.User.uid             user's unique id hash ... CURRENTLY NO NEED for this (internally available via firebase.auth().currentUser.uid)
               ...unknownArgs}={}) {

    // validate constructor parameters
    const check = verify.prefix('User() constructor parameter violation: ')
    // ... unrecognized named parameter
    const unknownArgKeys = Object.keys(unknownArgs);
    check(unknownArgKeys.length === 0,  `unrecognized named parameter(s): ${unknownArgKeys}`);
    // ... unrecognized positional parameter (NOTE: when defaulting entire struct, arguments.length is 0)
    check(arguments.length === 0 || arguments.length === 1, 'unrecognized positional parameters (only named parameters can be specified)');

    // retain supplied state in self
    this.name          = name;
    this.email         = email;
    this.emailVerified = emailVerified;
    this.pool          = pool;
  }


  /**
   * Return an indicator as to whether the user is signed out
   * (i.e. there is no user).
   */
  isUserSignedOut() {
    return this.email === null;
  }

  /**
   * Return an indicator as to whether the user is signed in -AND-
   * their email has been verified.
   */
  isUserSignedIn() {
    return this.email !== null && this.emailVerified;
  }

  /**
   * Return an indicator as to whether the user is signed in -HOWEVER-
   * their email needs verification.
   */
  isUserSignedInUnverified() {
    return this.email !== null && !this.emailVerified;
  }

  /**
   * Return self's authorization status string, representing all
   * permutations of the isXyx() methods:
   * 
   * - 'signedOut':          the user is signed out (i.e. there is no user)
   * - 'signedIn':           the user is signed in -AND- their email has been verified.
   * - 'signedInUnverified': the user is signed in -HOWEVER- their email needs verification.
   */
  getAuthStatus() {
    if (this.email) {
      return this.emailVerified ? 'signedIn' : 'signedInUnverified';
    }
    else {
      return 'signedOut';
    }
  }

  /**
   * Serialize self into a pure data structure (void of any methods),
   * so as to be serializable.
   *
   * This is useful in state managers (such as redux) where state must
   * be serializable.
   *
   * The returned structure is suitable to be used to re-instantiate a
   * User object, gaining the benefit of it's value-added methods.
   * 
   * @returns {struct} a pure data structure of self, suitable to
   * re-instantiate a User object.
   */
  toStruct() {
    return {
      name:          this.name,
      email:         this.email,
      emailVerified: this.emailVerified,
      pool:          this.pool,
    };
  }

  /**
   * Clone self into a new User object
   * 
   * @returns {User} the new cloned User object.
   */
  clone() {
    return new User(this.toStruct());
  }

};
