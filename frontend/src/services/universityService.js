import API from './api';

const universityService = {
  // Get all universities
  getUniversities: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/universities?${queryString}`);
  },

  // Get university by ID
  getUniversityById: async (id) => {
    return await API.get(`/universities/${id}`);
  },

  // Get colleges of a university
  getColleges: async (universityId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/universities/${universityId}/colleges?${queryString}`);
  },

  // Get departments of a college
  getDepartments: async (universityId, collegeId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/universities/${universityId}/colleges/${collegeId}/departments?${queryString}`);
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    return await API.get(`/universities/departments/${id}`);
  },

  // Get universities statistics
  getStatistics: async () => {
    return await API.get('/universities/api/stats');
  },

  // Search universities by name or location
  searchUniversities: async (query) => {
    return await API.get(`/universities?search=${encodeURIComponent(query)}`);
  },

  // Get universities by state
  getUniversitiesByState: async (state) => {
    return await API.get(`/universities?state=${encodeURIComponent(state)}`);
  },

  // Get universities by city
  getUniversitiesByCity: async (city) => {
    return await API.get(`/universities?city=${encodeURIComponent(city)}`);
  }
};

export default universityService;