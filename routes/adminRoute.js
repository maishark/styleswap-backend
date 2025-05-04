const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  banUser,
  removePost,
  getBannedUsers,
  unbanUser,
} = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.post("/ban-user", banUser);
router.delete("/remove-post/:postId", removePost);
router.get("/dashboard", getBannedUsers);
router.post("/unban-user", unbanUser);

module.exports = router;
