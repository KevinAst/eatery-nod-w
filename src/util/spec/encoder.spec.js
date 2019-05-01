import {encode, decode}  from '../encoder'; // modules under test

describe('encoder tests', () => {

  describe('encoded string tests', () => {

    const genesisStr = "Now is the time for all good men to come to the aid of their country!";

    describe('NON-safeguarded', () => {
      const encodedStr = encode(genesisStr);
      const decodedStr = decode(encodedStr);
      // console.log(`xx encodedStr: '${encodedStr}'`); // just for fun
      // ... encodedStr: 'Now is the time for all good men to come to the aid of their country!'

      test('go full circle', () => {
        expect(genesisStr).toEqual(decodedStr);
      });
    });

    describe('safeguarded', () => {
      const encodedStr = encode(genesisStr, true);
      const decodedStr = decode(encodedStr);
      // console.log(`xx encodedStr: '${encodedStr}'`); // just for fun
      // ... encodedStr: 'afesaTm93IGlzIHRoZSB0aW1lIGZvciBhbGwgZ29vZCBtZW4gdG8gY29tZSB0byB0aGUgYWlkIG9mIHRoZWlyIGNvdW50cnkh'
      
      test('go full circle', () => {
        expect(genesisStr).toEqual(decodedStr);
      });
    });

  });

  describe('encoded object tests', () => {

    const genesisObj = {
      wowZee: 'This is a test',
      wooWoo: 123,
      womBee: 'I hope it works',
      wooLoo: 'Here we go!!',
    };

    describe('NON-safeguarded', () => {
      const encodedStr = encode(genesisObj);
      const decodedObj = decode(encodedStr);
      // console.log(`xx encodedStr: '${encodedStr}'`); // just for fun
      // console.log('xx decodedObj: ', decodedObj);    // just for fun
      // ... encodedStr: 'obj2str:{"wowZee":"This is a test","wooWoo":123,"womBee":"I hope it works","wooLoo":"Here we go!!"}'

      // TEMP: FAIL TEST to insure it is detecting results correctly
      // decodedObj.POO = 'POOP';

      test('go full circle', () => {
        expect(genesisObj).toEqual(decodedObj);
      });
    });

    describe('safeguarded', () => {
      const encodedStr = encode(genesisObj, true);
      const decodedObj = decode(encodedStr);
      // console.log(`xx encodedStr: '${encodedStr}'`); // just for fun
      // console.log('xx decodedObj: ', decodedObj);    // just for fun
      // ... encodedStr: 'afesab2JqMnN0cjp7Indvd1plZSI6IlRoaXMgaXMgYSB0ZXN0Iiwid29vV29vIjoxMjMsIndvbUJlZSI6IkkgaG9wZSBpdCB3b3JrcyIsIndvb0xvbyI6IkhlcmUgd2UgZ28hISJ9'

      // TEMP: FAIL TEST to insure it is detecting results correctly
      // decodedObj.POO = 'POOP';

      test('go full circle', () => {
        expect(genesisObj).toEqual(decodedObj);
      });
    });

  });


  describe('decoding pass through', () => {

    const str = 'I am CLEAR TEXT!!'; 
    test('clear string pass through', () => {
      expect(decode(str)).toBe(str);
    });

    const date = new Date();
    test('date pass through', () => {
      expect(decode(date)).toBe(date);
    });

    const num = 123;
    test('num pass through', () => {
      expect(decode(num)).toBe(num);
    });

    const obj = {
      prop1: 'this is a clear object',
      prop2: 'I hope it works',
    };
    test('object pass through', () => {
      expect(decode(obj)).toBe(obj);
    });

  });


  describe('error conditions', () => {

    test('decode() requires ref param', () => {
      expect( () => decode() )
        .toThrow(/parameter violation: ref is required/);
      // THROW: decode(ref) parameter violation: ref is required
    });

    test('encode() requires ref param', () => {
      expect( () => encode() )
        .toThrow(/parameter violation: ref is required/);
      // THROW: encode(ref) parameter violation: ref is required
    });

    test('encode() ref param must be string -or- object', () => {
      expect( () => encode(123) )
        .toThrow(/parameter violation: ref must be a string -or- an object literal/);
      // THROW: encode(ref) parameter violation: ref must be a string -or- an object literal
    });

  });


  describe('safeguard API Keys', () => {

    //***
    //*** CAUTION: This test is used as a utility to safeguard sensitive data.
    //***          BE SURE TO **NOT** CHECK IN SENSITIVE DATA!!!
    //***

    describe('encode API Keys', () => {
      const genesis = null; // DO NOT CHECK IN SENSITIVE DATA!  Temporarily change this to one of your API Keys (a string or an object :-)
      if (genesis) {
        const encoded = encode(genesis, true);

        console.log('*** encode API Keys ***');
        console.log('genesis: ', genesis);
        console.log('encoded: ', encoded);
      }
    });

    describe('decode API Keys', () => {
      const genesis = null; // DO NOT CHECK IN SENSITIVE DATA!  Temporarily change this to an encoded API Key (an obfuscated string :-)
      if (genesis) {
        const decoded = decode(genesis);

        console.log('*** decode API Keys ***');
        console.log('genesis: ', genesis);
        console.log('decoded: ', decoded);
      }
    });

  });

});
