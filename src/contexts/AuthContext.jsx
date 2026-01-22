import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { storageHelper } from '../utils/storage';
import { setSessionTimeout, isSessionExpired, clearSessionTimeout } from '../utils/sessionManager';

/**
 * Authentication Context
 * Provides centralized authentication state management
 * Uses API calls when USE_API is enabled, falls back to localStorage
 */

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state and methods
 */
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get profile from API (session-based)
        const profile = await authService.getProfile();
        setAuthState({
          isAuthenticated: true,
          user: profile,
          loading: false,
        });
        setSessionTimeout();
      } catch (e) {
        // Not authenticated via API
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    initAuth();
    
    // Check session expiry periodically
    const sessionCheckInterval = setInterval(() => {
      if (isSessionExpired() && authState.isAuthenticated) {
        clearSessionTimeout();
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(sessionCheckInterval);
  }, []);

  /**
   * Login user
   * @param {object} credentials - Login credentials (email, password)
   * @returns {Promise<object>} - User data
   */
  const login = useCallback(async (credentials) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      const response = await authService.login(credentials);
      // After backend sets session cookie, fetch full profile
      let profile = null;
      try {
        profile = await authService.getProfile();
      } catch (err) {
        console.warn('Login: could not fetch profile immediately', err);
      }

      const user = profile || response.user;

      const newAuthState = {
        isAuthenticated: true,
        user: user,
        loading: false,
      };

      setAuthState(newAuthState);
      
      // Set session timeout (30 minutes)
      setSessionTimeout();

      return { user };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Register new user
   * @param {object} userData - Registration data
   * @returns {Promise<object>} - User data
   */
  const register = useCallback(async (userData) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      const response = await authService.register(userData);
      const user = response.user;

      // Do NOT set authenticated state on registration (user must login explicitly)
      setAuthState((prev) => ({ ...prev, loading: false }));

      return { user };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    try {
      authService.logout();
      clearSessionTimeout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  /**
   * Check authentication status
   * @returns {boolean} - True if authenticated
   */
  const checkAuth = useCallback(() => {
    if (API_CONFIG.USE_API) {
      return authService.isAuthenticated();
    }
    const storedAuth = storageHelper.getAuthState();
    return storedAuth?.isAuthenticated === true;
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      // Persist to backend when session auth is enabled
      const updated = await authService.updateProfile(userData);
      // If backend returns full user, use it; otherwise merge
      const nextUser = updated?.user || updated || { ...(authState.user || {}), ...(userData || {}) };
      setAuthState((prev) => ({ ...prev, user: nextUser }));
      return nextUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [authState.user]);

  const value = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Custom hook to access auth context
 * @returns {object} - Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
