// middleware/multer.js
const multer = require("multer");
const path = require("path");

// Setup storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Path where the files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// Accept only specific file types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".txt", ".pdf", ".docx"]; // Adjust allowed file types as needed
  const fileExt = path.extname(file.originalname);
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: set a limit for file size (5MB here)
});

module.exports = upload;
