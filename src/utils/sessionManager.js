/**
 * Session Management Utilities
 * Handles session timeout, auto-logout, and session state management
 * TODO: Replace with backend session management when API is ready
 */

const SESSION_TIMEOUT_KEY = 'voting_system_session_timeout';
const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
const DEFAULT_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes default

/**
 * Set session timeout
 * @param {number} duration - Session duration in milliseconds (default: 30 minutes)
 */
export const setSessionTimeout = (duration = DEFAULT_SESSION_DURATION) => {
  const timeoutTime = Date.now() + duration;
  sessionStorage.setItem(SESSION_TIMEOUT_KEY, timeoutTime.toString());
  return timeoutTime;
};

/**
 * Check if session is expired
 * @returns {boolean} - True if session is expired
 */
export const isSessionExpired = () => {
  const timeoutTime = sessionStorage.getItem(SESSION_TIMEOUT_KEY);
  if (!timeoutTime) return false;
  
  return Date.now() > parseInt(timeoutTime, 10);
};

/**
 * Get remaining session time in milliseconds
 * @returns {number} - Remaining time in milliseconds, or null if no session
 */
export const getRemainingSessionTime = () => {
  const timeoutTime = sessionStorage.getItem(SESSION_TIMEOUT_KEY);
  if (!timeoutTime) return null;
  
  const remaining = parseInt(timeoutTime, 10) - Date.now();
  return remaining > 0 ? remaining : 0;
};

/**
 * Check if session warning should be shown
 * @returns {boolean} - True if warning should be shown
 */
export const shouldShowSessionWarning = () => {
  const remaining = getRemainingSessionTime();
  if (!remaining) return false;
  
  return remaining <= SESSION_WARNING_TIME && remaining > 0;
};

/**
 * Clear session timeout
 */
export const clearSessionTimeout = () => {
  sessionStorage.removeItem(SESSION_TIMEOUT_KEY);
};

/**
 * Extend session timeout
 * @param {number} duration - Additional duration in milliseconds
 */
export const extendSession = (duration = DEFAULT_SESSION_DURATION) => {
  const currentTimeout = sessionStorage.getItem(SESSION_TIMEOUT_KEY);
  if (currentTimeout) {
    const newTimeout = Date.now() + duration;
    sessionStorage.setItem(SESSION_TIMEOUT_KEY, newTimeout.toString());
    return newTimeout;
  }
  return setSessionTimeout(duration);
};

/**
 * Format remaining time for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} - Formatted time string (e.g., "5 minutes")
 */
export const formatRemainingTime = (milliseconds) => {
  if (!milliseconds || milliseconds <= 0) return '0 minutes';
  
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};

export default {
  setSessionTimeout,
  isSessionExpired,
  getRemainingSessionTime,
  shouldShowSessionWarning,
  clearSessionTimeout,
  extendSession,
  formatRemainingTime,
};
