const express = require('express');
const { University, College, Department } = require('../models/University');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/universities
// @desc    Get all universities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      state, 
      city, 
      type, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { shortName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const universities = await University.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('name shortName type location.city location.state logo ranking studentCount');

    const total = await University.countDocuments(filter);

    res.json({
      universities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({
      message: 'Server error while fetching universities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/universities/:id
// @desc    Get university by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    
    if (!university) {
      return res.status(404).json({
        message: 'University not found'
      });
    }

    res.json({ university });

  } catch (error) {
    console.error('Get university error:', error);
    res.status(500).json({
      message: 'Server error while fetching university',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/universities/:id/colleges
// @desc    Get colleges of a university
// @access  Public
router.get('/:id/colleges', async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    
    const filter = { 
      university: req.params.id, 
      isActive: true 
    };

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { shortName: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const colleges = await College.find(filter)
      .populate('university', 'name shortName')
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await College.countDocuments(filter);

    res.json({
      colleges,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({
      message: 'Server error while fetching colleges',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/universities/:universityId/colleges/:collegeId/departments
// @desc    Get departments of a college
// @access  Public
router.get('/:universityId/colleges/:collegeId/departments', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 100 } = req.query;
    
    const filter = { 
      university: req.params.universityId,
      college: req.params.collegeId,
      isActive: true 
    };

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { shortName: new RegExp(search, 'i') }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const departments = await Department.find(filter)
      .populate('university', 'name shortName')
      .populate('college', 'name shortName')
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Department.countDocuments(filter);

    res.json({
      departments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      message: 'Server error while fetching departments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/universities/departments/:id
// @desc    Get department by ID
// @access  Public
router.get('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('university', 'name shortName location')
      .populate('college', 'name shortName location');
    
    if (!department) {
      return res.status(404).json({
        message: 'Department not found'
      });
    }

    res.json({ department });

  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      message: 'Server error while fetching department',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/universities
// @desc    Create new university (Admin only)
// @access  Private/Admin
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const universityData = req.body;
    
    // Check if university already exists
    const existingUniversity = await University.findOne({
      $or: [
        { name: universityData.name },
        { shortName: universityData.shortName }
      ]
    });

    if (existingUniversity) {
      return res.status(400).json({
        message: 'University with this name or short name already exists'
      });
    }

    const university = new University(universityData);
    await university.save();

    res.status(201).json({
      message: 'University created successfully',
      university
    });

  } catch (error) {
    console.error('Create university error:', error);
    res.status(500).json({
      message: 'Server error while creating university',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/universities/:id
// @desc    Update university (Admin only)
// @access  Private/Admin
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({
        message: 'University not found'
      });
    }

    res.json({
      message: 'University updated successfully',
      university
    });

  } catch (error) {
    console.error('Update university error:', error);
    res.status(500).json({
      message: 'Server error while updating university',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/universities/:id
// @desc    Delete university (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!university) {
      return res.status(404).json({
        message: 'University not found'
      });
    }

    res.json({
      message: 'University deactivated successfully'
    });

  } catch (error) {
    console.error('Delete university error:', error);
    res.status(500).json({
      message: 'Server error while deleting university',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/universities/stats
// @desc    Get universities statistics
// @access  Public
router.get('/api/stats', async (req, res) => {
  try {
    const stats = await University.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalUniversities: { $sum: 1 },
          centralUniversities: {
            $sum: { $cond: [{ $eq: ['$type', 'central'] }, 1, 0] }
          },
          stateUniversities: {
            $sum: { $cond: [{ $eq: ['$type', 'state'] }, 1, 0] }
          },
          privateUniversities: {
            $sum: { $cond: [{ $eq: ['$type', 'private'] }, 1, 0] }
          },
          deemedUniversities: {
            $sum: { $cond: [{ $eq: ['$type', 'deemed'] }, 1, 0] }
          },
          totalStudents: { $sum: '$studentCount.total' }
        }
      }
    ]);

    const stateWiseStats = await University.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$location.state',
          count: { $sum: 1 },
          students: { $sum: '$studentCount.total' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: stats[0] || {
        totalUniversities: 0,
        centralUniversities: 0,
        stateUniversities: 0,
        privateUniversities: 0,
        deemedUniversities: 0,
        totalStudents: 0
      },
      stateWiseStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;