const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: 'thisIsMySuperSecretKey123',
    resave: false,
    saveUninitialized: true,
  })
);

// Move this to a separate async function, but export `app` immediately.
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected Successfully!");

    // Test routes
    app.get("/", (req, res) => {
      res.send("StyleSwap server is running!");
    });

    app.get("/cloth", (req, res) => {
      res.send("Cloth path is running");
    });

    // Routes
    const productRoutes = require("./routes/productRoute");
    const userRoutes = require("./routes/userRoute");
    const cartRoutes = require("./routes/cartRoute");
    const wishlistRoutes = require("./routes/wishlistRoute");
    const orderRoutes = require("./routes/orderRoute");
    const exchangeRoutes = require("./routes/exchangeRoute");
    const paymentRoutes = require("./routes/paymentRoute");
    const reviewRoutes = require("./routes/reviewRoute");
    const adminRoutes = require("./routes/adminRoute");

    app.use("/api/orders", orderRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/wishlist", wishlistRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/exchanges", exchangeRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/admin", adminRoutes);
  } catch (err) {
    console.error("Server error:", err);
  }
})();

module.exports = app;
