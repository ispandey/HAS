const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  hostelOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Booking details
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple'],
    required: true
  },
  bedsRequested: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true
    },
    months: {
      type: Number,
      required: true,
      min: 1
    }
  },
  
  // Pricing details
  pricing: {
    pricePerBed: {
      type: Number,
      required: true,
      min: 0
    },
    totalBedCost: {
      type: Number,
      required: true,
      min: 0
    },
    messCharges: {
      type: Number,
      default: 0
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    advanceAmount: {
      type: Number,
      default: 0
    }
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'confirmed', 'checked_in', 'checked_out', 'completed'],
    default: 'pending'
  },
  
  // Status history for transparency
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'confirmed', 'checked_in', 'checked_out', 'completed']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    notes: String
  }],
  
  // Response from hostel owner
  ownerResponse: {
    respondedAt: Date,
    message: String,
    counterOffer: {
      pricePerBed: Number,
      securityDeposit: Number,
      alternativeRoomType: String,
      conditions: String
    }
  },
  
  // Student preferences at time of booking
  preferences: {
    messRequired: {
      type: Boolean,
      default: false
    },
    messType: {
      type: String,
      enum: ['veg', 'non_veg', 'both']
    },
    specialRequests: String,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  
  // Payment details
  payment: {
    method: {
      type: String,
      enum: ['online', 'cash', 'bank_transfer', 'upi', 'card'],
      default: 'online'
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAmount: {
      type: Number,
      default: 0
    },
    paymentDate: Date,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundDate: Date,
    paymentHistory: [{
      amount: Number,
      method: String,
      transactionId: String,
      status: String,
      timestamp: Date,
      notes: String
    }]
  },
  
  // Documents and verification
  documents: [{
    type: {
      type: String,
      enum: ['id_proof', 'address_proof', 'college_id', 'parent_consent', 'medical_certificate', 'photo']
    },
    name: String,
    url: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedDate: Date
  }],
  
  // Check-in/Check-out details
  checkIn: {
    actualDate: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    roomNumber: String,
    bedNumber: String,
    keysIssued: {
      type: Boolean,
      default: false
    },
    orientation: {
      completed: {
        type: Boolean,
        default: false
      },
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      completedDate: Date
    },
    notes: String
  },
  
  checkOut: {
    actualDate: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    depositRefunded: {
      type: Number,
      default: 0
    },
    deductions: [{
      item: String,
      amount: Number,
      reason: String
    }],
    finalSettlement: {
      amount: Number,
      method: String,
      transactionId: String,
      date: Date
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    notes: String
  },
  
  // Communication log
  communications: [{
    type: {
      type: String,
      enum: ['message', 'call', 'email', 'notification', 'system']
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    subject: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date
  }],
  
  // Reviews and ratings (post booking)
  review: {
    rating: {
      overall: { type: Number, min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5 },
      food: { type: Number, min: 1, max: 5 },
      location: { type: Number, min: 1, max: 5 },
      facilities: { type: Number, min: 1, max: 5 },
      staff: { type: Number, min: 1, max: 5 }
    },
    comment: String,
    photos: [String],
    wouldRecommend: {
      type: Boolean,
      default: true
    },
    submittedAt: Date
  },
  
  // Blockchain integration for transparency
  blockchain: {
    transactionHash: String,
    contractAddress: String,
    blockNumber: Number,
    gasUsed: Number,
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date
  },
  
  // Analytics and tracking
  source: {
    type: String,
    enum: ['web', 'mobile', 'api', 'referral', 'direct'],
    default: 'web'
  },
  referralCode: String,
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  },
  
  // Auto-cancellation
  autoCancelAt: Date,
  
  // Internal notes (admin only)
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Emergency contact during stay
  emergencyContact: {
    name: String,
    phone: String,
    email: String,
    relation: String,
    address: String
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
bookingSchema.index({ student: 1 });
bookingSchema.index({ hostel: 1 });
bookingSchema.index({ hostelOwner: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'duration.checkIn': 1 });
bookingSchema.index({ 'duration.checkOut': 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ 'blockchain.isVerified': 1 });

// Compound indexes
bookingSchema.index({ student: 1, status: 1 });
bookingSchema.index({ hostel: 1, status: 1 });
bookingSchema.index({ hostelOwner: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Virtual for total days
bookingSchema.virtual('totalDays').get(function() {
  if (!this.duration.checkIn || !this.duration.checkOut) return 0;
  const timeDiff = this.duration.checkOut.getTime() - this.duration.checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Method to add status history
bookingSchema.methods.addStatusHistory = function(status, updatedBy, reason, notes) {
  this.statusHistory.push({
    status,
    updatedBy,
    reason,
    notes,
    timestamp: new Date()
  });
  this.status = status;
  return this;
};

// Method to calculate total amount
bookingSchema.methods.calculateTotalAmount = function() {
  const { pricePerBed, messCharges, securityDeposit, discount } = this.pricing;
  const totalBedCost = pricePerBed * this.bedsRequested * this.duration.months;
  const totalMessCharges = messCharges * this.duration.months;
  const subtotal = totalBedCost + totalMessCharges + securityDeposit;
  const gst = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + gst - (discount || 0);
  
  this.pricing.totalBedCost = totalBedCost;
  this.pricing.totalAmount = subtotal;
  this.pricing.gst = gst;
  this.pricing.finalAmount = totalAmount;
  
  return totalAmount;
};

// Method to add communication
bookingSchema.methods.addCommunication = function(type, from, to, subject, message) {
  this.communications.push({
    type,
    from,
    to,
    subject,
    message,
    timestamp: new Date()
  });
  return this;
};

// Method to check if booking is active
bookingSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'confirmed' || 
         this.status === 'checked_in' && 
         this.duration.checkIn <= now && 
         this.duration.checkOut >= now;
};

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  // Auto-calculate amounts if not set
  if (this.isModified('pricing.pricePerBed') || this.isModified('bedsRequested') || this.isModified('duration.months')) {
    this.calculateTotalAmount();
  }
  
  // Set auto-cancel date (24 hours for pending bookings)
  if (this.status === 'pending' && !this.autoCancelAt) {
    this.autoCancelAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);