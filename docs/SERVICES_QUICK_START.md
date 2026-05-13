# Member 3 Services - Quick Start Guide

This guide shows how to use `AttendanceService` and `PaymentService` in your code.

---

## 📦 Import the Services

```javascript
// Option 1: Import both from index
const { AttendanceService, PaymentService } = require("./services");

// Option 2: Import individual files
const AttendanceService = require("./services/AttendanceService");
const PaymentService = require("./services/PaymentService");
```

---

## 🎯 Initialize Services

```javascript
const attendanceService = new AttendanceService();
const paymentService = new PaymentService();
```

---

## 📝 AttendanceService Examples

### Mark Attendance

```javascript
const result = attendanceService.markAttendance(
  "S001", // studentId
  "P001", // parentId
  true, // morningStatus (present)
  true, // afternoonStatus (present)
);

console.log(result);
// {
//   success: true,
//   message: 'Attendance marked successfully',
//   code: 'ATTENDANCE_MARKED',
//   record: { ... }
// }
```

### Get Student's Today Attendance

```javascript
const attendance = attendanceService.getStudentAttendance("S001");
console.log(attendance);
// {
//   recordId: 'REC_...',
//   studentId: 'S001',
//   morningStatus: true,
//   afternoonStatus: true,
//   date: '2026-05-13',
//   ...
// }
```

### Get All Children's Attendance (Parent View)

```javascript
const childrenAttendance =
  attendanceService.getParentChildrenAttendance("P001");
console.log(childrenAttendance);
// [
//   { studentId: 'S001', morningStatus: true, ... },
//   { studentId: 'S002', morningStatus: false, ... }
// ]
```

### Get Attendance History (Last 7 Days)

```javascript
const history = attendanceService.getStudentAttendanceHistory("S001", 7);
console.log(history);
// Array of attendance records from last 7 days
```

### Get Attendance Statistics

```javascript
const stats = attendanceService.getAttendanceStats("S001", 30);
console.log(stats);
// {
//   studentId: 'S001',
//   totalDays: 20,
//   presentMornings: 19,
//   absentMornings: 1,
//   presentAfternoons: 18,
//   absentAfternoons: 2,
//   morningAttendanceRate: 95,
//   afternoonAttendanceRate: 90,
//   overallAttendanceRate: 92
// }
```

### Generate Class Report

```javascript
const studentIds = ["S001", "S002", "S003"];
const reports = attendanceService.generateAttendanceReport(studentIds, 30);
console.log(reports);
// Array of statistics for each student in class
```

---

## 💳 PaymentService Examples

### Make Payment

```javascript
const payment = paymentService.makePayment(
  "P001", // parentId
  "S001", // studentId
  500, // amount
);

console.log(payment);
// {
//   success: true,
//   message: 'Payment processed successfully',
//   code: 'PAYMENT_SUCCESS',
//   paymentId: 'PAY_...',
//   amount: 500,
//   status: 'Paid',
//   processedAt: '2026-05-13T10:30:45.123Z'
// }
```

### Check Payment Status

```javascript
const status = paymentService.getPaymentStatus("PAY_1234567890_abc123");
console.log(status);
// {
//   paymentId: 'PAY_...',
//   parentId: 'P001',
//   studentId: 'S001',
//   amount: 500,
//   status: 'Paid',
//   ...
// }
```

### Get All Parent's Payments

```javascript
// Get all payments
const allPayments = paymentService.getParentPayments("P001");

// Get only paid payments
const paidPayments = paymentService.getParentPayments("P001", "paid");

// Get only pending payments
const pendingPayments = paymentService.getParentPayments("P001", "pending");

console.log(paidPayments);
// [
//   { paymentId: 'PAY_...', amount: 500, status: 'Paid', ... },
//   { paymentId: 'PAY_...', amount: 500, status: 'Paid', ... }
// ]
```

### Get Payment History for a Student

```javascript
const history = paymentService.getStudentPaymentHistory("S001", 10);
console.log(history);
// Last 10 payments for student S001
```

### Generate Receipt

```javascript
const receiptResult = paymentService.generateReceipt("PAY_1234567890_abc123");

if (receiptResult.success) {
  console.log(receiptResult.receipt);
  // {
  //   receiptId: 'RCP_...',
  //   paymentId: 'PAY_...',
  //   parentId: 'P001',
  //   amount: 500,
  //   paymentDate: '2026-05-13T10:30:45.123Z',
  //   ...
  // }
}
```

### Get All Receipts for Parent

```javascript
const receipts = paymentService.getParentReceipts("P001");
console.log(receipts);
// Array of all receipts for parent
```

### Cancel Pending Payment

```javascript
const cancelResult = paymentService.cancelPayment("PAY_1234567890_abc123");

if (cancelResult.success) {
  console.log("Payment cancelled");
} else {
  console.log(cancelResult.message);
  // 'Cannot cancel Paid payment'
}
```

### Get Payment Statistics

```javascript
const stats = paymentService.getParentPaymentStats("P001");
console.log(stats);
// {
//   parentId: 'P001',
//   totalPayments: 4,
//   totalAmount: 2000,
//   paidAmount: 2000,
//   pendingAmount: 0,
//   failedAmount: 0,
//   successRate: 100
// }
```

### Get Revenue Summary (For Admin)

```javascript
const revenue = paymentService.getRevenueSummary();
console.log(revenue);
// {
//   totalPayments: 50,
//   totalRevenue: 25000,
//   pendingAmount: 5000,
//   failedAmount: 0,
//   successfulPayments: 48,
//   failedPayments: 2,
//   pendingPayments: 0
// }
```

### Get Transaction History

```javascript
// Get all transactions
const allTransactions = paymentService.getTransactionHistory();

// Get transactions for specific parent
const parentTransactions = paymentService.getTransactionHistory("P001", 20);

console.log(parentTransactions);
// Last 20 transactions for parent P001
```

---

## ⚙️ Using Services in Express Routes

### Example: Mark Attendance Route

```javascript
const express = require("express");
const app = express();
const { AttendanceService } = require("./services");

const attendanceService = new AttendanceService();

app.post("/attendance", (req, res) => {
  const { studentId, parentId, morningStatus, afternoonStatus } = req.body;

  const result = attendanceService.markAttendance(
    studentId,
    parentId,
    morningStatus,
    afternoonStatus,
  );

  res.json(result);
});

app.get("/attendance/student/:studentId", (req, res) => {
  const attendance = attendanceService.getStudentAttendance(
    req.params.studentId,
  );

  if (attendance) {
    res.json({ success: true, data: attendance });
  } else {
    res.json({ success: false, message: "No attendance record found" });
  }
});
```

### Example: Payment Processing Route

```javascript
const { PaymentService } = require("./services");
const paymentService = new PaymentService();

app.post("/payment", (req, res) => {
  const { parentId, studentId, amount } = req.body;

  const result = paymentService.makePayment(parentId, studentId, amount);
  res.json(result);
});

app.get("/payment/:paymentId", (req, res) => {
  const status = paymentService.getPaymentStatus(req.params.paymentId);

  if (status) {
    res.json({ success: true, data: status });
  } else {
    res.json({ success: false, message: "Payment not found" });
  }
});

app.post("/payment/:paymentId/receipt", (req, res) => {
  const result = paymentService.generateReceipt(req.params.paymentId);
  res.json(result);
});

app.get("/payments/parent/:parentId", (req, res) => {
  const { filter } = req.query;
  const payments = paymentService.getParentPayments(
    req.params.parentId,
    filter,
  );
  res.json({ success: true, data: payments });
});
```

---

## 🔍 Error Handling

All methods return standardized responses:

```javascript
// Success response
{
  success: true,
  message: 'Operation successful',
  code: 'SUCCESS_CODE',
  [... additional data]
}

// Error response
{
  success: false,
  message: 'What went wrong',
  code: 'ERROR_CODE'
}
```

### Checking Results

```javascript
const result = attendanceService.markAttendance("S001", "P001", true, true);

if (result.success) {
  console.log("Success:", result.message);
  console.log("Record:", result.record);
} else {
  console.log("Error:", result.message);
  console.log("Code:", result.code);
}
```

---

## 📊 Response Examples

### Mark Attendance Success

```javascript
{
  success: true,
  message: 'Attendance marked successfully',
  code: 'ATTENDANCE_MARKED',
  record: {
    recordId: 'REC_1234567890_abc123',
    studentId: 'S001',
    parentId: 'P001',
    morningStatus: true,
    afternoonStatus: true,
    date: '2026-05-13',
    timestamp: '2026-05-13T10:30:45.123Z',
    createdAt: '2026-05-13T10:30:45.123Z',
    updatedAt: null
  }
}
```

### Payment Success

```javascript
{
  success: true,
  message: 'Payment processed successfully',
  code: 'PAYMENT_SUCCESS',
  paymentId: 'PAY_1234567890_abc123',
  amount: 500,
  status: 'Paid',
  processedAt: '2026-05-13T10:30:46.123Z'
}
```

### Error Response

```javascript
{
  success: false,
  message: 'Amount must be a positive number',
  code: 'INVALID_AMOUNT'
}
```

---

## 💡 Best Practices

1. **Always check `success` flag** before using returned data
2. **Handle error codes** for specific error scenarios
3. **Use services instead of direct model manipulation** for business logic
4. **Initialize services once** and reuse instances
5. **Pass appropriate parameters** - studentId, parentId, amounts, etc.
6. **Use filters** when querying for specific payment statuses

---

## 🧪 Testing

Run the test file to see all features in action:

```bash
npm test
# or
node services-test.js
```

---

## 📞 Support

If you have questions about:

- **Attendance Logic** → See `AttendanceService` documentation
- **Payment Processing** → See `PaymentService` documentation
- **Integration** → See `MEMBER3_SERVICES_DOCUMENTATION.md`
- **Full Report** → See `MEMBER3_COMPLETION_REPORT.md`

Happy coding! ✨
