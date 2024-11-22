const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const allowedFields = [
  "username",
  "image",
  "name",
  "bio",
  "email",
  "totalSpent",
];

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user data
const updateUser = async (req, res) => {
  try {
    // Ensure we have at least one field to update
    const updateData = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Find the user and update their data
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user data (protected route)
const getUserData = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated and user ID is in req.user

    // Fetch the user data, returning only the allowed fields
    const user = await User.findById(userId, allowedFields.join(" "));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  getUserData,
};
