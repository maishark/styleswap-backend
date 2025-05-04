const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/wishlistController");

router.post("/add", WishlistController.addToWishlist);
router.get("/:userId", WishlistController.getWishlist);
router.post("/remove", WishlistController.removeFromWishlist);

module.exports = router;
