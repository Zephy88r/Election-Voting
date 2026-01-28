/**
 * Authentication Service
 * Centralized service for all authentication operations
 * Currently uses localStorage, but structured for easy API migration
 */

import { authAPI } from './api';
import { setToken, setLoggedInUser, removeToken, removeLoggedInUser, getToken } from '../utils/authUtils';
import { storage } from './storageService';
import { API_CONFIG } from '../config/apiConfig';

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
    if (API_CONFIG.USE_API) {
      try {
        const response = await authAPI.register(userData);
        const user = response.user || response;
        return { user };
      } catch (error) {
        console.error('API registration failed, falling back to localStorage');
        // Fallback to localStorage
        const users = storage.getItem('users') || [];
        
        if (users.find(u => u.email === userData.email || u.voterId === userData.voterId)) {
          throw new Error('User already exists');
        }
        
        const newUser = {
          id: Date.now(),
          username: userData.email,
          voterId: userData.voterId || userData.email,
          ...userData,
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        storage.setItem('users', users);
        return { user: newUser };
      }
    } else {
      // Use localStorage mode
      const users = storage.getItem('users') || [];
      
      if (users.find(u => u.email === userData.email || u.voterId === userData.voterId)) {
        throw new Error('User already exists');
      }
      
      const newUser = {
        id: Date.now(),
        username: userData.email,
        voterId: userData.voterId || userData.email,
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      storage.setItem('users', users);
      return { user: newUser };
    }
  }

  /**
   * Login user
   * @param {object} credentials - Login credentials (voterId/email, password, faceImage)
   * @returns {Promise<object>} - Response with user and token
   */
  async login(credentials) {
    if (API_CONFIG.USE_API) {
      try {
        // Convert voterId to email for backend (backend expects email/password)
        const response = await authAPI.login({
          email: credentials.voterId || credentials.email,
          password: credentials.password
        });
        // Backend returns success on login, get profile after
        try {
          const user = await authAPI.getProfile();
          setLoggedInUser(user);
          setToken(user.id?.toString() || user.username || 'session');
          return { user };
        } catch (profileError) {
          // Profile fetch failed - session might not be established yet
          // Return the login response user data directly
          console.warn('Profile fetch failed after login, using login response data');
          const user = response.user || {
            username: credentials.email || credentials.voterId,
            email: credentials.email || credentials.voterId,
            first_name: credentials.voterId?.split('@')[0] || 'User'
          };
          setLoggedInUser(user);
          setToken(user.id?.toString() || user.username || 'session');
          return { user };
        }
      } catch (error) {
        // Don't log as error - try localStorage fallback
        const users = storage.getItem('users') || [];
        const user = users.find(u => {
          const emailMatch = u.email === credentials.voterId;
          const voterIdMatch = u.voterId === credentials.voterId;
          const usernameMatch = u.username === credentials.voterId;
          const passwordMatch = u.password === credentials.password;
          return (emailMatch || voterIdMatch || usernameMatch) && passwordMatch;
        });
        
        if (!user) {
          throw new Error('Invalid credentials');
        }
        
        setLoggedInUser(user);
        setToken(user.id?.toString() || user.email);
        return { user };
      }
    } else {
      // Use localStorage mode
      const users = storage.getItem('users') || [];
      const user = users.find(u => {
        const emailMatch = u.email === credentials.voterId;
        const voterIdMatch = u.voterId === credentials.voterId;
        const usernameMatch = u.username === credentials.voterId;
        const passwordMatch = u.password === credentials.password;
        return (emailMatch || voterIdMatch || usernameMatch) && passwordMatch;
      });
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      setLoggedInUser(user);
      setToken(user.id?.toString() || user.email);
      return { user };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    if (API_CONFIG.USE_API) {
      try {
        await authAPI.logout();
        removeToken();
        removeLoggedInUser();
      } catch (error) {
        console.error('Logout error:', error);
        // Still clear local state even if API fails
        removeToken();
        removeLoggedInUser();
        throw error;
      }
    } else {
      removeToken();
      removeLoggedInUser();
    }
  }

  /**
   * Get current user profile
   * @returns {Promise<object>} - User profile data
   */
  async getProfile() {
    if (API_CONFIG.USE_API) {
      try {
        const profile = await authAPI.getProfile();
        setLoggedInUser(profile);
        return profile;
      } catch (error) {
        // Don't log 401 errors as they're expected when not authenticated
        if (error.message && !error.message.includes('401')) {
          console.error('Get profile API error:', error);
        }
        // Fallback to localStorage
        const storedUser = storage.getItem('loggedInUser');
        if (storedUser) {
          return storedUser;
        }
        throw error;
      }
    } else {
      // Use localStorage mode
      const storedUser = storage.getItem('loggedInUser');
      if (storedUser) {
        return storedUser;
      }
      throw new Error('No user logged in');
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
