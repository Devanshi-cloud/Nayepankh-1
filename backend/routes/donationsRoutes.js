const express = require("express");
const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to authenticate user using Supabase
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, role, referral_code")
      .eq("id", decoded.id)
      .single();

    if (error || !user) return res.status(401).json({ msg: "User not found" });

    req.user = {
      id: user.id,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      role: user.role,
      referralCode: user.referral_code
    };
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// GET /api/donations - Fetch donations based on user's role
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = supabase
      .from("donations")
      .select(`
        id,
        donor_name,
        amount,
        referral_code,
        email,
        phone,
        whatsapp_number,
        address,
        payment_status,
        created_at,
        campaign:campaign_id (
          title,
          description,
          goal_amount
        )
      `)
      .order("created_at", { ascending: false });

    if (req.user.role !== "Super Admin" && req.user.role !== "Admin") {
      query = query.eq("referral_code", req.user.referralCode);
    }

    const { data: donations, error } = await query;
    if (error) throw error;

    if (!donations || !donations.length) {
      return res.status(404).json({
        msg: req.user.role === "Super Admin" || req.user.role === "Admin"
          ? "No donations found"
          : "No donations found for your referral code"
      });
    }

    // Format response to match frontend expectations
    const formattedDonations = donations.map(donation => ({
      _id: donation.id,
      donorName: donation.donor_name,
      amount: donation.amount,
      referralCode: donation.referral_code,
      email: donation.email,
      phone: donation.phone,
      whatsappNumber: donation.whatsapp_number,
      address: donation.address,
      paymentStatus: donation.payment_status,
      date: donation.created_at,
      campaign: donation.campaign ? {
        title: donation.campaign.title,
        description: donation.campaign.description,
        goalAmount: donation.campaign.goal_amount
      } : null
    }));

    res.status(200).json({ donations: formattedDonations, msg: "Donations retrieved successfully" });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ msg: "Server Error fetching donations", error: err.message });
  }
});

// GET /api/donations/leaderboard - Fetch leaderboard data
router.get("/leaderboard", async (req, res) => {
  try {
    const { data: leaderboard, error } = await supabase
      .from("fundraisers")
      .select(`
        totalAmount:total_raised,
        user:user_id (
          first_name,
          last_name
        )
      `)
      .gt("total_raised", 0)
      .order("total_raised", { ascending: false });

    if (error) throw error;

    if (!leaderboard || !leaderboard.length) {
      return res.status(404).json({ msg: "No donation data available for leaderboard" });
    }

    // Format fields for frontend charting library
    const formattedLeaderboard = leaderboard.map(item => ({
      name: item.user ? `${item.user.first_name} ${item.user.last_name}` : "Unknown Intern",
      totalAmount: parseFloat(item.totalAmount)
    }));

    res.status(200).json({ leaderboard: formattedLeaderboard });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ msg: "Server Error fetching leaderboard", error: err.message });
  }
});

// GET /api/donations/by-referral/:referralCode - Fetch donations by referral code (for Admins)
router.get("/by-referral/:referralCode", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Super Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied. Only Super Admin or Moderator can access this endpoint." });
    }
    const { referralCode } = req.params;
    if (!referralCode) {
      return res.status(400).json({ msg: "Missing referralCode parameter", missing: ["referralCode"] });
    }

    const { data: donations, error } = await supabase
      .from("donations")
      .select(`
        id,
        donor_name,
        amount,
        referral_code,
        email,
        phone,
        whatsapp_number,
        address,
        payment_status,
        created_at,
        campaign:campaign_id (
          title,
          description,
          goal_amount
        )
      `)
      .eq("referral_code", referralCode)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedDonations = donations.map(donation => ({
      _id: donation.id,
      donorName: donation.donor_name,
      amount: donation.amount,
      referralCode: donation.referral_code,
      email: donation.email,
      phone: donation.phone,
      whatsappNumber: donation.whatsapp_number,
      address: donation.address,
      paymentStatus: donation.payment_status,
      date: donation.created_at,
      campaign: donation.campaign ? {
        title: donation.campaign.title,
        description: donation.campaign.description,
        goalAmount: donation.campaign.goal_amount
      } : null
    }));

    res.status(200).json({ donations: formattedDonations });
  } catch (err) {
    console.error('Error fetching donations by referral:', err);
    res.status(500).json({ msg: "Server Error fetching donations by referral", error: err.message });
  }
});

module.exports = router;