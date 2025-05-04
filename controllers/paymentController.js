const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const { sendPaymentConfirmationEmail, sendOwnerNotificationEmail } = require('../utils/emailService');

// Process payment for an order
const processPayment = async (req, res) => {
  const { userId, orderId, amount, paymentMethod, paymentDetails } = req.body;

  try {
    // Get the order(s) - in this case, we're using the userId to get all pending orders
    const orders = await Order.find({ 
      user: userId, 
      status: 'Pending'
    })
    .populate('product')
    .populate({
      path: 'owner',
      select: 'name email'
    })
    .populate({
      path: 'user',
      select: 'name email'
    });
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No pending orders found for this user' 
      });
    }
    
    // Process each order - update status and send emails
    const processedOrders = [];
    
    for (const order of orders) {
      // Get product details
      const product = order.product;
      
      // Get owner details
      const owner = order.owner;
      
      // Get user details
      const user = order.user;
      
      // Update order with payment info
      order.paymentMethod = paymentMethod;
      order.paymentDetails = {
        amount: amount,
        method: paymentMethod,
        date: new Date(),
        // Don't store sensitive info like full card details or PINs in production!
        // Just store last 4 digits of card or phone number for reference
        reference: paymentMethod === 'Card' 
          ? `XXXX-XXXX-XXXX-${paymentDetails.cardNumber.slice(-4)}` 
          : paymentDetails.phoneNumber
      };
      
      await order.save();
      processedOrders.push(order);
      
      // Send emails using the new email service
      await sendPaymentConfirmationEmail(user, order, order.paymentDetails);
      await sendOwnerNotificationEmail(owner, order, user);
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      orderDetails: {
        orderId: processedOrders.map(order => order._id),
        products: processedOrders.map(order => ({
          name: order.product.name,
          price: order.product.price,
          duration: order.duration
        }))
      }
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process payment',
      error: error.message
    });
  }
};

// Get payment details for an order
const getPaymentDetails = async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const order = await Order.findById(orderId);
    
    if (!order || !order.paymentDetails) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment details not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      paymentDetails: order.paymentDetails
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get payment details',
      error: error.message
    });
  }
};

module.exports = {
  processPayment,
  getPaymentDetails
};