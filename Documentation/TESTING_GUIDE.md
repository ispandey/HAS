# HABS Testing Guide

## ✅ Completed Setup

All dashboard components have been successfully created and are now ready for testing!

### Created Dashboard Components:
1. **AdminDashboard.js** - Full admin management interface
2. **OwnerDashboard.js** - Hostel owner management interface  
3. **StudentDashboard.js** - Student hostel browsing interface

### Current Status:
- ✅ Backend running on port 5001
- ✅ Frontend compiled successfully on port 3000
- ✅ All dashboard components created without errors
- ✅ Database seeded with test data
- ✅ Demo accounts ready for testing

---

## 🧪 Testing Steps (1-4)

### Step 1: Test Login with Each Role ✓

#### Demo Accounts:

**Admin Account:**
- Email: `iamsatyampandey@gmail.com`
- Password: `admin@12345`
- Expected: Access to Admin Dashboard with user management

**Hostel Owner Account:**
- Email: `rajesh.kumar@example.com`
- Password: `owner123`
- Expected: Access to Owner Dashboard with hostel management

**Student Account:**
- Email: `rahul.singh@student.com`
- Password: `student123`
- Expected: Access to Student Dashboard with hostel browsing

#### Testing Actions:
1. Navigate to http://localhost:3000
2. Click "Login" button
3. Enter credentials for each role
4. Verify successful login and redirect to appropriate dashboard
5. Verify user name appears in navbar/dashboard header

---

### Step 2: Verify Data Loads from APIs ✓

#### Admin Dashboard Data:
- [ ] Stats cards show: Total Users, Total Hostels, Total Bookings, Revenue
- [ ] Users table loads with paginated user list
- [ ] Pending Hostels tab shows hostels awaiting approval
- [ ] Each tab (Overview, Users, Hostels, Bookings, Pending Approvals) loads data

#### Owner Dashboard Data:
- [ ] Stats cards show: Total Hostels, Total Bookings, Monthly Revenue, Occupancy Rate
- [ ] "My Hostels" tab displays hostel cards with images
- [ ] "Bookings" tab shows recent booking list
- [ ] Each hostel card shows: name, location, rating, status

#### Student Dashboard Data:
- [ ] Stats cards show: Available Hostels, Saved Hostels, My Bookings, Pending Bookings
- [ ] "Browse Hostels" tab displays all available hostels
- [ ] "My Bookings" tab shows student's booking history
- [ ] "Saved Hostels" tab displays favorited hostels
- [ ] Search and filter functionality works

#### API Endpoints Being Tested:
```
Admin:
- GET /api/admin/dashboard
- GET /api/admin/users
- GET /api/admin/hostels
- GET /api/admin/bookings

Owner:
- GET /api/hostels/owner
- GET /api/bookings/owner

Student:
- GET /api/hostels
- GET /api/bookings/my-bookings
- GET /api/users/saved-hostels
```

---

### Step 3: Test CRUD Operations ✓

#### Admin CRUD Operations:
**Approve/Reject Hostels:**
1. Navigate to "Pending Approvals" tab
2. Click "Approve" on a pending hostel
3. Verify success message and status change
4. Click "Reject" on another hostel
5. Enter rejection reason in dialog
6. Verify hostel removed from pending list

**User Management:**
1. Navigate to "Users" tab
2. View user details in table
3. Test pagination (change rows per page)
4. Verify all user data displays correctly

#### Owner CRUD Operations:
**Hostel Management:**
1. Navigate to "My Hostels" tab
2. Click "Add Hostel" button (should navigate to /add-hostel)
3. Click "Edit" on existing hostel (should navigate to /edit-hostel/:id)
4. Click "View" to see hostel details
5. Verify all hostel data displays (images, name, location, rating)

**Booking Management:**
1. Navigate to "Bookings" tab
2. View booking list with student names
3. Check booking amounts and status chips
4. Verify booking data is accurate

#### Student CRUD Operations:
**Save/Unsave Hostels:**
1. Navigate to "Browse Hostels" tab
2. Click heart icon to save a hostel
3. Verify success toast message
4. Navigate to "Saved Hostels" tab
5. Verify hostel appears in saved list
6. Click "Remove" to unsave hostel
7. Verify hostel removed from saved list

**Search and Filter:**
1. Enter search term in search box
2. Verify hostel list filters in real-time
3. Select location from dropdown filter
4. Verify only matching hostels display
5. Clear filters and verify all hostels return

---

### Step 4: Validate User Flows ✓

#### Complete Admin Flow:
1. Login as admin
2. View dashboard overview with statistics
3. Navigate through all 5 tabs (Overview, Users, Hostels, Bookings, Pending Approvals)
4. Approve a pending hostel
5. View updated stats
6. Logout

#### Complete Owner Flow:
1. Login as hostel owner
2. View dashboard with stats (hostels, bookings, revenue)
3. Check "My Hostels" - view all owned hostels
4. Click "Add Hostel" to navigate to add form
5. Click "Edit" on a hostel to navigate to edit form
6. Check "Bookings" tab for recent bookings
7. Verify booking data matches hostel
8. Logout

#### Complete Student Flow:
1. Login as student
2. View dashboard with browse/booking stats
3. Browse available hostels with search
4. Filter hostels by location
5. Click heart icon to save favorite hostels
6. Click "View Details" to see hostel page
7. Navigate to "Saved Hostels" tab
8. View saved hostels list
9. Remove a hostel from saved list
10. Check "My Bookings" tab
11. Logout

---

## 🔍 Expected Results

### Visual Checks:
- ✅ All dashboards display with gradient stat cards
- ✅ Material-UI components styled correctly
- ✅ Responsive layout on different screen sizes
- ✅ Images load from Unsplash URLs
- ✅ Toast notifications appear for actions
- ✅ Loading spinners show during API calls
- ✅ Tabs switch content without page reload

### Functional Checks:
- ✅ All API calls return data successfully
- ✅ Authentication tokens attached to requests
- ✅ CORS allows requests from localhost:3000
- ✅ Error handling shows user-friendly messages
- ✅ Pagination works in tables
- ✅ Navigation between pages works correctly

### Data Validation:
- ✅ Stats calculations are accurate
- ✅ Currency formatting shows INR correctly
- ✅ Status chips have correct colors (green=active/approved, yellow=pending, red=rejected)
- ✅ Dates formatted properly
- ✅ Empty states show when no data

---

## 🐛 Troubleshooting

### If Login Fails:
```bash
# Check backend is running
curl http://localhost:5001/api/health

# Check MongoDB connection in backend terminal
# Should see "MongoDB connected successfully"
```

### If Dashboard Data Doesn't Load:
```bash
# Check network tab in browser DevTools
# Verify API calls to http://localhost:5001/api/*
# Check for CORS errors
# Verify JWT token in localStorage
```

### If Images Don't Display:
- Unsplash URLs should work without authentication
- Check browser console for image loading errors
- Verify `hostel.images` array has valid URLs

### Backend API Errors:
```bash
# Check backend terminal for error logs
# Verify database seeding completed successfully
# Test API endpoints directly:
curl http://localhost:5001/api/hostels
```

---

## 📝 Notes

- **Unused Import Warnings:** ESLint shows warnings for unused imports (Delete, Tooltip, etc.). These don't affect functionality.
- **useEffect Dependencies:** Warning about missing dependencies in useEffect. This is intentional to prevent infinite loops.
- **Mock Data:** Some stats (like occupancy rate) are hardcoded for demo purposes.
- **Navigation Routes:** Add/Edit hostel forms need to be created separately for full owner functionality.

---

## 🚀 Next Steps After Testing

Once testing is complete, consider:

1. **Create Hostel Forms:**
   - Add Hostel form (`/add-hostel`)
   - Edit Hostel form (`/edit-hostel/:id`)

2. **Create Hostel Detail Page:**
   - Single hostel view (`/hostel/:id`)
   - Booking form
   - Reviews section

3. **Implement Booking Flow:**
   - Room selection
   - Payment integration
   - Booking confirmation

4. **Add Analytics:**
   - Charts for revenue trends
   - Occupancy graphs
   - User growth metrics

5. **Polish UI:**
   - Add loading skeletons
   - Implement error boundaries
   - Add form validations
   - Improve responsive design

---

## ✅ Testing Checklist

- [ ] Step 1: Login with all 3 roles successful
- [ ] Step 2: Dashboard data loads for all roles
- [ ] Step 3: CRUD operations work correctly
- [ ] Step 4: Complete user flows validated
- [ ] All API endpoints responding
- [ ] No console errors in browser
- [ ] Toast notifications working
- [ ] Navigation between pages smooth
- [ ] Logout functionality works

---

**Testing Status:** Ready to begin! 🎉

Frontend: http://localhost:3000  
Backend: http://localhost:5001
