const Order = require('../models/order');
const Cart = require('../models/cart_items');
const Product = require('../models/product');


const placeOrderFromCart = async (req, res) => {
  const { userId } = req.body;  

  try {
    
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    
    const orders = [];
    for (let item of cart.products) {
      const product = item.productId;  
      const order = new Order({
        user: userId,
        product: product._id,
        owner: product.ownerId,  
        duration: parseInt(product.duration?.toString().split(" ")[0]) || 7,
  
        rentedAt: new Date(),
        status: 'Pending',
      });

      // Save the order
      const savedOrder = await order.save();
      orders.push(savedOrder);  
    }

   //clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: 'Orders placed successfully', orders });
  } catch (err) {
    res.status(500).json({ message: 'Error placing orders', error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate({
        path: 'product',
        populate: {
          path: 'ownerId', 
          model: 'User', 
        },
      });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders for user', error: err.message });
  }
};




const getOrdersForOwner = async (req, res) => {
  const ownerId = req.params.ownerId;

  try {
    
    const orders = await Order.find({ owner: ownerId })
      .populate('product') 
      .populate('user', 'name email');  

    res.json(orders);  
  } catch (err) {
    res.status(500).json({ message: 'Error fetching owner orders', error: err.message });
  }
};


const updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body; 

  if (!orderId || !newStatus) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    
    if (!['Shipped', 'Returned'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    
    order.status = newStatus;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};

module.exports = {
  placeOrderFromCart,
  getUserOrders,
  getOrdersForOwner,
  updateOrderStatus,
};

const sendEmail = require("../utils/sendEmail");