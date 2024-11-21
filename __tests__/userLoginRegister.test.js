const request = require("supertest");
const app = require("../app"); // Assuming the Express app is in app.js
const User = require("../models/userModel");

// Setup the test user data
const testUser = {
  userName: "newggusegt1234",
  name: "New User",
  email: "userfgd@example.com",
  role: "student",
  password: "currentPassword",
};

// Create test user before tests and delete it after tests
beforeAll(async () => {
  // Clean the database to avoid duplicates
  await User.deleteMany({ email: testUser.email });
});

afterAll(async () => {
  // Cleanup the test user from the database after tests
  await User.deleteMany({ email: testUser.email });
});

describe("User Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/user/register").send({
      userName: "newggusegt1234",
      name: "New User",
      email: "userfgd@example.com",
      role: "student",
      password: "currentPassword",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should login the user and return a token", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
