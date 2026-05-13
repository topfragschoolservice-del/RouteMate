/**
 * Simple API Test Suite for RouteMate Backend
 * Run after: npm start
 * 
 * This tests all endpoints to verify the API is working
 */

const BASE_URL = 'http://localhost:3000';

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = {
  test: (name) => console.log(`\n${colors.bright}${colors.blue}► ${name}${colors.reset}`),
  success: (msg) => console.log(`  ${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`  ${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`  ${colors.yellow}ℹ ${msg}${colors.reset}`)
};

// Test helper function
async function test(name, method, endpoint, body) {
  log.test(name);
  
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.ok || response.status === 201) {
      log.success(`${response.status} - ${data.message || data.success}`);
      return data;
    } else {
      log.error(`${response.status} - ${data.message}`);
      return null;
    }
  } catch (err) {
    log.error(`Request failed: ${err.message}`);
    return null;
  }
}

// Main test runner
async function runTests() {
  console.log(`\n${colors.bright}RouteMate API Test Suite${colors.reset}`);
  console.log(`Testing: ${BASE_URL}\n`);

  // Test 1: Check server status
  log.test('Server Status');
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      log.success('Server is running');
    }
  } catch {
    log.error('Server is not running! Run: npm start');
    return;
  }

  // Test 2: Authentication
  const loginData = await test(
    'Auth - Login (Parent)',
    'POST',
    '/auth/login',
    { userId: 'P001', email: 'parent1@routemate.com' }
  );

  await test(
    'Auth - Get All Users',
    'GET',
    '/auth/users'
  );

  // Test 3: Attendance
  const attendanceData = await test(
    'Attendance - Mark Attendance',
    'POST',
    '/attendance',
    { 
      parentId: 'P001', 
      studentId: 'S001', 
      morningStatus: true, 
      afternoonStatus: false 
    }
  );

  await test(
    'Attendance - Get Student Attendance',
    'GET',
    '/attendance/student/S001'
  );

  await test(
    'Attendance - Get Parent Children Attendance',
    'GET',
    '/attendance/parent/P001'
  );

  // Test 4: Payments
  const paymentData = await test(
    'Payment - Create Payment',
    'POST',
    '/payment',
    { 
      parentId: 'P001', 
      studentId: 'S001', 
      amount: 5000 
    }
  );

  if (paymentData && paymentData.paymentId) {
    await test(
      'Payment - Process Payment',
      'POST',
      `/payment/${paymentData.paymentId}/process`
    );

    await test(
      'Payment - Generate Receipt',
      'GET',
      `/payment/${paymentData.paymentId}/receipt`
    );
  }

  await test(
    'Payment - Get Parent Payments',
    'GET',
    '/payment/parent/P001'
  );

  // Test 5: Bus
  await test(
    'Bus - Get All Buses',
    'GET',
    '/bus'
  );

  await test(
    'Bus - Get Specific Bus',
    'GET',
    '/bus/B001'
  );

  await test(
    'Bus - Get Bus Students',
    'GET',
    '/bus/B001/students'
  );

  await test(
    'Bus - Update Bus Location',
    'POST',
    '/bus/B001/location',
    { latitude: 31.5250, longitude: 74.3600 }
  );

  await test(
    'Bus - Get Bus Location',
    'GET',
    '/bus/B001/location'
  );

  // Test 6: Dashboards
  await test(
    'Dashboard - Get Parent Dashboard',
    'GET',
    '/dashboard/parent/P001'
  );

  await test(
    'Dashboard - Get Driver Dashboard',
    'GET',
    '/dashboard/driver/D001'
  );

  // Test 7: Logout
  await test(
    'Auth - Logout',
    'POST',
    '/auth/logout',
    { userId: 'P001' }
  );

  console.log(`\n${colors.bright}All tests completed!${colors.reset}\n`);
}

// Run tests if this is executed directly
runTests().catch(console.error);
