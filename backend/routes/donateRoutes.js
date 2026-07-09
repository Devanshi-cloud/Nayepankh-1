const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID || "rzp_test_TBNBuPaPRaIZWu",
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

// GET /api/donate/public - Fetch all active campaigns (public access)
router.get("/public", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .gte("end_date", today)
      .order("start_date", { ascending: false });

    if (error) throw error;

    if (!campaigns || !campaigns.length) {
      return res.status(404).json({ msg: "No active campaigns found" });
    }

    const formattedCampaigns = campaigns.map(camp => ({
      _id: camp.id,
      title: camp.title,
      description: camp.description,
      goalAmount: camp.goal_amount,
      raisedAmount: camp.raised_amount,
      startDate: camp.start_date,
      endDate: camp.end_date
    }));

    res.status(200).json({ campaigns: formattedCampaigns, msg: "Campaigns retrieved successfully" });
  } catch (err) {
    console.error('Error fetching public campaigns:', err);
    res.status(500).json({ msg: "Server Error fetching public campaigns", error: err.message });
  }
});

// GET /api/donate/:referralCode - Fetch campaigns with referral code
router.get("/:referralCode", async (req, res) => {
  try {
    const { referralCode } = req.params;
    if (!referralCode) {
      return res.status(400).json({ msg: "Missing referralCode parameter", missing: ["referralCode"] });
    }

    // Verify referral user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (userError || !user) {
      return res.status(400).json({ msg: "Invalid referral code" });
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .gte("end_date", today)
      .order("start_date", { ascending: false });

    if (error) throw error;

    if (!campaigns || !campaigns.length) {
      return res.status(404).json({ msg: "No active campaigns found" });
    }

    const formattedCampaigns = campaigns.map(camp => ({
      _id: camp.id,
      title: camp.title,
      description: camp.description,
      goalAmount: camp.goal_amount,
      raisedAmount: camp.raised_amount,
      startDate: camp.start_date,
      endDate: camp.end_date
    }));

    res.status(200).json({ campaigns: formattedCampaigns, msg: "Campaigns retrieved successfully" });
  } catch (err) {
    console.error('Error fetching campaigns by referral code:', err);
    res.status(500).json({ msg: "Server Error fetching campaigns by referral code", error: err.message });
  }
});

// POST /api/donate - Create donation order
router.post("/", async (req, res) => {
  const { donorName, amount, campaignId, referralCode, email, phoneNumber, campaignDetails, address, whatsappNumber } = req.body;

  // Validate required fields
  const missing = [];
  if (!donorName) missing.push("donorName");
  if (!amount) missing.push("amount");
  if (!email) missing.push("email");
  if (!phoneNumber) missing.push("phoneNumber");
  if (missing.length) {
    return res.status(400).json({ msg: "Missing required fields", missing });
  }

  try {
    if (campaignId) {
      const { data: campaign, error } = await supabase
        .from("campaigns")
        .select("id")
        .eq("id", campaignId)
        .maybeSingle();

      if (error || !campaign) {
        return res.status(404).json({ msg: "Campaign not found" });
      }
    }

    if (referralCode) {
      const { data: donorUser, error } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();

      if (error || !donorUser) {
        return res.status(400).json({ msg: "Invalid referral code" });
      }
    }

    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: Math.round(amount), // Amount in paise
      currency: "INR",
      receipt: `donation_${Date.now()}`,
    });

    const { data: newDonation, error: insertError } = await supabase
      .from("donations")
      .insert({
        donor_name: donorName,
        email,
        phone: phoneNumber,
        amount: amount / 100, // Save as INR rupees
        campaign_id: campaignId || null,
        referral_code: referralCode || null,
        address: address || null,
        whatsapp_number: whatsappNumber || null,
        razorpay_order_id: order.id,
        payment_status: "pending",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(200).json({
      orderId: order.id,
      amount,
      msg: "Donation order created successfully",
    });
  } catch (err) {
    console.error('Error creating donation order:', err);
    res.status(500).json({ msg: "Server Error creating donation order", error: err.message });
  }
});

// POST /api/donate/verify - Verify payment
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  // Validate required fields
  const missing = [];
  if (!razorpay_order_id) missing.push("razorpay_order_id");
  if (!razorpay_payment_id) missing.push("razorpay_payment_id");
  if (!razorpay_signature) missing.push("razorpay_signature");
  if (missing.length) {
    return res.status(400).json({ msg: "Missing required fields", missing });
  }

  try {
    if (!process.env.RAZORPAY_TEST_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET is not defined in environment variables");
      return res.status(500).json({ msg: "Server configuration error: Payment secret key missing" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid payment signature" });
    }

    // Update donation status to completed
    // Triggers in the DB will automatically recalculate campaign and fundraiser totals
    const { data: updatedDonation, error } = await supabase
      .from("donations")
      .update({
        payment_status: "completed",
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .maybeSingle();

    if (error || !updatedDonation) {
      return res.status(404).json({ msg: "Donation record not found in database" });
    }

    res.status(200).json({ msg: "Payment verified and donation recorded successfully" });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ msg: "Server Error verifying payment", error: err.message });
  }
});

module.exports = router;