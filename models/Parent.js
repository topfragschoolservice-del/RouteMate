const User = require('./User');

class Parent extends User {
  #children;

  constructor(id, name, email) {
    super(id, name, email);
    this.#children = [];
  }

  getChildren() {
    return [...this.#children];
  }

  addChild(student) {
    if (!this.#children.find(child => child.getId() === student.getId())) {
      this.#children.push(student);
      return true;
    }
    return false;
  }

  removeChild(studentId) {
    const index = this.#children.findIndex(child => child.getId() === studentId);
    if (index !== -1) {
      this.#children.splice(index, 1);
      return true;
    }
    return false;
  }

  markAttendance(studentId, morningStatus, afternoonStatus) {
    const student = this.#children.find(child => child.getId() === studentId);
    if (!student) {
      return { success: false, message: 'Student not found' };
    }

    const morningSet = student.setMorningStatus(morningStatus);
    const afternoonSet = student.setAfternoonStatus(afternoonStatus);

    if (morningSet || afternoonSet) {
      return {
        success: true,
        message: 'Attendance marked successfully',
        attendance: student.getAttendanceStatus()
      };
    }

    return { success: false, message: 'Invalid status values' };
  }

  makePayment(studentId, amount) {
    const student = this.#children.find(child => child.getId() === studentId);
    if (!student) {
      return { success: false, message: 'Student not found' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Invalid payment amount' };
    }

    return {
      success: true,
      message: 'Payment processed successfully',
      studentId: studentId,
      amount: amount,
      paymentDate: new Date().toISOString()
    };
  }

  getChildrenAttendance() {
    return this.#children.map(child => child.getAttendanceStatus());
  }

  toString() {
    return `${super.toString()} - Children Count: ${this.#children.length}`;
  }
}

module.exports = Parent;
