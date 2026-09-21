const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createPickup,
  getMyPickups,
  getPickupById,
  updatePickupStatus,
} = require("../controllers/pickupController");

const router = express.Router();

// Create pickup
router.post("/", protect, createPickup);

// Get logged-in user's pickups
router.get("/", protect, getMyPickups);

// Get one pickup
router.get("/:id", protect, getPickupById);

// Update status
router.patch("/:id/status", protect, updatePickupStatus);

module.exports = router;