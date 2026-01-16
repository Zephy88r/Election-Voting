/**
 * Authentication utility functions for token management
 * Centralized auth handling for JWT-ready implementation
 */

const TOKEN_KEY = "token";
const USER_KEY = "loggedInUser";

/**
 * Get authentication token from localStorage
 * @returns {string|null} - Token string or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set authentication token in localStorage
 * @param {string} token - JWT token string
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} - true if token exists, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get logged in user data from localStorage
 * @returns {object|null} - User object or null if not found
 */
export const getLoggedInUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Set logged in user data in localStorage
 * @param {object} user - User object to store
 */
export const setLoggedInUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Remove logged in user data from localStorage
 */
export const removeLoggedInUser = () => {
  localStorage.removeItem(USER_KEY);
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
