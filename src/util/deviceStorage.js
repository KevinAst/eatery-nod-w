import verify         from 'util/verify';
import isString       from 'lodash.isstring';
import isPlainObject  from 'lodash.isplainobject';
import noOp           from 'util/noOp';
import {encode,
        decode}       from 'util/encoder';

/**
 * Store the supplied entry in local device storage.
 *
 * @param {string} key the unique key that catalogs this entry.
 * @param {string|jsonObj} ref the reference to store.
 * @param {boolean} [safeguard=false] an indicator as to whether the
 * entry should be obfuscated (true) or not (false - the DEFAULT).
 */
export function storeItem(key, ref, safeguard=false) {

  // validate our parameters
  const check = verify.prefix('storeItem() parameter violation: ');

  // ... key
  check(key,           'key is required');
  check(isString(key), 'key must be a string, NOT: ', key);

  // ... ref
  check(ref,                                 'ref is required');
  check(isString(ref) || isPlainObject(ref), 'ref must be a string -or- an object literal, NOT: ', ref);

  // ... safeguard
  check(safeguard===true || safeguard===false, 'safeguard must be a boolean (true/false), NOT: ', safeguard);

  // encode the supplied ref into a string representation
  // SUPPORTING:
  //   - object encoding (to a string representation)
  //     NOTE: plain strings are NOT altered in this operation
  //   - safeguard (obfuscation)
  const value = encode(ref, safeguard);

  // store the entry into our deviceStorage
  deviceStorage.setItem(key, value);
}


/**
 * Fetch the stored entry from local device storage.
 *
 * @param {string} key the unique key that catalogs this entry.
 * 
 * @return {any} the entry stored from the supplied key (null for
 * none), implicitly unpacked to the original ref (supplied to
 * `storeItem()`).
 */
export function fetchItem(key) {

  // validate our parameters
  const check = verify.prefix('fetchItem() parameter violation: ');

  // ... key
  check(key,           'key is required');
  check(isString(key), 'key must be a string, NOT: ', key);

  // retrieve the entry from our deviceStorage
  const value = deviceStorage.getItem(key);

  // no-op for non-existent entries
  if (!value) {
    return null;
  }

  // decode the entry, unpacking it into the original form (ref)
  const ref = decode(value);

  // that's all folks :-)
  return ref;
}



/**
 * Remove the stored entry from local device storage.
 *
 * @param {string} key the unique key of the entry to remove.
 */
export function removeItem(key) {

  // validate our parameters
  const check = verify.prefix('removeItem() parameter violation: ');

  // ... key
  check(key,           'key is required');
  check(isString(key), 'key must be a string, NOT: ', key);

  // remove the entry from our local device storage
  deviceStorage.removeItem(key);
}




//***
//*** Abstract the Web Storage API (gracefully no-oping for unsupported browsers)
//***
//***  NOTE 1: This API is synchronous!
//***  NOTE 2: Apparently this API is available on both http (non SSL) as well as https (SSL).
//***

// feature detection
// ... NOTE: can't just assert window.localStorage exists
//           see: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
const _localStorageAvailable = storageAvailable('localStorage');
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    let x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
           // acknowledge QuotaExceededError only if there's something already stored
           (storage && storage.length !== 0);
  }
}

// log warning when deviceStorage is NOT in affect
if (!_localStorageAvailable) {
  console.warn('***WARNING*** deviceStorage module ... localStorage (Web Storage API) is NOT available in this browser ... all deviceStorage usage will silently no-op!!');
}

// our localStorage pass-through that gracefully no-ops for unsupported browsers
const deviceStorage = _localStorageAvailable ? {
  setItem:    (keyName, keyValue) => window.localStorage.setItem(keyName, keyValue),
  getItem:    (keyName)           => window.localStorage.getItem(keyName),
  removeItem: (keyName)           => window.localStorage.removeItem(keyName),
} : {
  setItem:    noOp,
  getItem:    noOp,
  removeItem: noOp,
};

// TEMP crude test of deviceStorage ... invoke these separately!
// deviceStorage.setItem('WowZeeKey', 'WowZeeValue');
// console.log(`test deviceStorage ... '${deviceStorage.getItem('WowZeeKey')}'`);
