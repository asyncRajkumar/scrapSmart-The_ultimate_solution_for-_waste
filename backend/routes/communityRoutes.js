const express = require("express");
const mongoose = require("mongoose");

const protect = require("../middleware/authMiddleware");
const Pickup = require("../models/Pickup");

const router = express.Router();

/* =========================================================
   COLLECTOR SCHEMA
   ========================================================= */

const collectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "Bhubaneswar",
    },

    address: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    totalPickups: {
      type: Number,
      default: 0,
    },

    materials: {
      type: [String],
      default: [],
    },

    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },

    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   REWARD WALLET SCHEMA
   ========================================================= */

const rewardWalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    points: {
      type: Number,
      default: 0,
    },

    lifetimePoints: {
      type: Number,
      default: 0,
    },

    redeemedPoints: {
      type: Number,
      default: 0,
    },

    claimedCouponCodes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   MONGOOSE MODELS
   ========================================================= */

const Collector =
  mongoose.models.ScrapSmartCollector ||
  mongoose.model(
    "ScrapSmartCollector",
    collectorSchema
  );

const RewardWallet =
  mongoose.models.ScrapSmartRewardWallet ||
  mongoose.model(
    "ScrapSmartRewardWallet",
    rewardWalletSchema
  );


/* =========================================================
   DEMO COLLECTORS
   ========================================================= */

const DEFAULT_COLLECTORS = [
  {
    name: "Sanjay Kumar",
    businessName: "GreenCycle Scrap",
    phone: "9876543210",
    city: "Bhubaneswar",
    address: "Tamando, Bhubaneswar",
    latitude: 20.2382,
    longitude: 85.7542,
    rating: 4.8,
    totalPickups: 214,
    materials: [
      "Paper",
      "Plastic",
      "Metal",
      "E-waste",
    ],
    availability: "available",
    verified: true,
  },

  {
    name: "Rakesh Sahu",
    businessName: "EcoRide Collectors",
    phone: "9123456780",
    city: "Bhubaneswar",
    address: "Patia, Bhubaneswar",
    latitude: 20.3548,
    longitude: 85.8192,
    rating: 4.7,
    totalPickups: 176,
    materials: [
      "Paper",
      "Plastic",
      "Cardboard",
    ],
    availability: "available",
    verified: true,
  },

  {
    name: "Manoj Das",
    businessName: "CleanLoop Recycling",
    phone: "9012345678",
    city: "Bhubaneswar",
    address: "Khandagiri, Bhubaneswar",
    latitude: 20.2644,
    longitude: 85.7765,
    rating: 4.6,
    totalPickups: 149,
    materials: [
      "Metal",
      "Plastic",
      "Paper",
    ],
    availability: "busy",
    verified: true,
  },

  {
    name: "Bikash Behera",
    businessName: "Urban Scrap Hub",
    phone: "9988776655",
    city: "Bhubaneswar",
    address: "Sahid Nagar, Bhubaneswar",
    latitude: 20.2898,
    longitude: 85.8453,
    rating: 4.5,
    totalPickups: 121,
    materials: [
      "Metal",
      "E-waste",
      "Plastic",
    ],
    availability: "available",
    verified: true,
  },

  {
    name: "Pratap Rout",
    businessName: "GreenBin Recyclers",
    phone: "9090909090",
    city: "Bhubaneswar",
    address: "Chandrasekharpur, Bhubaneswar",
    latitude: 20.3336,
    longitude: 85.8189,
    rating: 4.7,
    totalPickups: 198,
    materials: [
      "Paper",
      "Cardboard",
      "Plastic",
      "Metal",
    ],
    availability: "available",
    verified: true,
  },

  {
    name: "Arun Mohanty",
    businessName: "EcoSmart Scrap Point",
    phone: "9333333333",
    city: "Bhubaneswar",
    address: "Old Town, Bhubaneswar",
    latitude: 20.2444,
    longitude: 85.8339,
    rating: 4.4,
    totalPickups: 97,
    materials: [
      "Metal",
      "Paper",
      "E-waste",
    ],
    availability: "offline",
    verified: true,
  },
];


/* =========================================================
   SEED COLLECTORS
   ========================================================= */

async function seedCollectors() {
  try {
    const count = await Collector.countDocuments();

    if (count === 0) {
      await Collector.insertMany(
        DEFAULT_COLLECTORS
      );

      console.log(
        "ScrapSmart collectors seeded successfully"
      );
    }
  } catch (error) {
    console.error(
      "Collector seed error:",
      error.message
    );
  }
}


/* =========================================================
   DISTANCE HELPERS
   ========================================================= */

const toRadians = (value) => {
  return (Number(value) * Math.PI) / 180;
};


function distanceKm(
  lat1,
  lng1,
  lat2,
  lng2
) {
  const earthRadius = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}


function round(value, decimals = 1) {
  const power = 10 ** decimals;

  return (
    Math.round(value * power) /
    power
  );
}


/* =========================================================
   REWARD COUPONS
   ========================================================= */

const COUPONS = [
  {
    code: "GREEN50",
    title: "Green Boost",
    description:
      "Extra reward value on your next successful pickup.",
    points: 100,
    value: "₹50 bonus",
    icon: "leaf",
  },

  {
    code: "RECYCLE100",
    title: "Recycle Champion",
    description:
      "Unlock a ₹100 reward after earning enough points.",
    points: 200,
    value: "₹100 bonus",
    icon: "trophy",
  },

  {
    code: "ECO250",
    title: "Eco Saver",
    description:
      "A premium reward for consistent recycling activity.",
    points: 500,
    value: "₹250 bonus",
    icon: "sparkles",
  },
];


/* =========================================================
   GET /api/community/rewards
   ========================================================= */

async function getOrCreateWallet(userId) {
  let wallet =
    await RewardWallet.findOne({
      user: userId,
    });

  if (!wallet) {
    wallet =
      await RewardWallet.create({
        user: userId,
      });
  }

  return wallet;
}


async function syncRewardPoints(userId) {
  const completedPickups =
    await Pickup.find({
      user: userId,
      status: "completed",
    }).select(
      "finalWeight createdAt"
    );

  /*
   * ScrapSmart reward rule:
   *
   * 100 points per completed pickup
   * +
   * 5 points per final kilogram
   */

  const calculatedLifetimePoints =
    completedPickups.reduce(
      (total, pickup) => {
        const pickupPoints = 100;

        const weightPoints =
          Number(pickup.finalWeight) > 0
            ? Math.floor(
                Number(
                  pickup.finalWeight
                )
              ) * 5
            : 0;

        return (
          total +
          pickupPoints +
          weightPoints
        );
      },
      0
    );

  const wallet =
    await getOrCreateWallet(userId);

  const earnedBeforeRedemption =
    Math.max(
      wallet.lifetimePoints,
      calculatedLifetimePoints
    );

  const newBalance = Math.max(
    0,
    earnedBeforeRedemption -
      wallet.redeemedPoints
  );

  wallet.lifetimePoints =
    earnedBeforeRedemption;

  wallet.points = newBalance;

  await wallet.save();

  return {
    wallet,
    completedPickups,
  };
}


/* =========================================================
   NEARBY COLLECTORS
   GET /api/community/collectors
   ========================================================= */

router.get(
  "/collectors",
  protect,
  async (req, res) => {
    try {
      await seedCollectors();

      const userLat = Number(
        req.query.lat ?? 20.2961
      );

      const userLng = Number(
        req.query.lng ?? 85.8245
      );

      const radius = Math.min(
        Math.max(
          Number(
            req.query.radius ?? 10
          ),
          1
        ),
        50
      );

      if (
        !Number.isFinite(userLat) ||
        !Number.isFinite(userLng)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid latitude and longitude are required",
        });
      }

      const collectors =
        await Collector.find().lean();

      const nearby =
        collectors
          .map((collector) => ({
            ...collector,

            distanceKm: round(
              distanceKm(
                userLat,
                userLng,
                collector.latitude,
                collector.longitude
              ),
              1
            ),
          }))
          .filter(
            (collector) =>
              collector.distanceKm <=
              radius
          )
          .sort(
            (a, b) =>
              a.distanceKm -
              b.distanceKm
          );

      return res.status(200).json({
        success: true,

        center: {
          latitude: userLat,
          longitude: userLng,
        },

        radiusKm: radius,

        count: nearby.length,

        collectors: nearby,
      });
    } catch (error) {
      console.error(
        "Nearby collectors error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load nearby collectors",
      });
    }
  }
);


/* =========================================================
   GET REWARDS
   GET /api/community/rewards
   ========================================================= */

router.get(
  "/rewards",
  protect,
  async (req, res) => {
    try {
      const {
        wallet,
        completedPickups,
      } = await syncRewardPoints(
        req.user.userId
      );

      const claimed = new Set(
        wallet.claimedCouponCodes || []
      );

      const coupons =
        COUPONS.map((coupon) => ({
          ...coupon,

          claimed:
            claimed.has(
              coupon.code
            ),

          canRedeem:
            !claimed.has(
              coupon.code
            ) &&
            wallet.points >=
              coupon.points,
        }));

      return res.status(200).json({
        success: true,

        rewards: {
          points: wallet.points,

          lifetimePoints:
            wallet.lifetimePoints,

          redeemedPoints:
            wallet.redeemedPoints,

          completedPickups:
            completedPickups.length,

          coupons,
        },

        earningRules: [
          "100 points for every completed pickup",
          "5 bonus points for every final kilogram recorded",
        ],
      });
    } catch (error) {
      console.error(
        "Rewards fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load rewards",
      });
    }
  }
);


/* =========================================================
   REDEEM REWARD
   POST /api/community/rewards/redeem
   ========================================================= */

router.post(
  "/rewards/redeem",
  protect,
  async (req, res) => {
    try {
      const couponCode =
        String(
          req.body.couponCode || ""
        )
          .trim()
          .toUpperCase();

      const coupon =
        COUPONS.find(
          (item) =>
            item.code ===
            couponCode
        );

      if (!coupon) {
        return res.status(404).json({
          success: false,
          message:
            "Coupon code not found",
        });
      }

      const { wallet } =
        await syncRewardPoints(
          req.user.userId
        );

      if (
        wallet.claimedCouponCodes.includes(
          coupon.code
        )
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This reward has already been claimed",
        });
      }

      if (
        wallet.points <
        coupon.points
      ) {
        return res.status(400).json({
          success: false,
          message: `You need ${coupon.points} points to claim this reward`,
        });
      }

      wallet.points -=
        coupon.points;

      wallet.redeemedPoints +=
        coupon.points;

      wallet.claimedCouponCodes.push(
        coupon.code
      );

      await wallet.save();

      return res.status(200).json({
        success: true,

        message: `${coupon.code} claimed successfully`,

        coupon: {
          ...coupon,
          claimed: true,
          canRedeem: false,
        },

        points: wallet.points,
      });
    } catch (error) {
      console.error(
        "Reward redeem error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to redeem reward",
      });
    }
  }
);


/* =========================================================
   INITIAL SEED
   ========================================================= */

setTimeout(
  seedCollectors,
  1000
);


/* =========================================================
   EXPORT
   ========================================================= */

module.exports = router;