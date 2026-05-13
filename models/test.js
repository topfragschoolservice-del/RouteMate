// Test file to demonstrate OOP model functionality
// This file demonstrates that all classes work correctly with inheritance, encapsulation, and composition

const { User, Parent, Driver, Student, Bus, Payment, Location } = require('./index');

console.log('=== RouteMate OOP Models Test ===\n');

// 1. Create Location
const busLocation = new Location(40.7128, -74.0060);
console.log('Location:', busLocation.toString());

// 2. Create Student instances
const student1 = new Student('S001', 'Ali Ahmed', 'Central School');
const student2 = new Student('S002', 'Zainab Khan', 'Central School');
const student3 = new Student('S003', 'Hassan Ali', 'East School');
console.log('\nStudents Created:');
console.log('- ', student1.toString());
console.log('- ', student2.toString());
console.log('- ', student3.toString());

// 3. Create User (Base Class - can be abstract)
const user = new User('U001', 'John Doe', 'john@example.com');
console.log('\nBase User:', user.toString());
console.log('Login:', user.login());

// 4. Create Parent (Inheritance - extends User)
const parent1 = new Parent('P001', 'Amina Hassan', 'amina@example.com');
parent1.addChild(student1);
parent1.addChild(student2);
console.log('\nParent Created:', parent1.toString());
console.log('Children Count:', parent1.getChildren().length);

// 5. Mark Attendance (Parent functionality)
const attendance = parent1.markAttendance('S001', true, false);
console.log('Attendance Marked:', attendance);

// 6. Make Payment (Parent functionality)
const payment = parent1.makePayment('S001', 5000);
console.log('Payment Made:', payment);

// 7. Create Driver (Inheritance - extends User)
const driver1 = new Driver('D001', 'Khalid Mohammed', 'khalid@example.com');
console.log('\nDriver Created:', driver1.toString());
console.log('Bus Assigned:', driver1.hasBusAssigned());

// 8. Create Bus (Composition - contains Location and Students)
const bus1 = new Bus('BUS001', driver1, busLocation);
driver1.setAssignedBus(bus1);

// Add students to bus
bus1.addStudent(student1);
bus1.addStudent(student2);
bus1.addStudent(student3);
console.log('Bus Created:', bus1.toString());

// 9. Driver views students
const studentList = driver1.viewStudents();
console.log('\nDriver View Students:', studentList);

// 10. Update Bus Location
const locationUpdate = driver1.updateBusLocation(40.7580, -73.9855);
console.log('Location Updated:', locationUpdate);

// 11. Get Bus Status
const busStatus = driver1.getBusStatus();
console.log('Bus Status:', busStatus);

// 12. Create Payment instances
const payment1 = new Payment('PAY001', 'P001', 'S001', 5000);
const payment2 = new Payment('PAY002', 'P001', 'S002', 5000);
console.log('\nPayments Created:');
console.log('- ', payment1.toString());
console.log('- ', payment2.toString());

// 13. Process Payment
const processResult = payment1.processPayment();
console.log('Payment Processed:', processResult);

// 14. Generate Receipt
const receipt = payment1.generateReceipt();
console.log('Receipt Generated:', receipt);

console.log('\n=== OOP Principles Demonstrated ===');
console.log('✓ Encapsulation: Private fields (#) with getters/setters');
console.log('✓ Inheritance: Parent and Driver extend User');
console.log('✓ Composition: Bus contains Location and Students');
console.log('✓ Polymorphism: Each class overrides toString()');
