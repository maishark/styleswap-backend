const Wishlist = require("../models/wishlist");

// Add to wishlist
const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      const exists = wishlist.items.some((item) =>
        item.productId.equals(productId)
      );
      if (!exists) wishlist.items.push({ productId });
      await wishlist.save();
    } else {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
      await wishlist.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get wishlist by userId
const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
    res.status(200).json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => !item.productId.equals(productId)
    );

    await wishlist.save();
    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
