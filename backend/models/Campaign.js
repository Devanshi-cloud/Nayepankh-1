const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Campaign title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Campaign description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
  },
  goalAmount: {
    type: Number,
    required: [true, "Goal amount is required"],
    min: [1, "Goal amount must be at least 1"],
  },
  raisedAmount: {
    type: Number,
    default: 0,
    min: [0, "Raised amount cannot be negative"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // No longer required
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

campaignSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
