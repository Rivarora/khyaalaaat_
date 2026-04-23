const db = require("../config/db");
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
function getProfile(req, res) {
  const userId = req.params.id;

  db.query(
    `SELECT id, username, bio, profile_picture FROM users WHERE id = ?`,
    [userId],
    (err, userResult) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (userResult.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = userResult[0];

      db.query(
        `
        SELECT p.id, p.title, p.content
        FROM bookmarks b
        JOIN posts p ON b.post_id = p.id
        WHERE b.user_id = ?
        ORDER BY p.id DESC
        `,
        [userId],
        (err, bookmarkedPoems) => {
          if (err) return res.status(500).json({ message: "Database error" });

          res.json({
            ...user,
            bookmarked_poems: bookmarkedPoems,
          });
        }
      );
    }
  );
}

/* =========================================
   UPDATE PROFILE
========================================= */
function updateProfile(req, res) {
  const userId = req.user.id;
  const bio = req.body.bio || "";

  console.log("UPDATE PROFILE — userId:", userId);
  console.log("UPDATE PROFILE — bio:", bio);
  console.log("UPDATE PROFILE — file:", req.file);

  if (req.file) {
    const profilePicture = `/uploads/${req.file.filename}`;
    db.query(
      "UPDATE users SET bio = ?, profile_picture = ? WHERE id = ?",
      [bio, profilePicture, userId],
      (err) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ message: "Update failed" });
        }
        res.json({ success: true, message: "Profile updated ✨" });
      }
    );
  } else {
    db.query(
      "UPDATE users SET bio = ? WHERE id = ?",
      [bio, userId],
      (err) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ message: "Update failed" });
        }
        res.json({ success: true, message: "Profile updated ✨" });
      }
    );
  }
}

/* =========================================
   FOLLOW USER
========================================= */
function followUser(req, res) {
  const followerId = req.user.id;
  const followingId = req.params.id;

  if (followerId == followingId)
    return res.status(400).json({ message: "Cannot follow yourself" });

  db.query(
    "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)",
    [followerId, followingId],
    (err) => {
      if (err) return res.status(500).json({ message: "Follow failed" });
      res.json({ success: true });
    }
  );
}

/* =========================================
   UNFOLLOW USER
========================================= */
function unfollowUser(req, res) {
  const followerId = req.user.id;
  const followingId = req.params.id;

  db.query(
    "DELETE FROM followers WHERE follower_id = ? AND following_id = ?",
    [followerId, followingId],
    (err) => {
      if (err) return res.status(500).json({ message: "Unfollow failed" });
      res.json({ success: true });
    }
  );
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