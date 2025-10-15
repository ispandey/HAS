import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
      
    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        token: null
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return;
    }

    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });
      
      const response = await authService.getCurrentUser();
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: {
          user: response.user,
          token
        }
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: 'Session expired. Please login again.' 
      });
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });
      
      const response = await authService.login(credentials);
      
      localStorage.setItem('token', response.token);
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: response
      });
      
      toast.success('Login successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: message
      });
      
      toast.error(message);
      throw error;
    }
  };

  // Admin login function
  const adminLogin = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });
      
      const response = await authService.adminLogin(credentials);
      
      localStorage.setItem('token', response.token);
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: response
      });
      
      toast.success('Admin login successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed. Please try again.';
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: message
      });
      
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });
      
      const response = await authService.register(userData);
      
      localStorage.setItem('token', response.token);
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: response
      });
      
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: message
      });
      
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully!');
  }, []);

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: response.user
      });
      
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
      throw error;
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Password changed successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password.';
      toast.error(message);
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has required role
  const hasRole = (roles) => {
    if (!state.user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(state.user.role);
    }
    return state.user.role === roles;
  };

  // Check if user is student
  const isStudent = () => hasRole('student');

  // Check if user is hostel owner
  const isHostelOwner = () => hasRole('hostel_owner');

  // Check if user is admin
  const isAdmin = () => hasRole('admin');

  const value = {
    ...state,
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus,
    clearError,
    hasRole,
    isStudent,
    isHostelOwner,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;