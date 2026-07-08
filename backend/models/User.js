const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Firstname is required"],
    trim: true,
    minlength: [2, "Firstname must be at least 2 characters long"],
    maxlength: [50, "Firstname cannot exceed 50 characters"],
  },
  lastname: {
    type: String,
    required: [true, "Lastname is required"],
    trim: true,
    minlength: [2, "Lastname must be at least 2 characters long"],
    maxlength: [50, "Lastname cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  referralCode: {
    type: String,
    unique: true,
    trim: true,
    default: function () {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    },
  },
  role: {
    type: String,
    enum: ["Super Admin", "Admin", "Intern"], // Allowed roles as per requirements
    default: "Intern", // Default role is Intern
  },
  internshipPeriod: {
    type: String,
    enum: ["1 week", "2 weeks", "1 month", "3 months", "6 months"],
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;