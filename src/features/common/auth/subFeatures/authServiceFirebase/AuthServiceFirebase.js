import firebase       from 'firebase/app';
import                     'firebase/auth';
import                     'firebase/database';
import AuthServiceAPI from '../authService/AuthServiceAPI';
import User           from '../authService/User';

/**
 * AuthServiceFirebase is the **real** AuthServiceAPI derivation
 * using the Firebase service APIs.
 * 
 * NOTE: This represents a persistent service, where the active user
 *       is retained between service invocations.
 */
export default class AuthServiceFirebase extends AuthServiceAPI {

  /**
   * Our "current" active user, retained between service invocations,
   * null for none (i.e. signed-out).
   * 
   * NOTE: Firebase also maintains it's rendition of current user,
   *       available via `firebase.auth().currentUser`.  However, this
   *       service supplements the user with additional information
   *       from the app's DB userProfile.
   */
  currentAppUser = null; // type: User (our application User object)

  /**
   * Sign in to our authorization provider (asynchronously).
   * 
   * @param {String} email the identifying user email
   * @param {String} pass the user password
   *
   * @returns {User} the signed-in eatery-nod User object.  NOTE: This
   * returned user may still be in an unverified state.
   */
  async signIn(email, pass) {

    // detect guest signin and return immediately
    if (pass === 'guestNO' && email.indexOf('guestNO@') === 0) { // New Orleans guest ... ex: guestNO@gmail.com/guestNO
      // NOTE: appears to be working without a delay from say a timeout
      this.currentAppUser = new User({
        name:          'Harry',
        email,
        emailVerified: true,
        pool:          'mockNO',
        guestLoc:      {lat: 30.010479, lng: -90.119414}, // New Orleans, LA
      });
      return this.currentAppUser;
    }
    
    try {
      // signin through firebase authentication
      //    fbUser:  <firebase.User>: https://firebase.google.com/docs/reference/js/firebase.User
      //    same as: firebase.auth().currentUser
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
      const fbUser         = userCredential.user;

      // supplement the signed-in fbUser with our app's DB userProfile
      const dbRef = firebase.database().ref(`/userProfiles/${fbUser.uid}`);
      try { // detect user profile issue
        const snapshot    = await dbRef.once('value');
        const userProfile = snapshot.val();
        // console.log(`xx AuthServiceFirebase.signIn() userProfile: `, userProfile)
        
        // communicate issue: missing userProfile in our DB
        if (!userProfile) {
          throw new Error(`***ERROR*** No userProfile exists for user: ${fbUser.user.email}`)
                      .defineAttemptingToMsg('sign in to eatery-nod (your user profile does NOT exist)');
        }
        
        // retain/communicate our user object, populated from both the fbUser and userProfile
        this.currentAppUser = new User({
          name:          userProfile.name,
          email:         fbUser.email,
          emailVerified: fbUser.emailVerified,
          pool:          userProfile.pool,
        });
        // console.log(`xx MOCK RECORDING from AuthServiceFirebase.signIn(...): returning User: ${JSON.stringify(this.currentAppUser.toStruct())}`);
        return this.currentAppUser;
      }
      catch(err) { // user profile issue
        // re-throw enhanced err
        if (!err.attemptingToMsg) // ... qualify only if NOT done above
          err.defineAttemptingToMsg('sign in to eatery-nod (a problem was encountered fetching your user profile)');
        throw err;
      }
    }
    catch(err) { // general issue
      // NOTE: When firebase:
      //       - provides an err.code, this enumerates a user specific credentials problem (like "invalid password")
      //         ... we do NOT expose this to the user (so as to NOT give hacker insight)
      //             rather we generalize it to the user ('Invalid SignIn credentials.')
      //       - when NO err.code is supplied, it represents an unexpected condition
      if (err.code) { // expected condition
        err.defineUserMsg('Invalid SignIn credentials.'); // make generic ... do NOT expose err.code to the user
      }
      else { // unexpected condition
        if (!err.attemptingToMsg) // ... qualify only if NOT done above
          err.defineAttemptingToMsg('sign in to eatery-nod');
      }

      // re-throw enhanced err
      throw err;
    }
  }


  /**
   * Refresh the current signed-in user (asynchronously).
   *
   * This method is typically used to insure the authorization status
   * is up-to-date.
   * 
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   * 
   * @returns {User} the refreshed signed-in eatery-nod User object.
   * NOTE: The returned user may still be in an unverified state.
   */
  async refreshUser() {

    // verify we have a current user to refresh
    if (this.currentAppUser === null) {
      // unexpected condition
      throw new Error('***ERROR*** (within app logic) AuthServiceFirebase.refreshUser(): may only be called once a successful signIn() has completed.')
              .defineAttemptingToMsg('refresh a non-existent user (not yet signed in)');
    }

    try {
      // refresh our current signed-in user
      await firebase.auth().currentUser.reload();

      // NOTE: the service (above) returns void
      //       ... however, the firebase.auth().currentUser has been updated!
      const fbUser = firebase.auth().currentUser;

      // refresh our signed-in user
      // ... just for good measure, we create a new instance of this.currentAppUser, rather than mutating the existing one
      //     - just in case it is held directly in redux
      //     - even though client SHOULD use user.toStruct()
      this.currentAppUser = new User({
        name:          this.currentAppUser.name,  // keep same (from our db profile)
        email:         fbUser.email,              // refresh   (from current firebase auth)
        emailVerified: fbUser.emailVerified,      // refresh   (from current firebase auth)
        pool:          this.currentAppUser.pool,  // keep same (from our db profile)
      });

      // communicate our refreshed signed-in user
      return this.currentAppUser;
    }
    catch(err) {
      // re-throw enhanced err
      throw err.defineAttemptingToMsg('refresh the signed-in user');
    }
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
    // verify we have a current user to resend to
    if (this.currentAppUser === null) {
      // unexpected condition
      throw new Error('***ERROR*** (within app logic) AuthServiceFirebase.resendEmailVerification(): may only be called once a successful signIn() has completed.')
        .defineAttemptingToMsg('resend an email verification to a non-existent user (not yet signed in)');
    }

    // issue the email request
    firebase.auth().currentUser.sendEmailVerification();
  }


  /**
   * Sign-out the current signed-in user (asynchronously).
   *
   * This method can only be called, once a successful signIn() has
   * completed, because of the persistent nature of this service.
   */
  async signOut() {

    // verify we have a current user to signOut
    if (this.currentAppUser === null) {
      // unexpected condition
      throw new Error('***ERROR*** (within app logic) AuthServiceFirebase.signOut(): may only be called once a successful signIn() has completed.')
              .defineAttemptingToMsg('sign-out a non-existent user (not yet signed in)');
    }
    
    try {
      // sign out of firebase
      await firebase.auth().signOut();
    
      // reset our local User object, now that we are signed-out
      this.currentAppUser = null;
    }
    catch(err) {
      // re-throw enhanced err
      throw err.defineAttemptingToMsg('sign-out the user');
    }
  }

};
