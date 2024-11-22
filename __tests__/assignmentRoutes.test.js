const request = require("supertest");
const app = require("../app"); // Adjust the path to your app
const User = require("../models/userModel"); // Adjust the path to your User model
const Assignment = require("../models/assignmentModel"); // Adjust the path to your Assignment model
const path = require("path");
const fs = require("fs");

let token;
let testUser;
let testFilePath;

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

  // Ensure test file exists for uploading
  testFilePath = path.join(__dirname, "testFiles", "testFile.txt");
  if (!fs.existsSync(testFilePath)) {
    throw new Error(`Test file does not exist at path: ${testFilePath}`);
  }
});

describe("Assignment Routes", () => {
  it("should create an assignment with a file", async () => {
    const response = await request(app)
      .post("/api/assignments")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", testFilePath) // Attach the file to the request
      .field("title", "Test Assignment") // Additional form fields, if needed
      .field("description", "This is a test assignment")
      .expect(201); // Expect a 201 created response

    expect(response.body.message).toBe("Assignment created successfully");
    expect(response.body.assignment.title).toBe("Test Assignment");
  });

  it("should return an error if no file is provided", async () => {
    const response = await request(app)
      .post("/api/assignments")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test Assignment")
      .field("description", "This is a test assignment")
      .expect(400); // Bad Request

    expect(response.body.message).toBe("File is required");
  });

  it("should return an error if no title or description is provided", async () => {
    const response = await request(app)
      .post("/api/assignments")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", testFilePath)
      .expect(400); // Bad Request

    expect(response.body.message).toBe("Title and description are required");
  });

  it("should get all assignments for the authenticated user", async () => {
    const response = await request(app)
      .get("/api/assignments")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should allow tutor or admin to access all assignments", async () => {
    // Let's assume the user has the 'tutor' role
    testUser.role = "tutor"; // Set the role to 'tutor'
    await testUser.save(); // Save the updated role in the database

    const response = await request(app)
      .get("/api/assignments/all")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should return 403 for unauthorized users trying to access all assignments", async () => {
    // Change the user's role to 'student' and save it
    testUser.role = "student";
    await testUser.save();

    const response = await request(app)
      .get("/api/assignments/all")
      .set("Authorization", `Bearer ${token}`)
      .expect(403); // Forbidden

    expect(response.body.message).toBe("Forbidden");
  });

  it("should download an assignment file", async () => {
    // Assuming a test assignment with a file has already been created
    const assignment = await Assignment.create({
      title: "Test Assignment",
      description: "This is a test assignment",
      user: testUser._id,
      filePath: testFilePath,
    });

    const response = await request(app)
      .get(`/api/assignments/${assignment.filePath}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.headers["content-type"]).toMatch(/text\/plain/); // Assuming it's a text file
  });

  it("should return an error if trying to download an invalid file", async () => {
    const response = await request(app)
      .get("/api/assignments/invalidFilePath.txt")
      .set("Authorization", `Bearer ${token}`)
      .expect(500); // Internal Server Error

    expect(response.body.message).toBe("File not found or error occurred");
  });
});

afterAll(async () => {
  // Clean up test user and assignments after all tests
  await User.deleteMany({ email: "testuser@example.com" });
  await Assignment.deleteMany({ user: testUser._id });
});
