const express = require('express');
const User = require('../models/User');
const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');
const { University, College, Department } = require('../models/University');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalHostelOwners,
      totalHostels,
      approvedHostels,
      pendingHostels,
      totalBookings,
      activeBookings,
      totalUniversities,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'hostel_owner' }),
      Hostel.countDocuments({}),
      Hostel.countDocuments({ status: 'approved' }),
      Hostel.countDocuments({ status: 'pending' }),
      Booking.countDocuments({}),
      Booking.countDocuments({ status: { $in: ['approved', 'checked_in'] } }),
      University.countDocuments({ isActive: true }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.finalAmount' } } }
      ])
    ]);

    // Get recent activities
    const recentBookings = await Booking.find({})
      .populate('student', 'name')
      .populate('hostel', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('student hostel status createdAt');

    const recentHostels = await Hostel.find({ status: 'pending' })
      .populate('owner', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name owner createdAt location.city');

    // Monthly statistics for charts
    const monthlyStats = await getMonthlyStatistics();

    const stats = {
      users: {
        total: totalUsers,
        students: totalStudents,
        hostelOwners: totalHostelOwners
      },
      hostels: {
        total: totalHostels,
        approved: approvedHostels,
        pending: pendingHostels,
        rejected: totalHostels - approvedHostels - pendingHostels
      },
      bookings: {
        total: totalBookings,
        active: activeBookings
      },
      universities: totalUniversities,
      revenue: totalRevenue[0]?.total || 0,
      recentActivities: {
        bookings: recentBookings,
        hostels: recentHostels
      },
      monthlyStats
    };

    res.json({ stats });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      message: 'Server error while fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/admin/hostels/pending
// @desc    Get pending hostels for approval
// @access  Private/Admin
router.get('/hostels/pending', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const hostels = await Hostel.find({ status: 'pending' })
      .populate('owner', 'name email phone ownerProfile.businessName ownerProfile.businessRegistration')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Hostel.countDocuments({ status: 'pending' });

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
    console.error('Get pending hostels error:', error);
    res.status(500).json({
      message: 'Server error while fetching pending hostels',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/admin/hostels/:id/approve
// @desc    Approve hostel
// @access  Private/Admin
router.put('/hostels/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const { notes } = req.body;
    
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    hostel.status = 'approved';
    hostel.approvedBy = req.user.id;
    hostel.approvalDate = new Date();
    if (notes) {
      hostel.internalNotes.push({
        note: notes,
        addedBy: req.user.id
      });
    }

    await hostel.save();

    // Notify hostel owner
    if (req.io) {
      req.io.to(`owner_${hostel.owner}`).emit('hostel_approved', {
        hostelId: hostel._id,
        hostelName: hostel.name
      });
    }

    res.json({
      message: 'Hostel approved successfully',
      hostel
    });

  } catch (error) {
    console.error('Approve hostel error:', error);
    res.status(500).json({
      message: 'Server error while approving hostel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/admin/hostels/:id/reject
// @desc    Reject hostel
// @access  Private/Admin
router.put('/hostels/:id/reject', auth, authorize('admin'), async (req, res) => {
  try {
    const { reason, notes } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    hostel.status = 'rejected';
    hostel.rejectionReason = reason;
    if (notes) {
      hostel.internalNotes.push({
        note: notes,
        addedBy: req.user.id
      });
    }

    await hostel.save();

    // Notify hostel owner
    if (req.io) {
      req.io.to(`owner_${hostel.owner}`).emit('hostel_rejected', {
        hostelId: hostel._id,
        hostelName: hostel.name,
        reason
      });
    }

    res.json({
      message: 'Hostel rejected',
      hostel
    });

  } catch (error) {
    console.error('Reject hostel error:', error);
    res.status(500).json({
      message: 'Server error while rejecting hostel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering
// @access  Private/Admin
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .populate('studentProfile.university', 'name shortName')
      .populate('studentProfile.department', 'name shortName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Server error while fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/admin/users/:id/suspend
// @desc    Suspend/Activate user
// @access  Private/Admin
router.put('/users/:id/suspend', auth, authorize('admin'), async (req, res) => {
  try {
    const { suspended, reason } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isSuspended = suspended;
    if (suspended && reason) {
      user.suspensionReason = reason;
      user.suspendedAt = new Date();
      user.suspendedBy = req.user.id;
    } else if (!suspended) {
      user.suspensionReason = undefined;
      user.suspendedAt = undefined;
      user.suspendedBy = undefined;
    }

    await user.save();

    res.json({
      message: `User ${suspended ? 'suspended' : 'activated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSuspended: user.isSuspended
      }
    });

  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      message: 'Server error while updating user status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filtering
// @access  Private/Admin
router.get('/bookings', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = Booking.find(filter)
      .populate('student', 'name email')
      .populate('hostel', 'name location.city')
      .populate('hostelOwner', 'name ownerProfile.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (search) {
      // For search, we'll need to use aggregation
      const bookings = await Booking.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'student',
            foreignField: '_id',
            as: 'studentInfo'
          }
        },
        {
          $lookup: {
            from: 'hostels',
            localField: 'hostel',
            foreignField: '_id',
            as: 'hostelInfo'
          }
        },
        {
          $match: {
            ...filter,
            $or: [
              { 'studentInfo.name': new RegExp(search, 'i') },
              { 'studentInfo.email': new RegExp(search, 'i') },
              { 'hostelInfo.name': new RegExp(search, 'i') }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      const total = await Booking.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'student',
            foreignField: '_id',
            as: 'studentInfo'
          }
        },
        {
          $lookup: {
            from: 'hostels',
            localField: 'hostel',
            foreignField: '_id',
            as: 'hostelInfo'
          }
        },
        {
          $match: {
            ...filter,
            $or: [
              { 'studentInfo.name': new RegExp(search, 'i') },
              { 'studentInfo.email': new RegExp(search, 'i') },
              { 'hostelInfo.name': new RegExp(search, 'i') }
            ]
          }
        },
        { $count: 'total' }
      ]);

      res.json({
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil((total[0]?.total || 0) / parseInt(limit)),
          totalItems: total[0]?.total || 0,
          itemsPerPage: parseInt(limit)
        }
      });
    } else {
      const bookings = await query;
      const total = await Booking.countDocuments(filter);

      res.json({
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      });
    }

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      message: 'Server error while fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to get monthly statistics
const getMonthlyStatistics = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.finalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthlyUsers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    return {
      bookings: monthlyBookings,
      users: monthlyUsers
    };
  } catch (error) {
    console.error('Monthly statistics error:', error);
    return { bookings: [], users: [] };
  }
};

module.exports = router;