import API from './api';

const hostelService = {
  // Get hostels with filtering and search
  getHostels: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/hostels?${queryString}`);
  },

  // Get single hostel by ID
  getHostelById: async (id) => {
    return await API.get(`/hostels/${id}`);
  },

  // Create new hostel (hostel owner only)
  createHostel: async (hostelData) => {
    return await API.post('/hostels', hostelData);
  },

  // Update hostel (hostel owner only)
  updateHostel: async (id, hostelData) => {
    return await API.put(`/hostels/${id}`, hostelData);
  },

  // Delete hostel (hostel owner only)
  deleteHostel: async (id) => {
    return await API.delete(`/hostels/${id}`);
  },

  // Get hostels owned by current user
  getMyHostels: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/hostels/owner/my-hostels?${queryString}`);
  },

  // Upload hostel images
  uploadImages: async (hostelId, formData) => {
    return await API.post(`/hostels/${hostelId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get featured hostels
  getFeaturedHostels: async () => {
    return await API.get('/hostels?isFeatured=true&limit=6');
  },

  // Search hostels near a location
  searchNearby: async (coordinates, radius = 10, otherParams = {}) => {
    const params = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      radius,
      ...otherParams
    };
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/hostels?${queryString}`);
  },

  // Get hostels near university/department
  getHostelsNearInstitution: async (universityId, departmentId, otherParams = {}) => {
    const params = {
      universityId,
      departmentId,
      ...otherParams
    };
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/hostels?${queryString}`);
  }
};

export default hostelService;