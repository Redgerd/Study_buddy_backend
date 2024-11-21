const { body, validationResult } = require("express-validator");

// Validation rules
const validateAssignment = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateAssignment };
