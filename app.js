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

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    const newMessage = { sender, receiver, message, timestamp: new Date() };
    io.to(receiver).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
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
