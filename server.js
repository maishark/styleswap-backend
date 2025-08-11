const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 1226;
// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: 'thisIsMySuperSecretKey123', resave: false, saveUninitialized: true }));
//async function main() {
/*  await mongoose.connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://abraralvee:ars242423@styleswap.ezzcs5q.mongodb.net/styleswap?retryWrites=true&w=majority&appName=StyleSwap"
  );*/



async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment variables!");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB Connected Successfully!");

    // ===== Basic test routes =====
    app.get("/", (req, res) => {
      res.send("StyleSwap server is running!");
    });

    app.get("/cloth", (req, res) => {
      res.send("Cloth path is running");
    });

    // ===== Routes =====
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

    // ===== Start server =====
    app.listen(port, () => {
      console.log(` Server listening on port ${port}`);
    });
  } catch (err) {
    console.error(" Server startup error:", err.message);
    process.exit(1); // Stop the process if DB connection fails
  }
}

main();
