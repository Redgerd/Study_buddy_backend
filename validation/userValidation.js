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

exports.validateUpdates = [
  // Validate name if it's provided
  body("name")
    .optional() // This field is optional, the user doesn't need to update it
    .isString()
    .withMessage("Name must be a string")
    .trim(), // Remove extra spaces

  // Validate userName if it's provided
  body("userName")
    .optional() // This field is optional
    .isString()
    .withMessage("User name must be a string")
    .trim(), // Remove extra spaces

  // Validate phoneNumber if it's provided
  body("phoneNumber")
    .optional() // This field is optional
    .matches(/^\+92\d{10}$/) // Match phone numbers starting with +92 followed by exactly 10 digits
    .withMessage("Invalid phone number format for Pakistan"),

  // Validate imageUrl if it's provided
  body("imageUrl")
    .optional() // This field is optional
    .isURL()
    .withMessage("Invalid image URL format"),

  // Add any other validations you may need
];
