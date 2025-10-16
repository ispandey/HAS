# 🏠 HABS - Hostel Allotment and Booking System

> **AI-powered Hostel Allotment and Booking System** connecting students with quality accommodation near their universities across India.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### ✨ **Core Features**
- 🔐 **Role-based Authentication** - Students, Hostel Owners, and Admins
- 🤖 **AI-powered Recommendations** - Smart hostel matching based on preferences
- 📍 **MapMyIndia Integration** - Accurate location services and route planning
- ⚡ **Real-time Notifications** - Instant booking updates via Socket.io
- 🔒 **Blockchain Transparency** - Secure and transparent booking records
- 📱 **Responsive Design** - Material-UI powered interface for all devices

### 👥 **User Roles**
- **Students**: Search, book, and manage hostel accommodations
- **Hostel Owners**: List properties, manage bookings, track revenue
- **Admins**: Platform oversight, user management, analytics dashboard

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js 18, Material-UI v5, Socket.io-client |
| **Backend** | Node.js, Express.js, Socket.io, JWT Authentication |
| **Database** | MongoDB with Mongoose ODM |
| **Maps** | MapMyIndia API for location services |
| **Real-time** | Socket.io for live updates |
| **Blockchain** | Ethereum integration (development ready) |

## 📋 Project Status

### ✅ **Completed Components**

#### **Backend API (100% Complete)**
- [x] ✅ **Authentication System** - JWT-based with role management
- [x] ✅ **User Management** - Registration, login, profile management
- [x] ✅ **Hostel Operations** - CRUD operations, search, filtering
- [x] ✅ **Booking System** - Complete booking workflow with status tracking
- [x] ✅ **Admin Panel** - User management, hostel oversight, analytics
- [x] ✅ **MapMyIndia Integration** - Geocoding, routing, distance calculations
- [x] ✅ **Real-time Features** - Socket.io for live notifications
- [x] ✅ **Database Models** - Complete schema design with relationships
- [x] ✅ **Sample Data** - Comprehensive seed data for testing

#### **Frontend Application (85% Complete)**
- [x] ✅ **Authentication Pages** - Login/Register with multi-step forms
- [x] ✅ **Homepage** - Feature showcase and hero sections
- [x] ✅ **Dashboard Components** - Role-based dashboards for all user types
- [x] ✅ **Layout Components** - Navbar, Footer with responsive design
- [x] ✅ **Context Providers** - Auth and Socket contexts for state management
- [x] ✅ **Material-UI Integration** - Complete component library setup
- [x] ✅ **Development Servers** - React dev server running at http://localhost:3000 with backend API on http://localhost:5001

#### **Development Environment**
- [x] ✅ **Dependencies Installed** - Both backend and frontend packages
- [x] ✅ **Environment Configuration** - .env setup for development
- [x] ✅ **Task Configuration** - Development server setup

### 🔄 **In Progress**
- [ ] 🔄 **Resolve Mongoose Index Warnings** - Deduplicate schema indexes flagged during startup
- [ ] 🔄 **AI & ML Recommendation Engine** - Build personalized search, demand forecasting, and NLP-driven discovery
- [ ] 🔄 **Advanced Booking & Search UI** - Polish map overlays, booking flows, and filter experiences for students and owners

### ⏳ **Remaining Tasks**
- [ ] ⏳ **Additional React Components** - Search, booking flow, profile pages
- [ ] ⏳ **MapMyIndia Frontend Integration** - Interactive maps and route display
- [ ] ⏳ **Testing Suite** - Unit and integration tests
- [ ] ⏳ **Deployment Configuration** - Production build and deployment scripts

## � Proposal Highlights

Insights distilled from the *Project Proposal for Hostel/PG Booking System with Data Science, AI, and ML Integration* guide the product direction:

- **Executive Summary** – Addresses the accommodation gap faced by ~4M students relocating annually by delivering a unified discovery and booking experience.
- **Problem Statement** – Current location-first listings lack college proximity, availability, and facility transparency, forcing students into suboptimal choices.
- **Project Objectives** – Comprehensive college-centric listings, distance indicators, live availability, direct online bookings, rich user accounts, a three-portal model (Admin, Renter, User), and deep AI/ML integration.
- **Scope & Portals** – Dedicated experiences for students, hostel/PG owners, and admins covering search, listings, booking workflows, approvals, analytics, and property management.
- **System Architecture** – React-based responsive frontend, Node/Express APIs, MongoDB persistence, secured REST communication, and modular service layers.
- **AI & ML Roadmap** – Collaborative/content filtering recommendations, predictive demand analytics, NLP-powered search, and computer-vision-driven image insights.
- **Implementation Plan** – Phased build across backend scaffolding, portal UIs, API wiring, booking + payments, AI/ML modules, followed by thorough testing and deployment.
- **Security & Compliance** – Emphasizes JWT/OAuth authentication, encrypted data at rest and in transit, secure payment gateways, and routine vulnerability audits.
- **Future Enhancements** – Mobile apps, richer filters, ratings and reviews, and real-time chat support to elevate engagement.
- **Expected Outcomes** – Streamlined student onboarding, empowered property owners, clearer revenue channels, and improved satisfaction across the accommodation ecosystem.

## �🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- MapMyIndia API credentials (optional for full functionality)

### **Installation & Setup**

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd HAS
   npm install --legacy-peer-deps
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure .env file (template provided)
   cp .env.example .env
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend  
   npm install --legacy-peer-deps
   ```

4. **Start Development** (🚀 **Super Easy - Recommended**)
   
   **Option A: Interactive Control Panel** ⭐ **NEW!**
   ```bash
   ./habs.sh
   ```
   Beautiful menu-driven interface with options for:
   - 🚀 Start/Stop/Restart servers
   - 📊 Check server status
   - 📋 View logs in real-time
   - 🌐 Open browser
   - 📚 Access documentation
   
   **Option B: One-Command Startup**
   ```bash
   ./start-all.sh
   ```
   **What it does:**
   - ✅ Automatically kills any processes on ports 5001, 3000, 3001
   - ✅ Starts backend server (MongoDB + Express API)
   - ✅ Starts frontend server (React development server)
   - ✅ Opens browser automatically
   - ✅ Displays demo login credentials
   - ✅ Saves logs to `logs/` directory
   
   **To stop all servers:**
   ```bash
   ./stop-all.sh
   ```
   
   **Check server status:**
   ```bash
   ./status.sh
   ```
   
   **Alternative (Manual):**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run start:clean  # Auto-cleanup on port 5001
   
   # Terminal 2: Frontend
   cd frontend && npm run start:clean  # Auto-cleanup on port 3000
   ```
   
   📖 See [Documentation/](./Documentation/) for detailed guides.

### **Demo Accounts**
Try the system with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | iamsatyampandey@gmail.com | admin@12345 |
| **Student** | student@demo.com | demo123 |
| **Hostel Owner** | owner@demo.com | demo123 |

### **Sample Data**
Populate the database with comprehensive test data:
```bash
cd backend
node scripts/seedData.js
```
*Includes: 5 universities, 30+ hostels, 5 hostel owners, realistic location data*

## 📁 Project Structure

```
HABS/
├── 📁 backend/                 # Node.js API Server
│   ├── 📁 controllers/         # Route controllers
│   ├── 📁 middleware/          # Authentication & validation
│   ├── 📁 models/              # MongoDB schemas
│   ├── 📁 routes/              # API routes
│   ├── 📁 services/            # External API integrations
│   ├── 📁 scripts/             # Database utilities
│   └── 📄 server.js            # Main server file
├── 📁 frontend/                # React.js Application  
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable components
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 contexts/        # React contexts
│   │   ├── 📁 services/        # API services
│   │   └── 📁 utils/           # Helper functions
│   └── 📁 public/              # Static assets
├── 📁 .github/                 # GitHub configuration
└── 📄 README.md                # Project documentation
```

## 🌐 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### **Hostel Management**
- `GET /api/hostels` - List hostels with filters
- `POST /api/hostels` - Create new hostel (owners only)
- `GET /api/hostels/:id` - Get hostel details
- `PUT /api/hostels/:id` - Update hostel (owners only)

### **Booking System**
- `POST /api/bookings` - Create booking request
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### **Admin Operations**
- `GET /api/admin/users` - Manage all users
- `GET /api/admin/hostels` - Oversee all hostels
- `GET /api/admin/analytics` - Platform statistics

## 🔧 Configuration

### **Environment Variables**
Create `backend/.env` with:
```env
MONGODB_URI=mongodb://localhost:27017/habs
JWT_SECRET=your-jwt-secret
PORT=5000
MAPMYINDIA_CLIENT_ID=your-api-key
MAPMYINDIA_CLIENT_SECRET=your-secret
```

### **Database Setup**
- **Local MongoDB**: Install and run MongoDB locally
- **MongoDB Atlas**: Create cluster and update connection string
- **Seed Data**: Run seeder script for test data

## 🚀 Deployment

### **Production Build**
```bash
npm run build          # Build frontend
npm start             # Start production server
```

### **Deployment Platforms**
- **Frontend**: Vercel, Netlify, AWS S3
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas (recommended)

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test

# E2E tests
npm run test:e2e
```

## ✅ Next Steps

1. **Eliminate Duplicate Index Warnings** – Audit `backend/models/User.js` (and related schemas) to consolidate index declarations and silence Mongoose startup warnings.
2. **Deliver AI/ML Features** – Implement collaborative/content filtering pipelines, demand forecasting, and NLP search as specified in the proposal roadmap.
3. **Enhance Discovery UX** – Ship advanced filters, map-based browsing with MapMyIndia overlays, and richer booking flows for students and owners.
4. **Integrate Secure Payments** – Wire the booking flow to a PCI-compliant gateway (e.g., Stripe/PayPal) with encrypted transaction logging.
5. **Launch Feedback Channels** – Add ratings, reviews, and real-time chat support to close the feedback loop and improve service quality.
6. **Harden Quality Gates** – Expand automated tests, lint rules, and CI/CD pipelines to support production readiness and future mobile app expansion.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## � Documentation

Comprehensive documentation is available in the [`Documentation/`](./Documentation/) folder:

| Document | Description |
|----------|-------------|
| **[COMPLETE.md](./Documentation/COMPLETE.md)** | 🎉 Complete automation guide - START HERE! |
| **[STARTUP_GUIDE.md](./Documentation/STARTUP_GUIDE.md)** | Detailed startup instructions and troubleshooting |
| **[QUICK_REFERENCE.md](./Documentation/QUICK_REFERENCE.md)** | Quick command reference for daily use |
| **[AUTOMATION_SUMMARY.md](./Documentation/AUTOMATION_SUMMARY.md)** | Technical details about automation scripts |
| **[TESTING_GUIDE.md](./Documentation/TESTING_GUIDE.md)** | Dashboard testing instructions |

**Quick access**: Run `./habs.sh` and select option 9 to view documentation directly in terminal.

## �📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MapMyIndia** for location services
- **Material-UI** for component library
- **React** and **Node.js** communities
- **MongoDB** for database solutions

---

### 📞 Support

For support, email [iamsatyampandey@gmail.com](mailto:iamsatyampandey@gmail.com) or create an issue in the repository.

**Built with ❤️ for students across India**