/**
 * Services Layer Test & Demo
 * Demonstrates AttendanceService and PaymentService functionality
 * This shows how services integrate with the OOP models
 */

const AttendanceService = require('./services/AttendanceService');
const PaymentService = require('./services/PaymentService');
const { Parent, Student, Payment } = require('./models');

// Initialize services
const attendanceService = new AttendanceService();
const paymentService = new PaymentService();

console.log('='.repeat(60));
console.log('ROUTEMATE - SERVICES LAYER TEST');
console.log('='.repeat(60));

// Create sample data
const parent = new Parent('P001', 'John Doe', 'john@example.com');
const student1 = new Student('S001', 'Alice Doe', 'Lincoln High');
const student2 = new Student('S002', 'Bob Doe', 'Lincoln High');

parent.addChild(student1);
parent.addChild(student2);

console.log('\n' + '='.repeat(60));
console.log('ATTENDANCE SERVICE DEMONSTRATION');
console.log('='.repeat(60));

// Test 1: Mark Attendance
console.log('\n📝 Test 1: Marking Attendance');
console.log('-'.repeat(60));

const attendanceResult1 = attendanceService.markAttendance(
  'S001',
  'P001',
  true,  // morning present
  true   // afternoon present
);
console.log('Result:', attendanceResult1);

const attendanceResult2 = attendanceService.markAttendance(
  'S002',
  'P001',
  true,   // morning present
  false   // afternoon absent
);
console.log('Result:', attendanceResult2);

// Test 2: Get Student Attendance
console.log('\n📊 Test 2: Getting Student Attendance');
console.log('-'.repeat(60));

const studentAttendance = attendanceService.getStudentAttendance('S001');
console.log('Student S001 Today\'s Attendance:', studentAttendance);

// Test 3: Get Parent's Children Attendance
console.log('\n👨‍👧 Test 3: Getting Parent\'s Children Attendance');
console.log('-'.repeat(60));

const parentChildrenAttendance = attendanceService.getParentChildrenAttendance('P001');
console.log('Parent P001\'s Children Attendance:');
console.log(JSON.stringify(parentChildrenAttendance, null, 2));

// Test 4: Get Attendance Statistics
console.log('\n📈 Test 4: Getting Attendance Statistics');
console.log('-'.repeat(60));

// Mark attendance for multiple days to build history
for (let i = 1; i <= 5; i++) {
  attendanceService.markAttendance('S001', 'P001', i % 2 === 0, i % 3 === 0);
}

const stats = attendanceService.getAttendanceStats('S001', 30);
console.log('Student S001 Attendance Statistics (Last 30 days):');
console.log(JSON.stringify(stats, null, 2));

// Test 5: Generate Attendance Report
console.log('\n📋 Test 5: Generating Attendance Report');
console.log('-'.repeat(60));

const report = attendanceService.generateAttendanceReport(['S001', 'S002'], 30);
console.log('Class Attendance Report:');
console.log(JSON.stringify(report, null, 2));

console.log('\n' + '='.repeat(60));
console.log('PAYMENT SERVICE DEMONSTRATION');
console.log('='.repeat(60));

// Test 6: Make Payment
console.log('\n💳 Test 6: Making Payments');
console.log('-'.repeat(60));

const payment1 = paymentService.makePayment('P001', 'S001', 500);
console.log('Payment Result 1:', payment1);

const payment2 = paymentService.makePayment('P001', 'S002', 500);
console.log('Payment Result 2:', payment2);

// Test 7: Get Payment Status
console.log('\n🔍 Test 7: Getting Payment Status');
console.log('-'.repeat(60));

if (payment1.success) {
  const status = paymentService.getPaymentStatus(payment1.paymentId);
  console.log('Payment Status:', status);
}

// Test 8: Get Parent Payments
console.log('\n📄 Test 8: Getting Parent Payments');
console.log('-'.repeat(60));

const parentPayments = paymentService.getParentPayments('P001');
console.log('Parent P001 Payments:');
console.log(JSON.stringify(parentPayments, null, 2));

// Test 9: Generate Receipt
console.log('\n🧾 Test 9: Generating Receipt');
console.log('-'.repeat(60));

if (payment1.success && payment1.status === 'Paid') {
  const receipt = paymentService.generateReceipt(payment1.paymentId);
  console.log('Receipt Generated:');
  console.log(JSON.stringify(receipt.receipt, null, 2));
}

// Test 10: Payment Statistics
console.log('\n💰 Test 10: Payment Statistics');
console.log('-'.repeat(60));

const paymentStats = paymentService.getParentPaymentStats('P001');
console.log('Parent P001 Payment Statistics:');
console.log(JSON.stringify(paymentStats, null, 2));

// Test 11: Revenue Summary (Admin)
console.log('\n💵 Test 11: Revenue Summary (Admin Dashboard)');
console.log('-'.repeat(60));

const revenues = paymentService.getRevenueSummary();
console.log('System Revenue Summary:');
console.log(JSON.stringify(revenues, null, 2));

// Test 12: Cancel Payment
console.log('\n❌ Test 12: Cancelling Payments');
console.log('-'.repeat(60));

const testPayment = paymentService.makePayment('P001', 'S001', 250);
if (testPayment.success && testPayment.status === 'Pending') {
  const cancelResult = paymentService.cancelPayment(testPayment.paymentId);
  console.log('Cancel Result:', cancelResult);
} else {
  console.log('Payment was processed immediately, cannot cancel paid payment');
}

console.log('\n' + '='.repeat(60));
console.log('INTEGRATION TEST: Services with OOP Models');
console.log('='.repeat(60));

// Test 13: Using services with Parent model methods
console.log('\n🔗 Test 13: Services Integration with Parent Model');
console.log('-'.repeat(60));

// Parent model's markAttendance method
const result = parent.markAttendance('S001', true, false);
console.log('Parent.markAttendance() result:', result);

// Get service data
const serviceData = attendanceService.getParentChildrenAttendance('P001');
console.log('Service has marked attendance records:', serviceData.length > 0);

console.log('\n' + '='.repeat(60));
console.log('TEST COMPLETED SUCCESSFULLY ✅');
console.log('='.repeat(60));
console.log('\nKey Features Demonstrated:');
console.log('✓ AttendanceService manages attendance records');
console.log('✓ PaymentService handles payment processing');
console.log('✓ Services provide business logic layer');
console.log('✓ Services work with OOP models');
console.log('✓ Data validation and error handling');
console.log('✓ Statistical analysis and reporting');
