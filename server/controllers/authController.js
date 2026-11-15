const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new user
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      studentId,
      email,
      phone,
      emergencyContact,
      password,
      course,
      year,
      college,
    } = req.body;

    // Check required fields
    if (!fullName || !email || !phone || !emergencyContact || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Login user
    const loginUser = async (req, res) => {
      try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: "Please enter email and password",
          });
        }

        // Find user by email
        const user = await User.findOne({
          email: email.toLowerCase(),
        });

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "Invalid email or password",
          });
        }

        // Check if account is active
        if (!user.isActive) {
          return res.status(403).json({
            success: false,
            message: "Your account is inactive",
          });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid email or password",
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" },
        );

        // Send response
        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        console.log("Login error:", error.message);

        res.status(500).json({
          success: false,
          message: "Something went wrong during login",
        });
      }
    };

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      studentId,
      email,
      phone,
      emergencyContact,
      password: hashedPassword,
      course,
      year,
      college,
      role: "student",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};

module.exports = { registerUser,loginUser };