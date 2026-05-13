class Payment {
  #paymentId;
  #parentId;
  #studentId;
  #amount;
  #status;
  #createdAt;
  #processedAt;

  constructor(paymentId, parentId, studentId, amount) {
    this.#paymentId = paymentId;
    this.#parentId = parentId;
    this.#studentId = studentId;
    this.#amount = amount;
    this.#status = 'Pending';
    this.#createdAt = new Date();
    this.#processedAt = null;
  }

  getPaymentId() {
    return this.#paymentId;
  }

  getParentId() {
    return this.#parentId;
  }

  getStudentId() {
    return this.#studentId;
  }

  getAmount() {
    return this.#amount;
  }

  getStatus() {
    return this.#status;
  }

  getCreatedAt() {
    return this.#createdAt;
  }

  getProcessedAt() {
    return this.#processedAt;
  }

  processPayment() {
    if (this.#status === 'Paid') {
      return {
        success: false,
        message: 'Payment already processed'
      };
    }

    this.#status = 'Paid';
    this.#processedAt = new Date();
    return {
      success: true,
      message: 'Payment processed successfully',
      paymentId: this.#paymentId,
      amount: this.#amount,
      processedAt: this.#processedAt.toISOString()
    };
  }

  generateReceipt() {
    return {
      paymentId: this.#paymentId,
      parentId: this.#parentId,
      studentId: this.#studentId,
      amount: this.#amount,
      status: this.#status,
      createdAt: this.#createdAt.toISOString(),
      processedAt: this.#processedAt ? this.#processedAt.toISOString() : null,
      receiptDate: new Date().toISOString()
    };
  }

  cancelPayment() {
    if (this.#status === 'Paid') {
      return {
        success: false,
        message: 'Cannot cancel a paid payment'
      };
    }

    this.#status = 'Cancelled';
    return {
      success: true,
      message: 'Payment cancelled successfully'
    };
  }

  toString() {
    return `Payment - ID: ${this.#paymentId}, Parent: ${this.#parentId}, Student: ${this.#studentId}, Amount: ${this.#amount}, Status: ${this.#status}`;
  }
}

module.exports = Payment;
