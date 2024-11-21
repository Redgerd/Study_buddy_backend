const path = require("path"); // Make sure to import path

const Assignment = require("../models/assignmentModel");

// Create an assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log(req.file); // Debugging to ensure the file is being sent

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const assignment = new Assignment({
      title,
      description,
      user: req.user.id, // Authenticated user's ID
      filePath: req.file.path,
    });

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
    const assignments = await Assignment.find({ user: req.user.id });
    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

// Download an assignment file
const downloadAssignment = (req, res) => {
  const filePath = path.join(__dirname, "../", req.params.filePath); // Fixed path issue
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("File not found or error occurred");
    }
  });
};

module.exports = {
  createAssignment,
  getUserAssignments,
  downloadAssignment,
};
