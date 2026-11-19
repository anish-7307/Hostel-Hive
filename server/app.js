const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const studentPortalRoutes = require("./routes/studentPortalRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

dotenv.config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      const configuredOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
      const isLocalDevelopmentOrigin = process.env.NODE_ENV !== "production"
        && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");

      if (!origin || origin === configuredOrigin || isLocalDevelopmentOrigin) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/student", studentPortalRoutes);
app.use("/api/owner", ownerRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Hostel Management System API");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hostel Management API is running",
    database: mongoose.connection.readyState===1
      ? "connected"
      : "disconnected",
  });
});

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error);
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with the same unique value already exists.",
    });
  }
  res.status(500).json({
    success: false,
    message: "The server could not complete the request.",
  });
});

module.exports = app;