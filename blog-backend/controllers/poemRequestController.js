const PoemRequest = require("../models/poemRequestModel");

async function createRequest(req, res, next) {
  try {
    const { mood, theme } = req.body;

    if (!mood || !theme) {
      return res.status(400).json({ message: "mood and theme are required" });
    }

    const newRequest = new PoemRequest({
      user_id: req.user.id,
      mood: mood.trim(),
      theme: theme.trim(),
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Poem request created successfully",
    });
  } catch (error) {
    console.error("CREATE POEM REQUEST ERROR:", error);
    next(error);
  }
}

async function getMyRequests(req, res, next) {
  try {
    const requests = await PoemRequest.find({ user_id: req.user.id })
      .populate("user_id", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("GET MY REQUESTS ERROR:", error);
    next(error);
  }
}

async function getAllRequests(req, res, next) {
  try {
    const requests = await PoemRequest.find()
      .populate("user_id", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("GET ALL REQUESTS ERROR:", error);
    next(error);
  }
}

async function getRequestById(req, res, next) {
  try {
    const request = await PoemRequest.findById(req.params.id)
      .populate("user_id", "username email");

    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }

    return res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("GET REQUEST BY ID ERROR:", error);
    next(error);
  }
}

async function replyRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText || !replyText.trim()) {
      return res.status(400).json({ message: "replyText is required" });
    }

    const request = await PoemRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }

    await PoemRequest.findByIdAndUpdate(id, {
      reply_text: replyText.trim(),
      status: "completed",
      replied_at: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Reply submitted successfully",
    });
  } catch (error) {
    console.error("REPLY REQUEST ERROR:", error);
    next(error);
  }
}

async function deleteMyRequest(req, res, next) {
  try {
    const { id } = req.params;
    const request = await PoemRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }

    if (request.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this request" });
    }

    await PoemRequest.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Request deleted" });
  } catch (error) {
    console.error("DELETE MY REQUEST ERROR:", error);
    next(error);
  }
}

async function removeReply(req, res, next) {
  try {
    const { id } = req.params;
    const request = await PoemRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }

    await PoemRequest.findByIdAndUpdate(id, {
      reply_text: null,
      status: "pending",
      replied_at: null,
    });

    return res.status(200).json({ success: true, message: "Reply removed" });
  } catch (error) {
    console.error("REMOVE REPLY ERROR:", error);
    next(error);
  }
}

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  replyRequest,
  deleteMyRequest,
  removeReply,
};
