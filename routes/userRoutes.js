const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  registerUser,
  loginUser,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");

const {
  validateSignUp,
  validateLogin,
  validateUpdates,
} = require("../validation/userValidation");

// Public routes
router.post("/register", validateSignUp, registerUser);
router.post("/login", validateLogin, loginUser);

// Example route to get all users (No authentication required)
router.get("/all", getAllUsers); // This should be /api/users/all

// Only authenticated users can update user details
router.put("/update", validateUpdates, updateUser);

module.exports = router;
