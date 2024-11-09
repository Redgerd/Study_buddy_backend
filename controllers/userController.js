const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Register a new user
exports.registerUser = async (req, res) => {
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
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password }); // Log input

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("User found:", user); // Log user

    // Check password
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
    console.error("Error during login:", error); // Log error
    res.status(500).json({ message: "Server error", error });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming user is authenticated
    const { oldPassword, newPassword } = req.body;

    // Log inputs for debugging purposes
    console.log("Received request to change password:", {
      userId,
      oldPassword,
      newPassword,
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password change:", error); // Improved error logging
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming user is authenticated
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Check if there are no users in the database
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res.json({ message: "Users fetched successfully", users });
  } catch (error) {
    // Handle any server-side errors
    res.status(500).json({ message: "Server error", error });
  }
};
