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

// ===== SUBSCRIPTION (AUTOPAY) ROUTES =====

// POST /api/donate/create-subscription - Create a Razorpay subscription (Autopay)
router.post("/create-subscription", async (req, res) => {
  const {
    donorName, email, phoneNumber, campaignId, referralCode,
    planId, totalCount
  } = req.body;

  // Validate required fields
  const missing = [];
  if (!donorName) missing.push("donorName");
  if (!email) missing.push("email");
  if (!phoneNumber) missing.push("phoneNumber");
  if (!planId) missing.push("planId");
  if (missing.length) {
    return res.status(400).json({ msg: "Missing required fields", missing });
  }

  try {
    // Optional: verify campaign exists
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

    // Optional: verify referral code
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

    // Use provided planId, fall back to env, then use dummy
    const effectivePlanId = planId || process.env.RAZORPAY_PLAN_ID || "plan_Qwerty12345";

    // Create subscription in Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: effectivePlanId,
      customer_notify: 1,
      total_count: totalCount || 12,
      notify_info: {
        notify_email: email,
        notify_phone: phoneNumber
      },
      notes: {
        donor_name: donorName,
        campaign_id: campaignId || '',
        referral_code: referralCode || ''
      }
    });

    // Get plan details to figure out the amount
    let amount = 0;
    try {
      const plan = await razorpay.plans.fetch(planId);
      amount = plan.item.amount;
    } catch (planErr) {
      console.warn("Could not fetch plan details:", planErr.message);
    }

    // Save subscription to database
    const { data: newSubscription, error: insertError } = await supabase
      .from("subscriptions")
      .insert({
        razorpay_subscription_id: subscription.id,
        razorpay_plan_id: planId,
        donor_name: donorName,
        email,
        phone: phoneNumber,
        campaign_id: campaignId || null,
        referral_code: referralCode || null,
        amount: amount / 100, // Convert paise to INR
        status: subscription.status,
        total_count: totalCount || 12,
        paid_count: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving subscription to DB:", insertError);
      // Still return subscription ID even if DB save fails
    }

    res.status(200).json({
      subscriptionId: subscription.id,
      amount: amount,
      msg: "Subscription created successfully"
    });
  } catch (err) {
    console.error("Error creating subscription:", err);
    res.status(500).json({ msg: "Error creating subscription", error: err.message });
  }
});

// GET /api/donate/subscriptions - Fetch subscriptions by email or phone
router.get("/subscriptions", async (req, res) => {
  const { email, phone } = req.query;

  if (!email && !phone) {
    return res.status(400).json({ msg: "Provide email or phone to fetch subscriptions" });
  }

  try {
    let query = supabase
      .from("subscriptions")
      .select(`
        id,
        razorpay_subscription_id,
        razorpay_plan_id,
        donor_name,
        email,
        phone,
        amount,
        status,
        total_count,
        paid_count,
        current_start,
        current_end,
        created_at,
        campaign:campaign_id ( title, description )
      `)
      .order("created_at", { ascending: false });

    if (email) query = query.eq("email", email);
    if (phone) query = query.eq("phone", phone);

    const { data: subscriptions, error } = await query;
    if (error) throw error;

    const formattedSubscriptions = (subscriptions || []).map(sub => ({
      _id: sub.id,
      subscriptionId: sub.razorpay_subscription_id,
      planId: sub.razorpay_plan_id,
      donorName: sub.donor_name,
      email: sub.email,
      phone: sub.phone,
      amount: sub.amount,
      status: sub.status,
      totalCount: sub.total_count,
      paidCount: sub.paid_count,
      currentStart: sub.current_start,
      currentEnd: sub.current_end,
      createdAt: sub.created_at,
      campaign: sub.campaign || null
    }));

    res.status(200).json({ subscriptions: formattedSubscriptions });
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    res.status(500).json({ msg: "Error fetching subscriptions", error: err.message });
  }
});

// POST /api/donate/cancel-subscription - Cancel a subscription
router.post("/cancel-subscription", async (req, res) => {
  const { subscriptionId } = req.body;

  if (!subscriptionId) {
    return res.status(400).json({ msg: "Missing subscriptionId" });
  }

  try {
    // Cancel at Razorpay
    const cancelled = await razorpay.subscriptions.cancel(subscriptionId);

    // Update local database
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString()
      })
      .eq("razorpay_subscription_id", subscriptionId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating subscription in DB:", error);
    }

    res.status(200).json({ msg: "Subscription cancelled successfully", status: cancelled.status });
  } catch (err) {
    console.error("Error cancelling subscription:", err);
    res.status(500).json({ msg: "Error cancelling subscription", error: err.message });
  }
});

module.exports = router;