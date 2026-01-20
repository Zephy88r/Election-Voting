/**
 * Authentication Service
 * Centralized service for all authentication operations
 * Currently uses localStorage, but structured for easy API migration
 */

import { authAPI } from './api';
import { API_CONFIG } from '../config/apiConfig';
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
    // Use backend API when API mode is enabled
    if (API_CONFIG.USE_API) {
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

    // TODO: Replace with API call when backend is ready
    // try {
    //   const response = await authAPI.register(userData);
    //   setToken(response.token);
    //   setLoggedInUser(response.user);
    //   return response;
    // } catch (error) {
    //   throw new Error(error.message || 'Registration failed');
    // }

    // Temporary: localStorage implementation
    try {
      const users = storage.getItem('users') || [];
      
      // Check for duplicate voter ID
      const existingUser = users.find((u) => u.voterId === userData.voterId?.trim());
      if (existingUser) {
        throw new Error('This Voter ID is already registered');
      }

      // Check for duplicate email
      const existingEmail = users.find((u) => u.email === userData.email?.trim());
      if (existingEmail) {
        throw new Error('This email is already registered');
      }

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newUser);
      storage.setItem('users', users);

      // Set auth state (using voterId as token for now)
      const token = newUser.voterId;
      setToken(token);
      setLoggedInUser(newUser);

      // Create welcome notification
      notificationService.createNotification({
        type: 'success',
        title: 'Welcome!',
        message: `Welcome to Nepal Election Voting System, ${newUser.name}! Your account has been created successfully.`,
        userId: token,
      });

      return {
        user: newUser,
        token: token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {object} credentials - Login credentials (voterId, password, faceImage)
   * @returns {Promise<object>} - Response with user and token
   */
  async login(credentials) {
    if (API_CONFIG.USE_API) {
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

    // TODO: Replace with API call when backend is ready
    // try {
    //   const response = await authAPI.login(credentials);
    //   setToken(response.token);
    //   setLoggedInUser(response.user);
    //   return response;
    // } catch (error) {
    //   throw new Error(error.message || 'Login failed');
    // }

    // Temporary: localStorage implementation
    try {
      const users = storage.getItem('users') || [];
      
      // Find user by voter ID
      const user = users.find((u) => u.voterId === credentials.voterId?.trim());

      if (!user) {
        throw new Error('Invalid Voter ID. Please check and try again.');
      }

      // Verify password
      if (user.password !== credentials.password) {
        throw new Error('Incorrect password. Please try again.');
      }

      // Optional: Verify face image matches (in production, use face recognition API)
      if (!user.faceImage) {
        throw new Error('Face verification data not found. Please register again.');
      }

      // Set auth state
      const token = user.voterId;
      setToken(token);
      setLoggedInUser(user);

      // Create login notification
      notificationService.createNotification({
        type: 'info',
        title: 'Login Successful',
        message: `Welcome back, ${user.name}! You have successfully logged in.`,
        userId: token,
      });

      return {
        user: user,
        token: token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    try {
      if (API_CONFIG.USE_API) {
        try {
          authAPI.logout();
        } catch (e) {
          // ignore logout errors but continue clearing local state
        }
      }
      removeToken();
      removeLoggedInUser();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
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
        // keep local copy
        setLoggedInUser(profile);
        return profile;
      } catch (error) {
        throw error;
      }
    }

    // TODO: Replace with API call when backend is ready
    // try {
    //   const response = await authAPI.getProfile();
    //   return response;
    // } catch (error) {
    //   throw new Error(error.message || 'Failed to fetch profile');
    // }

    // Temporary: localStorage implementation
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const users = storage.getItem('users') || [];
      const user = users.find((u) => u.voterId === token);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user data
   */
  async updateProfile(userData) {
    // TODO: Replace with API call when backend is ready
    // try {
    //   const response = await authAPI.updateProfile(userData);
    //   setLoggedInUser(response.user || response);
    //   return response;
    // } catch (error) {
    //   throw new Error(error.message || 'Failed to update profile');
    // }

    // Temporary: localStorage implementation
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const users = storage.getItem('users') || [];
      const userIndex = users.findIndex((u) => u.voterId === token);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      const updatedUser = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      users[userIndex] = updatedUser;
      storage.setItem('users', users);
      setLoggedInUser(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
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
