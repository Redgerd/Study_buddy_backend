const request = require("supertest");
const app = require("../app"); // Adjust the path to your app
const User = require("../models/userModel"); // Adjust the path to your User model
const path = require("path");
const fs = require("fs");
const multer = require("multer");

let token;
let testUser;

beforeAll(async () => {
  // Create a test user to use for testing
  testUser = await User.create({
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  });

  // Simulate login to get token
  const loginResponse = await request(app).post("/api/user/login").send({
    email: "testuser@example.com",
    password: "password123",
  });
  token = loginResponse.body.token; // Assuming token is returned in the response
});

describe("Update User Profile Image", () => {
  it("should upload a profile image successfully", async () => {
    const imagePath = path.join(__dirname, "testImage.jpg"); // Path to a test image file

    // Create a mock image file (You can manually place a test image in the 'testImage.jpg' path)
    const res = await request(app)
      .put("/api/user/update-image") // Adjust the route if needed
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imagePath); // 'image' is the field name for file uploads

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Profile image updated successfully");
    expect(res.body.user.image).toMatch(/uploads\/images\/\d+\.jpg$/); // Check if the path to the uploaded image is correct

    // Optionally, check if the file exists in the directory
    const fileExists = fs.existsSync(
      path.join(__dirname, "uploads", "images", res.body.user.image)
    );
    expect(fileExists).toBe(true);
  });

  it("should return an error if no image is provided", async () => {
    const res = await request(app)
      .put("/api/user/update-image") // Adjust the route if needed
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No image file uploaded");
  });

  it("should return an error for an invalid file type", async () => {
    const invalidImagePath = path.join(__dirname, "invalidImage.txt"); // A non-image file

    const res = await request(app)
      .put("/api/user/update-image") // Adjust the route if needed
      .set("Authorization", `Bearer ${token}`)
      .attach("image", invalidImagePath); // 'image' is the field name for file uploads

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Invalid file type. Only image files are allowed"
    );
  });
});

afterAll(async () => {
  // Clean up test user after all tests
  await User.deleteMany({ email: "testuser@example.com" });

  // Optionally, delete uploaded test images (if any)
  const filePath = path.join(__dirname, "uploads", "images", "testImage.jpg");
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});
