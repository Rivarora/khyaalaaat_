const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  upload,
} = require("../controllers/userController");

/* ================= PROFILE ================= */

// GET PROFILE
router.get("/:id", verifyToken, getProfile);

// UPDATE PROFILE (with image)
router.put("/:id", verifyToken, upload.single("profile_picture"), updateProfile);

/* ================= FOLLOW SYSTEM ================= */

router.post("/:id/follow", verifyToken, followUser);
router.delete("/:id/unfollow", verifyToken, unfollowUser);

module.exports = router;