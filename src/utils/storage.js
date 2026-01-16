/**
 * Storage Utilities
 * Secure localStorage wrapper with encryption support
 * Ready for backend migration - all data operations go through this service
 */

const STORAGE_PREFIX = 'nepal_election_';

/**
 * Get storage key with prefix
 * @param {string} key - Storage key
 * @returns {string} - Prefixed key
 */
const getStorageKey = (key) => `${STORAGE_PREFIX}${key}`;

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {boolean} usePrefix - Whether to use prefix (default: true)
 * @returns {any} - Stored value or null
 */
export const getItem = (key, usePrefix = true) => {
  try {
    const storageKey = usePrefix ? getStorageKey(key) : key;
    const item = localStorage.getItem(storageKey);
    
    if (!item) return null;
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error getting item from storage (${key}):`, error);
    return null;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {boolean} usePrefix - Whether to use prefix (default: true)
 */
export const setItem = (key, value, usePrefix = true) => {
  try {
    const storageKey = usePrefix ? getStorageKey(key) : key;
    const item = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(storageKey, item);
  } catch (error) {
    console.error(`Error setting item in storage (${key}):`, error);
    
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please clear some data and try again.');
    }
    throw error;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @param {boolean} usePrefix - Whether to use prefix (default: true)
 */
export const removeItem = (key, usePrefix = true) => {
  try {
    const storageKey = usePrefix ? getStorageKey(key) : key;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error removing item from storage (${key}):`, error);
  }
};

/**
 * Clear all items with prefix from localStorage
 */
export const clearAll = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Check if item exists in localStorage
 * @param {string} key - Storage key
 * @param {boolean} usePrefix - Whether to use prefix (default: true)
 * @returns {boolean} - True if item exists
 */
export const hasItem = (key, usePrefix = true) => {
  const storageKey = usePrefix ? getStorageKey(key) : key;
  return localStorage.getItem(storageKey) !== null;
};

/**
 * Get all keys with prefix
 * @returns {string[]} - Array of keys
 */
export const getAllKeys = () => {
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''));
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Simple encryption/decryption (for sensitive data)
 * Note: This is basic obfuscation. For production, use proper encryption libraries
 */

/**
 * Simple base64 encoding (not secure, just obfuscation)
 * @param {string} data - Data to encode
 * @returns {string} - Encoded string
 */
const encode = (data) => {
  try {
    return btoa(encodeURIComponent(data));
  } catch (error) {
    console.error('Encoding error:', error);
    return data;
  }
};

/**
 * Simple base64 decoding
 * @param {string} data - Encoded data
 * @returns {string} - Decoded string
 */
const decode = (data) => {
  try {
    return decodeURIComponent(atob(data));
  } catch (error) {
    console.error('Decoding error:', error);
    return data;
  }
};

/**
 * Set encrypted item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to encrypt and store
 */
export const setEncryptedItem = (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const encrypted = encode(stringValue);
    setItem(key, encrypted);
  } catch (error) {
    console.error(`Error setting encrypted item (${key}):`, error);
    throw error;
  }
};

/**
 * Get and decrypt item from localStorage
 * @param {string} key - Storage key
 * @returns {any} - Decrypted value or null
 */
export const getEncryptedItem = (key) => {
  try {
    const encrypted = getItem(key);
    if (!encrypted) return null;
    
    const decrypted = decode(encrypted);
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error(`Error getting encrypted item (${key}):`, error);
    return null;
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  hasItem,
  getAllKeys,
  setEncryptedItem,
  getEncryptedItem,
};
