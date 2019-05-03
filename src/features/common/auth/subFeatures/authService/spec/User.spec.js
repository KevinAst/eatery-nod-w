import User  from '../User'; // modules under test

describe('User object tests', () => {

  describe('Basic Instantiation', () => {

    const user = new User({
      name:          'myName',
      email:         'myEmail',
      emailVerified: false,
      pool:          'myPool',
    });

    describe('Attributes Checks', () => {
      test('name',          () => expect(user.name).toEqual('myName'));
      test('email',         () => expect(user.email).toEqual('myEmail'));
      test('emailVerified', () => expect(user.emailVerified).toEqual(false));
      test('pool',          () => expect(user.pool).toEqual('myPool'));
      test('pool',          () => expect(user.pool).toEqual('myPool'));
    });

    describe('Accessor Checks', () => {
      test('isUserSignedOut()',          () => expect(user.isUserSignedOut()).toEqual(false));
      test('isUserSignedIn()',           () => expect(user.isUserSignedIn()).toEqual(false)); // because email NOT verified
      test('isUserSignedInUnverified()', () => expect(user.isUserSignedInUnverified()).toEqual(true));
      test('getAuthStatus()',            () => expect(user.getAuthStatus()).toEqual('signedInUnverified'));
      test('isGuest()',                  () => expect(user.isGuest()).toEqual(false));
    });

  });

  describe('Error Conditions', () => {

    test('unrecognized param', () => {
      expect( () => new User({badName: 'yikes'}) )
        .toThrow(/User.*constructor parameter violation: unrecognized named parameter.*badName/);
      // THROW: User() constructor parameter violation: unrecognized named parameter(s): badName
    });

    test('unrecognized positional parameters', () => {
      expect( () => new User(undefined, 123) )
        .toThrow(/User.*constructor parameter violation: unrecognized positional parameters.*only named parameters can be specified/);
      // THROW: User() constructor parameter violation: unrecognized positional parameters (only named parameters can be specified)
    });

  });


  describe('Guest User', () => {

    const guestUser = new User({
      name:          'myName',
      email:         'myEmail',
      emailVerified: true,
      pool:          'myPool',
      guestLoc:      {lat: 1, lng: 2},
      originalLoc:   {lat: 3, lng: 4}, // in production, this is "supplemented" through logic modules, but this is "good" for testing
    });

    test('isGuest()',   () => expect(guestUser.isGuest()).toEqual(true));
    test('guestLoc',    () => expect(guestUser.guestLoc).toEqual({lat: 1, lng: 2}));
    test('originalLoc', () => expect(guestUser.originalLoc).toEqual({lat: 3, lng: 4}));

    describe('Cloned Guest User', () => {

      const clonedUser = guestUser.clone();

      test('cloned new instance', () => {
        expect(clonedUser).not.toBe(guestUser);
      });

      test('cloned attributes', () => {
        expect(clonedUser).toEqual({
          name:          'myName',
          email:         'myEmail',
          emailVerified: true,
          pool:          'myPool',
          guestLoc:      {lat: 1, lng: 2},
          originalLoc:   {lat: 3, lng: 4},
        });
      });

    });

  });


  describe('User Encoding', () => {

    const user = new User({
      name:          'myName',
      email:         'myEmail',
      emailVerified: true,
      pool:          'myPool',
    });

    test('toStruct()', () => {
      expect(user.toStruct()).toEqual({
        name:          'myName',
        email:         'myEmail',
        emailVerified: true,
        pool:          'myPool',
        guestLoc:      null,
        originalLoc:   null,
      });
    });

  });

  describe('User Cloning', () => {

    const user = new User({
      name:          'myName',
      email:         'myEmail',
      emailVerified: true,
      pool:          'myPool',
    });

    const clonedUser = user.clone();

    test('cloned new instance', () => {
      expect(clonedUser).not.toBe(user);
    });

    test('cloned attributes', () => {
      expect(clonedUser).toEqual({
        name:          'myName',
        email:         'myEmail',
        emailVerified: true,
        pool:          'myPool',
        guestLoc:      null,
        originalLoc:   null,
      });
    });

  });

});
