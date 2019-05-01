import {storeItem,
        fetchItem,
        removeItem}   from 'util/deviceStorage';

/**
 * Store uiTheme on local device.
 * 
 * @param {string} uiTheme the UI Theme to store.
 */
export function storeUITheme(uiTheme) {
  storeItem(uiThemeKey, uiTheme);
}

/**
 * Fetch uiTheme stored on local device (if any).
 * 
 * @return {string} the persisted UI Theme (null for none).
 */
export function fetchUITheme() {
  return fetchItem(uiThemeKey);
}

/**
 * Remove uiTheme from local device.
 */
export function removeUITheme() {
  removeItem(uiThemeKey);
}

const uiThemeKey = 'uiTheme';
