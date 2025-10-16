import API from './api';

// Dashboard Statistics
export const getAdminDashboard = async () => {
  return API.get('/admin/dashboard');
};

// User Management
export const getAllUsers = async (params) => {
  return API.get('/admin/users', { params });
};

export const getUserById = async (userId) => {
  return API.get(`/admin/users/${userId}`);
};

export const updateUser = async (userId, data) => {
  return API.put(`/admin/users/${userId}`, data);
};

export const deleteUser = async (userId) => {
  return API.delete(`/admin/users/${userId}`);
};

export const approveHostelOwner = async (userId) => {
  return API.put(`/admin/users/${userId}/approve-owner`);
};

// Hostel Management
export const getPendingHostels = async (params) => {
  return API.get('/admin/hostels/pending', { params });
};

export const getAllHostels = async (params) => {
  return API.get('/admin/hostels', { params });
};

export const getHostelById = async (hostelId) => {
  return API.get(`/admin/hostels/${hostelId}`);
};

export const approveHostel = async (hostelId) => {
  return API.put(`/admin/hostels/${hostelId}/approve`);
};

export const rejectHostel = async (hostelId, reason) => {
  return API.put(`/admin/hostels/${hostelId}/reject`, { reason });
};

export const deleteHostel = async (hostelId) => {
  return API.delete(`/admin/hostels/${hostelId}`);
};

// Booking Management
export const getAllBookings = async (params) => {
  return API.get('/admin/bookings', { params });
};

export const getBookingById = async (bookingId) => {
  return API.get(`/admin/bookings/${bookingId}`);
};

export const updateBookingStatus = async (bookingId, status) => {
  return API.put(`/admin/bookings/${bookingId}/status`, { status });
};

// Analytics
export const getAnalytics = async (period) => {
  return API.get('/admin/analytics', { params: { period } });
};

export const getRevenueStats = async (startDate, endDate) => {
  return API.get('/admin/analytics/revenue', { 
    params: { startDate, endDate } 
  });
};

// University Management
export const getAllUniversities = async (params) => {
  return API.get('/admin/universities', { params });
};

export const createUniversity = async (data) => {
  return API.post('/admin/universities', data);
};

export const updateUniversity = async (universityId, data) => {
  return API.put(`/admin/universities/${universityId}`, data);
};

export const deleteUniversity = async (universityId) => {
  return API.delete(`/admin/universities/${universityId}`);
};

// Reports
export const generateReport = async (reportType, params) => {
  return API.get(`/admin/reports/${reportType}`, { params });
};

export const exportData = async (dataType, format) => {
  return API.get(`/admin/export/${dataType}`, {
    params: { format },
    responseType: 'blob'
  });
};

const adminService = {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  approveHostelOwner,
  getPendingHostels,
  getAllHostels,
  getHostelById,
  approveHostel,
  rejectHostel,
  deleteHostel,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getAnalytics,
  getRevenueStats,
  getAllUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  generateReport,
  exportData
};

export default adminService;
