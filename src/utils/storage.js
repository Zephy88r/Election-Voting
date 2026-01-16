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

/**
 * Storage Helper Functions for Voting System
 * Centralized LocalStorage/SessionStorage logic for easy backend migration
 * TODO: Replace all methods with API calls when backend is ready
 */

// Storage keys
const USERS_STORAGE_KEY = 'voting_system_users';
const AUTH_STORAGE_KEY = 'voting_system_auth';

export const storageHelper = {
  /**
   * Get all users from LocalStorage
   * TODO: Replace with GET /api/users endpoint
   * @returns {Array} - Array of user objects
   */
  getUsers: () => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users from storage:', error);
      return [];
    }
  },

  /**
   * Add a new user to LocalStorage
   * TODO: Replace with POST /api/auth/register endpoint
   * @param {object} userData - User data to add
   * @returns {object} - Created user object with id and createdAt
   */
  addUser: (userData) => {
    try {
      const users = storageHelper.getUsers();
      const newUser = {
        id: crypto.randomUUID ? crypto.randomUUID() : `user_${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('Error adding user to storage:', error);
      throw error;
    }
  },

  /**
   * Find user by email and password
   * TODO: Replace with POST /api/auth/login endpoint
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {object|null} - User object if found, null otherwise
   */
  findUserByCredentials: (email, password) => {
    try {
      const users = storageHelper.getUsers();
      return users.find(
        (u) => u.email === email && u.password === password
      ) || null;
    } catch (error) {
      console.error('Error finding user by credentials:', error);
      return null;
    }
  },

  /**
   * Get authentication state from SessionStorage
   * TODO: Replace with GET /api/auth/me (with JWT token)
   * @returns {object|null} - Auth state object or null
   */
  getAuthState: () => {
    try {
      const auth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return auth ? JSON.parse(auth) : null;
    } catch (error) {
      console.error('Error getting auth state from storage:', error);
      return null;
    }
  },

  /**
   * Set authentication state in SessionStorage
   * TODO: Replace with JWT token storage when backend is ready
   * @param {object} authState - Auth state object
   */
  setAuthState: (authState) => {
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Error setting auth state in storage:', error);
      throw error;
    }
  },

  /**
   * Clear authentication state from SessionStorage
   * TODO: Replace with POST /api/auth/logout endpoint
   */
  clearAuthState: () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY); // Also clear from localStorage if using remember me
    } catch (error) {
      console.error('Error clearing auth state from storage:', error);
    }
  },

  /**
   * Set authentication state in LocalStorage (for Remember Me)
   * TODO: Replace with JWT token storage when backend is ready
   * @param {object} authState - Auth state object
   */
  setAuthStatePersistent: (authState) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Error setting persistent auth state in storage:', error);
      throw error;
    }
  },

  /**
   * Get authentication state from LocalStorage (for Remember Me)
   * TODO: Replace with GET /api/auth/me (with JWT token)
   * @returns {object|null} - Auth state object or null
   */
  getAuthStatePersistent: () => {
    try {
      const auth = localStorage.getItem(AUTH_STORAGE_KEY);
      return auth ? JSON.parse(auth) : null;
    } catch (error) {
      console.error('Error getting persistent auth state from storage:', error);
      return null;
    }
  },
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
  storageHelper,
};
