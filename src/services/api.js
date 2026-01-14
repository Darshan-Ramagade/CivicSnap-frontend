import axios from 'axios';

// Base URL from environment variable
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds (AI classification can be slow)
});

// ==================== ISSUE ENDPOINTS ====================

/**
 * Create a new civic issue with AI classification
 * @param {Object} issueData - { imageUrl, location, description, reportedBy }
 * @returns {Promise} API response with created issue
 */
export const createIssue = async (issueData) => {
  try {
    console.log('🔵 Sending request to:', API_URL + '/issues');
    console.log('🔵 Data:', issueData);
    
    const response = await api.post('/issues', issueData);
    
    console.log('✅ Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('❌ Error response:', error.response?.data);
    throw handleError(error);
  }
};

/**
 * Get all issues with optional filters
 * @param {Object} params - { category, severity, status, page, limit, sortBy, order }
 * @returns {Promise} Array of issues
 */
export const getAllIssues = async (params = {}) => {
  try {
    const response = await api.get('/issues', { params });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get single issue by ID
 * @param {string} id - Issue ID
 * @returns {Promise} Issue details
 */
export const getIssueById = async (id) => {
  try {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Update issue (status, severity, etc.)
 * @param {string} id - Issue ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Updated issue
 */
export const updateIssue = async (id, updates) => {
  try {
    const response = await api.patch(`/issues/${id}`, updates);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Delete an issue
 * @param {string} id - Issue ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteIssue = async (id) => {
  try {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Upvote an issue
 * @param {string} id - Issue ID
 * @returns {Promise} Updated vote count
 */
export const voteIssue = async (id) => {
  try {
    const response = await api.post(`/issues/${id}/vote`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get issue statistics
 * @returns {Promise} Statistics object
 */
export const getIssueStats = async () => {
  try {
    const response = await api.get('/issues/stats');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// ==================== ERROR HANDLING ====================

/**
 * Handle API errors consistently
 * @param {Error} error - Axios error object
 * @returns {Error} Formatted error
 */
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data.error || 
                   error.response.data.errors?.join(', ') || 
                   'An error occurred';
    
    return new Error(message);
  } else if (error.request) {
    // Request made but no response (network error)
    return new Error('Network error. Please check your connection and make sure the backend is running.');
  } else {
    // Something else happened
    return new Error(error.message || 'An unexpected error occurred');
  }
};


/**
 * Upload image file to server
 * @param {File} file - Image file from input
 * @returns {Promise} Uploaded image URLs
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// ==================== AUTH ENDPOINTS ====================

/**
 * Register new user
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Login user
 */
export const login = async (credentials) => {
  try {
    console.log('📤 Sending login request:', credentials.email);
    
    const response = await api.post('/auth/login', credentials);
    
    console.log('✅ Login response:', response.data);
    
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    throw handleError(error);
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

/**
 * Get auth token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

// Add token to all API requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;