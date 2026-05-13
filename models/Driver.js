const User = require('./User');

class Driver extends User {
  #assignedBus;

  constructor(id, name, email) {
    super(id, name, email);
    this.#assignedBus = null;
  }

  getAssignedBus() {
    return this.#assignedBus;
  }

  setAssignedBus(bus) {
    this.#assignedBus = bus;
    return true;
  }

  hasBusAssigned() {
    return this.#assignedBus !== null;
  }

  viewStudents() {
    if (!this.#assignedBus) {
      return {
        success: false,
        message: 'No bus assigned',
        students: []
      };
    }

    const students = this.#assignedBus.getStudents();
    return {
      success: true,
      busId: this.#assignedBus.getBusId(),
      studentCount: students.length,
      students: students.map(student => ({
        id: student.getId(),
        name: student.getName(),
        school: student.getSchool(),
        morningStatus: student.getMorningStatus(),
        afternoonStatus: student.getAfternoonStatus()
      }))
    };
  }

  updateBusLocation(latitude, longitude) {
    if (!this.#assignedBus) {
      return {
        success: false,
        message: 'No bus assigned'
      };
    }

    const result = this.#assignedBus.updateLocation(latitude, longitude);
    return {
      success: true,
      ...result
    };
  }

  getBusStatus() {
    if (!this.#assignedBus) {
      return {
        success: false,
        message: 'No bus assigned'
      };
    }

    return {
      success: true,
      busStatus: this.#assignedBus.getBusStatus()
    };
  }

  toString() {
    const busInfo = this.#assignedBus ? this.#assignedBus.getBusId() : 'None';
    return `${super.toString()} - Assigned Bus: ${busInfo}`;
  }
}

module.exports = Driver;
