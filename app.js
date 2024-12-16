const express = require("express");
const connectdb = require("./config/db");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializePassport } = require("./middleware/passport");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
// Routes
const userRoutes = require("./routes/userRoutes");
const assignmentRoutes = require("./routes/assignmentRoute");
const passwordRoutes = require("./routes/passwordRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectdb();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(passport.initialize());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", passwordRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/chats", chatRoutes);

// Socket.io for real-time communication
const server = http.createServer(app);
const io = socketIo(server);

/// Handle socket connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins a chat room
  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    // Load previous messages
    const messages = await Message.find({ room }).sort("timestamp");
    socket.emit("previousMessages", messages);
  });

  // Handle new chat messages
  socket.on("chatMessage", async ({ room, message, user }) => {
    const newMessage = new Message({ room, user, message });
    try {
      await newMessage.save();
      io.to(room).emit("chatMessage", {
        user,
        message,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is running on port ${port}`);
  }
});

module.exports = app;
