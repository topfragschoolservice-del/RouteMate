const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { User, Parent, Driver, Student, Bus, Payment, Location } = require('./models');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static('./frontend'));

// ============================================
// IN-MEMORY DATA STORAGE
// ============================================
const dataStore = {
  users: [],
  parents: [],
  drivers: [],
  students: [],
  buses: [],
  payments: []
};

// ============================================
// INITIALIZE SAMPLE DATA
// ============================================
function initializeSampleData() {
  // Create students
  const student1 = new Student('S001', 'Ali Khan', 'Government School');
  const student2 = new Student('S002', 'Fatima Ahmed', 'Government School');
  const student3 = new Student('S003', 'Hassan Ali', 'Private Academy');
  
  dataStore.students.push(student1, student2, student3);

  // Create drivers
  const driver1 = new Driver('D001', 'Akram Khan', 'akram@routemate.com');
  const driver2 = new Driver('D002', 'Bilal Ahmad', 'bilal@routemate.com');
  
  driver1.login();
  driver2.login();
  
  dataStore.drivers.push(driver1, driver2);
  dataStore.users.push(driver1, driver2);

  // Create parents
  const parent1 = new Parent('P001', 'Mr. Khan', 'parent1@routemate.com');
  const parent2 = new Parent('P002', 'Mrs. Ahmed', 'parent2@routemate.com');
  
  parent1.addChild(student1);
  parent1.addChild(student2);
  parent2.addChild(student3);
  
  parent1.login();
  parent2.login();
  
  dataStore.parents.push(parent1, parent2);
  dataStore.users.push(parent1, parent2);

  // Create buses and assign drivers
  const bus1 = new Bus('B001', driver1, new Location(31.5204, 74.3587));
  const bus2 = new Bus('B002', driver2, new Location(31.5500, 74.3500));
  
  driver1.setAssignedBus(bus1);
  driver2.setAssignedBus(bus2);
  
  bus1.addStudent(student1);
  bus1.addStudent(student2);
  bus2.addStudent(student3);
  
  dataStore.buses.push(bus1, bus2);

  console.log('✓ Sample data initialized successfully');
  console.log(`  - Students: ${dataStore.students.length}`);
  console.log(`  - Parents: ${dataStore.parents.length}`);
  console.log(`  - Drivers: ${dataStore.drivers.length}`);
  console.log(`  - Buses: ${dataStore.buses.length}`);
}

// ============================================
// HELPER FUNCTIONS FOR DATA ACCESS
// ============================================

// Find user by ID (can be parent or driver)
function findUserById(userId) {
  return dataStore.parents.find(p => p.getId() === userId) ||
         dataStore.drivers.find(d => d.getId() === userId);
}

// Find student by ID
function findStudentById(studentId) {
  return dataStore.students.find(s => s.getId() === studentId);
}

// Find bus by ID
function findBusById(busId) {
  return dataStore.buses.find(b => b.getBusId() === busId);
}

// Find driver by ID
function findDriverById(driverId) {
  return dataStore.drivers.find(d => d.getId() === driverId);
}

// Generate unique payment ID
function generatePaymentId() {
  return `PAY_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// ============================================
// ROUTES - AUTH
// ============================================
const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID and email are required'
      });
    }

    const user = findUserById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.getEmail() !== email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email'
      });
    }

    user.login();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        type: user.constructor.name,
        isLoggedIn: user.isLoggedIn()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

authRouter.post('/logout', (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.logout();

    res.status(200).json({
      success: true,
      message: 'Logout successful',
      user: {
        id: user.getId(),
        name: user.getName(),
        isLoggedIn: user.isLoggedIn()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

authRouter.get('/users', (req, res) => {
  try {
    const allUsers = [
      ...dataStore.parents.map(p => ({
        id: p.getId(),
        name: p.getName(),
        email: p.getEmail(),
        type: 'Parent',
        isLoggedIn: p.isLoggedIn()
      })),
      ...dataStore.drivers.map(d => ({
        id: d.getId(),
        name: d.getName(),
        email: d.getEmail(),
        type: 'Driver',
        isLoggedIn: d.isLoggedIn()
      }))
    ];

    res.status(200).json({
      success: true,
      count: allUsers.length,
      users: allUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
});

app.use('/auth', authRouter);

// ============================================
// ROUTES - ATTENDANCE
// ============================================
const attendanceRouter = express.Router();

attendanceRouter.post('/', (req, res) => {
  try {
    const { parentId, studentId, morningStatus, afternoonStatus } = req.body;

    if (!parentId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Parent ID and Student ID are required'
      });
    }

    const parent = dataStore.parents.find(p => p.getId() === parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    const result = parent.markAttendance(studentId, morningStatus, afternoonStatus);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
});

attendanceRouter.get('/student/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const student = findStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      attendance: student.getAttendanceStatus()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance',
      error: error.message
    });
  }
});

attendanceRouter.get('/parent/:parentId', (req, res) => {
  try {
    const { parentId } = req.params;
    const parent = dataStore.parents.find(p => p.getId() === parentId);

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    res.status(200).json({
      success: true,
      parentId: parent.getId(),
      parentName: parent.getName(),
      childrenAttendance: parent.getChildrenAttendance()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve children attendance',
      error: error.message
    });
  }
});

app.use('/attendance', attendanceRouter);

// ============================================
// ROUTES - PAYMENT
// ============================================
const paymentRouter = express.Router();

paymentRouter.post('/', (req, res) => {
  try {
    const { parentId, studentId, amount } = req.body;

    if (!parentId || !studentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Parent ID, Student ID, and Amount are required'
      });
    }

    const parent = dataStore.parents.find(p => p.getId() === parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    const result = parent.makePayment(studentId, amount);

    if (result.success) {
      const paymentId = generatePaymentId();
      const payment = new (require('./models').Payment)(paymentId, parentId, studentId, amount);
      dataStore.payments.push(payment);

      res.status(201).json({
        ...result,
        paymentId: paymentId
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
});

paymentRouter.post('/:paymentId/process', (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = dataStore.payments.find(p => p.getPaymentId() === paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const result = payment.processPayment();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
});

paymentRouter.get('/:paymentId/receipt', (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = dataStore.payments.find(p => p.getPaymentId() === paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const receipt = payment.generateReceipt();
    res.status(200).json({
      success: true,
      receipt: receipt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate receipt',
      error: error.message
    });
  }
});

paymentRouter.get('/parent/:parentId', (req, res) => {
  try {
    const { parentId } = req.params;
    const payments = dataStore.payments.filter(p => p.getParentId() === parentId);

    res.status(200).json({
      success: true,
      parentId: parentId,
      paymentCount: payments.length,
      payments: payments.map(p => ({
        paymentId: p.getPaymentId(),
        studentId: p.getStudentId(),
        amount: p.getAmount(),
        status: p.getStatus(),
        createdAt: p.getCreatedAt().toISOString(),
        processedAt: p.getProcessedAt() ? p.getProcessedAt().toISOString() : null
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments',
      error: error.message
    });
  }
});

app.use('/payment', paymentRouter);

// ============================================
// ROUTES - BUS
// ============================================
const busRouter = express.Router();

busRouter.get('/:busId', (req, res) => {
  try {
    const { busId } = req.params;
    const bus = findBusById(busId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      bus: {
        busId: bus.getBusId(),
        driver: bus.getDriver().getName(),
        studentCount: bus.getStudentCount(),
        students: bus.getStudents().map(s => ({
          id: s.getId(),
          name: s.getName(),
          school: s.getSchool(),
          morningStatus: s.getMorningStatus(),
          afternoonStatus: s.getAfternoonStatus()
        })),
        location: bus.getLocationDetails()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bus',
      error: error.message
    });
  }
});

busRouter.get('/:busId/students', (req, res) => {
  try {
    const { busId } = req.params;
    const bus = findBusById(busId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    const students = bus.getStudents();
    res.status(200).json({
      success: true,
      busId: bus.getBusId(),
      studentCount: students.length,
      students: students.map(s => ({
        id: s.getId(),
        name: s.getName(),
        school: s.getSchool(),
        morningStatus: s.getMorningStatus(),
        afternoonStatus: s.getAfternoonStatus()
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students',
      error: error.message
    });
  }
});

busRouter.post('/:busId/location', (req, res) => {
  try {
    const { busId } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const bus = findBusById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    const result = bus.updateLocation(latitude, longitude);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update bus location',
      error: error.message
    });
  }
});

busRouter.get('/:busId/location', (req, res) => {
  try {
    const { busId } = req.params;
    const bus = findBusById(busId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      busId: bus.getBusId(),
      location: bus.getLocationDetails()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bus location',
      error: error.message
    });
  }
});

busRouter.get('', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      busCount: dataStore.buses.length,
      buses: dataStore.buses.map(b => ({
        busId: b.getBusId(),
        driver: b.getDriver().getName(),
        studentCount: b.getStudentCount(),
        location: b.getLocationDetails()
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve buses',
      error: error.message
    });
  }
});

app.use('/bus', busRouter);

// ============================================
// ROUTES - DASHBOARD
// ============================================
const dashboardRouter = express.Router();

dashboardRouter.get('/parent/:parentId', (req, res) => {
  try {
    const { parentId } = req.params;
    const parent = dataStore.parents.find(p => p.getId() === parentId);

    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found'
      });
    }

    const children = parent.getChildren();
    const childrenData = children.map(child => {
      const assignedBus = dataStore.buses.find(b => 
        b.getStudents().find(s => s.getId() === child.getId())
      );

      return {
        studentId: child.getId(),
        studentName: child.getName(),
        school: child.getSchool(),
        attendance: child.getAttendanceStatus(),
        assignedBus: assignedBus ? {
          busId: assignedBus.getBusId(),
          driver: assignedBus.getDriver().getName(),
          location: assignedBus.getLocationDetails()
        } : null
      };
    });

    const parentPayments = dataStore.payments.filter(p => p.getParentId() === parentId);

    res.status(200).json({
      success: true,
      parent: {
        parentId: parent.getId(),
        name: parent.getName(),
        email: parent.getEmail(),
        isLoggedIn: parent.isLoggedIn()
      },
      children: childrenData,
      payments: {
        total: parentPayments.length,
        paid: parentPayments.filter(p => p.getStatus() === 'Paid').length,
        pending: parentPayments.filter(p => p.getStatus() === 'Pending').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load parent dashboard',
      error: error.message
    });
  }
});

dashboardRouter.get('/driver/:driverId', (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = findDriverById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    const studentView = driver.viewStudents();
    const busStatus = driver.getBusStatus();

    res.status(200).json({
      success: true,
      driver: {
        driverId: driver.getId(),
        name: driver.getName(),
        email: driver.getEmail(),
        isLoggedIn: driver.isLoggedIn()
      },
      ...studentView,
      busStatus: busStatus.busStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load driver dashboard',
      error: error.message
    });
  }
});

app.use('/dashboard', dashboardRouter);

// ============================================
// ROOT ENDPOINT
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to RouteMate - School Transport Management System',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      attendance: '/attendance',
      payment: '/payment',
      bus: '/bus',
      dashboard: '/dashboard'
    },
    dataStore: {
      studentsCount: dataStore.students.length,
      parentsCount: dataStore.parents.length,
      driversCount: dataStore.drivers.length,
      busesCount: dataStore.buses.length
    }
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// ============================================
// SERVER STARTUP
// ============================================
app.listen(PORT, () => {
  initializeSampleData();
  console.log(`\n🚀 RouteMate Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/\n`);
});

module.exports = app;
