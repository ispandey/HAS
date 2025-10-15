import API from './api';

const authService = {
  // User login
  login: async (credentials) => {
    return await API.post('/auth/login', credentials);
  },

  // Admin login
  adminLogin: async (credentials) => {
    return await API.post('/auth/admin-login', credentials);
  },

  // User registration
  register: async (userData) => {
    return await API.post('/auth/register', userData);
  },

  // Get current user
  getCurrentUser: async () => {
    return await API.get('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await API.put('/auth/profile', profileData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return await API.post('/auth/change-password', passwordData);
  },

  // Logout (client-side token removal is handled in context)
  logout: async () => {
    return await API.post('/auth/logout');
  }
};

export default authService;