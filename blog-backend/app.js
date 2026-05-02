require("dotenv").config();
const morgan = require("morgan");

const express = require("express");

const connectDB = require("./config/db.js");

// Connect to MongoDB
connectDB();

const app = express();
const cors = require("cors");

// 🔥 Body parser MUST come first
app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || "https://khyaalaaat-1.onrender.com")
      .split(",")
      .map((url) => url.trim()),
    credentials: true,
  })
);

// Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const poemRequestRoutes = require("./routes/poemRequestRoutes");
const adminPoemRoutes = require("./routes/adminPoemRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const apiLimiter = require("./middleware/rateLimit");
const userRoutes = require("./routes/userRoutes");

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/poems", poemRequestRoutes);
app.use("/api/admin/poems", adminPoemRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);
app.use("/api", apiLimiter);

// Simple test route
app.post("/test", (req, res) => {
    console.log("TEST BODY:", req.body);
    res.json(req.body);
});

// Home route
app.get("/", (req, res) => {
    res.send("Backend working 🔥");
});

module.exports = app;
