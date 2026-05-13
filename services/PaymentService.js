/**
 * PaymentService
 * Handles all payment-related business logic
 * Manages payment processing, tracking, and receipt generation
 */

class PaymentService {
  #payments;
  #paymentTransactions;

  constructor() {
    this.#payments = [];
    this.#paymentTransactions = [];
  }

  /**
   * Create and process a payment
   * @param {string} parentId - Parent ID
   * @param {string} studentId - Student ID
   * @param {number} amount - Payment amount
   * @returns {Object} - Payment result
   */
  makePayment(parentId, studentId, amount) {
    // Validate inputs
    if (!parentId || !studentId) {
      return {
        success: false,
        message: 'Parent ID and Student ID are required',
        code: 'INVALID_INPUT'
      };
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return {
        success: false,
        message: 'Amount must be a positive number',
        code: 'INVALID_AMOUNT'
      };
    }

    // Create payment object
    const paymentId = this.#generatePaymentId();
    const payment = {
      paymentId,
      parentId,
      studentId,
      amount,
      status: 'Pending',
      createdAt: new Date(),
      processedAt: null,
      receipt: null
    };

    // Simulate payment processing (in real system, this would integrate with payment gateway)
    const processResult = this.#simulatePaymentProcessing(payment);

    if (processResult.success) {
      payment.status = 'Paid';
      payment.processedAt = new Date();
    } else {
      payment.status = 'Failed';
    }

    this.#payments.push(payment);

    // Record transaction
    this.#recordTransaction({
      transactionId: this.#generateTransactionId(),
      paymentId,
      parentId,
      studentId,
      amount,
      status: payment.status,
      timestamp: new Date()
    });

    return {
      success: processResult.success,
      message: processResult.message,
      code: processResult.code,
      paymentId,
      amount,
      status: payment.status,
      processedAt: payment.processedAt ? payment.processedAt.toISOString() : null
    };
  }

  /**
   * Get payment status
   * @param {string} paymentId - Payment ID
   * @returns {Object|null} - Payment details or null
   */
  getPaymentStatus(paymentId) {
    if (!paymentId) {
      return null;
    }

    const payment = this.#payments.find(p => p.paymentId === paymentId);
    return payment ? this.#formatPayment(payment) : null;
  }

  /**
   * Get all payments for a parent
   * @param {string} parentId - Parent ID
   * @param {string} filter - Filter by status: 'all', 'paid', 'pending', 'failed'
   * @returns {Array} - List of payments
   */
  getParentPayments(parentId, filter = 'all') {
    if (!parentId) {
      return [];
    }

    let payments = this.#payments.filter(p => p.parentId === parentId);

    if (filter !== 'all') {
      payments = payments.filter(p => p.status.toLowerCase() === filter.toLowerCase());
    }

    return payments.map(payment => this.#formatPayment(payment));
  }

  /**
   * Get payment history for a student
   * @param {string} studentId - Student ID
   * @param {number} limit - Maximum number of records to return
   * @returns {Array} - Payment history
   */
  getStudentPaymentHistory(studentId, limit = 10) {
    if (!studentId) {
      return [];
    }

    const payments = this.#payments
      .filter(p => p.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return payments.map(payment => this.#formatPayment(payment));
  }

  /**
   * Generate receipt for a payment
   * @param {string} paymentId - Payment ID
   * @returns {Object|null} - Receipt or null
   */
  generateReceipt(paymentId) {
    if (!paymentId) {
      return null;
    }

    const payment = this.#payments.find(p => p.paymentId === paymentId);
    if (!payment) {
      return null;
    }

    if (payment.status !== 'Paid') {
      return {
        success: false,
        message: 'Receipt can only be generated for paid payments',
        code: 'INVALID_STATUS'
      };
    }

    const receipt = {
      receiptId: this.#generateReceiptId(),
      paymentId,
      parentId: payment.parentId,
      studentId: payment.studentId,
      amount: payment.amount,
      paymentDate: payment.createdAt.toISOString(),
      processedDate: payment.processedAt.toISOString(),
      receiptGeneratedAt: new Date().toISOString(),
      status: 'Paid'
    };

    payment.receipt = receipt;

    return {
      success: true,
      message: 'Receipt generated successfully',
      code: 'RECEIPT_GENERATED',
      receipt
    };
  }

  /**
   * Get all receipts for a parent
   * @param {string} parentId - Parent ID
   * @returns {Array} - List of receipts
   */
  getParentReceipts(parentId) {
    if (!parentId) {
      return [];
    }

    const receipts = this.#payments
      .filter(p => p.parentId === parentId && p.receipt)
      .map(p => p.receipt);

    return receipts;
  }

  /**
   * Cancel a pending payment
   * @param {string} paymentId - Payment ID
   * @returns {Object} - Cancellation result
   */
  cancelPayment(paymentId) {
    if (!paymentId) {
      return {
        success: false,
        message: 'Payment ID is required',
        code: 'INVALID_INPUT'
      };
    }

    const payment = this.#payments.find(p => p.paymentId === paymentId);
    if (!payment) {
      return {
        success: false,
        message: 'Payment not found',
        code: 'PAYMENT_NOT_FOUND'
      };
    }

    if (payment.status !== 'Pending') {
      return {
        success: false,
        message: `Cannot cancel ${payment.status} payment`,
        code: 'INVALID_STATUS'
      };
    }

    payment.status = 'Cancelled';
    return {
      success: true,
      message: 'Payment cancelled successfully',
      code: 'PAYMENT_CANCELLED',
      paymentId
    };
  }

  /**
   * Get payment statistics for a parent
   * @param {string} parentId - Parent ID
   * @returns {Object} - Payment statistics
   */
  getParentPaymentStats(parentId) {
    if (!parentId) {
      return null;
    }

    const payments = this.#payments.filter(p => p.parentId === parentId);

    if (payments.length === 0) {
      return {
        parentId,
        totalPayments: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        failedAmount: 0,
        successRate: 0
      };
    }

    const stats = {
      parentId,
      totalPayments: payments.length,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      failedAmount: 0,
      successRate: 0
    };

    payments.forEach(payment => {
      stats.totalAmount += payment.amount;
      if (payment.status === 'Paid') {
        stats.paidAmount += payment.amount;
      } else if (payment.status === 'Pending') {
        stats.pendingAmount += payment.amount;
      } else if (payment.status === 'Failed') {
        stats.failedAmount += payment.amount;
      }
    });

    stats.successRate = Math.round((stats.paidAmount / stats.totalAmount) * 100);

    return stats;
  }

  /**
   * Get transaction history
   * @param {string} parentId - Filter by parent ID (optional)
   * @param {number} limit - Maximum records to return
   * @returns {Array} - Transaction history
   */
  getTransactionHistory(parentId = null, limit = 50) {
    let transactions = this.#paymentTransactions;

    if (parentId) {
      transactions = transactions.filter(t => t.parentId === parentId);
    }

    return transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get all payments (for admin/dashboard)
   * @returns {Array} - All payments
   */
  getAllPayments() {
    return this.#payments.map(payment => this.#formatPayment(payment));
  }

  /**
   * Get revenue summary
   * @returns {Object} - Revenue statistics
   */
  getRevenueSummary() {
    return {
      totalPayments: this.#payments.length,
      totalRevenue: this.#payments
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: this.#payments
        .filter(p => p.status === 'Pending')
        .reduce((sum, p) => sum + p.amount, 0),
      failedAmount: this.#payments
        .filter(p => p.status === 'Failed')
        .reduce((sum, p) => sum + p.amount, 0),
      successfulPayments: this.#payments.filter(p => p.status === 'Paid').length,
      failedPayments: this.#payments.filter(p => p.status === 'Failed').length,
      pendingPayments: this.#payments.filter(p => p.status === 'Pending').length
    };
  }

  // Private helper methods

  /**
   * Simulate payment processing
   * @param {Object} payment - Payment object
   * @returns {Object} - Processing result
   */
  #simulatePaymentProcessing(payment) {
    // Simulate 90% success rate for payment processing
    const randomValue = Math.random();

    if (randomValue < 0.9) {
      return {
        success: true,
        message: 'Payment processed successfully',
        code: 'PAYMENT_SUCCESS'
      };
    } else {
      return {
        success: false,
        message: 'Payment processing failed',
        code: 'PAYMENT_FAILED'
      };
    }
  }

  /**
   * Generate unique payment ID
   * @returns {string} - Payment ID
   */
  #generatePaymentId() {
    return `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique transaction ID
   * @returns {string} - Transaction ID
   */
  #generateTransactionId() {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique receipt ID
   * @returns {string} - Receipt ID
   */
  #generateReceiptId() {
    return `RCP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Record a transaction
   * @param {Object} transaction - Transaction object
   */
  #recordTransaction(transaction) {
    this.#paymentTransactions.push(transaction);
  }

  /**
   * Format payment for output
   * @param {Object} payment - Payment object
   * @returns {Object} - Formatted payment
   */
  #formatPayment(payment) {
    return {
      paymentId: payment.paymentId,
      parentId: payment.parentId,
      studentId: payment.studentId,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
      processedAt: payment.processedAt ? payment.processedAt.toISOString() : null
    };
  }
}

module.exports = PaymentService;
