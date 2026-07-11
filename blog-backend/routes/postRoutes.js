const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getComments,
  toggleBookmark,
  getPostsByGenre,
} = require("../controllers/postController");

/* ================= STATIC ROUTES ================= */

// My posts
router.get("/my", verifyToken, getMyPosts);

// Genre filter
router.get("/genre/:genre", verifyToken, getPostsByGenre);

/* ================= POSTS ================= */

// All posts
router.get("/", getAllPosts);

// Create post (admin only handled in controller)
router.post("/", verifyToken, createPost);

// Update
router.put("/:id", verifyToken, updatePost);

// Delete
router.delete("/:id", verifyToken, deletePost);

/* ================= INTERACTIONS ================= */

// Like
router.post("/:id/like", verifyToken, toggleLike);

// Bookmark
router.post("/:id/bookmark", verifyToken, toggleBookmark);

// Comments
router.post("/:id/comment", verifyToken, addComment);
router.get("/:id/comments", getComments);

module.exports = router;