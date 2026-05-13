# RouteMate Backend API - Member 2 Documentation

## Overview
This document covers the Express.js backend implementation for the RouteMate School Transport Management System.

## Project Structure
```
RouteMate/
├── app.js                 # Main Express server & all API routes
├── package.json          # Dependencies & scripts
├── models/               # OOP model classes
│   ├── User.js
│   ├── Parent.js
│   ├── Driver.js
│   ├── Student.js
│   ├── Bus.js
│   ├── Payment.js
│   ├── Location.js
│   └── index.js
└── README.md             # This file
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This installs:
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **body-parser**: JSON body parsing

### 2. Run the Server
```bash
npm start
```

Or for development:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Documentation

### Initialization
On startup, the server automatically creates sample data:

**Sample Users:**
- **Parents:**
  - P001: Mr. Khan (parent1@routemate.com)
  - P002: Mrs. Ahmed (parent2@routemate.com)

- **Drivers:**
  - D001: Akram Khan (akram@routemate.com)
  - D002: Bilal Ahmad (bilal@routemate.com)

**Sample Students:**
- S001: Ali Khan (Government School) - assigned to Bus B001
- S002: Fatima Ahmed (Government School) - assigned to Bus B001
- S003: Hassan Ali (Private Academy) - assigned to Bus B002

**Sample Buses:**
- B001: Driver D001, Location (31.5204, 74.3587)
- B002: Driver D002, Location (31.5500, 74.3500)

### Authentication Endpoints

#### POST /auth/login
Login a user (parent or driver)

**Request:**
```json
{
  "userId": "P001",
  "email": "parent1@routemate.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "P001",
    "name": "Mr. Khan",
    "email": "parent1@routemate.com",
    "type": "Parent",
    "isLoggedIn": true
  }
}
```

#### POST /auth/logout
Logout a user

**Request:**
```json
{
  "userId": "P001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "user": {
    "id": "P001",
    "name": "Mr. Khan",
    "isLoggedIn": false
  }
}
```

#### GET /auth/users
Get all users (parents and drivers)

**Response:**
```json
{
  "success": true,
  "count": 4,
  "users": [
    {
      "id": "P001",
      "name": "Mr. Khan",
      "email": "parent1@routemate.com",
      "type": "Parent",
      "isLoggedIn": true
    }
  ]
}
```

### Attendance Endpoints

#### POST /attendance
Mark child attendance

**Request:**
```json
{
  "parentId": "P001",
  "studentId": "S001",
  "morningStatus": true,
  "afternoonStatus": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "attendance": {
    "studentId": "S001",
    "studentName": "Ali Khan",
    "morning": true,
    "afternoon": false
  }
}
```

#### GET /attendance/student/:studentId
Get student's attendance

**Response:**
```json
{
  "success": true,
  "attendance": {
    "studentId": "S001",
    "studentName": "Ali Khan",
    "morning": true,
    "afternoon": false
  }
}
```

#### GET /attendance/parent/:parentId
Get all children's attendance

**Response:**
```json
{
  "success": true,
  "parentId": "P001",
  "parentName": "Mr. Khan",
  "childrenAttendance": [
    {
      "studentId": "S001",
      "studentName": "Ali Khan",
      "morning": true,
      "afternoon": false
    }
  ]
}
```

### Payment Endpoints

#### POST /payment
Process a payment

**Request:**
```json
{
  "parentId": "P001",
  "studentId": "S001",
  "amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "studentId": "S001",
  "amount": 5000,
  "paymentDate": "2026-05-13T14:40:27.242+05:30",
  "paymentId": "PAY_1234567890_5678"
}
```

#### POST /payment/:paymentId/process
Complete payment processing

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "paymentId": "PAY_1234567890_5678",
  "amount": 5000,
  "processedAt": "2026-05-13T14:40:28.123+05:30"
}
```

#### GET /payment/:paymentId/receipt
Generate payment receipt

**Response:**
```json
{
  "success": true,
  "receipt": {
    "paymentId": "PAY_1234567890_5678",
    "parentId": "P001",
    "studentId": "S001",
    "amount": 5000,
    "status": "Paid",
    "createdAt": "2026-05-13T14:40:27.242+05:30",
    "processedAt": "2026-05-13T14:40:28.123+05:30",
    "receiptDate": "2026-05-13T14:40:29.456+05:30"
  }
}
```

#### GET /payment/parent/:parentId
Get all parent's payments

**Response:**
```json
{
  "success": true,
  "parentId": "P001",
  "paymentCount": 2,
  "payments": [
    {
      "paymentId": "PAY_1234567890_5678",
      "studentId": "S001",
      "amount": 5000,
      "status": "Paid",
      "createdAt": "2026-05-13T14:40:27.242+05:30",
      "processedAt": "2026-05-13T14:40:28.123+05:30"
    }
  ]
}
```

### Bus Endpoints

#### GET /bus
Get all buses

**Response:**
```json
{
  "success": true,
  "busCount": 2,
  "buses": [
    {
      "busId": "B001",
      "driver": "Akram Khan",
      "studentCount": 2,
      "location": {
        "latitude": 31.5204,
        "longitude": 74.3587
      }
    }
  ]
}
```

#### GET /bus/:busId
Get specific bus details

**Response:**
```json
{
  "success": true,
  "bus": {
    "busId": "B001",
    "driver": "Akram Khan",
    "studentCount": 2,
    "students": [
      {
        "id": "S001",
        "name": "Ali Khan",
        "school": "Government School",
        "morningStatus": null,
        "afternoonStatus": null
      }
    ],
    "location": {
      "latitude": 31.5204,
      "longitude": 74.3587
    }
  }
}
```

#### GET /bus/:busId/students
Get students on a specific bus

**Response:**
```json
{
  "success": true,
  "busId": "B001",
  "studentCount": 2,
  "students": [
    {
      "id": "S001",
      "name": "Ali Khan",
      "school": "Government School",
      "morningStatus": true,
      "afternoonStatus": false
    }
  ]
}
```

#### POST /bus/:busId/location
Update bus location

**Request:**
```json
{
  "latitude": 31.5250,
  "longitude": 74.3600
}
```

**Response:**
```json
{
  "success": true,
  "busId": "B001",
  "location": "(31.525, 74.36)",
  "updatedAt": "2026-05-13T14:40:30.789+05:30"
}
```

#### GET /bus/:busId/location
Get current bus location

**Response:**
```json
{
  "success": true,
  "busId": "B001",
  "location": {
    "latitude": 31.5250,
    "longitude": 74.3600
  }
}
```

### Dashboard Endpoints

#### GET /dashboard/parent/:parentId
Get parent dashboard with children, attendance, and bus info

**Response:**
```json
{
  "success": true,
  "parent": {
    "parentId": "P001",
    "name": "Mr. Khan",
    "email": "parent1@routemate.com",
    "isLoggedIn": true
  },
  "children": [
    {
      "studentId": "S001",
      "studentName": "Ali Khan",
      "school": "Government School",
      "attendance": {
        "studentId": "S001",
        "studentName": "Ali Khan",
        "morning": true,
        "afternoon": false
      },
      "assignedBus": {
        "busId": "B001",
        "driver": "Akram Khan",
        "location": {
          "latitude": 31.5250,
          "longitude": 74.3600
        }
      }
    }
  ],
  "payments": {
    "total": 1,
    "paid": 1,
    "pending": 0
  }
}
```

#### GET /dashboard/driver/:driverId
Get driver dashboard with assigned students and bus status

**Response:**
```json
{
  "success": true,
  "driver": {
    "driverId": "D001",
    "name": "Akram Khan",
    "email": "akram@routemate.com",
    "isLoggedIn": true
  },
  "success": true,
  "busId": "B001",
  "studentCount": 2,
  "students": [
    {
      "id": "S001",
      "name": "Ali Khan",
      "school": "Government School",
      "morningStatus": true,
      "afternoonStatus": false
    }
  ],
  "busStatus": {
    "busId": "B001",
    "driverName": "Akram Khan",
    "studentCount": 2,
    "studentNames": ["Ali Khan", "Fatima Ahmed"],
    "currentLocation": "(31.525, 74.36)"
  }
}
```

## OOP Implementation

All endpoints use OOP classes to perform operations:

- **Parent.markAttendance()** - Handles attendance marking
- **Parent.makePayment()** - Processes payment logic
- **Driver.viewStudents()** - Retrieves driver's assigned students
- **Driver.updateBusLocation()** - Updates bus location
- **Bus.updateLocation()** - Updates location via OOP
- **Payment.processPayment()** - Processes payment state change
- **Payment.generateReceipt()** - Creates payment receipts

## Error Handling

All endpoints return proper HTTP status codes:

- **200 OK** - Successful GET/POST operations
- **201 Created** - Resource created (payments)
- **400 Bad Request** - Invalid input or business logic failure
- **401 Unauthorized** - Authentication failure
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

Standard error response:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Testing

### Quick Test Commands

```bash
# Login as Parent
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"P001","email":"parent1@routemate.com"}'

# Mark Attendance
curl -X POST http://localhost:3000/attendance \
  -H "Content-Type: application/json" \
  -d '{"parentId":"P001","studentId":"S001","morningStatus":true,"afternoonStatus":false}'

# View All Buses
curl http://localhost:3000/bus

# Get Parent Dashboard
curl http://localhost:3000/dashboard/parent/P001

# Update Bus Location
curl -X POST http://localhost:3000/bus/B001/location \
  -H "Content-Type: application/json" \
  -d '{"latitude":31.53,"longitude":74.36}'
```

## Data Flow

1. **Request arrives** at Express endpoint
2. **Middleware** processes JSON body
3. **Route handler** validates input
4. **OOP method** is called on model class
5. **Business logic** is executed in the model
6. **Response** is returned with status code

This ensures separation of concerns: HTTP handling in routes, business logic in OOP classes.

## Notes

- All data is stored in-memory (no database)
- Sample data is auto-initialized on server start
- Payment IDs are unique (timestamp + random number)
- Location coordinates use simple latitude/longitude format
- All timestamps are ISO 8601 format
