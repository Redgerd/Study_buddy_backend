const path = require("path"); // Import path module for file handling
const Assignment = require("../models/assignmentModel");

// Helper function for file validation
const validateFile = (file) => {
  if (!file) {
    return "File is required";
  }
  // Check for PDF, DOC, and image files (jpg, jpeg, png, gif, etc.)
  if (
    file.mimetype !== "application/pdf" &&
    file.mimetype !== "application/msword" &&
    !file.mimetype.startsWith("image/")
  ) {
    return "Only PDF, DOC, and image files are allowed";
  }
  return null;
};

// Create an assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    console.log(req.file); // Debugging to ensure the file is being sent

    // Validate the presence of required fields
    if (!title || !description || !deadline) {
      return res
        .status(400)
        .json({ message: "Title, description, and deadline are required" });
    }

    // Validate the file
    const fileError = validateFile(req.file);
    if (fileError) {
      return res.status(400).json({ message: fileError });
    }

    // Create a new assignment with the provided details
    const assignment = new Assignment({
      title,
      description,
      user: req.user.id, // Authenticated user's ID
      filePath: req.file.path, // Store file path
      deadline: new Date(deadline), // Store deadline date
    });

    // Save the assignment to the database
    const savedAssignment = await assignment.save();

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: savedAssignment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

// Get all assignments for a user
const getUserAssignments = async (req, res) => {
  try {
    // Fetch assignments for the authenticated user (req.user.id)
    const assignments = await Assignment.find({ user: req.user.id });

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found" });
    }

    res.status(200).json({
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

// Get all assignments (for admin or tutor)
const getAllAssignments = async (req, res) => {
  try {
    // Fetch all assignments (e.g., for admin or tutor)
    const assignments = await Assignment.find().populate(
      "user",
      "username name email"
    ); // Populate user details

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments available" });
    }

    res.status(200).json({
      message: "All assignments fetched successfully",
      assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching all assignments",
      error: error.message,
    });
  }
};

// Download an assignment file
const downloadAssignment = (req, res) => {
  try {
    const filePath = path.join(__dirname, "../", req.params.filePath); // Resolve the file path

    // Attempt to send the file for download
    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("File not found or error occurred");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing file download");
  }
};

module.exports = {
  createAssignment,
  getUserAssignments,
  getAllAssignments,
  downloadAssignment,
};
