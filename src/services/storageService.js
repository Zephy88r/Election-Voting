/**
 * Storage Service
 * Wrapper around storage utilities for consistent data access
 * All localStorage operations should go through this service
 */

import * as storageUtils from '../utils/storage';

/**
 * Storage Service
 * Provides methods for storing and retrieving application data
 */
class StorageService {
  /**
   * Get users array from storage
   * @returns {Array} - Array of users
   */
  getUsers() {
    return storageUtils.getItem('users') || [];
  }

  /**
   * Save users array to storage
   * @param {Array} users - Array of users
   */
  setUsers(users) {
    storageUtils.setItem('users', users);
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @returns {any} - Stored value
   */
  getItem(key) {
    return storageUtils.getItem(key);
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  setItem(key, value) {
    storageUtils.setItem(key, value);
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    storageUtils.removeItem(key);
  }

  /**
   * Clear all storage
   */
  clearAll() {
    storageUtils.clearAll();
  }
}

export const storage = new StorageService();
