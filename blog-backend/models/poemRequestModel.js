const mongoose = require("mongoose");

const poemRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    reply_text: {
      type: String,
      default: null,
    },
    replied_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PoemRequest", poemRequestSchema);
