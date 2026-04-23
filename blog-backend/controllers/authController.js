const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* =========================================
   REGISTER
========================================= */
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err) => {
        if (err) return next(new Error("Database error"));

        res.status(201).json({
          success: true,
          message: "User registered successfully",
        });
      }
    );
  } catch (error) {
    next(error);
  }
}

/* =========================================
   LOGIN
========================================= */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return next(new Error("Database error"));

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role || "user" },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
        });
      }
    );
  } catch (error) {
    next(error);
  }
}

/* =========================================
   EXPORT
========================================= */
module.exports = { register, login };