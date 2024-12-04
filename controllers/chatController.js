const Chat = require("../models/chatModel");

// Get chat history (Decrypted messages)
const getChatHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    // Ensure both user IDs are valid and match the sender/receiver
    if (userId1 === userId2) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    // Find chat messages between the two users
    const messages = await Chat.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    // Decrypt messages before sending them
    const decryptedMessages = messages.map((msg) => {
      return {
        ...msg.toObject(),
        message: msg.decryptMessage(msg.encryptedMessage), // Decrypt the message
      };
    });

    res.status(200).json({
      message: "Chat history fetched successfully",
      messages: decryptedMessages,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat history", error });
  }
};

// Send a new message (Encrypt before saving)
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Validate the message and IDs
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Encrypt the message
    const chat = new Chat({
      sender: senderId,
      receiver: receiverId,
      encryptedMessage: Chat.prototype.encryptMessage(message), // Encrypt before saving
    });

    // Save the encrypted message to the database
    await chat.save();

    res.status(200).json({ message: "Message sent successfully", chat });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

module.exports = { getChatHistory, sendMessage };
