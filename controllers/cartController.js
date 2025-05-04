const Cart = require("../models/cart_items");
const Product = require("../models/product");

// Add to cart
const addToCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  try {
  
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }


    let cart = await Cart.findOne({ userId });

    if (cart) {
    
      const itemIndex = cart.products.findIndex((p) => p.productId.equals(productId));
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    } else {
      
      cart = new Cart({
        userId,
        products: [{ productId, quantity }]
      });
      await cart.save();
    }

    
    res.status(200).json({ success: true, message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getCart = async (req, res) => {
  const { renterId } = req.params;
  try {
    const cart = await Cart.findOne({ userId: renterId }).populate("products.productId");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    cart.products = cart.products.filter(
      (item) => !item.productId.equals(productId)
    );
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.products.find((item) =>
      item.productId.equals(productId)
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const clearCart = async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({ success: false, message: "Cart not found" });

    cart.products = [];
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
  clearCart,
};
