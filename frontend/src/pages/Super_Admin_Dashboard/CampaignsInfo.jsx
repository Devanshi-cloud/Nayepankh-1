import { useState, useEffect } from "react";
import { buildApiUrl } from '../../constants.js';
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Grid,
  Fab,
  Divider,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CampaignsInfo = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCampaigns();
  }, [token]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl("/api/campaign"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCampaigns(data.campaigns || []);
      } else {
        toast.error(data.msg || "Failed to fetch campaigns.");
      }
    } catch (err) {
      toast.error("Network error while fetching campaigns.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (campaign = null) => {
    setEditMode(!!campaign);
    setSelectedCampaign(campaign);
    setFormData(
      campaign
        ? {
            title: campaign.title,
            description: campaign.description,
            goalAmount: campaign.goalAmount,
            startDate: campaign.startDate ? campaign.startDate.slice(0, 10) : "",
            endDate: campaign.endDate ? campaign.endDate.slice(0, 10) : "",
          }
        : { title: "", description: "", goalAmount: "", startDate: "", endDate: "" }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCampaign(null);
    setFormData({ title: "", description: "", goalAmount: "", startDate: "", endDate: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { title, description, goalAmount, startDate, endDate } = formData;
    if (!title || !description || !goalAmount || !startDate || !endDate) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode
        ? buildApiUrl(`/api/campaign/${selectedCampaign._id}`)
        : buildApiUrl("/api/campaign");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, goalAmount, startDate, endDate }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(editMode ? "Campaign updated!" : "Campaign created!");
        fetchCampaigns();
        handleCloseDialog();
      } else {
        toast.error(data.msg || "Failed to save campaign.");
      }
    } catch (err) {
      toast.error("Network error while saving campaign.");
    }
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const response = await fetch(buildApiUrl(`/api/campaign/${campaign._id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Campaign deleted!");
        fetchCampaigns();
      } else {
        toast.error(data.msg || "Failed to delete campaign.");
      }
    } catch (err) {
      toast.error("Network error while deleting campaign.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.default", minHeight: "60vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 700 }}>
            Campaigns Info
          </Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="primary" size={48} />
          </Box>
        ) : campaigns.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "text.secondary", fontSize: "1.2rem", py: 4 }}>
            No campaigns found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {campaigns.map((campaign) => {
              const isLive = campaign.endDate && new Date(campaign.endDate) >= new Date();
              return (
                <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
                      p: 0,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      minHeight: 340,
                      position: "relative",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      '&:hover': { boxShadow: "0px 12px 32px rgba(33,110,182,0.15)", transform: "translateY(-4px)" },
                      bgcolor: 'background.paper',
                    }}
                  >
                    {/* Status Ribbon */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 110,
                        height: 32,
                        overflow: 'visible',
                        zIndex: 2,
                        pointerEvents: 'none',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: -32,
                          transform: 'rotate(45deg)',
                          bgcolor: isLive ? 'success.main' : 'grey.500',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          px: 4,
                          py: 0.5,
                          boxShadow: 2,
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          borderRadius: 1,
                          minWidth: 90,
                          textAlign: 'center',
                          pointerEvents: 'auto',
                        }}
                      >
                        {isLive ? 'Live' : 'Ended'}
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', p: 3, pb: 2 }}>
                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 800, mb: 1, fontSize: '1.25rem', minHeight: 32 }}>
                        {campaign.title}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", mb: 2, fontSize: '1.05rem', minHeight: 56, wordBreak: 'break-word' }}>
                        {campaign.description}
                      </Typography>
                      <Divider sx={{ my: 1, width: '100%' }} />
                      <Typography sx={{ fontWeight: 700, color: "primary.main", mb: 0.5, fontSize: '1.08rem' }}>
                        Goal: <span style={{ color: '#263238', fontWeight: 600 }}>₹{campaign.goalAmount?.toLocaleString()}</span>
                      </Typography>
                      <Typography sx={{ fontSize: '0.98rem', color: 'text.secondary', mb: 0.5 }}>
                        Start: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "-"}
                      </Typography>
                      <Typography sx={{ fontSize: '0.98rem', color: 'text.secondary', mb: 0 }}>
                        End: {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "-"}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2, pt: 0, mt: 'auto' }}>
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleOpenDialog(campaign)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(campaign)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", fontWeight: 700 }}>
          {editMode ? "Edit Campaign" : "Add Campaign"}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              variant="outlined"
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Goal Amount"
              name="goalAmount"
              type="number"
              value={formData.goalAmount}
              onChange={handleInputChange}
              required
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default CampaignsInfo; 