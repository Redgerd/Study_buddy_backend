const request = require("supertest");
const app = require("../app"); // Import your Express app
const mongoose = require("mongoose");

describe("User Routes", () => {
  let token; // To store token after login

  // Ensure that the database connection is properly set up before tests run
  beforeAll(async () => {
    // Set up database connection or mock it
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Disconnect from the database after tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test the user registration route
  it("should register a new user", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201); // Check if status is 201
    expect(res.body).toHaveProperty("user"); // Expect the response to contain the user
  });

  // Test the user login route
  it("should log in a user and return a token", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200); // Check if status is 200
    expect(res.body).toHaveProperty("token"); // Expect the response to contain a token
    token = res.body.token; // Save the token for further protected routes tests
  });

  // Test the user password change route
  it("should change the user password", async () => {
    const res = await request(app)
      .post("/api/user/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "password123",
        newPassword: "newpassword123",
      });

    expect(res.status).toBe(200); // Check if status is 200
    expect(res.body).toHaveProperty("message", "Password changed successfully");
  });

  // Test unauthorized access to protected routes
  it("should not allow access to protected routes without token", async () => {
    const res = await request(app).post("/api/user/change-password").send({
      oldPassword: "password123",
      newPassword: "newpassword123",
    });

    expect(res.status).toBe(401); // Expect 401 Unauthorized status
    expect(res.body).toHaveProperty("error", "No token, authorization denied");
  });
});
