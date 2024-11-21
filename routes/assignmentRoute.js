// Remove the passport.authenticate() middleware if you're not using JWT

const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const {
  createAssignment,
  getUserAssignments,
  downloadAssignment,
} = require("../controllers/assignmentController");
const { validateAssignment } = require("../validation/assignmentValidation");

// Create an assignment (no authentication)
router.post(
  "/",
  upload.single("file"), // File upload
  validateAssignment, // Validation middleware
  createAssignment // Controller function to create the assignment
);

// Get all assignments for the user (no authentication)
router.get(
  "/",
  getUserAssignments // Controller function to get user assignments
);

// Download assignment file (no authentication)
router.get(
  "/download/:filePath",
  downloadAssignment // Controller function to download the assignment file
);

module.exports = router;
