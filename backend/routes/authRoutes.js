const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabaseClient");
const nodemailer = require("nodemailer");

const router = express.Router();

// Middleware to authenticate user using Supabase
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, phone, role, referral_code, email_verified, phone_verified, avatar")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = {
      id: user.id,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      referralCode: user.referral_code,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
      avatar: user.avatar,
    };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Utility to send OTP via Nodemailer
async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: (process.env.GMAIL_PASS || '').replace(/\s+/g, ''),
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP for NayePankh Portal',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #fafdff; padding: 32px 24px; border-radius: 12px; max-width: 420px; margin: 24px auto; box-shadow: 0 2px 12px rgba(33,110,182,0.07);">
          <div style="text-align:center;">
            <h2 style="color: #216eb6; margin: 0 0 8px;">NayePankh Portal</h2>
          </div>
          <p style="font-size: 1.1em; color: #263238; margin-bottom: 18px;">
            <strong>Your One-Time Password (OTP):</strong>
          </p>
          <div style="font-size: 2em; font-weight: bold; color: #1976d2; background: #e3f2fd; padding: 16px 0; border-radius: 8px; letter-spacing: 6px; text-align: center; margin-bottom: 18px;">
            ${otp}
          </div>
          <p style="color: #546E7A; font-size: 0.98em; margin-bottom: 0;">
            Please use this OTP to complete your action. This code is valid for 10 minutes.<br/>
            If you did not request this, you can safely ignore this email.
          </p>
          <div style="margin-top: 24px; text-align: center; color: #bdbdbd; font-size: 0.9em;">
            &copy; ${new Date().getFullYear()} NayePankh Foundation
          </div>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('OTP email delivery failed:', err.message);
    return false;
  }
}

// Generate OTP
function generateOTP() {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

// Registration (Interns: OTP, Others: as is)
router.post("/signup", async (req, res) => {
  let { firstname, lastname, email, password, internshipPeriod, role } = req.body;

  // Validate required fields
  const missing = [];
  if (!firstname) missing.push("firstname");
  if (!lastname) missing.push("lastname");
  if (!email) missing.push("email");
  if (!password) missing.push("password");
  if (!internshipPeriod) missing.push("internshipPeriod");
  if (missing.length) {
    return res.status(400).json({ msg: "Missing required fields", missing });
  }

  email = email.toLowerCase();

  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Generate unique referral code
    let referralCode;
    let isUnique = false;
    while (!isUnique) {
      referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: codeCheck } = await supabase
        .from("users")
        .select("id")
        .eq("referral_code", referralCode)
        .maybeSingle();
      if (!codeCheck) isUnique = true;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const roleStr = role || 'Intern';

    if (roleStr === 'Intern') {
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: firstname,
          last_name: lastname,
          email,
          password_hash: passwordHash,
          referral_code: referralCode,
          role: roleStr,
          email_verified: false,
          otp,
          otp_expiry: otpExpiry
        })
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ msg: "Failed to create user", error: insertError.message });
      }

      // Initialize matching Fundraiser record for milestone tracking
      await supabase
        .from("fundraisers")
        .insert({
          user_id: newUser.id,
          referral_code: referralCode,
          goal_amount: 30000.00
        });

      const emailSent = await sendOTP(email, otp);
      if (!emailSent) {
        return res.status(201).json({
          msg: 'Account created. OTP could not be delivered automatically, but your account is ready for manual verification.',
          email,
        });
      }
      return res.status(201).json({ msg: 'OTP sent to email. Please verify to complete registration.', email });
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: firstname,
          last_name: lastname,
          email,
          password_hash: passwordHash,
          referral_code: referralCode,
          role: roleStr,
          email_verified: true
        })
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ msg: "Failed to create user", error: insertError.message });
      }

      const payload = { id: newUser.id, role: newUser.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.status(201).json({ token, user: { id: newUser.id, firstname, lastname, email, referralCode } });
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// OTP Verification for Registration
router.post('/verify-otp', async (req, res) => {
  const { email: rawEmail, otp } = req.body;
  const email = rawEmail.toLowerCase();
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, otp, otp_expiry, email_verified")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) return res.status(400).json({ msg: 'User not found' });
    if (user.email_verified) return res.status(400).json({ msg: 'User already verified' });
    
    if (user.otp !== otp || !user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    await supabase
      .from("users")
      .update({
        email_verified: true,
        otp: null,
        otp_expiry: null
      })
      .eq("id", user.id);

    return res.json({ msg: 'Registration verified. You can now login.' });
  } catch (err) {
    res.status(500).json({ msg: "Server error during OTP verification", error: err.message });
  }
});

// Login (Interns: OTP, Others: as is)
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  // Validate required fields
  const missing = [];
  if (!email) missing.push("email");
  if (!password) missing.push("password");
  if (missing.length) {
    return res.status(400).json({ msg: "Missing required fields", missing });
  }

  email = email.toLowerCase();

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, password_hash, role, email_verified, first_name, last_name, referral_code")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    if (user.role === 'Intern') {
      if (!user.email_verified) return res.status(400).json({ msg: 'Please verify your registration OTP first.' });
    }
    
    // All users (Intern, Admin, Super Admin) log in directly with email/password
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ 
      msg: "Login successful", 
      token, 
      user: {
        id: user.id,
        firstname: user.first_name,
        lastname: user.last_name,
        email,
        role: user.role,
        referralCode: user.referral_code
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: "Server error during login", error: err.message });
  }
});

// OTP Verification for Login
router.post('/login-verify-otp', async (req, res) => {
  const { email: rawEmail, otp } = req.body;
  const email = rawEmail.toLowerCase();
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, otp, otp_expiry, role, first_name, last_name, referral_code")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) return res.status(400).json({ msg: 'User not found' });
    if (user.otp !== otp || !user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    await supabase
      .from("users")
      .update({
        otp: null,
        otp_expiry: null
      })
      .eq("id", user.id);

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ 
      msg: 'Login successful', 
      token, 
      user: {
        id: user.id,
        firstname: user.first_name,
        lastname: user.last_name,
        email,
        role: user.role,
        referralCode: user.referral_code
      } 
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error during login verification", error: err.message });
  }
});

// GET /api/auth/user - Get user details
router.get("/user", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// POST /api/auth/change-password
router.post("/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", req.user.id)
      .single();

    if (error || !user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", req.user.id);

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// POST /api/auth/send-email-otp
router.post("/send-email-otp", authMiddleware, async (req, res) => {
  try {
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase
      .from("users")
      .update({ otp, otp_expiry: otpExpiry })
      .eq("id", req.user.id);

    await sendOTP(req.user.email, otp);
    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// POST /api/auth/verify-email-otp
router.post("/verify-email-otp", authMiddleware, async (req, res) => {
  const { otp } = req.body;
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("otp, otp_expiry")
      .eq("id", req.user.id)
      .single();

    if (error || !user) return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp || !user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    await supabase
      .from("users")
      .update({ email_verified: true, otp: null, otp_expiry: null })
      .eq("id", req.user.id);

    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// POST /api/auth/send-sms-otp
router.post("/send-sms-otp", authMiddleware, async (req, res) => {
  try {
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase
      .from("users")
      .update({ otp, otp_expiry: otpExpiry })
      .eq("id", req.user.id);

    console.log(`[SMS OTP SIMULATION] OTP for phone of user ${req.user.email} is: ${otp}`);
    res.json({ msg: "SMS OTP sent successfully (simulated)" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// POST /api/auth/verify-sms-otp
router.post("/verify-sms-otp", authMiddleware, async (req, res) => {
  const { otp } = req.body;
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("otp, otp_expiry")
      .eq("id", req.user.id)
      .single();

    if (error || !user) return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp || !user.otp_expiry || new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    await supabase
      .from("users")
      .update({ phone_verified: true, otp: null, otp_expiry: null })
      .eq("id", req.user.id);

    res.json({ msg: "Phone number verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

module.exports = router;
