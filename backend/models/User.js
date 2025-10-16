const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'hostel_owner', 'admin'],
    default: 'student'
  },
  phone: {
    type: String,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  profileImage: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Student specific fields
  studentProfile: {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University'
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },
    institutionName: String,
    course: String,
    year: Number,
    yearLabel: String,
    studentId: String,
    preferences: {
      budgetRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 50000 }
      },
      roomType: {
        type: String,
        enum: ['single', 'double', 'triple', 'any'],
        default: 'any'
      },
      facilities: [{
        type: String,
        enum: ['wifi', 'ac', 'mess', 'laundry', 'gym', 'parking', 'security', 'water_cooler', 'power_backup']
      }],
      hostelType: {
        type: String,
        enum: ['boys', 'girls', 'coed', 'any'],
        default: 'any'
      },
      maxDistance: {
        type: Number,
        default: 10 // in kilometers
      }
    }
  },
  
  // Hostel Owner specific fields
  ownerProfile: {
    businessName: String,
    businessRegistration: String,
    businessPhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    documents: [{
      type: String,
      name: String,
      url: String
    }],
    isApproved: {
      type: Boolean,
      default: false
    },
    approvalDate: Date,
    totalHostels: {
      type: Number,
      default: 0
    }
  },

  // Blockchain wallet address for transparency
  walletAddress: String,
  
  // Activity tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
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

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update login tracking
userSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ 'studentProfile.university': 1 });
userSchema.index({ 'studentProfile.department': 1 });
userSchema.index({ 'ownerProfile.isApproved': 1 });

module.exports = mongoose.model('User', userSchema);