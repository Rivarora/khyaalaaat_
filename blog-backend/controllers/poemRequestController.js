const poemRequestModel = require("../models/poemRequestModel");

async function createRequest(req, res) {
  try {
    const { title, mood, theme } = req.body;

    if (!title || !theme) {
      return res.status(400).json({ message: "title and theme are required" });
    }

    await poemRequestModel.createPoemRequest({
      userId: req.user.id,
      title: title.trim(),
      mood: mood?.trim(),
      theme: theme.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Poem request created successfully",
    });
  } catch (error) {
    console.error("CREATE POEM REQUEST ERROR:", error);
    return res.status(500).json({ message: "Failed to create poem request" });
  }
}

async function getMyRequests(req, res) {
  try {
    const requests = await poemRequestModel.getRequestsByUser(req.user.id);
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("GET MY REQUESTS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch your poem requests" });
  }
}

async function getAllRequests(req, res) {
  try {
    const requests = await poemRequestModel.getAllRequests();
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("GET ALL REQUESTS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch poem requests" });
  }
}

async function getRequestById(req, res) {
  try {
    const request = await poemRequestModel.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }
    return res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("GET REQUEST BY ID ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch poem request" });
  }
}

async function replyRequest(req, res) {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText || !replyText.trim()) {
      return res.status(400).json({ message: "replyText is required" });
    }

    const request = await poemRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }

    await poemRequestModel.replyToRequest({
      id,
      replyText: replyText.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Reply submitted successfully",
    });
  } catch (error) {
    console.error("REPLY REQUEST ERROR:", error);
    return res.status(500).json({ message: "Failed to reply to poem request" });
  }
}

async function deleteMyRequest(req, res) {
  try {
    const { id } = req.params;
    const request = await poemRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }
    if (Number(request.user_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Not allowed to delete this request" });
    }

    const result = await poemRequestModel.deleteRequestByUser({
      id,
      userId: req.user.id,
    });

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Poem request not found" });
    }

    return res.status(200).json({ success: true, message: "Request deleted" });
  } catch (error) {
    console.error("DELETE MY REQUEST ERROR:", error);
    return res.status(500).json({ message: "Failed to delete request" });
  }
}

async function removeReply(req, res) {
  try {
    const { id } = req.params;
    const request = await poemRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Poem request not found" });
    }

    await poemRequestModel.clearReply({ id });
    return res.status(200).json({ success: true, message: "Reply removed" });
  } catch (error) {
    console.error("REMOVE REPLY ERROR:", error);
    return res.status(500).json({ message: "Failed to remove reply" });
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
