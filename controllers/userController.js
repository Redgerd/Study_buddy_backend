const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const {
      userName,
      name,
      email,
      password,
      role,
      keyWords,
      phoneNumber,
      location,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      userName,
      name,
      email,
      password: hashedPassword,
      role,
      keyWords,
      phoneNumber,
      location,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user details
const updateUser = async (req, res) => {
  try {
    const { name, userName, phoneNumber, imageUrl, bio } = req.body;

    // Ensure the user exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields provided in the request body
    if (name) user.name = name;
    if (userName) user.userName = userName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (imageUrl) user.imageUrl = imageUrl;
    if (bio) user.bio = bio;

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

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

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getAllUsers,
};
