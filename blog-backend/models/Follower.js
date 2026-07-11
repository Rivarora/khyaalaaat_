const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
  {
    follower_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure unique follow per user pair
followerSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

module.exports = mongoose.model("Follower", followerSchema);
