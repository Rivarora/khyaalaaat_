const Post = require("../models/Post");
const Like = require("../models/Like");
const Bookmark = require("../models/Bookmark");
const Comment = require("../models/Comment");
const User = require("../models/User");

/* ================= CREATE POST ================= */

async function createPost(req, res, next) {
  try {
    const { title, content, genre } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only the poet can publish poems",
      });
    }

    if (!title || !content || !genre) {
      return res.status(400).json({
        message: "Title, content and genre required",
      });
    }

    const newPost = new Post({
      title,
      content,
      genre,
      user_id: req.user.id,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Poem published ✨",
    });
  } catch (error) {
    next(error);
  }
}

/* ================= GET ALL POSTS ================= */

async function getAllPosts(req, res, next) {
  try {
    const posts = await Post.find()
      .populate("user_id", "username email profile_picture")
      .sort({ createdAt: -1 });

    // Add likes and comments count
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post_id: post._id });
        const commentsCount = await Comment.countDocuments({ post_id: post._id });
        return {
          ...post.toObject(),
          likes_count: likesCount,
          comments_count: commentsCount,
        };
      })
    );

    res.json({
      success: true,
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
}

/* ================= GET POSTS BY GENRE ================= */

async function getPostsByGenre(req, res, next) {
  try {
    const genre = req.params.genre;

    const posts = await Post.find({ genre })
      .populate("user_id", "username email profile_picture")
      .sort({ createdAt: -1 });

    // Add likes and comments count
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post_id: post._id });
        const commentsCount = await Comment.countDocuments({ post_id: post._id });
        return {
          ...post.toObject(),
          likes_count: likesCount,
          comments_count: commentsCount,
        };
      })
    );

    res.json({
      success: true,
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
}

/* ================= GET MY POSTS ================= */

async function getMyPosts(req, res, next) {
  try {
    const userId = req.user.id;

    const posts = await Post.find({ user_id: userId })
      .populate("user_id", "username email profile_picture")
      .sort({ createdAt: -1 });

    // Add likes and comments count
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post_id: post._id });
        const commentsCount = await Comment.countDocuments({ post_id: post._id });
        return {
          ...post.toObject(),
          likes_count: likesCount,
          comments_count: commentsCount,
        };
      })
    );

    res.json({
      success: true,
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
}

/* ================= UPDATE POST ================= */

async function updatePost(req, res, next) {
  try {
    const postId = req.params.id;
    const { title, content, genre } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only the poet can edit poems",
      });
    }

    await Post.findByIdAndUpdate(postId, { title, content, genre });

    res.json({
      success: true,
      message: "Poem updated ✨",
    });
  } catch (error) {
    next(error);
  }
}

/* ================= DELETE POST ================= */

async function deletePost(req, res, next) {
  try {
    const postId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only the poet can delete poems",
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      success: true,
      message: "Poem deleted 🖤",
    });
  } catch (error) {
    next(error);
  }
}

/* ================= TOGGLE LIKE ================= */

async function toggleLike(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const existingLike = await Like.findOne({
      user_id: userId,
      post_id: postId,
    });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      return res.json({ liked: false });
    } else {
      // Like
      const newLike = new Like({
        user_id: userId,
        post_id: postId,
      });
      await newLike.save();
      return res.json({ liked: true });
    }
  } catch (error) {
    next(error);
  }
}

/* ================= TOGGLE BOOKMARK ================= */

async function toggleBookmark(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const existingBookmark = await Bookmark.findOne({
      user_id: userId,
      post_id: postId,
    });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      return res.json({ saved: false });
    } else {
      // Add bookmark
      const newBookmark = new Bookmark({
        user_id: userId,
        post_id: postId,
      });
      await newBookmark.save();
      return res.json({ saved: true });
    }
  } catch (error) {
    next(error);
  }
}

/* ================= ADD COMMENT ================= */

async function addComment(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { content } = req.body;

    const newComment = new Comment({
      user_id: userId,
      post_id: postId,
      content,
    });

    await newComment.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

/* ================= GET COMMENTS ================= */

async function getComments(req, res, next) {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post_id: postId })
      .populate("user_id", "username email profile_picture")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
}

/* ================= EXPORT ================= */

module.exports = {
  createPost,
  getAllPosts,
  getPostsByGenre,
  getMyPosts,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  addComment,
  getComments,
};