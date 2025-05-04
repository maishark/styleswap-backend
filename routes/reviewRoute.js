const express = require("express");
const router = express.Router();
const {
  addReview,
  getAllReviewsForProduct,
  editReview,
  deleteReview,
} = require("../controllers/reviewController");

// Route to Add a Review
router.post("/add", addReview);

// Route to Get All Reviews for a Product
router.get("/product/:productId", getAllReviewsForProduct);

// Route to Edit a Review
router.patch("/edit/:reviewId", editReview);

// Route to Delete a Review
router.delete("/delete/:reviewId", deleteReview);

module.exports = router;
