const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { University, College, Department } = require('../models/University');
const Hostel = require('../models/Hostel');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample Universities Data
const universitiesData = [
  {
    name: 'Banaras Hindu University',
    shortName: 'BHU',
    type: 'central',
    established: 1916,
    location: {
      address: 'Varanasi, Uttar Pradesh 221005, India',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      country: 'India',
      coordinates: {
        latitude: 25.2677,
        longitude: 82.9913
      }
    },
    contact: {
      phone: '9876543210',
      email: 'info@bhu.ac.in',
      website: 'https://www.bhu.ac.in'
    },
    description: 'Banaras Hindu University is a public central university located in Varanasi, Uttar Pradesh, India.',
    ranking: {
      nirf: 12,
      qs: 801
    },
    studentCount: {
      total: 30000,
      undergraduate: 20000,
      postgraduate: 8000,
      doctoral: 2000
    },
    isActive: true
  },
  {
    name: 'University of Delhi',
    shortName: 'DU',
    type: 'central',
    established: 1922,
    location: {
      address: 'Delhi 110007, India',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110007',
      country: 'India',
      coordinates: {
        latitude: 28.6906,
        longitude: 77.2006
      }
    },
    contact: {
      phone: '9876543211',
      email: 'info@du.ac.in',
      website: 'https://www.du.ac.in'
    },
    description: 'University of Delhi is a premier university of India located in New Delhi.',
    ranking: {
      nirf: 11,
      qs: 521
    },
    studentCount: {
      total: 132435,
      undergraduate: 100000,
      postgraduate: 25000,
      doctoral: 7435
    },
    isActive: true
  },
  {
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    type: 'central',
    established: 1958,
    location: {
      address: 'Powai, Mumbai, Maharashtra 400076, India',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      country: 'India',
      coordinates: {
        latitude: 19.1334,
        longitude: 72.9133
      }
    },
    contact: {
      phone: '9876543212',
      email: 'info@iitb.ac.in',
      website: 'https://www.iitb.ac.in'
    },
    description: 'IIT Bombay is one of the premier engineering institutions in India.',
    ranking: {
      nirf: 3,
      qs: 172
    },
    studentCount: {
      total: 10500,
      undergraduate: 4500,
      postgraduate: 4000,
      doctoral: 2000
    },
    isActive: true
  },
  {
    name: 'University of Calcutta',
    shortName: 'CU',
    type: 'state',
    established: 1857,
    location: {
      address: 'Senate House, 87/1 College Street, Kolkata, West Bengal 700073, India',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700073',
      country: 'India',
      coordinates: {
        latitude: 22.5726,
        longitude: 88.3639
      }
    },
    contact: {
      phone: '9876543213',
      email: 'info@caluniv.ac.in',
      website: 'https://www.caluniv.ac.in'
    },
    description: 'University of Calcutta is the first modern university established in India.',
    ranking: {
      nirf: 27,
      qs: 801
    },
    studentCount: {
      total: 300000,
      undergraduate: 200000,
      postgraduate: 80000,
      doctoral: 20000
    },
    isActive: true
  },
  {
    name: 'University of Madras',
    shortName: 'UNOM',
    type: 'state',
    established: 1857,
    location: {
      address: 'Chepauk, Chennai, Tamil Nadu 600005, India',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600005',
      country: 'India',
      coordinates: {
        latitude: 13.0827,
        longitude: 80.2707
      }
    },
    contact: {
      phone: '9876543214',
      email: 'info@unom.ac.in',
      website: 'https://www.unom.ac.in'
    },
    description: 'University of Madras is one of the oldest universities in India.',
    ranking: {
      nirf: 35,
      qs: 801
    },
    studentCount: {
      total: 200000,
      undergraduate: 120000,
      postgraduate: 60000,
      doctoral: 20000
    },
    isActive: true
  }
];

// Sample Colleges Data (will be created after universities)
const collegesData = [
  // BHU Colleges
  {
    name: 'Institute of Science',
    shortName: 'IOS',
    type: 'constituent',
    established: 1916,
    location: {
      address: 'BHU Campus, Varanasi, UP 221005',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      coordinates: { latitude: 25.2701, longitude: 82.9905 }
    }
  },
  {
    name: 'Faculty of Arts',
    shortName: 'FA',
    type: 'constituent',
    established: 1916,
    location: {
      address: 'BHU Campus, Varanasi, UP 221005',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      coordinates: { latitude: 25.2685, longitude: 82.9920 }
    }
  },
  {
    name: 'Institute of Management Studies',
    shortName: 'IMS',
    type: 'constituent',
    established: 1970,
    location: {
      address: 'BHU Campus, Varanasi, UP 221005',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      coordinates: { latitude: 25.2695, longitude: 82.9900 }
    }
  },
  // DU Colleges
  {
    name: 'Faculty of Science',
    shortName: 'FS',
    type: 'constituent',
    established: 1922,
    location: {
      address: 'North Campus, Delhi 110007',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110007',
      coordinates: { latitude: 28.6906, longitude: 77.2006 }
    }
  },
  {
    name: 'Faculty of Arts',
    shortName: 'FA',
    type: 'constituent',
    established: 1922,
    location: {
      address: 'North Campus, Delhi 110007',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110007',
      coordinates: { latitude: 28.6915, longitude: 77.2010 }
    }
  },
  {
    name: 'Faculty of Commerce',
    shortName: 'FC',
    type: 'constituent',
    established: 1922,
    location: {
      address: 'South Campus, Delhi 110021',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110021',
      coordinates: { latitude: 28.5245, longitude: 77.1855 }
    }
  },
  // IIT Bombay Colleges
  {
    name: 'School of Engineering',
    shortName: 'SOE',
    type: 'constituent',
    established: 1958,
    location: {
      address: 'IIT Bombay Campus, Powai, Mumbai 400076',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      coordinates: { latitude: 19.1334, longitude: 72.9133 }
    }
  },
  {
    name: 'School of Management',
    shortName: 'SOM',
    type: 'constituent',
    established: 1995,
    location: {
      address: 'IIT Bombay Campus, Powai, Mumbai 400076',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      coordinates: { latitude: 19.1340, longitude: 72.9140 }
    }
  }
];

// Sample Departments Data
const departmentsData = [
  // BHU - Institute of Science
  { name: 'Department of Physics', shortName: 'PHY', category: 'science' },
  { name: 'Department of Chemistry', shortName: 'CHE', category: 'science' },
  { name: 'Department of Mathematics', shortName: 'MAT', category: 'science' },
  { name: 'Department of Computer Science', shortName: 'CSE', category: 'engineering' },
  
  // BHU - Faculty of Arts
  { name: 'Department of English', shortName: 'ENG', category: 'arts' },
  { name: 'Department of Hindi', shortName: 'HIN', category: 'arts' },
  { name: 'Department of History', shortName: 'HIS', category: 'arts' },
  
  // BHU - IMS
  { name: 'Department of Management Studies', shortName: 'MGT', category: 'management' },
  
  // DU - Faculty of Science
  { name: 'Department of Physics', shortName: 'PHY', category: 'science' },
  { name: 'Department of Chemistry', shortName: 'CHE', category: 'science' },
  { name: 'Department of Botany', shortName: 'BOT', category: 'science' },
  
  // DU - Faculty of Arts
  { name: 'Department of English', shortName: 'ENG', category: 'arts' },
  { name: 'Department of Political Science', shortName: 'POL', category: 'arts' },
  
  // DU - Faculty of Commerce
  { name: 'Department of Commerce', shortName: 'COM', category: 'commerce' },
  
  // IIT Bombay - School of Engineering
  { name: 'Computer Science & Engineering', shortName: 'CSE', category: 'engineering' },
  { name: 'Electrical Engineering', shortName: 'EE', category: 'engineering' },
  { name: 'Mechanical Engineering', shortName: 'ME', category: 'engineering' },
  
  // IIT Bombay - School of Management
  { name: 'Department of Management Studies', shortName: 'DMS', category: 'management' }
];

// Sample Hostel Owners Data
const hostelOwnersData = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: 'owner123',
    phone: '9876543210',
    role: 'hostel_owner',
    ownerProfile: {
      businessName: 'Kumar Hostels',
      businessRegistration: 'BHU/HOST/001/2020',
      address: {
        street: '123 Lanka Road',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        pincode: '221005',
        country: 'India'
      },
      isApproved: true,
      approvalDate: new Date('2023-01-15'),
      totalHostels: 0
    },
    isVerified: true
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'owner123',
    phone: '9876543211',
    role: 'hostel_owner',
    ownerProfile: {
      businessName: 'Sharma Girls Hostel',
      businessRegistration: 'DU/HOST/002/2020',
      address: {
        street: '456 Kamla Nagar',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110007',
        country: 'India'
      },
      isApproved: true,
      approvalDate: new Date('2023-02-10'),
      totalHostels: 0
    },
    isVerified: true
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    password: 'owner123',
    phone: '9876543212',
    role: 'hostel_owner',
    ownerProfile: {
      businessName: 'Patel Student Accommodation',
      businessRegistration: 'IIT/HOST/003/2020',
      address: {
        street: '789 Powai Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400076',
        country: 'India'
      },
      isApproved: true,
      approvalDate: new Date('2023-03-05'),
      totalHostels: 0
    },
    isVerified: true
  },
  {
    name: 'Suresh Gupta',
    email: 'suresh.gupta@example.com',
    password: 'owner123',
    phone: '9876543213',
    role: 'hostel_owner',
    ownerProfile: {
      businessName: 'Gupta Boys Hostel',
      businessRegistration: 'CAL/HOST/004/2020',
      address: {
        street: '321 College Street',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700073',
        country: 'India'
      },
      isApproved: true,
      approvalDate: new Date('2023-04-12'),
      totalHostels: 0
    },
    isVerified: true
  },
  {
    name: 'Lakshmi Iyer',
    email: 'lakshmi.iyer@example.com',
    password: 'owner123',
    phone: '9876543214',
    role: 'hostel_owner',
    ownerProfile: {
      businessName: 'Iyer Student Home',
      businessRegistration: 'MAD/HOST/005/2020',
      address: {
        street: '654 Mylapore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600005',
        country: 'India'
      },
      isApproved: true,
      approvalDate: new Date('2023-05-08'),
      totalHostels: 0
    },
    isVerified: true
  }
];

// Sample Hostels Data
const hostelsData = [
  // Varanasi (BHU) Hostels
  {
    name: 'Kumar Boys Hostel',
    type: 'boys',
    description: 'A comfortable and safe boys hostel near BHU with all modern amenities. Located in the heart of Lanka, providing easy access to the university.',
    location: {
      address: '123 Lanka Road, Near BHU Main Gate, Varanasi, UP 221005',
      landmark: 'Near BHU Main Gate',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      coordinates: { latitude: 25.2650, longitude: 82.9890 }
    },
    contact: {
      phone: '9876543210',
      email: 'kumar.hostel@example.com',
      whatsapp: '9876543210'
    },
    roomTypes: [
      { type: 'single', totalRooms: 10, availableRooms: 3, bedsPerRoom: 1, pricePerBed: 8000, pricePerRoom: 8000, securityDeposit: 5000, amenities: ['ac', 'attached_bathroom', 'study_table', 'wardrobe'] },
      { type: 'double', totalRooms: 20, availableRooms: 8, bedsPerRoom: 2, pricePerBed: 6000, pricePerRoom: 12000, securityDeposit: 4000, amenities: ['non_ac', 'shared_bathroom', 'study_table', 'wardrobe'] }
    ],
    facilities: ['wifi', 'mess', 'laundry', 'security', 'power_backup', 'water_cooler'],
    mess: {
      available: true,
      type: 'both',
      pricePerMonth: 2500,
      timings: { breakfast: '7:00-9:00', lunch: '12:00-2:00', dinner: '7:00-9:00' }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80',
        caption: 'Premium single room with natural light and study setup',
        category: 'room',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        caption: 'Collaborative lounge for group study',
        category: 'common_area'
      },
      {
        url: 'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=1200&q=80',
        caption: 'Nutritious meals served in the dining hall',
        category: 'mess'
      }
    ],
    status: 'approved'
  },
  {
    name: 'Ganga Girls Hostel',
    type: 'girls',
    description: 'Premium girls hostel with 24/7 security and excellent facilities. Located in a peaceful area near BHU.',
    location: {
      address: '456 Assi Ghat Road, Varanasi, UP 221005',
      landmark: 'Near Assi Ghat',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      coordinates: { latitude: 25.2580, longitude: 82.9850 }
    },
    contact: {
      phone: '9876543215',
      email: 'ganga.hostel@example.com'
    },
    roomTypes: [
      { type: 'single', totalRooms: 8, availableRooms: 2, bedsPerRoom: 1, pricePerBed: 9000, pricePerRoom: 9000, securityDeposit: 6000, amenities: ['ac', 'attached_bathroom', 'study_table', 'wardrobe'] },
      { type: 'triple', totalRooms: 15, availableRooms: 5, bedsPerRoom: 3, pricePerBed: 4500, pricePerRoom: 13500, securityDeposit: 3000, amenities: ['non_ac', 'shared_bathroom', 'study_table'] }
    ],
    facilities: ['wifi', 'mess', 'laundry', 'security', 'power_backup', 'gym', 'medical'],
    mess: { available: true, type: 'veg', pricePerMonth: 2200 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sunlit twin sharing room designed for focus',
        category: 'room',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1551298370-9d8a5c1bb6d3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Secure entrance with biometric access',
        category: 'exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cozy lounge space for weekend downtime',
        category: 'common_area'
      }
    ],
    status: 'approved'
  },
  
  // Delhi (DU) Hostels
  {
    name: 'Sharma Girls PG',
    type: 'girls',
    description: 'Modern girls accommodation near Delhi University North Campus with excellent connectivity.',
    location: {
      address: '789 Kamla Nagar, Delhi 110007',
      landmark: 'Near Kamla Nagar Metro Station',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110007',
      coordinates: { latitude: 28.6800, longitude: 77.2100 }
    },
    contact: {
      phone: '9876543211',
      email: 'sharma.pg@example.com'
    },
    roomTypes: [
      { type: 'double', totalRooms: 25, availableRooms: 12, bedsPerRoom: 2, pricePerBed: 12000, pricePerRoom: 24000, securityDeposit: 8000, amenities: ['ac', 'attached_bathroom', 'study_table', 'wardrobe'] },
      { type: 'triple', totalRooms: 20, availableRooms: 7, bedsPerRoom: 3, pricePerBed: 10000, pricePerRoom: 30000, securityDeposit: 6000, amenities: ['ac', 'shared_bathroom', 'study_table'] }
    ],
    facilities: ['wifi', 'mess', 'laundry', 'security', 'power_backup', 'parking', 'gym'],
    mess: { available: true, type: 'both', pricePerMonth: 4000 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1652878645809-2189bec20d0d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Premium air-conditioned dormitory',
        category: 'room',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
        caption: 'Collaborative work pods and reading corners',
        category: 'common_area'
      },
      {
        url: 'https://images.unsplash.com/photo-1512914890250-353c97aa1133?auto=format&fit=crop&w=1200&q=80',
        caption: 'On-site fitness studio for residents',
        category: 'facilities'
      }
    ],
    status: 'approved'
  },
  {
    name: 'Delhi University Boys Hostel',
    type: 'boys',
    description: 'Affordable boys hostel near DU with basic amenities and good food.',
    location: {
      address: '321 Mukherjee Nagar, Delhi 110009',
      landmark: 'Near Mukherjee Nagar Metro',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110009',
      coordinates: { latitude: 28.7041, longitude: 77.2025 }
    },
    contact: {
      phone: '9876543216',
      email: 'du.boys@example.com'
    },
    roomTypes: [
      { type: 'triple', totalRooms: 30, availableRooms: 15, bedsPerRoom: 3, pricePerBed: 7000, pricePerRoom: 21000, securityDeposit: 5000, amenities: ['non_ac', 'shared_bathroom', 'study_table'] }
    ],
    facilities: ['wifi', 'mess', 'laundry', 'security', 'power_backup'],
    mess: { available: true, type: 'both', pricePerMonth: 3000 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fresh meals prepared in hygienic kitchen',
        category: 'mess',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        caption: 'Comfortable triple occupancy rooms',
        category: 'room'
      },
      {
        url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
        caption: 'Student lounge with reading nook',
        category: 'common_area'
      }
    ],
    status: 'approved'
  },
  
  // Mumbai (IIT Bombay) Hostels
  {
    name: 'Patel Student Residence',
    type: 'coed',
    description: 'Premium co-ed student accommodation near IIT Bombay with state-of-the-art facilities.',
    location: {
      address: '567 Powai Vihar, Mumbai 400076',
      landmark: 'Near IIT Bombay Main Gate',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      coordinates: { latitude: 19.1200, longitude: 72.9050 }
    },
    contact: {
      phone: '9876543212',
      email: 'patel.residence@example.com'
    },
    roomTypes: [
      { type: 'single', totalRooms: 15, availableRooms: 5, bedsPerRoom: 1, pricePerBed: 15000, pricePerRoom: 15000, securityDeposit: 10000, amenities: ['ac', 'attached_bathroom', 'study_table', 'wardrobe', 'balcony'] },
      { type: 'double', totalRooms: 18, availableRooms: 9, bedsPerRoom: 2, pricePerBed: 12000, pricePerRoom: 24000, securityDeposit: 8000, amenities: ['ac', 'attached_bathroom', 'study_table', 'wardrobe'] }
    ],
    facilities: ['wifi', 'mess', 'laundry', 'gym', 'parking', 'security', 'power_backup', 'common_room', 'library'],
    mess: { available: true, type: 'both', pricePerMonth: 5000 },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        caption: 'Designer single occupancy suite',
        category: 'room',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Serene outdoor courtyard for gatherings',
        category: 'exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1512914890250-353c97aa1133?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fully equipped fitness studio',
        category: 'facilities'
      }
    ],
    status: 'approved'
  }
];

const hashUserPasswords = async (users) => {
  return Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 12)
    }))
  );
};

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      University.deleteMany({}),
      College.deleteMany({}),
      Department.deleteMany({}),
      Hostel.deleteMany({})
    ]);
    
    console.log('Cleared existing data');
    
    // Create universities
    console.log('Creating universities...');
    const createdUniversities = await University.insertMany(universitiesData);
    console.log(`Created ${createdUniversities.length} universities`);
    
    // Create colleges
    console.log('Creating colleges...');
    const collegesWithUniversityIds = collegesData.map((college, index) => {
      const universityIndex = Math.floor(index / 3); // 3 colleges per university
      return {
        ...college,
        university: createdUniversities[universityIndex]._id
      };
    });
    
    const createdColleges = await College.insertMany(collegesWithUniversityIds);
    console.log(`Created ${createdColleges.length} colleges`);
    
    // Create departments
    console.log('Creating departments...');
    const departmentsWithIds = departmentsData.map((dept, index) => {
      // Ensure we don't reference undefined colleges
      const college = createdColleges[index % createdColleges.length];
      return {
        ...dept,
        college: college._id,
        university: college.university,
        location: {
          coordinates: {
            latitude: college.location.coordinates.latitude + (Math.random() - 0.5) * 0.01,
            longitude: college.location.coordinates.longitude + (Math.random() - 0.5) * 0.01
          }
        }
      };
    });
    
    const createdDepartments = await Department.insertMany(departmentsWithIds);
    console.log(`Created ${createdDepartments.length} departments`);
    
    // Create hostel owners
  console.log('Creating hostel owners...');
  const ownersWithHashedPasswords = await hashUserPasswords(hostelOwnersData);
  const createdOwners = await User.insertMany(ownersWithHashedPasswords);
    console.log(`Created ${createdOwners.length} hostel owners`);
    
    // Create hostels
    console.log('Creating hostels...');
    const hostelsWithOwnerIds = hostelsData.map((hostel, index) => ({
      ...hostel,
      owner: createdOwners[index % createdOwners.length]._id
    }));
    
    const createdHostels = await Hostel.insertMany(hostelsWithOwnerIds);
    console.log(`Created ${createdHostels.length} hostels`);
    
    // Create admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      name: 'System Administrator',
      email: 'iamsatyampandey@gmail.com',
      password: 'admin@12345',
      role: 'admin',
      isVerified: true
    });
    await adminUser.save();
    console.log('Created admin user');
    
    // Create sample student users
    console.log('Creating sample students...');
    const sampleStudents = [
      {
        name: 'Rahul Singh',
        email: 'rahul.singh@student.com',
        password: 'student123',
        phone: '9876543220',
        role: 'student',
        studentProfile: {
          university: createdUniversities[0]._id, // BHU
          college: createdColleges[0]._id,
          department: createdDepartments[0]._id,
          course: 'B.Sc Physics',
          year: 2,
          studentId: 'BHU2023001',
          preferences: {
            budgetRange: { min: 5000, max: 10000 },
            roomType: 'double',
            facilities: ['wifi', 'mess', 'laundry'],
            hostelType: 'boys',
            maxDistance: 5
          }
        },
        isVerified: true
      },
      {
        name: 'Priya Verma',
        email: 'priya.verma@student.com',
        password: 'student123',
        phone: '9876543221',
        role: 'student',
        studentProfile: {
          university: createdUniversities[1]._id, // DU
          college: createdColleges[3]._id,
          department: createdDepartments[8]._id,
          course: 'B.A English',
          year: 3,
          studentId: 'DU2022002',
          preferences: {
            budgetRange: { min: 8000, max: 15000 },
            roomType: 'single',
            facilities: ['wifi', 'mess', 'security', 'gym'],
            hostelType: 'girls',
            maxDistance: 10
          }
        },
        isVerified: true
      }
    ];
    
  const studentsWithHashedPasswords = await hashUserPasswords(sampleStudents);
  const createdStudents = await User.insertMany(studentsWithHashedPasswords);
    console.log(`Created ${createdStudents.length} sample students`);
    
    console.log('Database seeding completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: iamsatyampandey@gmail.com / admin@12345');
    console.log('Hostel Owners: rajesh.kumar@example.com / owner123 (and 4 others)');
    console.log('Students: rahul.singh@student.com / student123 (and 1 other)');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;