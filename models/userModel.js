const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: { type: String, enum: ["tutor", "student"], required: true },
  keyWords: {
    type: [String],
    default: [],
  },
  phoneNumber: { type: Number },
  imageUrl: { type: String, default: null }, // Field to store the image URL
});

// Pre-save middleware to ensure hashtags
userSchema.pre("save", function (next) {
  if (this.keyWords && this.keyWords.length > 0) {
    this.keyWords = this.keyWords.map((keyword) => {
      return keyword.startsWith("#") ? keyword : `#${keyword}`;
    });
  }
  next();
});

const userModel = new mongoose.model("users", userSchema);

module.exports = userModel;
