const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const fs = require("fs");

const allowedFields = [
  "userName",
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
    const updateData = {};

    // Process other fields to update
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Process uploaded image if available
    if (req.file) {
      // Convert the image to Base64
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString("base64");

      // Store the image in the database (you might want to store it as a URL path in a production app)
      updateData.profileImage = base64Image;

      // Clean up temporary file
      fs.unlinkSync(req.file.path);
    }

    // Ensure there's at least one field to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Find and update the user document
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true, // Returns the updated user document
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return updated user
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user data (protected route) - Fetch specified fields
const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user data, including all required fields
    const user = await User.findById(
      userId,
      "userName image name bio email totalSpent" // Correct field name
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct the response with the correct fields
    res.status(200).json({
      message: "User data fetched successfully",
      user: {
        userName: user.userName, // Correct field name
        image: user.image,
        name: user.name,
        bio: user.bio,
        email: user.email,
        totalSpent: user.totalSpent,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getUserData };

module.exports = {
  getAllUsers,
  updateUser,
  getUserData,
};
