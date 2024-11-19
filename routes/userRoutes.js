const express = require("express");
const passport = require("passport");
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

// Example route to get all users (No authentication required)
router.get("/all", getAllUsers); // This should be /api/users/all

// Protected route using Passport.js JWT authentication
// Only authenticated users can change their password
router.put(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  validateChangePassword,
  changePassword
);

// You can protect other routes similarly:
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  validateUpdates,
  updateUser
);

module.exports = router;
