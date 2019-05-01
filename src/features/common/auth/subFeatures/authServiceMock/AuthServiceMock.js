import AuthServiceAPI from '../authService/AuthServiceAPI';
import User           from '../authService/User';

/**
 * AuthServiceMock is the **mock** AuthServiceAPI derivation.
 * 
 * NOTE: This represents a persistent service, where the active user
 *       is retained between service invocations.
 */
export default class AuthServiceMock extends AuthServiceAPI {

  /**
   * Our "current" active user, retained between service invocations,
   * null for none (i.e. signed-out).
   */
  currentAppUser = null; // type: User (our application User object)


  signIn(email, pass) { // ... see AuthServiceAPI

    return new Promise( (resolve, reject) => {

      // stimulate various errors with variations in email/pass
      if (pass === 'unexpect') { // ... unexpected condition
        return reject(
          new Error(`***ERROR*** Simulated Unexpected Condition`)
            .defineAttemptingToMsg('sign in to eatery-nod')
        );
      }

      if (pass === 'expect') { // ... expected condition
        return reject(
          new Error(`***ERROR*** Invalid Password`) // do NOT expose details to the user (e.g. Invalid Password)
            .defineUserMsg('Invalid SignIn credentials.') // keep generic
            .defineAttemptingToMsg('sign in to eatery-nod')
        );
      }

      // define our mock user
      this.currentAppUser = new User({
        "name":          "MockGuy",
        email,
        "emailVerified": false,
        "pool":          "mock"
      });

      // sign in the supplied user
      if (pass === 'unverify') { // ... simulate user unverified
        return resolve(this.currentAppUser);
      }

      // ... all other cases: user is verified
      this.currentAppUser.emailVerified = true;
      return resolve(this.currentAppUser);

    });
  }


  refreshUser() { // ... see AuthServiceAPI
    return new Promise( (resolve, reject) => {
      // very simple mock ... assume they have now been verified
      this.currentAppUser = this.currentAppUser.clone();
      this.currentAppUser.emailVerified = true;
      return resolve(this.currentAppUser);

    });
  }


  resendEmailVerification() { // ... see AuthServiceAPI
    // NOTHING TO DO :-)
  }


  signOut() { // ... see AuthServiceAPI
    return new Promise( (resolve, reject) => {
      this.currentAppUser = null; // reset our local User object, now that we are signed-out
      return resolve(undefined);
    });
  }

};
