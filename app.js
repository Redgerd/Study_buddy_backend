const express = require("express");
const connectdb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializePassport } = require("./middleware/passportConfig");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const app = express();

// Connect to the database
connectdb();

// Middleware for parsing JSON, enabling CORS, and improving security
app.use(express.json());
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(helmet()); // Adds security-related HTTP headers
app.use(morgan("dev"));

// Initialize Passport
app.use(passport.initialize()); // <-- Initialize Passport middleware

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", passwordRoutes);

// Function to log all routes in the application
function logRoutes() {
  console.log("Routes in the application:");

  // Iterate through all middlewares in app._router.stack
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Direct route handler, log exact path
      console.log(
        `${middleware.route.stack[0].method.toUpperCase()} ${
          middleware.route.path
        }`
      );
    } else if (middleware.name === "router") {
      // Nested router, check its stack for nested routes
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(
            `${handler.route.stack[0].method.toUpperCase()} ${
              handler.route.path
            }`
          );
        }
      });
    }
  });
}

// Log routes after all middleware and routes are defined
logRoutes();

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
