class Student {
  #id;
  #name;
  #school;
  #morningStatus;
  #afternoonStatus;

  constructor(id, name, school) {
    this.#id = id;
    this.#name = name;
    this.#school = school;
    this.#morningStatus = null;
    this.#afternoonStatus = null;
  }

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getSchool() {
    return this.#school;
  }

  getMorningStatus() {
    return this.#morningStatus;
  }

  getAfternoonStatus() {
    return this.#afternoonStatus;
  }

  setMorningStatus(status) {
    if (typeof status === 'boolean') {
      this.#morningStatus = status;
      return true;
    }
    return false;
  }

  setAfternoonStatus(status) {
    if (typeof status === 'boolean') {
      this.#afternoonStatus = status;
      return true;
    }
    return false;
  }

  getAttendanceStatus() {
    return {
      studentId: this.#id,
      studentName: this.#name,
      morning: this.#morningStatus,
      afternoon: this.#afternoonStatus
    };
  }

  toString() {
    return `Student - ID: ${this.#id}, Name: ${this.#name}, School: ${this.#school}`;
  }
}

module.exports = Student;
