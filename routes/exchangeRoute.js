// backend/routes/exchangeRoute.js

const express = require('express');
const router = express.Router();
const ExchangeController = require('../controllers/exchangeController');

// Send an exchange request
router.post('/request', ExchangeController.sendExchangeRequest);

// Get all received requests for owner
router.get('/received/:ownerId', ExchangeController.getReceivedRequests);

// Get all sent requests by a user
router.get('/sent/:userId', ExchangeController.getSentRequests);

// Accept or Decline an exchange request
router.patch('/status', ExchangeController.updateRequestStatus);

// Update swap status (Pending ➔ Shipped ➔ Returned)
router.patch('/swap-status', ExchangeController.updateSwapStatus);

module.exports = router;
