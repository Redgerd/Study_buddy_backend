const request = require("supertest");
const app = require("../app"); // Your Express app
const path = require("path");

const fs = require("fs");
const filePath = path.join(__dirname, "testFiles", "testFile.txt");
if (!fs.existsSync(filePath)) {
  throw new Error(`Test file does not exist at path: ${filePath}`);
}

it("should create an assignment with a file", async () => {
  const response = await request(app)
    .post("/api/assignments")
    .attach("file", filePath) // Attach the file to the request
    .field("title", "Test Assignment") // Additional form fields, if needed
    .field("description", "This is a test assignment")
    .expect(201); // Expect a 201 created response

  expect(response.body.message).toBe("Assignment created successfully");
});
