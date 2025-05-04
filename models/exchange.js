// backend/models/exchange.js

const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  offeredProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestStatus: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
  swapStatus: { type: String, enum: ['Pending', 'Shipped', 'Returned'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Exchange', exchangeSchema);
