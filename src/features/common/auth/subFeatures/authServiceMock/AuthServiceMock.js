import AuthServiceAPI from '../authService/AuthServiceAPI';
import User           from '../authService/User';
import featureFlags   from 'featureFlags';

/**
 * AuthServiceMock is the **mock** AuthServiceAPI derivation.
 * 
 * NOTE: This represents a persistent service, where the active user
 *       is retained between service invocations.
 */
export default class AuthServiceMock extends AuthServiceAPI {

  constructor() {
    super();
    !featureFlags.useWIFI && console.log('***eatery-nod-w*** mocking AuthService (via AuthServiceMock)');
  }

  /**
   * Our "current" active user, retained between service invocations,
   * null for none (i.e. signed-out).
   */
  currentAppUser = null; // type: User (our application User object)


  async signIn(email, pass) { // ... see AuthServiceAPI

    //***
    //*** stimulate various errors with variations in email/pass
    //***

    // unexpected condition
    if (pass === 'unexpect') {
      throw new Error(`***ERROR*** Simulated Unexpected Condition`)
                  .defineAttemptingToMsg('sign in to eatery-nod');
    }

    // expected condition
    if (pass === 'expect') {
      throw new Error(`***ERROR*** Invalid Password`) // do NOT expose details to the user (e.g. Invalid Password)
                  .defineUserMsg('Invalid SignIn credentials.') // keep generic
                  .defineAttemptingToMsg('sign in to eatery-nod');
    }

    //***
    //*** sign in the supplied user
    //***

    // define our mock user
    this.currentAppUser = new User({
      "name":          "MockGuy",
      email,
      "emailVerified": false,
      "pool":          "mock"
    });

    // simulate user unverified
    if (pass === 'unverify') {
      return this.currentAppUser;
    }

    // all other cases: user is verified
    this.currentAppUser.emailVerified = true;
    return this.currentAppUser;

  }


  async refreshUser() { // ... see AuthServiceAPI
    // very simple mock ... assume they have now been verified
    this.currentAppUser = this.currentAppUser.clone();
    this.currentAppUser.emailVerified = true;
    return this.currentAppUser;
  }


  resendEmailVerification() { // ... see AuthServiceAPI
    // NOTHING TO DO :-)
  }


  async signOut() { // ... see AuthServiceAPI
    this.currentAppUser = null; // reset our local User object, now that we are signed-out
  }

};
