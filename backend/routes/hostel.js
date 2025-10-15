const express = require('express');
const Hostel = require('../models/Hostel');
const { University, Department } = require('../models/University');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const mapMyIndiaService = require('../services/mapMyIndiaService');

const router = express.Router();

// @route   GET /api/hostels
// @desc    Get hostels with filtering and search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      type,
      city,
      state,
      universityId,
      departmentId,
      minPrice,
      maxPrice,
      facilities,
      roomType,
      latitude,
      longitude,
      radius = 10,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'approved' };
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') }
      ];
    }

    if (type && type !== 'any') filter.type = type;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    // Price filtering
    if (minPrice || maxPrice) {
      filter['roomTypes.pricePerBed'] = {};
      if (minPrice) filter['roomTypes.pricePerBed'].$gte = parseInt(minPrice);
      if (maxPrice) filter['roomTypes.pricePerBed'].$lte = parseInt(maxPrice);
    }

    // Facilities filtering
    if (facilities) {
      const facilityArray = Array.isArray(facilities) ? facilities : [facilities];
      filter.facilities = { $all: facilityArray };
    }

    // Room type filtering
    if (roomType && roomType !== 'any') {
      filter['roomTypes.type'] = roomType;
    }

    // University/Department proximity filtering
    if (universityId) {
      filter['location.nearbyUniversities.university'] = universityId;
    }

    if (departmentId) {
      filter['location.nearbyDepartments.department'] = departmentId;
    }

    // Location-based filtering
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInMeters = parseFloat(radius) * 1000;

      filter['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInMeters / 6378100]
        }
      };
    }

    // Sort options
    const sort = {};
    if (sortBy === 'price') {
      sort['roomTypes.pricePerBed'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'rating') {
      sort['ratings.average'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'distance' && latitude && longitude) {
      // Distance sorting handled separately
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = Hostel.find(filter)
      .populate('owner', 'name email phone ownerProfile.businessName')
      .select('name type description location contact roomTypes facilities mess images ratings occupancy pricing isFeatured priority views');

    // Apply distance-based sorting if coordinates provided
    if (latitude && longitude && sortBy === 'distance') {
      query = query.sort({
        'location.coordinates': {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] }
          }
        }
      });
    } else {
      query = query.sort(sort);
    }

    const hostels = await query.skip(skip).limit(parseInt(limit));

    // Update view counts
    if (hostels.length > 0) {
      const hostelIds = hostels.map(h => h._id);
      await Hostel.updateMany(
        { _id: { $in: hostelIds } },
        { $inc: { views: 1 } }
      );
    }

    const total = await Hostel.countDocuments(filter);

    // Get AI recommendations if user is logged in
    let recommendations = [];
    if (req.user && req.user.role === 'student' && req.user.studentProfile) {
      recommendations = await getAIRecommendations(req.user, hostels);
    }

    res.json({
      hostels,
      recommendations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      filters: {
        search,
        type,
        city,
        state,
        minPrice,
        maxPrice,
        facilities,
        roomType
      }
    });

  } catch (error) {
    console.error('Get hostels error:', error);
    res.status(500).json({
      message: 'Server error while fetching hostels',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/hostels/:id
// @desc    Get single hostel
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'name email phone ownerProfile.businessName ownerProfile.businessRegistration')
      .populate('location.nearbyUniversities.university', 'name shortName location')
      .populate('location.nearbyDepartments.department', 'name shortName category')
      .populate('location.nearbyDepartments.university', 'name shortName');

    if (!hostel) {
      return res.status(404).json({
        message: 'Hostel not found'
      });
    }

    // Increment view count
    await Hostel.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Get similar hostels
    const similarHostels = await getSimilarHostels(hostel);

    res.json({
      hostel,
      similarHostels
    });

  } catch (error) {
    console.error('Get hostel error:', error);
    res.status(500).json({
      message: 'Server error while fetching hostel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/hostels
// @desc    Create new hostel
// @access  Private/Hostel Owner
router.post('/', auth, authorize('hostel_owner'), async (req, res) => {
  try {
    const hostelData = {
      ...req.body,
      owner: req.user.id,
      status: 'pending'
    };

    // Geocode the address if coordinates are not provided
    if (!hostelData.location.coordinates && hostelData.location.address) {
      try {
        const geoData = await mapMyIndiaService.geocodeAddress(hostelData.location.address);
        hostelData.location.coordinates = {
          latitude: geoData.latitude,
          longitude: geoData.longitude
        };
        hostelData.location.mappls_pin = geoData.mapplsPin;
        hostelData.location.place_id = geoData.placeId;
      } catch (geoError) {
        console.warn('Geocoding failed:', geoError.message);
      }
    }

    const hostel = new Hostel(hostelData);
    await hostel.save();

    // Calculate distances to nearby universities and departments
    if (hostel.location.coordinates) {
      await calculateNearbyInstitutions(hostel);
    }

    // Update owner's hostel count
    await req.user.updateOne({ $inc: { 'ownerProfile.totalHostels': 1 } });

    res.status(201).json({
      message: 'Hostel created successfully and submitted for approval',
      hostel
    });

  } catch (error) {
    console.error('Create hostel error:', error);
    res.status(500).json({
      message: 'Server error while creating hostel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/hostels/:id
// @desc    Update hostel
// @access  Private/Hostel Owner
router.put('/:id', auth, authorize('hostel_owner'), async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ _id: req.params.id, owner: req.user.id });

    if (!hostel) {
      return res.status(404).json({
        message: 'Hostel not found or not authorized'
      });
    }

    // Update hostel data
    Object.assign(hostel, req.body);
    hostel.lastUpdatedBy = req.user.id;
    hostel.updatedAt = new Date();

    // If location changed, recalculate distances
    if (req.body.location && req.body.location.coordinates) {
      await calculateNearbyInstitutions(hostel);
    }

    await hostel.save();

    res.json({
      message: 'Hostel updated successfully',
      hostel
    });

  } catch (error) {
    console.error('Update hostel error:', error);
    res.status(500).json({
      message: 'Server error while updating hostel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/hostels/:id
// @desc    Delete hostel
// @access  Private/Hostel Owner
router.delete('/:id', auth, authorize('hostel_owner'), async (req, res) => {
  try {
    const hostel = await Hostel.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!hostel) {
      return res.status(404).json({
        message: 'Hostel not found or not authorized'
      });
    }

    // Update owner's hostel count
    await req.user.updateOne({ $inc: { 'ownerProfile.totalHostels': -1 } });

    res.json({
      message: 'Hostel deleted successfully'
    });

  } catch (error) {
    console.error('Delete hostel error:', error);
    res.status(500).json({
      message: 'Server error while deleting hostel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/hostels/owner/my-hostels
// @desc    Get hostels owned by current user
// @access  Private/Hostel Owner
router.get('/owner/my-hostels', auth, authorize('hostel_owner'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { owner: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const hostels = await Hostel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('name type status location.city occupancy ratings views bookingRequests successfulBookings createdAt');

    const total = await Hostel.countDocuments(filter);

    res.json({
      hostels,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get my hostels error:', error);
    res.status(500).json({
      message: 'Server error while fetching your hostels',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to calculate nearby institutions
const calculateNearbyInstitutions = async (hostel) => {
  try {
    const { latitude, longitude } = hostel.location.coordinates;
    
    // Find nearby universities (within 50km)
    const nearbyUniversities = await University.find({
      'location.coordinates': {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], 50000 / 6378100] // 50km
        }
      },
      isActive: true
    });

    // Find nearby departments (within 25km)
    const nearbyDepartments = await Department.find({
      'location.coordinates': {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], 25000 / 6378100] // 25km
        }
      },
      isActive: true
    }).populate('university', 'name');

    // Calculate travel times for each
    const universitiesWithDistance = [];
    for (const university of nearbyUniversities) {
      try {
        const travelTimes = await mapMyIndiaService.calculateTravelTimes(
          hostel.location.coordinates,
          university.location.coordinates
        );
        
        universitiesWithDistance.push({
          university: university._id,
          distance: travelTimes.driving.distance / 1000, // convert to km
          travelTime: travelTimes
        });
      } catch (error) {
        console.warn(`Failed to calculate distance to university ${university.name}:`, error.message);
      }
    }

    const departmentsWithDistance = [];
    for (const department of nearbyDepartments) {
      if (department.location && department.location.coordinates) {
        try {
          const travelTimes = await mapMyIndiaService.calculateTravelTimes(
            hostel.location.coordinates,
            department.location.coordinates
          );
          
          departmentsWithDistance.push({
            department: department._id,
            university: department.university._id,
            distance: travelTimes.driving.distance / 1000, // convert to km
            travelTime: travelTimes
          });
        } catch (error) {
          console.warn(`Failed to calculate distance to department ${department.name}:`, error.message);
        }
      }
    }

    // Update hostel with calculated distances
    hostel.location.nearbyUniversities = universitiesWithDistance;
    hostel.location.nearbyDepartments = departmentsWithDistance;
    
  } catch (error) {
    console.error('Error calculating nearby institutions:', error);
  }
};

// Helper function to get AI recommendations
const getAIRecommendations = async (user, hostels) => {
  try {
    const preferences = user.studentProfile.preferences;
    const userLocation = user.studentProfile.department;
    
    // Score hostels based on user preferences
    const scoredHostels = hostels.map(hostel => {
      let score = 0;
      
      // Price preference matching
      const minPrice = Math.min(...hostel.roomTypes.map(rt => rt.pricePerBed));
      if (minPrice >= preferences.budgetRange.min && minPrice <= preferences.budgetRange.max) {
        score += 30;
      }
      
      // Room type preference
      if (preferences.roomType === 'any' || hostel.roomTypes.some(rt => rt.type === preferences.roomType)) {
        score += 20;
      }
      
      // Hostel type preference
      if (preferences.hostelType === 'any' || hostel.type === preferences.hostelType) {
        score += 20;
      }
      
      // Facilities matching
      const matchingFacilities = hostel.facilities.filter(f => preferences.facilities.includes(f));
      score += (matchingFacilities.length / preferences.facilities.length) * 15;
      
      // Rating bonus
      score += (hostel.ratings.average / 5) * 10;
      
      // Distance penalty (if user has selected department)
      if (userLocation) {
        const departmentDistance = hostel.location.nearbyDepartments.find(
          nd => nd.department.toString() === userLocation.toString()
        );
        if (departmentDistance && departmentDistance.distance <= preferences.maxDistance) {
          score += 15 - (departmentDistance.distance / preferences.maxDistance) * 10;
        }
      }
      
      return { hostel, score };
    });
    
    // Sort by score and return top 3
    return scoredHostels
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => ({
        ...item.hostel.toObject(),
        recommendationScore: item.score,
        reasons: generateRecommendationReasons(item.hostel, preferences, item.score)
      }));
    
  } catch (error) {
    console.error('AI recommendation error:', error);
    return [];
  }
};

// Helper function to generate recommendation reasons
const generateRecommendationReasons = (hostel, preferences, score) => {
  const reasons = [];
  
  const minPrice = Math.min(...hostel.roomTypes.map(rt => rt.pricePerBed));
  if (minPrice >= preferences.budgetRange.min && minPrice <= preferences.budgetRange.max) {
    reasons.push('Fits your budget perfectly');
  }
  
  if (hostel.ratings.average >= 4) {
    reasons.push('Highly rated by students');
  }
  
  if (hostel.facilities.includes('wifi') && preferences.facilities.includes('wifi')) {
    reasons.push('Has WiFi as requested');
  }
  
  if (hostel.facilities.includes('mess') && preferences.facilities.includes('mess')) {
    reasons.push('Mess facility available');
  }
  
  if (hostel.type === preferences.hostelType) {
    reasons.push(`Perfect match for ${preferences.hostelType} accommodation`);
  }
  
  return reasons.slice(0, 3); // Return top 3 reasons
};

// Helper function to get similar hostels
const getSimilarHostels = async (hostel) => {
  try {
    const filter = {
      _id: { $ne: hostel._id },
      status: 'approved',
      type: hostel.type,
      'location.city': hostel.location.city
    };

    const similarHostels = await Hostel.find(filter)
      .select('name type location.address roomTypes facilities ratings images')
      .limit(4)
      .sort({ 'ratings.average': -1 });

    return similarHostels;
  } catch (error) {
    console.error('Get similar hostels error:', error);
    return [];
  }
};

module.exports = router;