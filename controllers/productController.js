const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("ownerId", "name email"); // Populate renterId with name and email of the renter

    res.status(200).json({
      success: true,
      data: products, //
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "No products found!" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "ownerId", 
      "name email"
    ); // Populate renterId to show the renter's info

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, size, color, gender, condition, image, price, duration } = req.body;

    // Check if all required fields are present
    if (!name || !size || !color || !gender || !condition || !image || !price || !duration) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      size,
      color,
      gender,
      condition,
      image,
      price,
      duration,
      ownerId: req.user._id,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


module.exports = {
  getProductById,
  getAllProducts,
  addProduct,
};
