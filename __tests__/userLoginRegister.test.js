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
      userName: testUser.userName,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      password: testUser.password,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");

    // Check that the user is saved in the database
    const userInDb = await User.findOne({ email: testUser.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb.email).toBe(testUser.email);
  });

  it("should login the user and return a token", async () => {
    // Register the user first (if not already registered)
    await request(app).post("/api/user/register").send({
      userName: testUser.userName,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      password: testUser.password,
    });

    const res = await request(app)
      .post("/api/user/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).toMatch(/^eyJ/); // Check if token looks like a valid JWT

    // Optionally, check for user role in the response
    expect(res.body.role).toBe(testUser.role);
  });

  it("should return error if user does not exist during login", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "nonexistentuser@example.com",
      password: "wrongPassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return error if password is incorrect during login", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: testUser.email, password: "wrongPassword" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
