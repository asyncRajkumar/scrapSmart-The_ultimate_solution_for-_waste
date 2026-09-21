const Pickup = require("../models/Pickup");
const User = require("../models/User");

// Generate unique ScrapSmart request ID
const generateRequestId = async () => {
  let requestId;
  let exists = true;

  while (exists) {
    const random = Math.floor(1000 + Math.random() * 9000);

    requestId = `SS-${new Date().getFullYear()}-${random}`;

    exists = await Pickup.exists({ requestId });
  }

  return requestId;
};

// ==========================================
// CREATE PICKUP
// ==========================================
const createPickup = async (req, res) => {
  try {
    const {
      address,
      city,
      pincode,
      mobile,
      location,
      latitude,
      longitude,
      pickupDate,
      timeSlot,
      weightRange,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !address ||
      !city ||
      !pincode ||
      !mobile ||
      !pickupDate ||
      !timeSlot ||
      !weightRange
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required pickup details",
      });
    }

    // Get logged-in user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate request ID
    const requestId = await generateRequestId();

    // Create pickup
    const pickup = await Pickup.create({
      requestId,

      user: user._id,

      username: user.username,

      mobile,

      address,

      city,

      pincode,

      location: location || "",

      latitude:
        latitude !== "" && latitude !== undefined
          ? Number(latitude)
          : null,

      longitude:
        longitude !== "" && longitude !== undefined
          ? Number(longitude)
          : null,

      pickupDate,

      timeSlot,

      weightRange,

      notes: notes || "",

      status: "submitted",
    });

    res.status(201).json({
      success: true,
      message: "Pickup request created successfully",

      pickup: {
        id: pickup._id,
        requestId: pickup.requestId,
        username: pickup.username,
        mobile: pickup.mobile,
        address: pickup.address,
        city: pickup.city,
        pincode: pickup.pincode,
        location: pickup.location,
        latitude: pickup.latitude,
        longitude: pickup.longitude,
        pickupDate: pickup.pickupDate,
        timeSlot: pickup.timeSlot,
        weightRange: pickup.weightRange,
        notes: pickup.notes,
        status: pickup.status,
        createdAt: pickup.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Pickup Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating pickup",
    });
  }
};

// ==========================================
// GET ALL PICKUPS OF LOGGED-IN USER
// ==========================================
const getMyPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    console.error("Get Pickups Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching pickups",
    });
  }
};

// ==========================================
// GET SINGLE PICKUP
// ==========================================
const getPickupById = async (req, res) => {
  try {
    const pickup = await Pickup.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    res.status(200).json({
      success: true,
      pickup,
    });
  } catch (error) {
    console.error("Get Pickup Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching pickup",
    });
  }
};

// ==========================================
// UPDATE PICKUP STATUS
// ==========================================
const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "submitted",
      "finding_collector",
      "scheduled",
      "on_the_way",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup status",
      });
    }

    const pickup = await Pickup.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: "Pickup not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pickup status updated",
      pickup,
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating pickup",
    });
  }
};

module.exports = {
  createPickup,
  getMyPickups,
  getPickupById,
  updatePickupStatus,
};