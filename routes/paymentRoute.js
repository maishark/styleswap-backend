const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// Process payment
router.post('/process', PaymentController.processPayment);

// Get payment details for an order
router.get('/details/:orderId', PaymentController.getPaymentDetails);

module.exports = router;