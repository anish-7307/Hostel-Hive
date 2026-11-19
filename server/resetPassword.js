require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("student123", 10);

    const result = await User.updateOne(
      { email: "student@test.com" },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      console.log("User not found");
    } else {
      console.log("Password reset successful");
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    await mongoose.disconnect();
  }
};

resetPassword();