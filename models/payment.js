const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true,
    default: () => `PMT-${Date.now()}`
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['bKash', 'Nagad', 'Card'] 
  },
  paymentDetails: {
    method: { 
      type: String, 
      required: true 
    },
    reference: { 
      type: String, 
      required: true 
    },
    cardHolderName: String,
    cardNumber: String,
    expiryDate: String,
    phoneNumber: String,
    date: { 
      type: Date, 
      default: Date.now 
    }
  },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Completed', 'Failed'] 
  }
}, { 
  timestamps: true 
});


const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
module.exports = Payment;