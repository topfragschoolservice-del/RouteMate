# RouteMate - OOP Models Documentation (Member 1)

## Overview
Member 1 has successfully created all required OOP classes following SOLID principles with proper encapsulation, inheritance, and composition.

## 📁 File Structure
```
/models
  ├── User.js          (Base class - login/logout)
  ├── Parent.js        (Extends User - manage children & attendance)
  ├── Driver.js        (Extends User - manage bus & students)
  ├── Student.js       (Standalone - attendance tracking)
  ├── Bus.js           (Composition - location + students)
  ├── Payment.js       (Standalone - payment processing)
  ├── Location.js      (Standalone - GPS coordinates)
  ├── index.js         (Export all classes)
  └── test.js          (Test file - demonstrates OOP functionality)
```

## 🏗️ OOP Principles Implemented

### 1. Encapsulation
- All class properties are **private** using `#` prefix
- Public methods provide controlled access via getters/setters
- Example:
  ```javascript
  class User {
    #id;        // Private
    #name;      // Private
    #email;     // Private
    
    getId() { return this.#id; }  // Public getter
    setName(name) { this.#name = name; }  // Public setter
  }
  ```

### 2. Inheritance
- **Parent** extends **User** - inherits login/logout
- **Driver** extends **User** - inherits login/logout
- Each maintains its own unique methods
- Example:
  ```javascript
  class Parent extends User {
    // Inherits: getId(), getName(), login(), logout()
    // New methods: markAttendance(), makePayment(), addChild()
  }
  ```

### 3. Composition
- **Bus** contains **Location** object (has-a relationship)
- **Bus** manages array of **Student** objects
- **Parent** manages array of **Student** objects
- Example:
  ```javascript
  class Bus {
    #currentLocation;  // Composition: Location object
    #students;         // Composition: Array of Student objects
  }
  ```

### 4. Polymorphism
- Each class implements `toString()` method
- Allows polymorphic behavior (same method, different output)
- Example:
  ```javascript
  user.toString();    // "User - ID: U001, Name: John Doe..."
  parent.toString();  // "Parent - ID: P001, Name: Amina Hassan... - Children Count: 2"
  driver.toString();  // "Driver - ID: D001, Name: Khalid... - Assigned Bus: BUS001"
  ```

## 📚 Class Details

### User (Base Class)
**Properties:**
- `id`, `name`, `email` (private)
- `isLoggedIn` (private boolean)

**Methods:**
- `login()` - Set isLoggedIn to true
- `logout()` - Set isLoggedIn to false
- Getters/Setters for all properties

---

### Parent (extends User)
**Additional Properties:**
- `children` (private array of Student objects)

**Methods:**
- `addChild(student)` - Add a student
- `removeChild(studentId)` - Remove a student
- `markAttendance(studentId, morningStatus, afternoonStatus)` - Mark attendance
- `makePayment(studentId, amount)` - Process payment
- `getChildrenAttendance()` - Get all children's attendance status

---

### Driver (extends User)
**Additional Properties:**
- `assignedBus` (private Bus object)

**Methods:**
- `setAssignedBus(bus)` - Assign a bus
- `viewStudents()` - Get all students in assigned bus
- `updateBusLocation(latitude, longitude)` - Update bus GPS location
- `getBusStatus()` - Get detailed bus status

---

### Student (Standalone)
**Properties:**
- `id`, `name`, `school` (private)
- `morningStatus`, `afternoonStatus` (private booleans)

**Methods:**
- `setMorningStatus(status)` - Mark morning attendance
- `setAfternoonStatus(status)` - Mark afternoon attendance
- `getAttendanceStatus()` - Return attendance object

---

### Bus (Standalone)
**Properties:**
- `busId` (private)
- `driver` (private Driver object)
- `students` (private array of Student objects)
- `currentLocation` (private Location object)

**Methods:**
- `addStudent(student)` - Add student to bus
- `removeStudent(studentId)` - Remove student from bus
- `updateLocation(latitude, longitude)` - Update GPS location
- `getBusStatus()` - Return complete bus status

---

### Payment (Standalone)
**Properties:**
- `paymentId`, `parentId`, `studentId`, `amount` (private)
- `status` (Pending/Paid/Cancelled)
- `createdAt`, `processedAt` (private timestamps)

**Methods:**
- `processPayment()` - Change status to Paid
- `generateReceipt()` - Create payment receipt
- `cancelPayment()` - Cancel pending payment

---

### Location (Standalone)
**Properties:**
- `latitude`, `longitude` (private)

**Methods:**
- `updateLocation(latitude, longitude)` - Update coordinates
- `toString()` - Return formatted location string "(lat, lon)"

---

## 🚀 Usage for Next Members

### Member 2 (Backend API Developer)
Import and use models in routes:
```javascript
const { Parent, Driver, Student, Bus } = require('./models');

const parent = new Parent('P001', 'Amina Hassan', 'amina@example.com');
const student = new Student('S001', 'Ali Ahmed', 'Central School');
parent.addChild(student);
parent.markAttendance('S001', true, false);
```

### Member 3 (Services Developer)
Services will wrap these models with business logic:
```javascript
class AttendanceService {
  markAttendance(parent, studentId, morning, afternoon) {
    return parent.markAttendance(studentId, morning, afternoon);
  }
}
```

### Member 4 (Tracking System)
Use Bus and Location for tracking:
```javascript
bus.updateLocation(40.7128, -74.0060);
const location = bus.getCurrentLocation();
```

### Member 5 (Frontend)
Fetch API will receive data from these classes:
```javascript
fetch('/api/bus/status')
  .then(res => res.json())
  .then(data => {
    // data contains Bus status from backend
  });
```

## ✅ Testing

Run the test file to verify all classes work:
```bash
node models/test.js
```

Output shows:
- ✓ Encapsulation works (private fields)
- ✓ Inheritance works (Parent & Driver extend User)
- ✓ Composition works (Bus contains Location & Students)
- ✓ Polymorphism works (toString() implementations)

## 🎯 Next Steps

1. **Member 2**: Create Express server (`app.js`) and routes
2. **Member 3**: Create Services layer (AttendanceService, PaymentService)
3. **Member 4**: Implement Bus tracking and GPS simulation
4. **Member 5**: Build frontend UI and integrate with APIs

---

**Member 1 Status: ✅ COMPLETE**

All OOP models ready for integration with backend services.
