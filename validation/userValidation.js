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
  body("email").optional().isEmail().withMessage("Must be a valid email"),
  body("phoneNumber")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric"),
];
