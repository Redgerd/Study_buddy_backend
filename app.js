const express = require("express");
const connectdb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
// const tutorRoutes = require("./routes/tutorRoutes");  // Uncomment when needed
// const assignmentRoutes = require("./routes/assignmentRoutes");  // Uncomment when needed
// const projectRoutes = require("./routes/projectRoutes");  // Uncomment when needed
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Connect to the database
connectdb();

// Middleware for parsing JSON, enabling CORS, and improving security
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(helmet()); // Adds security-related HTTP headers
app.use(morgan("dev")); // Logs HTTP requests to the console

// API Routes
app.use("/api/user", userRoutes);
// app.use("/api/tutor", tutorRoutes);  // Uncomment when needed
// app.use("/api/assignment", assignmentRoutes);  // Uncomment when needed
// app.use("/api/project", projectRoutes);  // Uncomment when needed

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware for catching all errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong!",
  });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is running on port ${port}`);
  }
});

module.exports = app;
