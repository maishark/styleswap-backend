const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Admin schema to store admin user data
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },  // Admin flag set to true for all admin users
}, { timestamps: true });

// Hash password before saving admin user
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create Admin model from schema
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
