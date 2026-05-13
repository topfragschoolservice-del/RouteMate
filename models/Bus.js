const Location = require('./Location');

class Bus {
  #busId;
  #driver;
  #students;
  #currentLocation;

  constructor(busId, driver, initialLocation = null) {
    this.#busId = busId;
    this.#driver = driver;
    this.#students = [];
    this.#currentLocation = initialLocation || new Location(0, 0);
  }

  getBusId() {
    return this.#busId;
  }

  getDriver() {
    return this.#driver;
  }

  setDriver(driver) {
    this.#driver = driver;
  }

  getStudents() {
    return [...this.#students];
  }

  getStudentCount() {
    return this.#students.length;
  }

  getCurrentLocation() {
    return this.#currentLocation;
  }

  addStudent(student) {
    if (!this.#students.find(s => s.getId() === student.getId())) {
      this.#students.push(student);
      return true;
    }
    return false;
  }

  removeStudent(studentId) {
    const index = this.#students.findIndex(s => s.getId() === studentId);
    if (index !== -1) {
      this.#students.splice(index, 1);
      return true;
    }
    return false;
  }

  updateLocation(latitude, longitude) {
    this.#currentLocation.updateLocation(latitude, longitude);
    return {
      busId: this.#busId,
      location: this.#currentLocation.toString(),
      updatedAt: new Date().toISOString()
    };
  }

  getLocationDetails() {
    return {
      latitude: this.#currentLocation.getLatitude(),
      longitude: this.#currentLocation.getLongitude()
    };
  }

  getBusStatus() {
    return {
      busId: this.#busId,
      driverName: this.#driver.getName(),
      studentCount: this.#students.length,
      studentNames: this.#students.map(s => s.getName()),
      currentLocation: this.#currentLocation.toString()
    };
  }

  toString() {
    return `Bus - ID: ${this.#busId}, Driver: ${this.#driver.getName()}, Students: ${this.#students.length}, Location: ${this.#currentLocation.toString()}`;
  }
}

module.exports = Bus;
