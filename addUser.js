// addUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel"); // Adjust path if needed
require("dotenv").config();

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");

  // Sample user data
  const sampleUser = {
    userName: "testuser",
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    role: "student",
    phoneNumber: "1234567890",
    keyWords: ["test", "user"],
  };

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: sampleUser.email });
    if (existingUser) {
      console.log("User already exists");
    } else {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      sampleUser.password = await bcrypt.hash(sampleUser.password, salt);

      // Save the new user
      const newUser = new User(sampleUser);
      await newUser.save();
      console.log("Sample user created successfully");
    }
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    mongoose.connection.close();
  }
});
