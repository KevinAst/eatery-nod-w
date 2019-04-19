import {encodeContent, decodeContent}  from '../safeguardContent'; // modules under test

describe('safeguardContent tests', () => {

  describe('encoded string tests', () => {

    const genesisStr = "Now is the time for all good men to come to the aid of their country!";
    const encodedStr = encodeContent(genesisStr);
    const decodedStr = decodeContent(encodedStr);
    // console.log(`xx encodedStr: '${encodedStr}'`); // just for fun
    // ... encodedStr: 'thereTm93IGlzIHRoZSB0aW1lIGZvciBhbGwgZ29vZCBtZW4gdG8gY29tZSB0byB0aGUgYWlkIG9mIHRoZWlyIGNvdW50cnkh'

    test('go full circle', () => {
      expect(genesisStr).toEqual(decodedStr);
    });

  });


  describe('encoded object tests', () => {

    const genesisObj = {
      wowZee: 'This is a test',
      wooWoo: 123,
      womBee: 'I hope it works',
      wooLoo: 'Here we go!!',
    };
    const encodedStr = encodeContent(genesisObj);
    const decodedObj = decodeContent(encodedStr);
    // console.log(`xx encodedStr: '${encodedStr}'`); // just for fun
    // console.log('xx decodedObj: ', decodedObj);    // just for fun
    // ... encodedObj: 'theireyJ3b3daZWUiOiJUaGlzIGlzIGEgdGVzdCIsIndvb1dvbyI6MTIzLCJ3b21CZWUiOiJJIGhvcGUgaXQgd29ya3MiLCJ3b29Mb28iOiJIZXJlIHdlIGdvISEifQ=='

    // TEMP: FAIL TEST to insure it is detecting results correctly
    // decodedObj.POO = 'POOP';

    test('go full circle', () => {
      expect(genesisObj).toEqual(decodedObj);
    });

  });


  describe('decoding pass through', () => {

    const str = 'I am CLEAR TEXT!!'; 
    test('clear string pass through', () => {
      expect(decodeContent(str)).toBe(str);
    });

    const date = new Date();
    test('date pass through', () => {
      expect(decodeContent(date)).toBe(date);
    });

    const num = 123;
    test('num pass through', () => {
      expect(decodeContent(num)).toBe(num);
    });

    const obj = {
      prop1: 'this is a clear object',
      prop2: 'I hope it works',
    };
    test('object pass through', () => {
      expect(decodeContent(obj)).toBe(obj);
    });

  });


  describe('error conditions', () => {

    test('decodeContent() requires ref param', () => {
      expect( () => decodeContent() )
        .toThrow(/parameter violation: ref is required/);
        // THROW: decodeContent(ref) parameter violation: ref is required
    });

    test('encodeContent() requires ref param', () => {
      expect( () => encodeContent() )
        .toThrow(/parameter violation: ref is required/);
      // THROW: encodeContent(ref) parameter violation: ref is required
    });

    test('encodeContent() ref param must be string -or- object', () => {
      expect( () => encodeContent(123) )
        .toThrow(/parameter violation: ref must be a string -or- and object literal/);
        // THROW: encodeContent(ref) parameter violation: ref must be a string -or- and object literal
    });

  });


  describe('encrypt keys', () => {

    //***
    //*** CAUTION: this is used as a utility to encode sensitive data 
    //***          AND SHOULD NOT BE CHECKED IN!!!
    //***

    const genesis = 'DO NOT CHECK IN SENSITIVE DATA!';
    const encoded = encodeContent(genesis);

    console.log('genesis: ', genesis);
    console.log('encoded: ', encoded);
  });

});
