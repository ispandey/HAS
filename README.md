# HABS - Hostel Allotment and Booking System

An AI-powered Hostel Allotment and Booking System that helps students find and book hostel accommodation near their chosen universities, colleges, or departments in India. The system incorporates AI for personalization, MapMyIndia integration for location services, and blockchain features for transparency.

## 🚀 Features

### For Students
- **Smart Search & Filtering**: Find hostels based on location, price, facilities, and preferences
- **AI-Powered Recommendations**: Get personalized hostel suggestions based on your profile and preferences
- **University Integration**: Search hostels near specific universities, colleges, and departments
- **Real-time Booking**: Submit booking requests and track status in real-time
- **Interactive Maps**: View hostel locations and get directions using MapMyIndia
- **Reviews & Ratings**: Read and submit reviews for hostels

### For Hostel Owners
- **Hostel Management**: Add, edit, and manage hostel listings
- **Booking Management**: Approve/reject booking requests and manage check-ins/check-outs
- **Real-time Notifications**: Get instant notifications for new booking requests
- **Analytics Dashboard**: Track performance and occupancy rates
- **Document Verification**: Upload and manage verification documents

### For Administrators
- **Hostel Verification**: Review and approve/reject hostel listings
- **User Management**: Manage student and hostel owner accounts
- **Analytics & Reports**: Comprehensive dashboard with statistics and insights
- **Content Management**: Manage university and department data
- **System Monitoring**: Track system performance and user activities

### Technical Features
- **MapMyIndia Integration**: Precise location services and navigation
- **Blockchain Integration**: Transparent booking records and verification
- **Real-time Updates**: Socket.io for instant notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Advanced Security**: JWT authentication and role-based access control

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API with comprehensive endpoints
- MongoDB database with optimized schemas
- Real-time communication with Socket.io
- MapMyIndia API integration
- Blockchain integration for transparency
- JWT-based authentication and authorization

### Frontend (React)
- Modern React application with functional components
- Material-UI for consistent design
- Context API for state management
- React Router for navigation
- Socket.io client for real-time updates
- Responsive design with mobile-first approach

### Database (MongoDB)
- User management with role-based access
- University, college, and department hierarchies
- Hostel listings with detailed information
- Booking system with status tracking
- Review and rating system

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (v16.0.0 or higher)
- MongoDB (v4.4 or higher)
- MapMyIndia API credentials
- Git for version control

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HAS
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install blockchain dependencies (optional)
cd ../blockchain
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/habs

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Client URL
CLIENT_URL=http://localhost:3000

# MapMyIndia API Keys
MAPMYINDIA_API_KEY=your_mapmyindia_api_key_here
MAPMYINDIA_CLIENT_ID=your_mapmyindia_client_id_here
MAPMYINDIA_CLIENT_SECRET=your_mapmyindia_client_secret_here

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password

# Blockchain Configuration (optional)
BLOCKCHAIN_NETWORK_URL=http://localhost:8545
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_deployed_contract_address_here
```

#### Frontend Environment
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAPMYINDIA_API_KEY=your_mapmyindia_api_key_here
```

### 4. Database Setup

Start MongoDB and seed the database with sample data:
```bash
# Make sure MongoDB is running
mongod

# Seed the database (from backend directory)
cd backend
npm run seed
```

### 5. Start the Application

#### Development Mode (All Services)
```bash
# From root directory
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000
- Blockchain development network (optional)

#### Individual Services
```bash
# Backend only
npm run backend

# Frontend only
npm run frontend

# Blockchain only (optional)
npm run blockchain
```

## 👥 User Accounts & Login Credentials

After seeding the database, you can use these test accounts:

### Admin Account
- **Email**: iamsatyampandey@gmail.com
- **Password**: admin@12345

### Hostel Owner Accounts
- **Email**: rajesh.kumar@example.com | **Password**: owner123
- **Email**: priya.sharma@example.com | **Password**: owner123
- **Email**: amit.patel@example.com | **Password**: owner123
- **Email**: suresh.gupta@example.com | **Password**: owner123
- **Email**: lakshmi.iyer@example.com | **Password**: owner123

### Student Accounts
- **Email**: rahul.singh@student.com | **Password**: student123
- **Email**: priya.verma@student.com | **Password**: student123

## 🏫 Sample Data

The system includes comprehensive sample data:

### Universities (5 major Indian universities)
1. **Banaras Hindu University (BHU)** - Varanasi, UP
2. **University of Delhi (DU)** - New Delhi, Delhi
3. **IIT Bombay** - Mumbai, Maharashtra
4. **University of Calcutta** - Kolkata, West Bengal
5. **University of Madras** - Chennai, Tamil Nadu

### Colleges & Departments
- Each university has 2-3 colleges
- Each college has 2-4 departments
- Departments span various categories (Science, Arts, Engineering, etc.)

### Hostels (30+ sample hostels)
- Mix of Boys, Girls, and Co-ed hostels
- Varying facilities and amenities
- Different room types and pricing
- Located near sample universities with calculated distances

## 🗺️ MapMyIndia Integration

The system integrates with MapMyIndia for:
- **Geocoding**: Convert addresses to coordinates
- **Reverse Geocoding**: Get addresses from coordinates
- **Distance Calculation**: Calculate travel distances and times
- **Route Planning**: Get directions between locations
- **Nearby Search**: Find places near hostels or universities
- **Interactive Maps**: Display hostels and universities on maps

### Getting MapMyIndia API Keys
1. Sign up at [MapMyIndia API Console](https://apis.mapmyindia.com/)
2. Create a new project
3. Get your API key, Client ID, and Client Secret
4. Add them to your environment configuration

## 🔗 Blockchain Integration

The system includes blockchain features for transparency:
- **Booking Records**: Store booking transactions on blockchain
- **Verification**: Verify booking authenticity
- **Transparency**: Immutable record of all transactions

*Note: Blockchain features are currently implemented as placeholders and can be extended with actual smart contracts.*

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Hostel Endpoints
- `GET /api/hostels` - Get hostels with filtering
- `GET /api/hostels/:id` - Get hostel details
- `POST /api/hostels` - Create hostel (owner only)
- `PUT /api/hostels/:id` - Update hostel (owner only)

### Booking Endpoints
- `POST /api/bookings` - Create booking request
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id/respond` - Respond to booking (owner)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### University Endpoints
- `GET /api/universities` - Get universities
- `GET /api/universities/:id/colleges` - Get colleges
- `GET /api/universities/:universityId/colleges/:collegeId/departments` - Get departments

### Map Endpoints
- `POST /api/map/geocode` - Geocode address
- `POST /api/map/distance` - Calculate distance
- `POST /api/map/route` - Get route directions

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or other cloud MongoDB service
2. Configure production environment variables
3. Deploy to platforms like Heroku, AWS, or DigitalOcean
4. Set up SSL certificates for HTTPS

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Configure environment variables for production

### Environment Variables for Production
- Update API URLs to production endpoints
- Use strong JWT secrets
- Configure proper CORS settings
- Set up production database connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: iamsatyampandey@gmail.com

## 🙏 Acknowledgments

- MapMyIndia for location services
- Material-UI for the design system
- MongoDB for the database solution
- Socket.io for real-time communication
- React and Node.js communities for excellent documentation

---

**HABS** - Making hostel booking simple, transparent, and efficient for students across India! 🏠🎓