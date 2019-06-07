import {storeItem,
        fetchItem,
        removeItem}   from 'util/deviceStorage';

/**
 * Store the responsiveMode on local device.
 * 
 * @param {string} responsiveMode the "responsive mode" to store.
 */
export function storeResponsiveMode(responsiveMode) {
  storeItem(responsiveModeKey, responsiveMode);
}

/**
 * Fetch responsiveMode stored on local device (if any).
 * 
 * @return {string} the persisted "responsive mode" (null for none).
 */
export function fetchResponsiveMode() {
  return fetchItem(responsiveModeKey);
}

/**
 * Remove responsiveMode from local device.
 */
export function removeResponsiveMode() {
  removeItem(responsiveModeKey);
}

const responsiveModeKey = 'responsiveMode';
