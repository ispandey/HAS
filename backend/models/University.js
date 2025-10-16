const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
    unique: true
  },
  shortName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['central', 'state', 'private', 'deemed'],
    required: true
  },
  established: {
    type: Number,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
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
    }
  },
  contact: {
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      match: [/^https?:\/\//, 'Please enter a valid website URL']
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    default: null
  },
  ranking: {
    nirf: Number,
    qs: Number,
    times: Number
  },
  accreditation: [{
    body: String,
    grade: String,
    year: Number
  }],
  studentCount: {
    total: Number,
    undergraduate: Number,
    postgraduate: Number,
    doctoral: Number
  },
  isActive: {
    type: Boolean,
    default: true
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

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    trim: true
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  type: {
    type: String,
    enum: ['constituent', 'affiliated', 'autonomous'],
    required: true
  },
  established: Number,
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  accreditation: [{
    body: String,
    grade: String,
    year: Number
  }],
  isActive: {
    type: Boolean,
    default: true
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

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    trim: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  type: {
    type: String,
    enum: ['academic', 'research', 'administrative'],
    default: 'academic'
  },
  category: {
    type: String,
    enum: ['science', 'arts', 'commerce', 'engineering', 'medical', 'law', 'management', 'other'],
    required: true
  },
  established: Number,
  location: {
    building: String,
    floor: String,
    room: String,
    address: String,
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  contact: {
    phone: String,
    email: String,
    hodName: String,
    hodEmail: String
  },
  programs: [{
    name: String,
    degree: {
      type: String,
      enum: ['bachelor', 'master', 'doctoral', 'diploma', 'certificate']
    },
    duration: Number, // in years
    seats: Number
  }],
  facilities: [{
    type: String,
    enum: ['library', 'laboratory', 'computer_lab', 'auditorium', 'seminar_hall', 'research_center']
  }],
  studentCount: {
    total: Number,
    undergraduate: Number,
    postgraduate: Number,
    doctoral: Number
  },
  facultyCount: Number,
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
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

// Indexes for better performance
universitySchema.index({ 'location.city': 1 });
universitySchema.index({ 'location.state': 1 });
universitySchema.index({ 'location.coordinates': '2dsphere' });

collegeSchema.index({ university: 1 });
collegeSchema.index({ university: 1, name: 1 }, { unique: true });
collegeSchema.index({ 'location.coordinates': '2dsphere' });

departmentSchema.index({ college: 1 });
departmentSchema.index({ university: 1 });
departmentSchema.index({ category: 1 });
departmentSchema.index({ 'location.coordinates': '2dsphere' });

// Compound indexes
departmentSchema.index({ university: 1, college: 1, name: 1 }, { unique: true });

module.exports = {
  University: mongoose.model('University', universitySchema),
  College: mongoose.model('College', collegeSchema),
  Department: mongoose.model('Department', departmentSchema)
};