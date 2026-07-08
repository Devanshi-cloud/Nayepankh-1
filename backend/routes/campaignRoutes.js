const express = require("express");
const {
  authMiddleware,
  superAdminMiddleware,
} = require("../middleware/authMiddleware");
const supabase = require("../config/supabaseClient");

const router = express.Router();

// POST /api/campaign - Create a new campaign (Super Admin only)
router.post("/", [authMiddleware, superAdminMiddleware], async (req, res) => {
  const { title, description, goalAmount, startDate, endDate } = req.body;

  // Validate required fields
  const missing = [];
  if (!title) missing.push("title");
  if (!description) missing.push("description");
  if (!goalAmount) missing.push("goalAmount");
  if (!startDate) missing.push("startDate");
  if (!endDate) missing.push("endDate");
  if (missing.length) {
    return res.status(400).json({
      msg: "Missing required fields",
      missing
    });
  }

  try {
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        title,
        description,
        goal_amount: goalAmount,
        start_date: startDate,
        end_date: endDate
      })
      .select()
      .single();

    if (error) throw error;

    const formattedCampaign = {
      _id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goal_amount,
      raisedAmount: campaign.raised_amount,
      startDate: campaign.start_date,
      endDate: campaign.end_date
    };

    res.status(201).json({ campaign: formattedCampaign, msg: "Campaign created successfully" });
  } catch (err) {
    console.error('Error creating campaign:', err);
    res.status(500).json({ msg: "Server Error creating campaign", error: err.message });
  }
});

// GET /api/campaign - Fetch all campaigns (for Super Admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!campaigns || !campaigns.length) {
      return res.status(404).json({ msg: "No campaigns found" });
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
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ msg: "Server Error fetching campaigns", error: err.message });
  }
});

// PUT /api/campaign/:id - Update a campaign (Super Admin only)
router.put("/:id", [authMiddleware, superAdminMiddleware], async (req, res) => {
  const { title, description, goalAmount, startDate, endDate } = req.body;
  if (!title && !description && !goalAmount && !startDate && !endDate) {
    return res.status(400).json({
      msg: "At least one field must be provided to update",
      missing: ["title", "description", "goalAmount", "startDate", "endDate"]
    });
  }

  try {
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (goalAmount) updateData.goal_amount = goalAmount;
    if (startDate) updateData.start_date = startDate;
    if (endDate) updateData.end_date = endDate;

    const { data: campaign, error } = await supabase
      .from("campaigns")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!campaign) return res.status(404).json({ msg: "Campaign not found" });

    const formattedCampaign = {
      _id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goal_amount,
      raisedAmount: campaign.raised_amount,
      startDate: campaign.start_date,
      endDate: campaign.end_date
    };

    res.status(200).json({ campaign: formattedCampaign, msg: "Campaign updated successfully" });
  } catch (err) {
    console.error('Error updating campaign:', err);
    res.status(500).json({ msg: "Server Error updating campaign", error: err.message });
  }
});

// PUT /api/campaign/:id/extend - Extend campaign end date (Super Admin only)
router.put(
  "/:id/extend",
  [authMiddleware, superAdminMiddleware],
  async (req, res) => {
    try {
      const { duration } = req.body;
      if (!duration || typeof duration !== "number" || duration <= 0) {
        return res
          .status(400)
          .json({ msg: "Valid positive duration in milliseconds is required", missing: ["duration"] });
      }

      const { data: campaignToCheck, error: checkError } = await supabase
        .from("campaigns")
        .select("id, end_date")
        .eq("id", req.params.id)
        .maybeSingle();

      if (checkError || !campaignToCheck) return res.status(404).json({ msg: "Campaign not found" });

      const currentEndDate = new Date(campaignToCheck.end_date);
      const newEndDate = new Date(currentEndDate.getTime() + duration).toISOString().split("T")[0];

      const { data: campaign, error } = await supabase
        .from("campaigns")
        .update({ end_date: newEndDate })
        .eq("id", req.params.id)
        .select()
        .single();

      if (error) throw error;

      const formattedCampaign = {
        _id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goalAmount: campaign.goal_amount,
        raisedAmount: campaign.raised_amount,
        startDate: campaign.start_date,
        endDate: campaign.end_date
      };

      res.status(200).json({ campaign: formattedCampaign, msg: "Campaign extended successfully" });
    } catch (err) {
      console.error('Error extending campaign:', err);
      res.status(500).json({ msg: "Server Error extending campaign", error: err.message });
    }
  }
);

// DELETE /api/campaign/:id - Delete a campaign (Super Admin only)
router.delete(
  "/:id",
  [authMiddleware, superAdminMiddleware],
  async (req, res) => {
    try {
      const { data: campaign, error: checkError } = await supabase
        .from("campaigns")
        .select("id")
        .eq("id", req.params.id)
        .maybeSingle();

      if (checkError || !campaign) return res.status(404).json({ msg: "Campaign not found" });

      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", req.params.id);

      if (error) throw error;

      res.status(200).json({ msg: "Campaign deleted successfully" });
    } catch (err) {
      console.error('Error deleting campaign:', err);
      res.status(500).json({ msg: "Server Error deleting campaign", error: err.message });
    }
  }
);

module.exports = router;
