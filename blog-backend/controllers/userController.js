const User = require("../models/User");
const Bookmark = require("../models/Bookmark");
const Post = require("../models/Post");
const Follower = require("../models/Follower");
const multer = require("multer");
const path = require("path");

/* =========================================
   MULTER CONFIG
========================================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

/* =========================================
   GET FULL PROFILE
========================================= */
async function getProfile(req, res, next) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("username bio profile_picture");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmarks = await Bookmark.find({ user_id: userId })
      .populate({
        path: "post_id",
        select: "title content",
      });

    const bookmarkedPoems = bookmarks.map((b) => b.post_id);

    res.json({
      ...user.toObject(),
      bookmarked_poems: bookmarkedPoems,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================
   UPDATE PROFILE
========================================= */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const bio = req.body.bio || "";

    console.log("UPDATE PROFILE — userId:", userId);
    console.log("UPDATE PROFILE — bio:", bio);
    console.log("UPDATE PROFILE — file:", req.file);

    if (req.file) {
      const profilePicture = `/uploads/${req.file.filename}`;
      await User.findByIdAndUpdate(userId, { bio, profile_picture: profilePicture });
    } else {
      await User.findByIdAndUpdate(userId, { bio });
    }

    res.json({ success: true, message: "Profile updated ✨" });
  } catch (error) {
    next(error);
  }
}

/* =========================================
   FOLLOW USER
========================================= */
async function followUser(req, res, next) {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const newFollower = new Follower({
      follower_id: followerId,
      following_id: followingId,
    });

    await newFollower.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/* =========================================
   UNFOLLOW USER
========================================= */
async function unfollowUser(req, res, next) {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    await Follower.deleteOne({
      follower_id: followerId,
      following_id: followingId,
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/* =========================================
   EXPORT
========================================= */
module.exports = {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  upload,
};