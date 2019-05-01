import {storeItem,
        fetchItem,
        removeItem}   from 'util/deviceStorage';

/**
 * Store credentials on local device in an encoded form.
 * 
 * @param {string} email the email (id) to store.
 * @param {string} pass the password to store.
 */
export function storeCredentials(email, pass) {
  storeItem(credentialsKey,
            {email, pass},
            true); // safeguard
}

/**
 * Fetch credentials stored on local device (if any).
 * 
 * @return {object} the credentials object if any (null for none):
 *   {
 *     email: string,
 *     pass:  string
 *   }
 */
export function fetchCredentials() {
  return fetchItem(credentialsKey);
}

/**
 * Remove credentials from local device.
 */
export function removeCredentials() {
  removeItem(credentialsKey);
}

const credentialsKey = 'credentials';
