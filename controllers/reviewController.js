const Review = require("../models/review");

const addReview = async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    const newReview = new Review({
      productId,
      userId,
      rating,
      comment,
      userName,
    });

    await newReview.save();

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

const getAllReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate("userId", "name");

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
};

const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update review" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete review" });
  }
};

module.exports = {
  addReview,
  getAllReviewsForProduct,
  editReview,
  deleteReview,
};
