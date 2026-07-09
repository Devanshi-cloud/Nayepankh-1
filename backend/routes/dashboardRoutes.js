const express = require("express");
const {authMiddleware} = require("../middleware/authMiddleware");
const supabase = require("../config/supabaseClient");

const router = express.Router();

// GET /api/dashboard - Get dashboard info for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, phone, role, referral_code, email_verified, phone_verified, avatar")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const formattedUser = {
      _id: user.id,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      referralCode: user.referral_code,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
      avatar: user.avatar
    };

    res.json({ message: `Hello ${formattedUser.firstname}, Welcome to your Dashboard!`, user: formattedUser });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ msg: "Server Error fetching dashboard data", error: err.message });
  }
});

module.exports = router;
