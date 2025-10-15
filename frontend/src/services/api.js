import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - remove token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (status === 403) {
        // Forbidden - show access denied message
        console.error('Access denied:', data.message);
      } else if (status === 404) {
        // Not found
        console.error('Resource not found:', data.message);
      } else if (status >= 500) {
        // Server error
        console.error('Server error:', data.message);
      }
      
      error.message = data.message || error.message;
    } else if (error.request) {
      // Network error
      error.message = 'Network error. Please check your internet connection.';
    } else {
      // Other error
      error.message = 'An unexpected error occurred.';
    }
    
    return Promise.reject(error);
  }
);

export default API;