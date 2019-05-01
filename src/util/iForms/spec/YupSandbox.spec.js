import * as Yup from 'yup';

describe('Yup sandbox tests', () => {

  describe('basic Yup object schema', () => {

    const schema = Yup.object().shape({
      name:    Yup.string().required(),
      age:     Yup.number().required().positive().integer(),
      email:   Yup.string().email().label('Email Address'),
      website: Yup.string().url(),
    });

    test('schema.isValid', () => {
      return schema.isValid({ // KJB: in jest, returning a promise will wait for it to resolve
        name: 'jimmy',
        age:  '24',
      })
      .then( valid => {
        expect(valid).toBe(true);
      });
    });

    test('schema.validate() of invalid obj', () => {

      // KJB: Jest promise testing is problematic prior to version 20.0.0+
      //      - my Jest is 19.0.2 (via jest-expo)
      //      - Jest has NO fail() ... they think it is an anti-pattern
      //      - in Jest 20.0.0+ they have: expect(blaPromise).rejects() ... but alas my version is old and fixed (due to jest-expo)
      //      - for promises, you must return it in your test, and Jest will wait
      //      - if you are expecting an error (rejection), you will obviously have a .catch(),
      //        * but if you attempt to have a .then() with a simulated fail (via some bad expect), it filters into the .catch()
      //      - the ONLY feasible way to do this is:
      //        * have a .catch() only ... DO NOT HAVE A .then()
      //        * prefix entire test with expect.assertions( {numberOfExpects} ) ... to insure all tests were reasoned about
    
      expect.assertions(2); // only way to insure the catch() clause is executed with ALL assertions (see above)

      return schema.validate({
        name:  'jimmy',
        age:   '-24',            // age must be a positive number
        email: 'meMail.com',     // email must be a valid email (missing @)
      },
      { // options
        abortEarly: false,       // return ALL errors
      })
      .catch( err => {
        // transform into our errors format:
        //   errors: {
        //     age:   'age must be a positive number',
        //     email: 'Email Address must be a valid email',
        //   }
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        expect(errors.age).toBe('age must be a positive number');
        expect(errors.email).toBe('Email Address must be a valid email');
      });
    });



    test('schema.describe() fetching meta info, like label', () => {

      const fieldNames = Object.keys(schema.fields);

      // for each field, we can glean their label (fallback to fieldName when NO label)
      const labels = fieldNames.reduce( (labels, fieldName) => {
        labels[fieldName] = schema.fields[fieldName].describe().label || fieldName;
        return labels;
      }, {});

      // ? const labels = {};
      // ? for (const fieldName of fieldNames) {
      // ?   // verbose form
      // ?   // const fieldSchema  = schema.fields[fieldName];
      // ?   // const fieldDetails = fieldSchema.describe();
      // ?   // const label        = fieldDetails.label || fieldName;
      // ?   // console.log(`xxx label for field ${fieldName}: '${label}'`);
      // ?   // concise form:
      // ?   const label = schema.fields[fieldName].describe().label || fieldName;
      // ?   // console.log(`xxx label for field ${fieldName}: '${label}'`);
      // ?   labels[fieldName] = label;
      // ? }
      // ? console.log(`xxx labels: `, labels);
      
      expect(labels.age).toBe('age');
      expect(labels.email).toBe('Email Address');

    });

  });

});


// NOTE: here is what Jest returns on validation errors (with abortEarly: false ... returning ALL errors)

// catch ...
// ValidationError {
//   name: 'ValidationError',
//   value: { email: 'poop', age: -24, name: 'jimmy' },
//   path: undefined,
//   type: undefined,
//   errors:
//          [ 'age must be a positive number',
//            'email must be a valid email' ],
//   inner: <<< KEY
//         [ ValidationError {
//             name: 'ValidationError',
//             value: -24,
//             path: 'age', <<< KEY
//             type: 'min',
//             errors: [Object],
//             inner: [],
//             message: 'age must be a positive number', <<< KEY
//             params: [Object] },
//           ValidationError {
//             name: 'ValidationError',
//             value: 'poop',
//             path: 'email', <<< KEY
//             type: undefined,
//             errors: [Object],
//             inner: [],
//             message: 'email must be a valid email', <<< KEY
//             params: [Object] } ],
//   message: '2 errors occurred' }
