/**
 * AttendanceService
 * Handles all attendance-related business logic
 * Manages marking, tracking, and validating attendance records
 */

class AttendanceService {
  #attendanceRecords;

  constructor() {
    this.#attendanceRecords = [];
  }

  /**
   * Mark attendance for a student
   * @param {string} studentId - Student ID
   * @param {string} parentId - Parent ID
   * @param {boolean} morningStatus - Morning attendance (true = present, false = absent)
   * @param {boolean} afternoonStatus - Afternoon attendance (true = present, false = absent)
   * @returns {Object} - Result of marking attendance
   */
  markAttendance(studentId, parentId, morningStatus, afternoonStatus) {
    // Validate inputs
    if (!studentId || !parentId) {
      return {
        success: false,
        message: 'Student ID and Parent ID are required',
        code: 'INVALID_INPUT'
      };
    }

    if (typeof morningStatus !== 'boolean' || typeof afternoonStatus !== 'boolean') {
      return {
        success: false,
        message: 'Attendance status must be boolean values',
        code: 'INVALID_STATUS'
      };
    }

    // Check if attendance already marked for this student today
    const today = new Date().toDateString();
    const existingRecord = this.#attendanceRecords.find(
      record => record.studentId === studentId &&
                 new Date(record.timestamp).toDateString() === today
    );

    if (existingRecord) {
      // Update existing record
      existingRecord.morningStatus = morningStatus;
      existingRecord.afternoonStatus = afternoonStatus;
      existingRecord.timestamp = new Date();
      existingRecord.updatedAt = new Date();

      return {
        success: true,
        message: 'Attendance updated successfully',
        code: 'ATTENDANCE_UPDATED',
        record: this.#formatAttendanceRecord(existingRecord)
      };
    }

    // Create new attendance record
    const attendanceRecord = {
      recordId: this.#generateRecordId(),
      studentId,
      parentId,
      morningStatus,
      afternoonStatus,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: null
    };

    this.#attendanceRecords.push(attendanceRecord);

    return {
      success: true,
      message: 'Attendance marked successfully',
      code: 'ATTENDANCE_MARKED',
      record: this.#formatAttendanceRecord(attendanceRecord)
    };
  }

  /**
   * Get attendance record for a specific student
   * @param {string} studentId - Student ID
   * @returns {Object|null} - Attendance record or null
   */
  getStudentAttendance(studentId) {
    if (!studentId) {
      return null;
    }

    const today = new Date().toDateString();
    const record = this.#attendanceRecords.find(
      r => r.studentId === studentId &&
           new Date(r.timestamp).toDateString() === today
    );

    return record ? this.#formatAttendanceRecord(record) : null;
  }

  /**
   * Get all attendance records for a parent's children
   * @param {string} parentId - Parent ID
   * @returns {Array} - List of attendance records
   */
  getParentChildrenAttendance(parentId) {
    if (!parentId) {
      return [];
    }

    const today = new Date().toDateString();
    const records = this.#attendanceRecords.filter(
      r => r.parentId === parentId &&
           new Date(r.timestamp).toDateString() === today
    );

    return records.map(record => this.#formatAttendanceRecord(record));
  }

  /**
   * Get attendance history for a student (last N days)
   * @param {string} studentId - Student ID
   * @param {number} days - Number of past days to retrieve (default: 7)
   * @returns {Array} - Attendance history
   */
  getStudentAttendanceHistory(studentId, days = 7) {
    if (!studentId || days < 1) {
      return [];
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const records = this.#attendanceRecords.filter(
      r => r.studentId === studentId && new Date(r.timestamp) >= cutoffDate
    );

    return records.map(record => this.#formatAttendanceRecord(record));
  }

  /**
   * Get attendance statistics for a student
   * @param {string} studentId - Student ID
   * @param {number} days - Number of past days for statistics (default: 30)
   * @returns {Object} - Attendance statistics
   */
  getAttendanceStats(studentId, days = 30) {
    if (!studentId) {
      return null;
    }

    const history = this.getStudentAttendanceHistory(studentId, days);

    if (history.length === 0) {
      return {
        studentId,
        totalDays: 0,
        presentMornings: 0,
        absentMornings: 0,
        presentAfternoons: 0,
        absentAfternoons: 0,
        morningAttendanceRate: 0,
        afternoonAttendanceRate: 0,
        overallAttendanceRate: 0
      };
    }

    const stats = {
      studentId,
      totalDays: history.length,
      presentMornings: 0,
      absentMornings: 0,
      presentAfternoons: 0,
      absentAfternoons: 0,
      morningAttendanceRate: 0,
      afternoonAttendanceRate: 0,
      overallAttendanceRate: 0
    };

    history.forEach(record => {
      if (record.morningStatus === true) stats.presentMornings++;
      if (record.morningStatus === false) stats.absentMornings++;
      if (record.afternoonStatus === true) stats.presentAfternoons++;
      if (record.afternoonStatus === false) stats.absentAfternoons++;
    });

    // Calculate rates
    const totalMornings = stats.presentMornings + stats.absentMornings;
    const totalAfternoons = stats.presentAfternoons + stats.absentAfternoons;

    stats.morningAttendanceRate = totalMornings > 0
      ? Math.round((stats.presentMornings / totalMornings) * 100)
      : 0;

    stats.afternoonAttendanceRate = totalAfternoons > 0
      ? Math.round((stats.presentAfternoons / totalAfternoons) * 100)
      : 0;

    stats.overallAttendanceRate = Math.round(
      ((stats.presentMornings + stats.presentAfternoons) /
       (totalMornings + totalAfternoons)) * 100
    );

    return stats;
  }

  /**
   * Generate attendance report for all students in a class/batch
   * @param {Array} studentIds - Array of student IDs
   * @param {number} days - Number of past days for report
   * @returns {Array} - Attendance reports for each student
   */
  generateAttendanceReport(studentIds, days = 30) {
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return [];
    }

    return studentIds.map(studentId => this.getAttendanceStats(studentId, days));
  }

  /**
   * Get all attendance records (currently stored)
   * @returns {Array} - All attendance records
   */
  getAllAttendanceRecords() {
    return this.#attendanceRecords.map(record => this.#formatAttendanceRecord(record));
  }

  /**
   * Clear old attendance records (older than specified days)
   * @param {number} days - Age threshold in days
   * @returns {Object} - Clear operation result
   */
  clearOldRecords(days = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const initialLength = this.#attendanceRecords.length;
    this.#attendanceRecords = this.#attendanceRecords.filter(
      record => new Date(record.timestamp) >= cutoffDate
    );

    return {
      success: true,
      message: `Cleared ${initialLength - this.#attendanceRecords.length} old records`,
      recordsRemaining: this.#attendanceRecords.length
    };
  }

  // Private helper methods

  /**
   * Generate unique record ID
   * @returns {string} - Record ID
   */
  #generateRecordId() {
    return `REC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format attendance record for output
   * @param {Object} record - Raw record
   * @returns {Object} - Formatted record
   */
  #formatAttendanceRecord(record) {
    return {
      recordId: record.recordId,
      studentId: record.studentId,
      parentId: record.parentId,
      morningStatus: record.morningStatus,
      afternoonStatus: record.afternoonStatus,
      date: new Date(record.timestamp).toISOString().split('T')[0],
      timestamp: record.timestamp.toISOString(),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt ? record.updatedAt.toISOString() : null
    };
  }
}

module.exports = AttendanceService;
