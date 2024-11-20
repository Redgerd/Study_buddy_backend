const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/userModel"); // Assuming you have a User model

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
      from: process.env.EMAIL_USER, // Sender address
      to, // Recipient address
      subject, // Subject of the email
      text, // Content of the email
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user is authenticated
    const { oldPassword, newPassword } = req.body;

    console.log("Received request to change password:", { id });

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the old password with the stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send email notification about the password change
    const emailSubject = "Password Changed Successfully";
    const emailText = `Hello ${user.name},\n\nYour password has been successfully changed. If this wasn't you, please contact support immediately.\n\nBest regards,\nYour App Team`;

    // Send the email to the user
    await sendEmail(user.email, emailSubject, emailText);

    // Return success response
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password change:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};
