const { body } = require("express-validator");

exports.validateSignUp = [
  body("userName").notEmpty().withMessage("User name is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

exports.validateUpdates = (req, res, next) => {
  const { name, userName, phoneNumber, imageUrl } = req.body;

  // Validate fields if they exist in the request body
  if (name && typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name" });
  }
  if (userName && typeof userName !== "string") {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (
    phoneNumber &&
    (typeof phoneNumber !== "number" || phoneNumber.toString().length < 10)
  ) {
    return res.status(400).json({ message: "Invalid phone number" });
  }
  if (imageUrl && typeof imageUrl !== "string") {
    return res.status(400).json({ message: "Invalid image URL" });
  }

  next(); // Proceed to the next middleware or controller
};
