const express = require("express");
const { getMessages, saveMessage } = require("../controllers/chatController");
const router = express.Router();

// Get all messages for a specific room
router.get("/:room", getMessages);

// Save a new message
router.post("/", saveMessage);

module.exports = router;
