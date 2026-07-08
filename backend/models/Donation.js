const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: [true, "Donor name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number starting with 6-9"],
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  amount: {
    type: Number,
    required: [true, "Donation amount is required"],
    min: [1, "Amount must be at least 1"],
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    default: null, // Optional: null for custom donations
  },
  campaignDetails: {
    title: { type: String, default: "Custom Donation" },
    description: { type: String, default: "A custom donation without a specific campaign" },
    goalAmount: { type: Number, default: null }, // Optional, for static campaigns
  }, // New embedded object for campaign details
  referralCode: {
    type: String,
    trim: true,
    default: null, // Optional field
    match: [/^[A-Za-z0-9]+$/, "Referral code must be alphanumeric"], // Optional validation
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentId: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
donationSchema.index({ referralCode: 1 }); // For intern donation lookups
donationSchema.index({ campaign: 1 }); // For campaign-based queries
donationSchema.index({ paymentId: 1 }); // For payment verification

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;