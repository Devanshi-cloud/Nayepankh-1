const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const {
  authMiddleware,
  superAdminMiddleware,
  moderatorViewMiddleware,
} = require("../middleware/authMiddleware");
const supabase = require("../config/supabaseClient");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // limit to 2MB
});

const router = express.Router();

// GET /api/users - Fetch all users (Super Admin and Moderator only)
router.get("/", [authMiddleware, moderatorViewMiddleware], async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, role, referral_code, email_verified, created_at");

    if (error) throw error;

    // Map column names to match frontend expectations (e.g. first_name -> firstname)
    const formattedUsers = users.map(u => ({
      _id: u.id,
      firstname: u.first_name,
      lastname: u.last_name,
      email: u.email,
      role: u.role,
      referralCode: u.referral_code,
      email_verified: u.email_verified,
      created_at: u.created_at
    }));

    res.status(200).json({ users: formattedUsers });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ msg: "Server Error fetching users", error: err.message });
  }
});

// PUT /api/users/:id - Update a user (Super Admin only)
router.put("/:id", [authMiddleware, superAdminMiddleware], async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    referralCode,
  } = req.body;

  if (!firstname && !lastname && !email && !password && !referralCode) {
    return res.status(400).json({
      msg: "At least one field must be provided to update",
      missing: ["firstname", "lastname", "email", "password", "referralCode"]
    });
  }

  try {
    const updateData = {};
    if (firstname) updateData.first_name = firstname;
    if (lastname) updateData.last_name = lastname;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }
    if (referralCode) updateData.referral_code = referralCode;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    const formattedUser = {
      _id: updatedUser.id,
      firstname: updatedUser.first_name,
      lastname: updatedUser.last_name,
      email: updatedUser.email,
      role: updatedUser.role,
      referralCode: updatedUser.referral_code
    };

    res.status(200).json({ user: formattedUser, msg: "User updated successfully" });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ msg: "Server Error updating user", error: err.message });
  }
});

// DELETE /api/users/:id - Delete a user (Super Admin only)
router.delete(
  "/:id",
  [authMiddleware, superAdminMiddleware],
  async (req, res) => {
    try {
      const { data: userToCheck } = await supabase
        .from("users")
        .select("id")
        .eq("id", req.params.id)
        .maybeSingle();

      if (!userToCheck) return res.status(404).json({ msg: "User not found" });

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", req.params.id);

      if (error) throw error;

      res.status(200).json({ msg: "User deleted successfully" });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ msg: "Server Error deleting user", error: err.message });
    }
  }
);

// POST /api/users/upload-avatar - Upload profile avatar to Cloudinary
router.post(
  "/upload-avatar",
  [authMiddleware, upload.single("avatar")],
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    try {
      // Upload image stream to Cloudinary
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "nayepankh_avatars",
              public_id: `avatar_${req.user.id}`,
              overwrite: true,
              resource_type: "image"
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadStream();
      const avatarUrl = result.secure_url;

      // Update avatar URL in Supabase database
      const { error: dbError } = await supabase
        .from("users")
        .update({ avatar: avatarUrl })
        .eq("id", req.user.id);

      if (dbError) throw dbError;

      res.status(200).json({ avatarUrl, msg: "Avatar uploaded successfully" });
    } catch (err) {
      console.error("Avatar upload error:", err);
      res.status(500).json({ msg: "Server Error uploading avatar", error: err.message });
    }
  }
);

module.exports = router;
