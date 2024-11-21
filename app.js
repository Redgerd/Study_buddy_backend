const express = require("express");
const connectdb = require("./config/db");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { initializePassport } = require("./middleware/passportConfig");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const assignmentRoutes = require("./routes/assignmentRoute");
const passwordRoutes = require("./routes/passwordRoutes");

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
