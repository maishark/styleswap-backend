const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");

router.post("/add", CartController.addToCart);
router.get("/:renterId", CartController.getCart);
router.post("/remove", CartController.removeFromCart);
router.post("/update", CartController.updateQuantity);
router.post("/clear", CartController.clearCart);

module.exports = router;
