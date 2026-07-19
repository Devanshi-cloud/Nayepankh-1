import { useState, useEffect } from "react";
import { buildApiUrl } from '../../constants.js';
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../portalTheme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TimerIcon from "@mui/icons-material/Timer";

const OngoingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
  });
  const [extendDuration, setExtendDuration] = useState("");
  const token = localStorage.getItem("token");

  // State to hold live time remaining for each campaign
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/campaign"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const ongoing = data.campaigns.filter(
            (campaign) => new Date(campaign.endDate) > new Date()
          );
          setCampaigns(ongoing);
          // Initialize time remaining for each campaign
          const initialTime = {};
          ongoing.forEach((campaign) => {
            initialTime[campaign._id] = getTimeRemaining(
              campaign.startDate,
              campaign.endDate
            );
          });
          setTimeRemaining(initialTime);
        } else {
          toast.error(data.msg || "Failed to fetch campaigns");
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Error fetching campaigns");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [token]);

  // Live timer update
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTime = {};
      campaigns.forEach((campaign) => {
        updatedTime[campaign._id] = getTimeRemaining(
          campaign.startDate,
          campaign.endDate
        );
      });
      setTimeRemaining(updatedTime);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [campaigns]);

  // Timer Calculation
  const getTimeRemaining = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDuration = end - start;
    const timeLeft = end - now;

    if (timeLeft <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, percentage: 100 };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    const percentage = ((totalDuration - timeLeft) / totalDuration) * 100;

    return { days, hours, minutes, seconds, percentage };
  };

  // Delete Campaign
  const handleDeleteClick = (campaign) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        buildApiUrl(`/api/campaign/${campaignToDelete._id}`),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCampaigns(campaigns.filter((c) => c._id !== campaignToDelete._id));
        toast.success("Campaign deleted successfully");
      } else {
        toast.error(data.msg || "Failed to delete campaign");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Error deleting campaign");
    } finally {
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  // Update Campaign
  const handleUpdateClick = (campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      startDate: campaign.startDate.slice(0, 16),
      endDate: campaign.endDate.slice(0, 16),
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateConfirm = async () => {
    try {
      const response = await fetch(
        buildApiUrl(`/api/campaign/${selectedCampaign._id}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            goalAmount: parseFloat(formData.goalAmount),
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCampaigns(
          campaigns.map((c) =>
            c._id === selectedCampaign._id ? data.campaign : c
          )
        );
        toast.success("Campaign updated successfully");
        setUpdateDialogOpen(false);
      } else {
        toast.error(data.msg || "Failed to update campaign");
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Error updating campaign");
    }
  };

  // Extend Campaign
  const handleExtendClick = (campaign) => {
    setSelectedCampaign(campaign);
    setExtendDialogOpen(true);
  };

  const handleExtendConfirm = async () => {
    if (!extendDuration || isNaN(extendDuration) || extendDuration <= 0) {
      toast.error("Please enter a valid number of days");
      return;
    }
    try {
      const response = await fetch(
        buildApiUrl(`/api/campaign/${selectedCampaign._id}/extend`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            duration: extendDuration * 24 * 60 * 60 * 1000, // Convert days to milliseconds
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Campaign extended successfully");
        setExtendDialogOpen(false);
        setExtendDuration("");
        fetchCampaigns(); // <-- Re-fetch all campaigns after extension
      } else {
        toast.error(data.msg || "Failed to extend campaign");
      }
    } catch (error) {
      console.error("Error extending campaign:", error);
      toast.error("Error extending campaign");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 2, sm: 4 },
              textAlign: "center",
              color: "primary.main",
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2.5rem" },
              textShadow: "1px 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            Ongoing Campaigns
          </Typography>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <LinearProgress color="primary" sx={{ width: "50%" }} />
            </Box>
          ) : campaigns.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                fontSize: "1.2rem",
              }}
            >
              No ongoing campaigns found.
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {campaigns.map((campaign) => {
                const { days, hours, minutes, seconds, percentage } =
                  timeRemaining[campaign._id] ||
                  getTimeRemaining(campaign.startDate, campaign.endDate);
                return (
                  <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                    <Card
                      sx={{
                        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                        borderRadius: 3,
                        bgcolor: "white",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0px 12px 30px rgba(0,0,0,0.2)",
                        },
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "primary.main",
                            fontWeight: 700,
                            mb: 1.5,
                          }}
                        >
                          {campaign.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            mb: 2,
                            height: 60,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {campaign.description}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, mb: 1 }}
                        >
                          Goal: ₹{campaign.goalAmount.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, mb: 2 }}
                        >
                          Raised: ₹{campaign.raisedAmount.toLocaleString()}
                        </Typography>
                        <Box sx={{ mb: 2, textAlign: "center" }}>
                          <Chip
                            label={`Ends: ${new Date(
                              campaign.endDate
                            ).toLocaleDateString()}`}
                            color="primary"
                            size="small"
                            sx={{
                              bgcolor: "secondary.main",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        {/* Live Timer with Horizontal Progress */}
                        <Box
                          sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 3,
                            bgcolor:
                              "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                            },
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 700,
                              color: "primary.main",
                              textAlign: "center",
                              mb: 1,
                            }}
                          >
                            {days}d {hours}h {minutes}m {seconds}s
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "#bbdefb",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: "primary.main",
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                              mt: 0.5,
                            }}
                          >
                            Time Remaining
                          </Typography>
                        </Box>
                        {/* Action Buttons */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleUpdateClick(campaign)}
                            sx={{
                              flex: 1,
                              minWidth: "80px",
                              borderRadius: 2,
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: "primary.light",
                                color: "white",
                                borderColor: "primary.main",
                              },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<TimerIcon />}
                            onClick={() => handleExtendClick(campaign)}
                            sx={{
                              flex: 1,
                              minWidth: "80px",
                              borderRadius: 2,
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: "secondary.light",
                                color: "white",
                                borderColor: "secondary.main",
                              },
                            }}
                          >
                            Extend
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(campaign)}
                            sx={{
                              flex: 1,
                              minWidth: "80px",
                              borderRadius: 2,
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: "error.light",
                                color: "white",
                                borderColor: "error.main",
                              },
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 3,
              boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
              width: { xs: "90%", sm: "400px" },
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontWeight: 600,
              py: 2,
            }}
          >
            Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Typography sx={{ color: "text.primary", fontSize: "1.1rem" }}>
              This action is irreversible. Are you sure you want to delete the
              campaign &quot;{campaignToDelete?.title}&quot;?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{
                color: "primary.main",
                borderColor: "primary.main",
                "&:hover": { bgcolor: "rgba(33,110,182,0.1)" },
                px: 3,
                py: 1,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              sx={{
                bgcolor: "#D32F2F",
                "&:hover": { bgcolor: "#B71C1C" },
                px: 3,
                py: 1,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Campaign Dialog */}
        <Dialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 3,
              boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
              width: { xs: "90%", sm: "500px" },
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontWeight: 600,
              py: 2,
            }}
          >
            Update Campaign
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goal Amount (INR)"
                  name="goalAmount"
                  type="number"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "primary.main" },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button
              onClick={() => setUpdateDialogOpen(false)}
              variant="outlined"
              sx={{
                color: "primary.main",
                borderColor: "primary.main",
                "&:hover": { bgcolor: "rgba(33,110,182,0.1)" },
                px: 3,
                py: 1,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateConfirm}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "#1E5FA4" },
                px: 3,
                py: 1,
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Extend Campaign Dialog */}
        <Dialog
          open={extendDialogOpen}
          onClose={() => setExtendDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 3,
              boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
              width: { xs: "90%", sm: "400px" },
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontWeight: 600,
              py: 2,
            }}
          >
            Extend Campaign Duration
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Typography sx={{ mb: 2, color: "text.primary" }}>
              Extend &quot;{selectedCampaign?.title}&quot; by how many days?
            </Typography>
            <TextField
              fullWidth
              label="Days to Extend"
              type="number"
              value={extendDuration}
              onChange={(e) => setExtendDuration(e.target.value)}
              variant="outlined"
              inputProps={{ min: 1 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "primary.main" },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button
              onClick={() => setExtendDialogOpen(false)}
              variant="outlined"
              sx={{
                color: "primary.main",
                borderColor: "primary.main",
                "&:hover": { bgcolor: "rgba(33,110,182,0.1)" },
                px: 3,
                py: 1,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExtendConfirm}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "#1E5FA4" },
                px: 3,
                py: 1,
              }}
            >
              Extend
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    </ThemeProvider>
  );
};

export default OngoingCampaigns;
