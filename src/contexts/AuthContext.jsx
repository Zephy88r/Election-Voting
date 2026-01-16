import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageHelper } from '../utils/storage';
import { setSessionTimeout, isSessionExpired, clearSessionTimeout } from '../utils/sessionManager';

/**
 * Authentication Context
 * Provides centralized authentication state management
 * Uses SessionStorage for auth state persistence
 * TODO: Replace with API calls when backend is ready
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
   * Initialize auth state on mount from SessionStorage
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        // TODO: Replace with API call to GET /api/auth/me
        const storedAuth = storageHelper.getAuthState();
        
        // Check if session is expired
        if (isSessionExpired()) {
          clearSessionTimeout();
          storageHelper.clearAuthState();
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
          return;
        }
        
        if (storedAuth && storedAuth.isAuthenticated && storedAuth.user) {
          setAuthState({
            isAuthenticated: true,
            user: storedAuth.user,
            loading: false,
          });
          // Refresh session timeout
          setSessionTimeout();
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
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
        storageHelper.clearAuthState();
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(sessionCheckInterval);
  }, [authState.isAuthenticated]);

  /**
   * Login user
   * TODO: Replace with POST /api/auth/login endpoint
   * @param {object} credentials - Login credentials (email, password)
   * @returns {Promise<object>} - User data
   */
  const login = useCallback(async (credentials) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      // TODO: Replace with API call
      const user = storageHelper.findUserByCredentials(
        credentials.email,
        credentials.password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Prepare user data for auth state (exclude password)
      const { password, ...userWithoutPassword } = user;
      const authUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        province: user.province,
      };

      const newAuthState = {
        isAuthenticated: true,
        user: authUser,
        loading: false,
      };

      setAuthState(newAuthState);
      
      // Store auth state based on Remember Me preference
      if (credentials.rememberMe) {
        storageHelper.setAuthStatePersistent(newAuthState);
      } else {
        storageHelper.setAuthState(newAuthState);
        // Set session timeout (30 minutes)
        setSessionTimeout();
      }

      return { user: authUser };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Register new user
   * TODO: Replace with POST /api/auth/register endpoint
   * @param {object} userData - Registration data
   * @returns {Promise<object>} - User data
   */
  const register = useCallback(async (userData) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      // TODO: Replace with API call
      const users = storageHelper.getUsers();

      // Check for duplicate email
      const existingEmail = users.find(
        (u) => u.email === userData.email?.trim()
      );
      if (existingEmail) {
        throw new Error('This email is already registered');
      }

      // Add user to storage
      const newUser = storageHelper.addUser(userData);

      // Prepare user data for auth state (exclude password)
      const { password, ...userWithoutPassword } = newUser;
      const authUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        province: newUser.province,
      };

      const newAuthState = {
        isAuthenticated: true,
        user: authUser,
        loading: false,
      };

      setAuthState(newAuthState);
      storageHelper.setAuthState(newAuthState);
      
      // Set session timeout (30 minutes)
      setSessionTimeout();

      return { user: authUser };
    } catch (error) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  /**
   * Logout user
   * TODO: Replace with POST /api/auth/logout endpoint
   */
  const logout = useCallback(() => {
    try {
      clearSessionTimeout();
      storageHelper.clearAuthState();
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
   * TODO: Replace with GET /api/auth/me endpoint
   * @returns {boolean} - True if authenticated
   */
  const checkAuth = useCallback(() => {
    const storedAuth = storageHelper.getAuthState();
    return storedAuth?.isAuthenticated === true;
  }, []);

  const value = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    login,
    register,
    logout,
    checkAuth,
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
