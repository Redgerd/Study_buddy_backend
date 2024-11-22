const request = require("supertest");
const app = require("../app"); // Adjust the path to your app
const User = require("../models/userModel"); // Adjust the path to your User model

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

describe("Update User Data", () => {
  it("should update the user's information", async () => {
    const updatedData = { name: "Updated User", email: "updated@example.com" };

    const res = await request(app)
      .put(`/api/user/update`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe(updatedData.name);
    expect(res.body.user.email).toBe(updatedData.email);
  });

  it("should return an error if no token is provided", async () => {
    const updatedData = { name: "Updated User", email: "updated@example.com" };

    const res = await request(app).put(`/api/user/update`).send(updatedData);

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toBe("Authorization required");
  });

  it("should return an error if the token is invalid", async () => {
    const updatedData = { name: "Updated User", email: "updated@example.com" };

    const res = await request(app)
      .put(`/api/user/update`)
      .set("Authorization", "Bearer invalidtoken")
      .send(updatedData);

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toBe("Invalid token");
  });

  it("should return an error if updating with missing fields", async () => {
    const updatedData = { name: "Updated User" }; // Missing email

    const res = await request(app)
      .put(`/api/user/update`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(400); // Bad Request
    expect(res.body.message).toBe("Missing required fields");
  });

  it("should return an error if the user tries to update role to an unauthorized value", async () => {
    const updatedData = { role: "admin" }; // Assuming 'admin' is an unauthorized role for this user

    const res = await request(app)
      .put(`/api/user/update`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(403); // Forbidden
    expect(res.body.message).toBe("Unauthorized to change role");
  });
});

afterAll(async () => {
  // Clean up test user after all tests
  await User.deleteMany({ email: "testuser@example.com" });
});
