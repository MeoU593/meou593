const express = require('express');
const { createPayment, checkPaymentStatus } = require('../../Controllers/client/payment.controller');

const router = express.Router();

// Tạo giao dịch thanh toán
router.post('/create', createPayment);

// Kiểm tra trạng thái thanh toán
router.get('/status/:paymentId', checkPaymentStatus);

module.exports = router;
