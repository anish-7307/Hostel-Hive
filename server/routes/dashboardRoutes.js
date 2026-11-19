
const express = require("express");
const router = express.Router();

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Student dashboard
router.get(
  "/student",
  protect,
  authorize("student"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Student Dashboard",
      user: req.user,
    });
  }
);

// Warden dashboard
router.get(
  "/warden",
  protect,
  authorize("warden"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Warden Dashboard",
      user: req.user,
    });
  }
);

// Owner dashboard
router.get(
  "/owner",
  protect,
  authorize("owner"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Owner Dashboard",
      user: req.user,
    });
  }
);

module.exports = router;