const express = require("express");
const router = express.Router();

const poemController = require("../controllers/poemRequestController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", verifyToken, authorizeRoles("admin"), poemController.getAllRequests);
router.get("/:id", verifyToken, authorizeRoles("admin"), poemController.getRequestById);
router.put("/:id/reply", verifyToken, authorizeRoles("admin"), poemController.replyRequest);
router.delete("/:id/reply", verifyToken, authorizeRoles("admin"), poemController.removeReply);

module.exports = router;
