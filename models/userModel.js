const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    role: { type: String, enum: ["tutor", "student"], required: true },
    keyWords: {
      type: [String],
      default: [],
      set: (keywords) =>
        keywords.map((keyword) =>
          keyword.startsWith("#") ? keyword : `#${keyword}`
        ),
    },
    phoneNumber: { type: String, default: null, trim: true },
    imageUrl: { type: String, default: null },
    bio: { type: String, default: null, trim: true },
    totalSpent: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Index for efficient searches based on email or username
userSchema.index({ email: 1, userName: 1 });

// Pre-save hook for additional validations or logic
userSchema.pre("save", function (next) {
  if (this.keyWords && this.keyWords.length > 0) {
    this.keyWords = this.keyWords.map((keyword) => {
      return keyword.startsWith("#") ? keyword : `#${keyword}`;
    });
  }
  next();
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
