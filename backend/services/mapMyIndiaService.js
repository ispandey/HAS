const axios = require('axios');

class MapMyIndiaService {
  constructor() {
    this.apiKey = process.env.MAPMYINDIA_API_KEY;
    this.clientId = process.env.MAPMYINDIA_CLIENT_ID;
    this.clientSecret = process.env.MAPMYINDIA_CLIENT_SECRET;
    this.baseURL = 'https://apis.mapmyindia.com';
    this.token = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    try {
      if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.token;
      }

      const response = await axios.post(`${this.baseURL}/advancedmaps/v1/oauth/access_token`, {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

      this.token = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000) - 60000); // 1 minute buffer

      return this.token;
    } catch (error) {
      console.error('Error getting MapMyIndia access token:', error);
      throw new Error('Failed to authenticate with MapMyIndia');
    }
  }

  async geocodeAddress(address) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseURL}/advancedmaps/v1/geocoding`, {
        params: {
          address: address,
          itemCount: 1
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lng),
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          mapplsPin: result.eLoc
        };
      }

      throw new Error('No geocoding results found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  async reverseGeocode(latitude, longitude) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseURL}/advancedmaps/v1/rev_geocoding`, {
        params: {
          lat: latitude,
          lng: longitude
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          formattedAddress: result.formatted_address,
          city: result.city,
          state: result.state,
          pincode: result.pincode,
          area: result.area,
          locality: result.locality,
          placeId: result.place_id,
          mapplsPin: result.eLoc
        };
      }

      throw new Error('No reverse geocoding results found');
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }

  async calculateDistance(origin, destination) {
    try {
      const token = await this.getAccessToken();
      
      // origin and destination can be coordinates or eLoc pins
      const originParam = typeof origin === 'object' 
        ? `${origin.latitude},${origin.longitude}` 
        : origin;
      const destParam = typeof destination === 'object' 
        ? `${destination.latitude},${destination.longitude}` 
        : destination;

      const response = await axios.get(`${this.baseURL}/advancedmaps/v1/distance_matrix/driving`, {
        params: {
          origins: originParam,
          destinations: destParam,
          sources: 'coordinates',
          targets: 'coordinates'
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          distance: result.distance, // in meters
          duration: result.duration, // in seconds
          distanceText: this.formatDistance(result.distance),
          durationText: this.formatDuration(result.duration)
        };
      }

      throw new Error('No distance calculation results found');
    } catch (error) {
      console.error('Distance calculation error:', error);
      throw new Error('Failed to calculate distance');
    }
  }

  async getRoute(origin, destination, routeType = 'driving') {
    try {
      const token = await this.getAccessToken();
      
      const originParam = typeof origin === 'object' 
        ? `${origin.latitude},${origin.longitude}` 
        : origin;
      const destParam = typeof destination === 'object' 
        ? `${destination.latitude},${destination.longitude}` 
        : destination;

      const response = await axios.get(`${this.baseURL}/advancedmaps/v1/routing`, {
        params: {
          start: originParam,
          end: destParam,
          routeType: routeType, // driving, walking, biking
          with_traffic: true,
          alternatives: true,
          steps: true,
          geometries: 'polyline'
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        return response.data.routes.map(route => ({
          distance: route.distance,
          duration: route.duration,
          distanceText: this.formatDistance(route.distance),
          durationText: this.formatDuration(route.duration),
          geometry: route.geometry,
          steps: route.legs[0]?.steps || [],
          summary: route.summary || {}
        }));
      }

      throw new Error('No route found');
    } catch (error) {
      console.error('Route calculation error:', error);
      throw new Error('Failed to calculate route');
    }
  }

  async searchNearby(coordinates, radius = 5000, keyword = '') {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseURL}/advancedmaps/v1/nearby`, {
        params: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          radius: radius, // in meters
          keyword: keyword,
          sortBy: 'dist:asc'
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.suggestedLocations) {
        return response.data.suggestedLocations.map(location => ({
          name: location.placeName,
          address: location.placeAddress,
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lng),
          distance: location.distance,
          placeId: location.placeId,
          mapplsPin: location.eLoc,
          category: location.categoryCode,
          keywords: location.keywords || []
        }));
      }

      return [];
    } catch (error) {
      console.error('Nearby search error:', error);
      throw new Error('Failed to search nearby locations');
    }
  }

  async getPlaceDetails(placeId) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseURL}/advancedmaps/v1/place_detail`, {
        params: {
          place_id: placeId
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          name: result.name,
          address: result.formatted_address,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lng),
          placeId: result.place_id,
          mapplsPin: result.eLoc,
          phone: result.phone,
          website: result.website,
          rating: result.rating,
          openingHours: result.opening_hours,
          photos: result.photos || [],
          reviews: result.reviews || []
        };
      }

      throw new Error('Place not found');
    } catch (error) {
      console.error('Place details error:', error);
      throw new Error('Failed to get place details');
    }
  }

  // Helper method to format distance
  formatDistance(distanceInMeters) {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)} m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)} km`;
    }
  }

  // Helper method to format duration
  formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${durationInSeconds} sec`;
    }
  }

  // Calculate travel times for different modes
  async calculateTravelTimes(origin, destination) {
    try {
      const [driving, walking] = await Promise.all([
        this.calculateDistance(origin, destination),
        this.getRoute(origin, destination, 'walking').catch(() => null)
      ]);

      return {
        driving: {
          distance: driving.distance,
          duration: Math.round(driving.duration / 60), // convert to minutes
          text: `${this.formatDistance(driving.distance)} (${this.formatDuration(driving.duration)})`
        },
        walking: walking ? {
          distance: walking[0].distance,
          duration: Math.round(walking[0].duration / 60), // convert to minutes
          text: `${this.formatDistance(walking[0].distance)} (${this.formatDuration(walking[0].duration)})`
        } : null,
        public_transport: Math.round(driving.duration / 60 * 1.5) // estimated as 1.5x driving time
      };
    } catch (error) {
      console.error('Travel times calculation error:', error);
      // Return fallback calculation based on straight-line distance
      const straightLineDistance = this.calculateStraightLineDistance(origin, destination);
      return {
        driving: {
          distance: straightLineDistance * 1000,
          duration: Math.round((straightLineDistance * 1000) / 500), // ~30 km/h in city
          text: `~${this.formatDistance(straightLineDistance * 1000)}`
        },
        walking: {
          distance: straightLineDistance * 1000,
          duration: Math.round((straightLineDistance * 1000) / 83.33), // ~5 km/h walking
          text: `~${this.formatDistance(straightLineDistance * 1000)}`
        },
        public_transport: Math.round((straightLineDistance * 1000) / 333.33) // ~20 km/h public transport
      };
    }
  }

  // Calculate straight-line distance using Haversine formula
  calculateStraightLineDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(coord2.latitude - coord1.latitude);
    const dLon = this.degToRad(coord2.longitude - coord1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degToRad(coord1.latitude)) * Math.cos(this.degToRad(coord2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  degToRad(deg) {
    return deg * (Math.PI/180);
  }
}

module.exports = new MapMyIndiaService();