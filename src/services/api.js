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
const API_BASE_URL = API_CONFIG.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint (e.g., "/auth/login")
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} - Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Check if body is FormData
  const isFormData = options.body instanceof FormData;
  
  // Default headers (don't set Content-Type for FormData)
  const headers = isFormData ? {} : {
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
      const text = await response.text();
      console.log('Non-JSON response:', text);
      throw new Error("Server response is not JSON");
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      console.error(`API Error Response (${endpoint}):`, {
        status: response.status,
        statusText: response.statusText,
        url: url,
        data: data
      });
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
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
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password - Password
   * @returns {Promise<object>} - Response with login status
   */
  login: async (credentials) => {
    return apiRequest("/elections/api/voter/login/", {
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
   * Logout user (optional - for session invalidation on backend)
   * @returns {Promise<object>} - Logout response
   */
  logout: async () => {
    return apiRequest("/elections/api/voter/logout/", {
      method: "POST",
    });
  },
};

/**
 * Voting API endpoints
 */
export const votingAPI = {
  /**
   * Get candidates for electoral area
   * @param {string} electoralAreaId - Electoral area identifier
   * @returns {Promise<Array>} - List of candidates
   */
  getCandidates: async (electoralAreaId) => {
    // Add user email as query parameter
    const authState = JSON.parse(localStorage.getItem('authState') || '{}');
    const user = authState.user;
    const userEmail = user && (user.email || user.username);
    
    let queryParams = [];
    if (electoralAreaId) {
      queryParams.push(`electoral_area_id=${electoralAreaId}`);
    }
    if (userEmail) {
      queryParams.push(`user_email=${encodeURIComponent(userEmail)}`);
    }
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return apiRequest(`/elections/api/candidates/${queryString}`, {
      method: "GET",
    });
  },

  /**
   * Get parties for voting
   * @returns {Promise<Array>} - List of parties
   */
  getParties: async () => {
    // Add user email as query parameter
    const authState = JSON.parse(localStorage.getItem('authState') || '{}');
    const user = authState.user;
    const userEmail = user && (user.email || user.username);
    
    const queryParam = userEmail ? `?user_email=${encodeURIComponent(userEmail)}` : '';
    
    return apiRequest(`/elections/api/parties/${queryParam}`, {
      method: "GET",
    });
  },

  /**
   * Submit vote
   * @param {object} voteData - Vote data
   * @param {string} voteData.vote_type - Vote type ('FPTP' or 'PR')
   * @param {number} voteData.candidate_id - Candidate ID (for FPTP)
   * @param {number} voteData.party_id - Party ID (for PR)
   * @returns {Promise<object>} - Vote confirmation
   */
  submitVote: async (voteData) => {
    // Get user email from query parameter as fallback
    const authState = JSON.parse(localStorage.getItem('authState') || '{}');
    const user = authState.user;
    const userEmail = user && (user.email || user.username);
    
    if (!user || (!user.email && !user.username)) {
      throw new Error('User not authenticated - please login again');
    }
    
    const email = user.email || user.username;
    
    // Backend expects FormData or form-encoded POST at /elections/vote/submit/
    // Convert to FormData to match backend expectations
    const formData = new FormData();
    Object.keys(voteData).forEach(key => {
      if (voteData[key] !== null && voteData[key] !== undefined) {
        formData.append(key, voteData[key]);
        console.log(`Added to FormData: ${key} = ${voteData[key]}`);
      }
    });
    
    formData.append('user_email', email);
    // Add electoral area based on user's province
    if (user.province) {
      const provinceToElectoralArea = {
        'Province 1': 1,
        'Province 2': 2, 
        'Bagmati Province': 3,
        'Gandaki Province': 4,
        'Lumbini Province': 5,
        'Karnali Province': 6,
        'Sudurpashchim Province': 7
      };
      const electoralAreaId = provinceToElectoralArea[user.province] || 1;
      formData.append('electoral_area_id', electoralAreaId);
      console.log('Added electoral_area_id:', electoralAreaId);
    }
    console.log('Added user_email to FormData:', email);
    
    // Log all FormData entries
    console.log('Final FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    return apiRequest("/elections/vote/submit/", {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
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
    // Add user email as query parameter
    const authState = JSON.parse(localStorage.getItem('authState') || '{}');
    const user = authState.user;
    const userEmail = user && (user.email || user.username);
    
    const queryParam = userEmail ? `?user_email=${encodeURIComponent(userEmail)}` : '';
    
    return apiRequest(`/elections/api/voting-history${queryParam}`, {
      method: "GET",
    });
  },

  /**
   * Get consolidated voting history for current user
   * @returns {Promise<object>} - Consolidated vote information
   */
  getConsolidatedVotingHistory: async () => {
    // Add user email as query parameter
    const authState = JSON.parse(localStorage.getItem('authState') || '{}');
    const user = authState.user;
    const userEmail = user && (user.email || user.username);
    
    const queryParam = userEmail ? `?user_email=${encodeURIComponent(userEmail)}` : '';
    
    return apiRequest(`/elections/api/voting-history/consolidated${queryParam}`, {
      method: "GET",
    });
  },
};

/**
 * Province API endpoints
 */
export const provinceAPI = {
  /**
   * Get registration data (provinces, districts, electoral areas)
   * @returns {Promise<object>} - Registration data
   */
  getRegistrationData: async () => {
    return apiRequest("/elections/api/registration-data/", {
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
