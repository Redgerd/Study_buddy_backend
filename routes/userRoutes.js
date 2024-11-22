const express = require("express");
const passport = require("passport");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userLoginRegister");

const {
  getUserData,
  updateUser,
  getAllUsers,
} = require("../controllers/userDataUpdateGet");

const {
  validateSignUp,
  validateLogin,
  validateUpdates,
} = require("../validation/userValidation");

// Public routes
router.post("/register", validateSignUp, registerUser);
router.post("/login", validateLogin, loginUser);

// Protected routes (requires authentication)
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  getAllUsers
);
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  getUserData
);

// Update user details (allow only the user to update their own details)
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  validateUpdates,
  updateUser
);

module.exports = router;
