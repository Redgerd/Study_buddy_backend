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
    const { userId } = req.user; // Assuming user is authenticated
    const { name, userName, phoneNumber, imageUrl } = req.body;

    // Validation (if needed)
    if (phoneNumber && isNaN(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (userName) updateData.userName = userName.trim();
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (imageUrl) updateData.imageUrl = imageUrl.trim(); // Ensure image URL is properly formatted

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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

// Placeholder for changePassword if not yet implemented
const changePassword = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  updateUser,
  getAllUsers,
};
