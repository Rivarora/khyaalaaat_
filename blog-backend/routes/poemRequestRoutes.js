const express = require("express");
const router = express.Router();

// ✅ import full controller object (SAFE way)
const poemController = require("../controllers/poemRequestController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// USER ROUTES (require auth)
router.post("/", verifyToken, poemController.createRequest);
router.get("/my", verifyToken, poemController.getMyRequests);
router.delete("/my/:id", verifyToken, poemController.deleteMyRequest);

// ADMIN ROUTES (require auth and admin role)
router.get("/admin/all", verifyToken, authorizeRoles("admin"), poemController.getAllRequests);
router.put("/admin/:id/reply", verifyToken, authorizeRoles("admin"), poemController.replyRequest);

// Backward-compatible aliases for current frontend calls
router.post("/request", verifyToken, poemController.createRequest);
router.get("/my-requests", verifyToken, poemController.getMyRequests);
router.delete("/my-requests/:id", verifyToken, poemController.deleteMyRequest);
router.get("/all", verifyToken, authorizeRoles("admin"), poemController.getAllRequests);
router.put("/respond/:id", verifyToken, authorizeRoles("admin"), poemController.replyRequest);

module.exports = router;