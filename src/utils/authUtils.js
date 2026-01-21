/**
 * Authentication utility functions for token management
 * Centralized auth handling for JWT-ready implementation
 */

const TOKEN_KEY = "token";
const USER_KEY = "loggedInUser";

/**
 * Get authentication token (not used in session auth)
 * @returns {string|null} - Always returns null
 */
export const getToken = () => {
  return null;
};

/**
 * Set authentication token (not used in session auth)
 * @param {string} token - JWT token string
 */
export const setToken = (token) => {
  // Do nothing
};

/**
 * Remove authentication token (not used in session auth)
 */
export const removeToken = () => {
  // Do nothing
};

/**
 * Check if user is authenticated (use AuthContext state)
 * @returns {boolean} - Always returns false, check AuthContext
 */
export const isAuthenticated = () => {
  return false;
};

/**
 * Get logged in user data from sessionStorage
 * @returns {object|null} - User object or null if not found
 */
export const getLoggedInUser = () => {
  const userStr = sessionStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Set logged in user data in sessionStorage
 * @param {object} user - User object to store
 */
export const setLoggedInUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Remove logged in user data from sessionStorage
 */
export const removeLoggedInUser = () => {
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Clear all authentication data (logout)
 */
export const clearAuth = () => {
  removeToken();
  removeLoggedInUser();
};

/**
 * Logout helper for Navbar or other components
 */
export const logout = () => {
  clearAuth();
};
