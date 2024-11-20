// routes/passwordRoutes.js (or whichever file you use for the routes)
const express = require("express");
const router = express.Router();
const {
  sendPasswordReset,
  resetPassword,
  changePassword,
} = require("../controllers/passwordController");
const passport = require("passport");

// Route to send a password reset link
router.post("/send-password-reset", sendPasswordReset);

// Route to reset the password with token
router.post("/reset-password", resetPassword);

// Route to change password for authenticated user
router.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  changePassword
);

module.exports = router;
