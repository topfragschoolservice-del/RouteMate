# RouteMate Frontend - Member 5 Documentation

## Overview

This is the complete frontend implementation for **RouteMate - School Transport Management System**. It provides a user-friendly interface for parents, drivers, and administrators to interact with the school transport system.

## 📁 Frontend Structure

```
/frontend
├── index.html        # Landing page with navigation to all modules
├── parent.html       # Parent dashboard for attendance & payments
├── driver.html       # Driver dashboard for bus management
├── tracking.html     # Real-time GPS tracking system
└── README.md        # This file
```

## 🌐 Pages Overview

### 1. **Index.html** - Main Landing Page
The home page that introduces RouteMate and provides navigation to all three main modules.

**Features:**
- Beautiful landing page with gradient design
- Quick access cards to Parent Portal, Driver Dashboard, and Live Tracking
- Feature highlights showcase
- Technology stack information
- Responsive design for all devices

**URL:** `http://localhost:3000/frontend/index.html`

---

### 2. **Parent.html** - Parent Dashboard
Complete interface for parents to manage their children's school transport.

**Features:**
- ✅ Parent Login (with email verification)
- 📋 View all children and their attendance status
- ✅ Mark attendance (Morning & Afternoon)
- 💳 Process payment simulation
- 💰 View payment history and status
- 🚌 View assigned buses and real-time locations
- 📊 Dashboard stats (children, paid/pending payments)

**Sample Login Credentials:**
```
Parent 1:
  ID: P001
  Name: Mr. Khan
  Email: parent1@routemate.com
  Children: Ali Khan (S001), Fatima Ahmed (S002)

Parent 2:
  ID: P002
  Name: Mrs. Ahmed
  Email: parent2@routemate.com
  Children: Hassan Ali (S003)
```

**Key Functions:**
```javascript
loginParent()                              // Authenticate parent
loadParentDashboard()                      // Load dashboard data
markAttendance(studentId, period, status)  // Mark attendance
makePayment()                              // Process payment
loadPaymentHistory()                       // Display payment records
```

**URL:** `http://localhost:3000/frontend/parent.html`

---

### 3. **Driver.html** - Driver Dashboard
Interface for drivers to manage their assigned buses and view student information.

**Features:**
- ✅ Driver Login (with email verification)
- 👥 View assigned students
- 📋 Check student attendance status
- 📍 Update bus location (latitude & longitude)
- 🚌 View bus details and student count
- 📊 Dashboard stats (students, present/absent)

**Sample Login Credentials:**
```
Driver 1:
  ID: D001
  Name: Akram Khan
  Email: akram@routemate.com
  Assigned Bus: B001
  Students: Ali Khan (S001), Fatima Ahmed (S002)

Driver 2:
  ID: D002
  Name: Bilal Ahmad
  Email: bilal@routemate.com
  Assigned Bus: B002
  Students: Hassan Ali (S003)
```

**Key Functions:**
```javascript
loginDriver()            // Authenticate driver
loadDriverDashboard()    // Load dashboard data
loadStudents(data)       // Display students on bus
updateLocation()         // Update bus GPS coordinates
updateStats()           // Calculate attendance stats
```

**URL:** `http://localhost:3000/frontend/driver.html`

---

### 4. **Tracking.html** - Live GPS Tracking System
Real-time tracking interface to monitor all school buses.

**Features:**
- 🗺️ Simulated map view with 10x10 GPS grid
- 🚌 View all active buses with their locations
- 📍 Manual location update for any bus
- 💾 Real-time location data from API
- 🎯 Hover to see bus details and tooltips
- 📱 Click on buses to select and update location
- 🔄 Refresh data to get latest locations

**Coordinates (Simulated):**
- Bus B001: Latitude 31.5204, Longitude 74.3587
- Bus B002: Latitude 31.5500, Longitude 74.3500

**Key Functions:**
```javascript
loadAllBuses()           // Fetch all buses from API
renderBuses()            // Display buses in list
renderMap()             // Render GPS map grid
createBusMarker()       // Place bus markers on map
selectBus()             // Select bus for updating
manualUpdate()          // Update location manually
```

**URL:** `http://localhost:3000/frontend/tracking.html`

---

## 🎨 Design & Styling

### Color Schemes
- **Parent Portal:** Purple gradient (#667eea → #764ba2)
- **Driver Dashboard:** Pink/Red gradient (#f093fb → #f5576c)
- **Tracking System:** Purple gradient (#667eea → #764ba2)
- **Landing Page:** Mixed gradients with consistency

### Responsive Design
- Mobile-first approach
- Breakpoints: 600px, 900px
- Grid layouts for cards and forms
- Touch-friendly buttons and inputs

### UI Components
- Alert messages (success, error, info)
- Status badges (present, absent, unmarked)
- Cards with shadows and hover effects
- Smooth animations and transitions
- Loading indicators

---

## 🔌 API Integration

All pages communicate with the backend API at `http://localhost:3000`.

### API Endpoints Used:

**Authentication:**
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/users` - Get all users

**Attendance:**
- `POST /attendance` - Mark attendance
- `GET /attendance/student/:studentId` - Get student attendance
- `GET /attendance/parent/:parentId` - Get parent's children attendance

**Payment:**
- `POST /payment` - Create payment
- `GET /payment/parent/:parentId` - Get parent's payments
- `GET /payment/:paymentId/receipt` - Generate receipt

**Bus Management:**
- `GET /bus` - Get all buses
- `GET /bus/:busId` - Get bus details
- `GET /bus/:busId/students` - Get bus students
- `POST /bus/:busId/location` - Update bus location
- `GET /bus/:busId/location` - Get bus location

**Dashboard:**
- `GET /dashboard/parent/:parentId` - Get parent dashboard
- `GET /dashboard/driver/:driverId` - Get driver dashboard

---

## 🚀 How to Run

### Prerequisites:
- Backend server running on `http://localhost:3000`
- CORS enabled on backend (already configured)
- Browser with ES6+ support

### Steps:
1. Open `index.html` in browser
   ```
   http://localhost:3000/frontend/index.html
   ```

2. Navigate to desired module (Parent, Driver, or Tracking)

3. Login with provided credentials

4. Use the features in the dashboard

---

## 📱 Browser Compatibility

- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔐 Security Features

- Form validation on client-side
- Email verification for login
- Session-based user management
- Alert notifications for errors
- Logout functionality

---

## 📝 Key Implementation Details

### Parent Dashboard
1. **Login System:** Select parent ID from dropdown and verify email
2. **Children Cards:** Display all children with individual sections
3. **Attendance Marking:** 4 buttons per child (Morning/Afternoon × Present/Absent)
4. **Payment Form:** Select child and amount, then submit
5. **Stats Box:** Shows children count, paid, and pending payments
6. **Bus Info:** Displays assigned bus details and location

### Driver Dashboard
1. **Login System:** Select driver ID and verify email
2. **Bus Status:** Shows bus ID and current GPS coordinates
3. **Location Update:** Form to enter new latitude/longitude
4. **Students List:** Display all students on the bus with attendance
5. **Stats Box:** Shows total students, present, and absent
6. **Real-time Updates:** Fetch latest data from API

### Tracking System
1. **Map Grid:** 10×10 simulated GPS map
2. **Bus Markers:** Animated markers showing bus positions
3. **Bus List:** Sidebar with all active buses
4. **Location Form:** Manual update controls
5. **Selection:** Click bus to pre-fill update form
6. **Refresh:** Button to reload all data

---

## 🎯 Testing Scenario

### Complete User Flow:

1. **Parent Login** (parent.html)
   - Select Parent: P001 (Mr. Khan)
   - Email: parent1@routemate.com
   - Click Login

2. **Mark Attendance**
   - Click "Present" for child morning attendance
   - Click "Absent" for another time period
   - See status update

3. **Make Payment**
   - Select child from dropdown
   - Enter amount (e.g., 5000)
   - Click "Pay Now"
   - View in payment history

4. **Driver Login** (driver.html)
   - Select Driver: D001 (Akram Khan)
   - Email: akram@routemate.com
   - Click Login

5. **Update Location**
   - Change latitude/longitude
   - Click "Update Location"
   - See last known location update

6. **View Tracking** (tracking.html)
   - See all buses on map
   - Click on bus to select
   - Update location manually
   - Click "Refresh All Data"

---

## 🛠️ Development Notes

### Code Structure:
- Pure HTML, CSS, JavaScript (No frameworks)
- Vanilla fetch API for HTTP requests
- ES6 async/await pattern
- Modular function design
- Clear separation of concerns

### Constants:
```javascript
const API_URL = 'http://localhost:3000';
```

### Alert System:
```javascript
showAlert(message, type)  // Types: 'success', 'error', 'info'
```

### Error Handling:
- Try-catch blocks for all fetch calls
- User-friendly error messages
- Network error handling
- API response validation

---

## 📊 Sample Data

### Students:
- S001: Ali Khan - Government School
- S002: Fatima Ahmed - Government School
- S003: Hassan Ali - Private Academy

### Buses:
- B001: Driver D001, Location (31.5204, 74.3587)
- B002: Driver D002, Location (31.5500, 74.3500)

---

## 🎓 OOP Integration

The frontend integrates with backend OOP classes:

1. **User Classes** (Parent, Driver extend User)
   - Login/Logout functionality
   - User authentication

2. **Student Class**
   - Attendance tracking
   - School information
   - Bus assignment

3. **Bus Class**
   - Location management
   - Student list
   - Driver assignment

4. **Payment Class**
   - Payment processing
   - Receipt generation
   - Status tracking

---

## 📞 Support

### Common Issues:

**Q: API not responding?**
- Ensure backend server is running on port 3000
- Check if CORS is enabled
- Verify API URL in code

**Q: Login fails?**
- Check correct email for selected user
- Verify user ID matches dropdown
- Check browser console for errors

**Q: Styling not applied?**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser zoom level

---

## ✅ Completion Checklist

- ✅ index.html - Landing page with navigation
- ✅ parent.html - Complete parent dashboard
- ✅ driver.html - Complete driver dashboard
- ✅ tracking.html - GPS tracking system
- ✅ Responsive design for all pages
- ✅ API integration for all features
- ✅ User authentication and validation
- ✅ Alert and notification system
- ✅ Sample data loaded automatically
- ✅ Professional UI/UX design
- ✅ Mobile-friendly interface
- ✅ Comprehensive documentation

---

## 📦 Deliverables

**Frontend Component (Member 5 Work):**
- 4 HTML pages with complete functionality
- Professional CSS styling
- JavaScript for API integration
- Full OOP integration with backend
- Responsive design
- Complete documentation

---

## 🎉 Conclusion

The RouteMate frontend is complete and ready for use. All three modules (Parent, Driver, Tracking) are fully functional with proper API integration, user authentication, and responsive design.

**Happy Coding! 🚀**

---

**Version:** 1.0.0  
**Last Updated:** May 13, 2024  
**Team:** Topfrag  
**Project:** RouteMate - School Transport Management System
