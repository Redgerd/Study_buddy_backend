const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
  updateUser,
  getAllUsers, // Import getAllUsers
} = require("../controllers/userController");
const {
  validateSignUp,
  validateLogin,
  validateChangePassword,
  validateUpdates,
} = require("../validation/userValidation");

// Public routes
router.post("/register", validateSignUp, registerUser);
router.post("/login", validateLogin, loginUser);

// Example route to get all users
router.get("/all", getAllUsers); // This should be /api/users/all

// Protected routes
router.post("/change-password", validateChangePassword, changePassword);
router.put("/update", validateUpdates, updateUser);

module.exports = router;
