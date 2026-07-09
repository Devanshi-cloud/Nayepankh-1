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

// GET /api/donations/leaderboard - Fetch leaderboard data (real-time from donations)
router.get("/leaderboard", async (req, res) => {
  try {
    // Step 1: Fetch all completed donations with referral codes
    const { data: donationRows, error: dError } = await supabase
      .from("donations")
      .select(`
        referral_code,
        amount
      `)
      .eq("payment_status", "completed")
      .not("referral_code", "is", null);

    if (dError) throw dError;

    if (!donationRows || !donationRows.length) {
      return res.status(404).json({ msg: "No donation data available for leaderboard" });
    }

    // Step 2: Aggregate totals by referral_code in JS
    const totalsMap = {};
    donationRows.forEach(d => {
      const rc = d.referral_code;
      if (!totalsMap[rc]) {
        totalsMap[rc] = { totalAmount: 0, referralsCount: 0 };
      }
      totalsMap[rc].totalAmount += parseFloat(d.amount || 0);
      totalsMap[rc].referralsCount += 1;
    });

    // Step 3: Fetch user names for all referral codes
    const referralCodes = Object.keys(totalsMap);
    const { data: users, error: uError } = await supabase
      .from("users")
      .select("first_name, last_name, referral_code")
      .in("referral_code", referralCodes);

    if (uError) throw uError;

    // Build user lookup map
    const userMap = {};
    (users || []).forEach(u => {
      userMap[u.referral_code] = u;
    });

    // Step 4: Build final leaderboard
    const formattedLeaderboard = referralCodes
      .map(rc => {
        const user = userMap[rc] || {};
        return {
          name: user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Intern",
          referralCode: rc,
          totalAmount: totalsMap[rc].totalAmount,
          referralsCount: totalsMap[rc].referralsCount,
        };
      })
      .sort((a, b) => b.totalAmount - a.totalAmount);

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