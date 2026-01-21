/**
 * Authentication Service
 * Centralized service for all authentication operations
 * Currently uses localStorage, but structured for easy API migration
 */

import { authAPI } from './api';
import { setToken, setLoggedInUser, removeToken, removeLoggedInUser, getToken } from '../utils/authUtils';
import { storage } from './storageService';
import { notificationService } from './notificationService';

/**
 * Authentication Service
 * Handles registration, login, logout, and profile management
 */
class AuthService {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - Response with user and token
   */
  async register(userData) {
    // Use backend API
    try {
      const response = await authAPI.register(userData);
      const user = response.user || response;
      // For session auth, store user locally for UI
      setLoggedInUser(user);
      setToken(user.id?.toString() || user.username || 'session');
      return { user };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   * @param {object} credentials - Login credentials (voterId, password, faceImage)
   * @returns {Promise<object>} - Response with user and token
   */
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      const user = response.user || response;
      setLoggedInUser(user);
      setToken(user.id?.toString() || user.username || 'session');
      return { user };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    try {
      authAPI.logout();
      removeToken();
      removeLoggedInUser();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API fails
      removeToken();
      removeLoggedInUser();
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<object>} - User profile data
   */
  async getProfile() {
    try {
      const profile = await authAPI.getProfile();
      // keep local copy
      setLoggedInUser(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await authAPI.updateProfile(userData);
      setLoggedInUser(response.user || response);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return !!getToken();
  }
}

export const authService = new AuthService();
