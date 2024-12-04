const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getChatHistory,
  sendMessage,
} = require("../controllers/chatController");

// Route for sending a message (protected)
router.post(
  "/send",
  passport.authenticate("jwt", { session: false }),
  sendMessage
);

// Route for fetching chat history (protected)
router.get(
  "/:userId1/:userId2",
  passport.authenticate("jwt", { session: false }),
  getChatHistory
);

module.exports = router;
