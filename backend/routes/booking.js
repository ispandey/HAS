const express = require('express');
const Booking = require('../models/Booking');
const Hostel = require('../models/Hostel');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create new booking request
// @access  Private/Student
router.post('/', auth, authorize('student'), async (req, res) => {
  try {
    const {
      hostelId,
      roomType,
      bedsRequested,
      duration,
      preferences
    } = req.body;

    // Validate hostel exists and is approved
    const hostel = await Hostel.findOne({ _id: hostelId, status: 'approved' })
      .populate('owner');

    if (!hostel) {
      return res.status(404).json({
        message: 'Hostel not found or not available for booking'
      });
    }

    // Check room availability
    const roomTypeData = hostel.roomTypes.find(rt => rt.type === roomType);
    if (!roomTypeData) {
      return res.status(400).json({
        message: 'Selected room type not available'
      });
    }

    if (!hostel.checkAvailability(roomType, bedsRequested)) {
      return res.status(400).json({
        message: 'Insufficient beds available for selected room type'
      });
    }

    // Calculate pricing
    const pricePerBed = roomTypeData.pricePerBed;
    const securityDeposit = roomTypeData.securityDeposit;
    const totalBedCost = pricePerBed * bedsRequested * duration.months;
    const messCharges = preferences.messRequired ? (hostel.mess.pricePerMonth * duration.months) : 0;
    const subtotal = totalBedCost + messCharges + securityDeposit;
    const gst = subtotal * 0.18;
    const finalAmount = subtotal + gst;

    // Create booking
    const booking = new Booking({
      student: req.user.id,
      hostel: hostelId,
      hostelOwner: hostel.owner._id,
      roomType,
      bedsRequested,
      duration,
      pricing: {
        pricePerBed,
        totalBedCost,
        messCharges,
        securityDeposit,
        totalAmount: subtotal,
        gst,
        finalAmount
      },
      preferences,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        updatedBy: req.user.id
      }]
    });

    await booking.save();

    // Update hostel booking request count
    await Hostel.findByIdAndUpdate(hostelId, { $inc: { bookingRequests: 1 } });

    // Emit real-time notification to hostel owner
    if (req.io) {
      req.io.to(`owner_${hostel.owner._id}`).emit('new_booking_request', {
        bookingId: booking._id,
        studentName: req.user.name,
        hostelName: hostel.name,
        roomType,
        bedsRequested
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('hostel', 'name location contact')
      .populate('student', 'name email phone');

    res.status(201).json({
      message: 'Booking request submitted successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      message: 'Server error while creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get current user's bookings
// @access  Private
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    
    if (req.user.role === 'student') {
      filter.student = req.user.id;
    } else if (req.user.role === 'hostel_owner') {
      filter.hostelOwner = req.user.id;
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('hostel', 'name location contact images')
      .populate('student', 'name email phone')
      .populate('hostelOwner', 'name email phone ownerProfile.businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      message: 'Server error while fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hostel')
      .populate('student', 'name email phone studentProfile')
      .populate('hostelOwner', 'name email phone ownerProfile');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isAuthorized = booking.student._id.toString() === req.user.id ||
                        booking.hostelOwner._id.toString() === req.user.id ||
                        req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      message: 'Server error while fetching booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/bookings/:id/respond
// @desc    Hostel owner respond to booking request
// @access  Private/Hostel Owner
router.put('/:id/respond', auth, authorize('hostel_owner'), async (req, res) => {
  try {
    const { action, message, counterOffer } = req.body; // action: 'approve' or 'reject'
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      hostelOwner: req.user.id,
      status: 'pending'
    }).populate('hostel').populate('student', 'name email');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found or not authorized'
      });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Update booking status
    booking.addStatusHistory(newStatus, req.user.id, message);
    booking.ownerResponse = {
      respondedAt: new Date(),
      message,
      counterOffer
    };

    await booking.save();

    // Update room availability if approved
    if (action === 'approve') {
      const hostel = booking.hostel;
      const roomType = hostel.roomTypes.find(rt => rt.type === booking.roomType);
      if (roomType && roomType.availableRooms > 0) {
        const bedsToDeduct = Math.ceil(booking.bedsRequested / roomType.bedsPerRoom);
        roomType.availableRooms = Math.max(0, roomType.availableRooms - bedsToDeduct);
        await hostel.save();
      }

      // Update successful bookings count
      await Hostel.findByIdAndUpdate(booking.hostel._id, { $inc: { successfulBookings: 1 } });
    }

    // Emit real-time notification to student
    if (req.io) {
      req.io.to(`student_${booking.student._id}`).emit('booking_response', {
        bookingId: booking._id,
        status: newStatus,
        hostelName: booking.hostel.name,
        message
      });
    }

    res.json({
      message: `Booking ${action}d successfully`,
      booking
    });

  } catch (error) {
    console.error('Booking response error:', error);
    res.status(500).json({
      message: 'Server error while responding to booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findById(req.params.id)
      .populate('hostel')
      .populate('student', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const canCancel = booking.student._id.toString() === req.user.id ||
                     (req.user.role === 'hostel_owner' && booking.hostelOwner.toString() === req.user.id) ||
                     req.user.role === 'admin';

    if (!canCancel) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (!['pending', 'approved'].includes(booking.status)) {
      return res.status(400).json({
        message: 'Booking cannot be cancelled in current status'
      });
    }

    // Update booking status
    booking.addStatusHistory('cancelled', req.user.id, reason);
    await booking.save();

    // Restore room availability if was approved
    if (booking.status === 'approved') {
      const hostel = booking.hostel;
      const roomType = hostel.roomTypes.find(rt => rt.type === booking.roomType);
      if (roomType) {
        const bedsToRestore = Math.ceil(booking.bedsRequested / roomType.bedsPerRoom);
        roomType.availableRooms += bedsToRestore;
        await hostel.save();
      }
    }

    // Emit real-time notification
    const notificationTarget = req.user.role === 'student' ? 
      `owner_${booking.hostelOwner}` : `student_${booking.student._id}`;
    
    if (req.io) {
      req.io.to(notificationTarget).emit('booking_cancelled', {
        bookingId: booking._id,
        cancelledBy: req.user.role,
        reason
      });
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      message: 'Server error while cancelling booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/bookings/:id/checkin
// @desc    Check-in student
// @access  Private/Hostel Owner
router.put('/:id/checkin', auth, authorize('hostel_owner'), async (req, res) => {
  try {
    const { roomNumber, bedNumber, notes } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      hostelOwner: req.user.id,
      status: 'approved'
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found or not authorized'
      });
    }

    // Update booking for check-in
    booking.addStatusHistory('checked_in', req.user.id, 'Student checked in');
    booking.checkIn = {
      actualDate: new Date(),
      verifiedBy: req.user.id,
      roomNumber,
      bedNumber,
      keysIssued: true,
      notes
    };

    await booking.save();

    // Emit real-time notification
    if (req.io) {
      req.io.to(`student_${booking.student}`).emit('checked_in', {
        bookingId: booking._id,
        roomNumber,
        bedNumber
      });
    }

    res.json({
      message: 'Student checked in successfully',
      booking
    });

  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      message: 'Server error during check-in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/bookings/:id/checkout
// @desc    Check-out student
// @access  Private/Hostel Owner
router.put('/:id/checkout', auth, authorize('hostel_owner'), async (req, res) => {
  try {
    const { condition, deductions, notes } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      hostelOwner: req.user.id,
      status: 'checked_in'
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found or student not checked in'
      });
    }

    // Calculate refund amount
    const totalDeductions = deductions ? deductions.reduce((sum, d) => sum + d.amount, 0) : 0;
    const refundAmount = Math.max(0, booking.pricing.securityDeposit - totalDeductions);

    // Update booking for check-out
    booking.addStatusHistory('checked_out', req.user.id, 'Student checked out');
    booking.checkOut = {
      actualDate: new Date(),
      verifiedBy: req.user.id,
      depositRefunded: refundAmount,
      deductions: deductions || [],
      condition,
      notes
    };

    await booking.save();

    // Restore room availability
    const hostel = await Hostel.findById(booking.hostel);
    const roomType = hostel.roomTypes.find(rt => rt.type === booking.roomType);
    if (roomType) {
      const bedsToRestore = Math.ceil(booking.bedsRequested / roomType.bedsPerRoom);
      roomType.availableRooms += bedsToRestore;
      await hostel.save();
    }

    // Emit real-time notification
    if (req.io) {
      req.io.to(`student_${booking.student}`).emit('checked_out', {
        bookingId: booking._id,
        refundAmount,
        deductions
      });
    }

    res.json({
      message: 'Student checked out successfully',
      booking,
      refundAmount
    });

  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({
      message: 'Server error during check-out',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/bookings/:id/review
// @desc    Submit review for hostel
// @access  Private/Student
router.post('/:id/review', auth, authorize('student'), async (req, res) => {
  try {
    const { rating, comment, photos, wouldRecommend } = req.body;
    
    const booking = await Booking.findOne({
      _id: req.params.id,
      student: req.user.id,
      status: { $in: ['checked_out', 'completed'] }
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found or not eligible for review'
      });
    }

    if (booking.review && booking.review.submittedAt) {
      return res.status(400).json({
        message: 'Review already submitted for this booking'
      });
    }

    // Add review to booking
    booking.review = {
      rating,
      comment,
      photos: photos || [],
      wouldRecommend: wouldRecommend !== false,
      submittedAt: new Date()
    };

    await booking.save();

    // Update hostel ratings
    await updateHostelRating(booking.hostel, rating);

    res.json({
      message: 'Review submitted successfully',
      review: booking.review
    });

  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      message: 'Server error while submitting review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to update hostel rating
const updateHostelRating = async (hostelId, newRating) => {
  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return;

    const bookingsWithReviews = await Booking.find({
      hostel: hostelId,
      'review.submittedAt': { $exists: true }
    });

    if (bookingsWithReviews.length === 0) return;

    const totalRatings = bookingsWithReviews.length;
    const sumRatings = bookingsWithReviews.reduce((sum, booking) => {
      return sum + booking.review.rating.overall;
    }, 0);

    const averageRating = sumRatings / totalRatings;

    // Calculate breakdown averages
    const breakdown = {
      cleanliness: 0,
      food: 0,
      location: 0,
      facilities: 0,
      staff: 0
    };

    bookingsWithReviews.forEach(booking => {
      if (booking.review.rating.cleanliness) breakdown.cleanliness += booking.review.rating.cleanliness;
      if (booking.review.rating.food) breakdown.food += booking.review.rating.food;
      if (booking.review.rating.location) breakdown.location += booking.review.rating.location;
      if (booking.review.rating.facilities) breakdown.facilities += booking.review.rating.facilities;
      if (booking.review.rating.staff) breakdown.staff += booking.review.rating.staff;
    });

    Object.keys(breakdown).forEach(key => {
      breakdown[key] = breakdown[key] / totalRatings;
    });

    // Update hostel ratings
    hostel.ratings = {
      average: Math.round(averageRating * 10) / 10,
      totalReviews: totalRatings,
      breakdown
    };

    await hostel.save();
  } catch (error) {
    console.error('Update hostel rating error:', error);
  }
};

module.exports = router;