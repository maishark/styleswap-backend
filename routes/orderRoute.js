const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Place order
router.post('/place-order', OrderController.placeOrderFromCart);

// Fetch orders for products owned by the user
router.get('/owner/:ownerId', OrderController.getOrdersForOwner);

// Fetch orders placed by the user
router.get('/user/:userId', OrderController.getUserOrders);

// Update order status
router.put('/update-status', OrderController.updateOrderStatus);

module.exports = router;
