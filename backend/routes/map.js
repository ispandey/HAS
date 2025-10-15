const express = require('express');
const mapMyIndiaService = require('../services/mapMyIndiaService');

const router = express.Router();

// @route   POST /api/map/geocode
// @desc    Geocode an address
// @access  Public
router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        message: 'Address is required'
      });
    }

    const result = await mapMyIndiaService.geocodeAddress(address);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      message: 'Failed to geocode address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/map/reverse-geocode
// @desc    Reverse geocode coordinates
// @access  Public
router.post('/reverse-geocode', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Latitude and longitude are required'
      });
    }

    const result = await mapMyIndiaService.reverseGeocode(latitude, longitude);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({
      message: 'Failed to reverse geocode coordinates',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/map/distance
// @desc    Calculate distance between two points
// @access  Public
router.post('/distance', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        message: 'Origin and destination are required'
      });
    }

    const result = await mapMyIndiaService.calculateDistance(origin, destination);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Distance calculation error:', error);
    res.status(500).json({
      message: 'Failed to calculate distance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/map/route
// @desc    Get route between two points
// @access  Public
router.post('/route', async (req, res) => {
  try {
    const { origin, destination, routeType = 'driving' } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        message: 'Origin and destination are required'
      });
    }

    const routes = await mapMyIndiaService.getRoute(origin, destination, routeType);
    
    res.json({
      success: true,
      data: routes
    });

  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({
      message: 'Failed to calculate route',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/map/nearby
// @desc    Search nearby places
// @access  Public
router.post('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000, keyword = '' } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Latitude and longitude are required'
      });
    }

    const results = await mapMyIndiaService.searchNearby(
      { latitude, longitude }, 
      radius, 
      keyword
    );
    
    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      message: 'Failed to search nearby places',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/map/place/:placeId
// @desc    Get place details
// @access  Public
router.get('/place/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;

    const result = await mapMyIndiaService.getPlaceDetails(placeId);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Place details error:', error);
    res.status(500).json({
      message: 'Failed to get place details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/map/travel-times
// @desc    Calculate travel times for different modes
// @access  Public
router.post('/travel-times', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        message: 'Origin and destination coordinates are required'
      });
    }

    const travelTimes = await mapMyIndiaService.calculateTravelTimes(origin, destination);
    
    res.json({
      success: true,
      data: travelTimes
    });

  } catch (error) {
    console.error('Travel times calculation error:', error);
    res.status(500).json({
      message: 'Failed to calculate travel times',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;