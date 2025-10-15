import API from './api';

const mapService = {
  // Geocode an address
  geocodeAddress: async (address) => {
    return await API.post('/map/geocode', { address });
  },

  // Reverse geocode coordinates
  reverseGeocode: async (latitude, longitude) => {
    return await API.post('/map/reverse-geocode', { latitude, longitude });
  },

  // Calculate distance between two points
  calculateDistance: async (origin, destination) => {
    return await API.post('/map/distance', { origin, destination });
  },

  // Get route between two points
  getRoute: async (origin, destination, routeType = 'driving') => {
    return await API.post('/map/route', { origin, destination, routeType });
  },

  // Search nearby places
  searchNearby: async (latitude, longitude, radius = 5000, keyword = '') => {
    return await API.post('/map/nearby', { latitude, longitude, radius, keyword });
  },

  // Get place details
  getPlaceDetails: async (placeId) => {
    return await API.get(`/map/place/${placeId}`);
  },

  // Calculate travel times for different modes
  calculateTravelTimes: async (origin, destination) => {
    return await API.post('/map/travel-times', { origin, destination });
  },

  // Get directions for display on map
  getDirections: async (origin, destination, mode = 'driving') => {
    try {
      const response = await API.post('/map/route', { 
        origin, 
        destination, 
        routeType: mode 
      });
      
      if (response.success && response.data.length > 0) {
        return {
          success: true,
          route: response.data[0],
          directions: response.data[0].steps || []
        };
      }
      
      return {
        success: false,
        error: 'No route found'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get directions'
      };
    }
  }
};

export default mapService;