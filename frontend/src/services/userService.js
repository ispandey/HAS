import API from './api';

// User Profile
export const getUserProfile = async () => {
  return API.get('/auth/me');
};

export const updateUserProfile = async (data) => {
  return API.put('/auth/profile', data);
};

export const changePassword = async (data) => {
  return API.put('/auth/change-password', data);
};

export const uploadProfileImage = async (formData) => {
  return API.post('/auth/upload-profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Student Preferences
export const updateStudentPreferences = async (preferences) => {
  return API.put('/auth/student-preferences', preferences);
};

export const getStudentPreferences = async () => {
  return API.get('/auth/student-preferences');
};

// Saved Hostels
export const getSavedHostels = async () => {
  return API.get('/users/saved-hostels');
};

export const saveHostel = async (hostelId) => {
  return API.post(`/users/saved-hostels/${hostelId}`);
};

export const unsaveHostel = async (hostelId) => {
  return API.delete(`/users/saved-hostels/${hostelId}`);
};

// User Activity
export const getUserActivity = async () => {
  return API.get('/users/activity');
};

export const getUserBookings = async (params) => {
  return API.get('/users/bookings', { params });
};

// Notifications
export const getNotifications = async () => {
  return API.get('/users/notifications');
};

export const markNotificationRead = async (notificationId) => {
  return API.put(`/users/notifications/${notificationId}/read`);
};

export const markAllNotificationsRead = async () => {
  return API.put('/users/notifications/mark-all-read');
};

export const deleteNotification = async (notificationId) => {
  return API.delete(`/users/notifications/${notificationId}`);
};

const userService = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfileImage,
  updateStudentPreferences,
  getStudentPreferences,
  getSavedHostels,
  saveHostel,
  unsaveHostel,
  getUserActivity,
  getUserBookings,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
};

export default userService;
