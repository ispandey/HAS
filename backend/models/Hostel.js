const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hostel name is required'],
    trim: true,
    maxlength: [100, 'Hostel name cannot exceed 100 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['boys', 'girls', 'coed'],
    required: [true, 'Hostel type is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Location details with MapMyIndia integration
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    landmark: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid Indian pincode']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    // MapMyIndia specific fields
    mappls_pin: String, // MapMyIndia PIN for precise location
    place_id: String,   // MapMyIndia Place ID
    
    // Distance to nearby universities/departments (calculated and cached)
    nearbyUniversities: [{
      university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University'
      },
      distance: Number, // in kilometers
      travelTime: {
        walking: Number, // in minutes
        driving: Number, // in minutes
        public_transport: Number // in minutes
      }
    }],
    nearbyDepartments: [{
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      },
      university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University'
      },
      distance: Number, // in kilometers
      travelTime: {
        walking: Number,
        driving: Number,
        public_transport: Number
      }
    }]
  },
  
  // Contact information
  contact: {
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    whatsapp: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid WhatsApp number']
    },
    manager: {
      name: String,
      phone: String,
      email: String
    }
  },
  
  // Room configurations
  roomTypes: [{
    type: {
      type: String,
      enum: ['single', 'double', 'triple'],
      required: true
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 1
    },
    availableRooms: {
      type: Number,
      required: true,
      min: 0
    },
    bedsPerRoom: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerBed: {
      type: Number,
      required: true,
      min: 0
    },
    pricePerRoom: {
      type: Number,
      min: 0
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0
    },
    amenities: [{
      type: String,
      enum: ['ac', 'non_ac', 'attached_bathroom', 'shared_bathroom', 'balcony', 'study_table', 'wardrobe', 'bed', 'mattress']
    }]
  }],
  
  // Facilities and amenities
  facilities: [{
    type: String,
    enum: [
      'wifi', 'mess', 'laundry', 'gym', 'parking', 'security', 
      'power_backup', 'water_cooler', 'common_room', 'study_room',
      'library', 'medical', 'atm', 'canteen', 'visitor_room',
      'cctv', 'biometric', 'fire_safety', 'lift'
    ]
  }],
  
  // Mess details
  mess: {
    available: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['veg', 'non_veg', 'both'],
      default: 'veg'
    },
    pricePerMonth: Number,
    timings: {
      breakfast: String,
      lunch: String,
      dinner: String,
      snacks: String
    },
    menu: [{
      day: String,
      breakfast: String,
      lunch: String,
      dinner: String
    }]
  },
  
  // Images and media
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    category: {
      type: String,
      enum: ['exterior', 'room', 'facilities', 'mess', 'common_area', 'other'],
      default: 'other'
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Rules and policies
  rules: {
    checkinTime: String,
    checkoutTime: String,
    visitorPolicy: String,
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    alcoholAllowed: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    gateClosingTime: String,
    minimumStay: {
      type: Number,
      default: 1 // in months
    },
    advancePayment: {
      type: Number,
      default: 1 // number of months
    },
    noticePeriod: {
      type: Number,
      default: 30 // in days
    },
    otherRules: [String]
  },
  
  // Approval and verification
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,
  rejectionReason: String,
  
  // Ratings and reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    breakdown: {
      cleanliness: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      facilities: { type: Number, default: 0 },
      staff: { type: Number, default: 0 }
    }
  },
  
  // Availability and occupancy
  occupancy: {
    total: {
      type: Number,
      default: 0
    },
    occupied: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  },
  
  // Pricing and offers
  pricing: {
    hasDiscount: {
      type: Boolean,
      default: false
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    seasonalPricing: [{
      season: String,
      startDate: Date,
      endDate: Date,
      multiplier: Number // price multiplier
    }],
    offers: [{
      title: String,
      description: String,
      validFrom: Date,
      validTill: Date,
      discountType: {
        type: String,
        enum: ['percentage', 'fixed']
      },
      discountValue: Number
    }]
  },
  
  // Verification documents
  documents: [{
    type: {
      type: String,
      enum: ['ownership_proof', 'fire_safety', 'electrical_safety', 'license', 'tax_certificate', 'other']
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
  
  // Featured and priority
  isFeatured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  
  // Blockchain transaction hash for transparency
  blockchainTxHash: String,
  blockchainVerified: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  bookingRequests: {
    type: Number,
    default: 0
  },
  successfulBookings: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
hostelSchema.index({ owner: 1 });
hostelSchema.index({ type: 1 });
hostelSchema.index({ status: 1 });
hostelSchema.index({ 'location.coordinates': '2dsphere' });
hostelSchema.index({ 'location.city': 1 });
hostelSchema.index({ 'location.state': 1 });
hostelSchema.index({ 'location.pincode': 1 });
hostelSchema.index({ isFeatured: 1, priority: -1 });
hostelSchema.index({ 'ratings.average': -1 });
hostelSchema.index({ createdAt: -1 });

// Compound indexes
hostelSchema.index({ status: 1, type: 1, 'location.city': 1 });
hostelSchema.index({ 'location.nearbyUniversities.university': 1, status: 1 });

// Virtual for total capacity
hostelSchema.virtual('totalCapacity').get(function() {
  return this.roomTypes.reduce((total, room) => {
    return total + (room.totalRooms * room.bedsPerRoom);
  }, 0);
});

// Virtual for available capacity
hostelSchema.virtual('availableCapacity').get(function() {
  return this.roomTypes.reduce((total, room) => {
    return total + (room.availableRooms * room.bedsPerRoom);
  }, 0);
});

// Method to update occupancy
hostelSchema.methods.updateOccupancy = function() {
  this.occupancy.total = this.totalCapacity;
  this.occupancy.available = this.availableCapacity;
  this.occupancy.occupied = this.occupancy.total - this.occupancy.available;
  return this;
};

// Method to check room availability
hostelSchema.methods.checkAvailability = function(roomType, bedsNeeded = 1) {
  const room = this.roomTypes.find(r => r.type === roomType);
  if (!room) return false;
  
  return room.availableRooms * room.bedsPerRoom >= bedsNeeded;
};

// Method to get starting price
hostelSchema.methods.getStartingPrice = function() {
  if (this.roomTypes.length === 0) return 0;
  return Math.min(...this.roomTypes.map(room => room.pricePerBed));
};

// Pre-save middleware to update occupancy
hostelSchema.pre('save', function(next) {
  this.updateOccupancy();
  next();
});

module.exports = mongoose.model('Hostel', hostelSchema);