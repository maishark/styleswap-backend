// backend/models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  condition: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },

  ownerId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = product;
