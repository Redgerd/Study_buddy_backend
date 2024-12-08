const Message = require("../models/chatModel");

// Get all messages for a specific room
const getMessages = async (req, res) => {
  try {
    const room = req.params.room;
    const messages = await Message.find({ room }).sort("timestamp");
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

// Save a new message
const saveMessage = async (req, res) => {
  const { room, user, message } = req.body;
  if (!room || !user || !message) {
    return res
      .status(400)
      .json({ error: "Room, user, and message are required" });
  }

  try {
    const newMessage = new Message({ room, user, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving message" });
  }
};

module.exports = { getMessages, saveMessage };
