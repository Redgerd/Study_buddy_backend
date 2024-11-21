const request = require("supertest");
const app = require("../app"); // Your Express app
const User = require("../models/userModel");

const testUser = {
  userName: "testuser",
  name: "Test User",
  email: "testuser@example.com",
  password: "password123",
  role: "student",
};

// Create test user before tests and delete it after tests
beforeAll(async () => {
  // Clean the database to avoid duplicates
  await User.deleteMany({ email: testUser.email });

  // Register test user
  await request(app).post("/api/user/register").send(testUser);
});

afterAll(async () => {
  // Cleanup the test user from the database after tests
  await User.deleteMany({ email: testUser.email });
});

describe("User Update", () => {
  it("should update the user details successfully", async () => {
    const updatedData = {
      name: "Updated Test User",
      userName: "updatedtestuser",
      phoneNumber: "1234567890",
      imageUrl: "https://example.com/updated-image.jpg",
      bio: "This is the updated bio",
    };

    // Send update request without Authorization token
    const res = await request(app).put("/api/user/update").send(updatedData); // Send updated data without the token

    // Log the response for debugging
    console.log(res.body);

    // Check if the response is as expected
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated successfully");
    expect(res.body.user.name).toBe(updatedData.name);
    expect(res.body.user.userName).toBe(updatedData.userName);
    expect(res.body.user.phoneNumber).toBe(updatedData.phoneNumber);
    expect(res.body.user.imageUrl).toBe(updatedData.imageUrl);

    // Now fetch the updated user from the database to check the changes
    const updatedUser = await User.findOne({ email: testUser.email });

    // Check if the database has the updated data
    expect(updatedUser.name).toBe(updatedData.name);
    expect(updatedUser.userName).toBe(updatedData.userName);
    expect(updatedUser.phoneNumber).toBe(updatedData.phoneNumber);
    expect(updatedUser.imageUrl).toBe(updatedData.imageUrl);
  });
});
