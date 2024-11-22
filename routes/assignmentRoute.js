const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // Multer middleware for handling file uploads
const {
  createAssignment,
  getUserAssignments,
  getAllAssignments,
  downloadAssignment,
} = require("../controllers/assignmentController");
const { validateAssignment } = require("../validation/assignmentValidation"); // Assuming validation logic

// Route to create a new assignment (using POST for creation)
router.post(
  "/assignments",
  upload.single("assignmentFile"), // Handle single file upload with field name 'assignmentFile'
  createAssignment
);

// Route to get all assignments for the authenticated user
router.get(
  "/assignments/me",
  getUserAssignments // This assumes user info is fetched from session or other middleware
);

// Route to get all assignments
router.get(
  "/assignments/all",
  (req, res, next) => {
    // If you are using role-based access control, add your logic here
    // For now, I'll leave the role check as a placeholder
    if (req.user.role === "tutor" || req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" }); // If not authorized
  },
  getAllAssignments
);

// Route to download an assignment file
router.get("/assignments/:filePath", downloadAssignment);

module.exports = router;
