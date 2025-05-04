const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware"); 


router.get("/all-products", ProductController.getAllProducts);


router.get("/view-product/:id", ProductController.getProductById);


router.post("/add-product", auth, ProductController.addProduct);

module.exports = router;
