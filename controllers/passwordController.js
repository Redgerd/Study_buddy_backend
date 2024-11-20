const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/userModel"); // Assuming you have a User model
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider's service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Reusable function to send emails
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to generate and send password reset link
exports.sendPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email with the reset link
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Hello ${user.name},\n\nPlease click the following link to reset your password: ${resetURL}\n\nIf you did not request this change, please ignore this email.\n\nBest regards,\nYour App Team`
    );

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};

// Function to reset the password using the token
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpire = undefined; // Clear the expiry time
    await user.save();

    // Send email notification of password change
    await sendEmail(
      user.email,
      "Password Changed Successfully",
      `Hello ${user.name},\n\nYour password has been successfully reset. If you did not request this, please contact support immediately.\n\nBest regards,\nYour App Team`
    );

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};

// Function to change the password for an authenticated user
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // Use id from the authenticated user

  try {
    const user = await User.findById(id); // Use the user id to find the user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send email notification of password change
    await sendEmail(
      user.email,
      "Password Changed Successfully",
      `Hello ${user.name},\n\nYour password has been successfully changed. If this wasn't you, please contact support immediately.\n\nBest regards,\nYour App Team`
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password change:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};
