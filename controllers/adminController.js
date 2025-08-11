const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/product");
const User = require("../models/user");

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.isAdmin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, "secret-key", { expiresIn: "1d" });

    res.json({ token, user: admin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const banUser = async (req, res) => {
    const { userId, duration } = req.body;
    const bannedUntil = getBanEndTime(duration);
  
    try {
      await User.findByIdAndUpdate(userId, {
        bannedUntil,
        isBanned: true  // ✅ NOW WE SET THIS
      });
      res.status(200).send("User banned");
    } catch (error) {
      res.status(500).json({ message: "Ban failed", error: error.message });
    }
  };
  

// Calculate ban expiration date based on short or long format
const getBanEndTime = (duration) => {
    const now = new Date();
    switch (duration) {
      case "1 day":
      case "1d":
        return new Date(now.setDate(now.getDate() + 1));
      case "1 week":
      case "1w":
        return new Date(now.setDate(now.getDate() + 7));
      case "1 month":
      case "1m":
        return new Date(now.setMonth(now.getMonth() + 1));
      case "1 year":
      case "1y":
        return new Date(now.setFullYear(now.getFullYear() + 1));
      case "permanent":
      default:
        return null; // Means permanent ban
    }
  };
  

// Remove a product post
const removePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await Product.findByIdAndDelete(postId);
    if (!result) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getBannedUsers = async (req, res) => {
    try {
      const now = new Date();
      const users = await User.find({
        $or: [
          { isBanned: true, bannedUntil: null }, // Permanent ban
          { bannedUntil: { $gt: now } }          // Temporary ban still active
        ]
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch banned users" });
    }
  };
  
  

// Unban a user
const unbanUser = async (req, res) => {
    try {
      const { userId } = req.body;
      await User.findByIdAndUpdate(userId, {
        bannedUntil: null,
        isBanned: false, // ✅ This is what was missing
      });
      res.status(200).send("User unbanned");
    } catch (err) {
      res.status(500).json({ error: "Failed to unban user" });
    }
  };
  

module.exports = {
  loginAdmin,
  banUser,
  removePost,
  getBannedUsers,
  unbanUser,
};
