# RouteMate - School Transport Management System

## Project Overview

RouteMate is a university OOP project built by **Team Topfrag** for managing school bus transport operations. It allows parents to mark child attendance and track bus locations, drivers to view assigned students and update bus status, and admins to manage the system (optional).

### 🎯 Core Features

- **Parent Dashboard**: Mark morning/afternoon attendance, view child's bus location, simulate payments
- **Driver Dashboard**: View assigned students, update bus location in real-time
- **Bus Tracking**: Simulated GPS tracking for parents to monitor bus movement
- **Payment System**: Payment simulation for transport fees
- **OOP Architecture**: Fully object-oriented design using inheritance, encapsulation, and polymorphism

---

## 🧱 Architecture

### Tech Stack
- **Backend**: Node.js + Express.js
- **Frontend**: HTML + CSS + Vanilla JavaScript
- **Data Storage**: In-memory (no database)
- **Architecture**: Strict Object-Oriented Programming

### Project Structure

```
RouteMate/
├── models/                    # OOP Model Classes
│   ├── User.js               # Base user class
│   ├── Parent.js             # Parent extends User
│   ├── Driver.js             # Driver extends User
│   ├── Student.js            # Student model
│   ├── Bus.js                # Bus model
│   ├── Payment.js            # Payment model
│   ├── Location.js           # Location model
│   └── index.js              # Model exports
├── routes/                    # API Routes (created by Member 2)
├── services/                  # Business Logic Services (Member 3)
├── tracking/                  # GPS Tracking System (Member 4)
├── frontend/                  # UI Pages (Member 5)
├── app.js                     # Express server (Member 2)
├── package.json              # Dependencies
├── API_DOCUMENTATION.md      # API Reference
├── README.md                 # This file
└── MODELS.md                 # Model specifications
```

---

## 👥 Team Work Division

### 👤 Member 1 – OOP Models Developer ✅ COMPLETED
**Responsibility**: Create all OOP classes with proper inheritance and encapsulation

**Deliverables**:
- ✅ `User` - Base class with login/logout
- ✅ `Parent` - Extends User, manages children and payments
- ✅ `Driver` - Extends User, manages bus and students
- ✅ `Student` - Manages attendance status
- ✅ `Bus` - Manages location and students
- ✅ `Payment` - Handles payment processing
- ✅ `Location` - Manages coordinates

### 👤 Member 2 – Backend API Developer ✅ COMPLETED (YOU ARE HERE)
**Responsibility**: Express server setup and REST API implementation

**Deliverables**:
- ✅ `app.js` - Main Express server with middleware
- ✅ `/auth` endpoints - Login, logout, user listing
- ✅ `/attendance` endpoints - Mark attendance, retrieve attendance
- ✅ `/payment` endpoints - Process payments, generate receipts
- ✅ `/bus` endpoints - View buses, update location, manage students
- ✅ `/dashboard` endpoints - Parent and driver dashboards
- ✅ Sample data initialization
- ✅ Error handling and validation
- ✅ API documentation

### 👤 Member 3 – Services Layer Developer
**Responsibility**: Create business logic services layer

**Expected Work**:
- `AttendanceService` - Attendance validation and business rules
- `PaymentService` - Payment processing logic
- Service folder: `/services`

### 👤 Member 4 – Driver & Tracking System Developer
**Responsibility**: GPS tracking and bus movement simulation

**Expected Work**:
- Simulated GPS movement
- Bus location updates
- Route tracking
- Tracking folder: `/tracking`

### 👤 Member 5 – Frontend Developer
**Responsibility**: Create HTML UI and JavaScript client

**Expected Work**:
- `parent.html` - Parent dashboard page
- `driver.html` - Driver dashboard page
- `tracking.html` - Bus tracking page
- CSS styling
- JavaScript fetch API integration
- Frontend folder: `/frontend`


## 📡 API Endpoints Summary

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/users` - Get all users

### Attendance
- `POST /attendance` - Mark attendance
- `GET /attendance/student/:studentId` - Get student attendance
- `GET /attendance/parent/:parentId` - Get all children's attendance

### Payment
- `POST /payment` - Create payment
- `POST /payment/:paymentId/process` - Process payment
- `GET /payment/:paymentId/receipt` - Generate receipt
- `GET /payment/parent/:parentId` - Get parent's payments

### Bus
- `GET /bus` - Get all buses
- `GET /bus/:busId` - Get bus details
- `GET /bus/:busId/students` - Get bus students
- `POST /bus/:busId/location` - Update bus location
- `GET /bus/:busId/location` - Get bus location

### Dashboard
- `GET /dashboard/parent/:parentId` - Parent dashboard
- `GET /dashboard/driver/:driverId` - Driver dashboard

**For detailed API documentation, see: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

---

## 💾 Sample Data

The system initializes with sample data automatically:

### Parents
- **P001**: Mr. Khan (parent1@routemate.com) - Has children S001, S002
- **P002**: Mrs. Ahmed (parent2@routemate.com) - Has child S003

### Drivers
- **D001**: Akram Khan (akram@routemate.com) - Drives Bus B001
- **D002**: Bilal Ahmad (bilal@routemate.com) - Drives Bus B002

### Students
- **S001**: Ali Khan - Government School - Bus B001
- **S002**: Fatima Ahmed - Government School - Bus B001
- **S003**: Hassan Ali - Private Academy - Bus B002

### Buses
- **B001**: Driven by D001, Location (31.5204, 74.3587)
- **B002**: Driven by D002, Location (31.5500, 74.3500)

---

## 🔧 Development Guide

### OOP Principles Used

1. **Encapsulation**: Private fields (#) in all classes
2. **Inheritance**: Parent and Driver extend User
3. **Polymorphism**: Different user types (Parent/Driver) with different methods
4. **Composition**: Bus contains Students, Parent contains Children

### Adding New Endpoints

1. Create a new route handler in `app.js`
2. Use helper functions to access dataStore
3. Call OOP methods on model instances
4. Return proper HTTP status codes and JSON responses

Example:
```javascript
const router = express.Router();

router.post('/endpoint', (req, res) => {
  try {
    const { data } = req.body;
    const result = someModel.someMethod(data);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Testing Endpoints

Use curl or Postman:

```bash
# Example: Create Payment
curl -X POST http://localhost:3000/payment \
  -H "Content-Type: application/json" \
  -d '{"parentId":"P001","studentId":"S001","amount":5000}'
```

---

## 📝 Member 2 Implementation Details

### What Was Delivered

1. **Express Server Setup** (`app.js`)
   - Middleware configuration (CORS, body-parser)
   - In-memory data storage
   - Sample data initialization
   - Helper functions for data access

2. **Authentication Routes** (`/auth`)
   - Login with ID and email validation
   - Logout functionality
   - User listing
   - Uses OOP User methods

3. **Attendance Routes** (`/attendance`)
   - Mark attendance through Parent class
   - Retrieve student attendance
   - Get all children's attendance
   - Validates parent-student relationship

4. **Payment Routes** (`/payment`)
   - Create payments through Parent class
   - Process payments with state management
   - Generate receipts
   - Track payment history per parent
   - Uses Payment class methods

5. **Bus Routes** (`/bus`)
   - List all buses
   - Get bus details with students
   - Update bus location via OOP
   - Get current location
   - View students on specific bus

6. **Dashboard Routes** (`/dashboard`)
   - Parent dashboard with children and bus info
   - Driver dashboard with assigned students
   - Integrated data from multiple models

### OOP Integration

All endpoints follow this pattern:
1. Validate request input
2. Find relevant OOP object from dataStore
3. Call OOP method to perform business logic
4. Return result to client

This ensures clean separation between HTTP handling and business logic.


