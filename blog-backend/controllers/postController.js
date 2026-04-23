const db = require("../config/db.js");

/* ================= CREATE POST ================= */

function createPost(req, res) {
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

  db.query(
    "INSERT INTO posts (title, content, genre, user_id) VALUES (?, ?, ?, ?)",
    [title, content, genre, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        success: true,
        message: "Poem published ✨",
      });
    }
  );
}

/* ================= GET ALL POSTS ================= */

function getAllPosts(req, res) {
  db.query(
    `
    SELECT 
      p.*,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
    FROM posts p
    ORDER BY p.id DESC
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        success: true,
        posts: results,
      });
    }
  );
}

/* ================= GET POSTS BY GENRE ================= */

function getPostsByGenre(req, res) {
  const genre = req.params.genre;

  db.query(
    `
    SELECT 
      p.*,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
    FROM posts p
    WHERE p.genre = ?
    ORDER BY p.id DESC
    `,
    [genre],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
        console.log("RAW POSTS:", JSON.stringify(posts, null, 2));
console.log("ACTIVE GENRE:", activeGenre);
      }
       
      res.json({
        success: true,
        posts: results,
      });
    }
  );
}

/* ================= GET MY POSTS ================= */

function getMyPosts(req, res) {
  const userId = req.user.id;

  db.query(
    `
    SELECT 
      p.*,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
    FROM posts p
    WHERE p.user_id = ?
    ORDER BY p.id DESC
    `,
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      res.json({
        success: true,
        posts: results,
      });
    }
  );
}

/* ================= UPDATE POST ================= */

function updatePost(req, res) {
  const postId = req.params.id;
  const { title, content, genre } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only the poet can edit poems",
    });
  }

  db.query(
    "UPDATE posts SET title = ?, content = ?, genre = ? WHERE id = ?",
    [title, content, genre, postId],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        success: true,
        message: "Poem updated ✨",
      });
    }
  );
}

/* ================= DELETE POST ================= */

function deletePost(req, res) {
  const postId = req.params.id;

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only the poet can delete poems",
    });
  }

  db.query(
    "DELETE FROM posts WHERE id = ?",
    [postId],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        success: true,
        message: "Poem deleted 🖤",
      });
    }
  );
}

/* ================= TOGGLE LIKE ================= */

function toggleLike(req, res) {
  const userId = req.user.id;
  const postId = req.params.id;

  db.query(
    "SELECT id FROM likes WHERE user_id = ? AND post_id = ?",
    [userId, postId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        // Unlike
        db.query(
          "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
          [userId, postId],
          (err) => {
            if (err) {
              return res.status(500).json({ message: "Unlike failed" });
            }

            return res.json({ liked: false });
          }
        );
      } else {
        // Like
        db.query(
          "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
          [userId, postId],
          (err) => {
            if (err) {
              return res.status(500).json({ message: "Like failed" });
            }

            return res.json({ liked: true });
          }
        );
      }
    }
  );
}

/* ================= TOGGLE BOOKMARK ================= */

function toggleBookmark(req, res) {
  const userId = req.user.id;
  const postId = req.params.id;

  db.query(
    "SELECT id FROM bookmarks WHERE user_id = ? AND post_id = ?",
    [userId, postId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        // Remove bookmark
        db.query(
          "DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?",
          [userId, postId],
          () => {
            res.json({ saved: false });
          }
        );
      } else {
        // Add bookmark
        db.query(
          "INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)",
          [userId, postId],
          () => {
            res.json({ saved: true });
          }
        );
      }
    }
  );
}

/* ================= ADD COMMENT ================= */

function addComment(req, res) {
  const userId = req.user.id;
  const postId = req.params.id;
  const { content } = req.body;

  db.query(
    "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)",
    [userId, postId, content],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Comment failed" });
      }

      res.json({ success: true });
    }
  );
}

/* ================= GET COMMENTS ================= */

function getComments(req, res) {
  const postId = req.params.id;

  db.query(
    `
    SELECT comments.*, users.username 
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE post_id = ? 
    ORDER BY created_at DESC
    `,
    [postId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json(results);
    }
  );
}

/* ================= EXPORT ================= */

module.exports = {
  createPost,
  getAllPosts,
  getPostsByGenre, // ✅ NEW
  getMyPosts,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  addComment,
  getComments,
};