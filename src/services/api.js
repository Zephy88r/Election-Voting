/**
 * Centralized API service for backend communication
 * All API calls should go through this service
 * 
 * Backend developer notes:
 * - Replace API_BASE_URL with your actual backend URL
 * - All endpoints expect JSON responses
 * - Authentication tokens are sent in Authorization header
 */

// Use centralized API config
import { API_CONFIG } from "../config/apiConfig";

// API Base URL - comes from API_CONFIG (falls back to VITE_API_BASE_URL)
const API_BASE_URL = API_CONFIG.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint (e.g., "/auth/login")
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} - Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    // Include credentials (session cookie) for API mode
    const finalConfig = {
      ...config,
      credentials: API_CONFIG.USE_API ? "include" : (config.credentials || "same-origin"),
    };

    // CSRF: for session-authenticated requests to Django, include X-CSRFToken
    const unsafeMethods = ["POST", "PUT", "PATCH", "DELETE"];
    const method = (finalConfig.method || "GET").toUpperCase();

    if (API_CONFIG.USE_API && unsafeMethods.includes(method)) {
      // Read csrftoken from cookies
      const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
        return match ? match.pop() : null;
      };
      const csrftoken = getCookie('csrftoken');
      if (csrftoken) {
        finalConfig.headers = {
          ...finalConfig.headers,
          'X-CSRFToken': csrftoken,
        };
      }
    }

    const response = await fetch(url, finalConfig);
    
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server response is not JSON");
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @param {string} userData.name - Full name
   * @param {string} userData.email - Email address
   * @param {string} userData.address - Address
   * @param {string} userData.dateOfBirth - Date of birth (AD format: YYYY-MM-DD)
   * @param {string} userData.citizenshipNumber - Citizenship number
   * @param {string} userData.voterId - Voter ID
   * @param {string} userData.password - Password
   * @param {string|File} userData.faceImage - Face image (base64 or File object)
   * @returns {Promise<object>} - Response with token and user data
   */
  register: async (userData) => {
    // If faceImage is a File, convert to base64 or FormData
    let body = { ...userData };
    
    // For multipart/form-data (if backend expects it)
    // const formData = new FormData();
    // Object.keys(userData).forEach(key => {
    //   if (key === 'faceImage' && userData[key] instanceof File) {
    //     formData.append('faceImage', userData[key]);
    //   } else {
    //     formData.append(key, userData[key]);
    //   }
    // });

    return apiRequest("/elections/api/voter/register/", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * Login user
   * @param {object} credentials - Login credentials
   * @param {string} credentials.voterId - Voter ID
   * @param {string} credentials.password - Password
   * @param {string} credentials.faceImage - Face image (base64 string)
   * @returns {Promise<object>} - Response with token and user data
   */
  login: async (credentials) => {
    // Backend login endpoint uses session authentication and returns user info
    return apiRequest("/elections/api/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Get current user profile
   * @returns {Promise<object>} - User profile data
   */
  getProfile: async () => {
    return apiRequest("/elections/api/voter/profile/", {
      method: "GET",
    });
  },

  /**
   * Update user profile
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user data
   */
  updateProfile: async (userData) => {
    return apiRequest("/elections/api/voter/profile/", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Logout user (optional - for token invalidation on backend)
   * @returns {Promise<object>} - Logout response
   */
  logout: async () => {
    return apiRequest("/elections/api/auth/logout/", {
      method: "POST",
    });
  },
};

/**
 * Voting API endpoints
 */
export const votingAPI = {
  /**
   * Get candidates for a province
   * @param {string} provinceId - Province identifier
   * @returns {Promise<object>} - List of candidates
   */
  getCandidates: async (provinceId) => {
    // Backend endpoint returns candidates for logged-in user's electoral area.
    // If a provinceId is supplied, append as query param (backend may ignore).
    const q = provinceId ? `?province_id=${provinceId}` : "";
    return apiRequest(`/elections/api/candidates/${q}`, {
      method: "GET",
    });
  },

  /**
   * Submit vote
   * @param {object} voteData - Vote data
   * @param {string} voteData.provinceId - Province identifier
   * @param {string} voteData.candidateId - Selected candidate ID
   * @returns {Promise<object>} - Vote confirmation
   */
  submitVote: async (voteData) => {
    // Existing backend vote endpoint expects form-encoded POST at /elections/vote/submit/
    // For now we POST JSON to a safer API path; backend must accept JSON at this path.
    return apiRequest("/elections/api/vote/", {
      method: "POST",
      body: JSON.stringify(voteData),
    });
  },

  /**
   * Get voting status for current user
   * @returns {Promise<object>} - Voting status information
   */
  getVotingStatus: async () => {
    return apiRequest("/elections/api/voting/status/", {
      method: "GET",
    });
  },

  /**
   * Get voting history for current user
   * @returns {Promise<Array>} - List of votes
   */
  getVotingHistory: async () => {
    return apiRequest("/elections/api/voting-history/", {
      method: "GET",
    });
  },
};

/**
 * Notification API endpoints
 */
export const notificationAPI = {
  /**
   * Get notifications for current user
   * @returns {Promise<Array>} - List of notifications
   */
  getNotifications: async () => {
    return apiRequest("/elections/api/notifications/", {
      method: "GET",
    });
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<object>} - Response
   */
  markAsRead: async (notificationId) => {
    return apiRequest(`/elections/api/notifications/${notificationId}/read/`, {
      method: "POST",
    });
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<object>} - Response
   */
  markAllAsRead: async () => {
    return apiRequest("/elections/api/notifications/mark-all-read/", {
      method: "POST",
    });
  },

  /**
   * Create a new notification
   * @param {object} notificationData - Notification data
   * @returns {Promise<object>} - Created notification
   */
  createNotification: async (notificationData) => {
    return apiRequest("/elections/api/notifications/", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<object>} - Response
   */
  deleteNotification: async (notificationId) => {
    return apiRequest(`/elections/api/notifications/${notificationId}/`, {
      method: "DELETE",
    });
  },

  /**
   * Clear all notifications
   * @returns {Promise<object>} - Response
   */
  clearAllNotifications: async () => {
    return apiRequest("/elections/api/notifications/clear-all/", {
      method: "POST",
    });
  },
};

/**
 * Province API endpoints
 */
export const provinceAPI = {
  /**
   * Get all provinces
   * @returns {Promise<object>} - List of provinces
   */
  getAll: async () => {
    return apiRequest("/elections/api/provinces/", {
      method: "GET",
    });
  },

  /**
   * Get province details
   * @param {string} provinceId - Province identifier
   * @returns {Promise<object>} - Province details
   */
  getById: async (provinceId) => {
    return apiRequest(`/elections/api/provinces/${provinceId}`, {
      method: "GET",
    });
  },
};

// Export default API request function for custom endpoints
export default apiRequest;
