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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dialog as MuiDialog } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const InternsList = () => {
  const [interns, setInterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    internshipPeriod: "1 week", // Default value to keep it controlled
  });
  const token = localStorage.getItem("token");
  const [donationsModalOpen, setDonationsModalOpen] = useState(false);
  const [selectedDonations, setSelectedDonations] = useState([]);
  const [selectedInternName, setSelectedInternName] = useState("");

  const internshipPeriods = [
    "1 week",
    "2 weeks",
    "1 month",
    "3 months",
    "6 months",
  ];

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/users"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const internList = data.users.filter(
            (user) => user.role === "Intern"
          );
          
          // Fetch donations for each intern
          const internsWithDonations = await Promise.all(
            internList.map(async (intern) => {
              try {
                const donationsResponse = await fetch(
                  buildApiUrl("/api/donations/by-referral/${intern.referralCode}"),
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                const donationsData = await donationsResponse.json();
                const totalDonations = (donationsData.donations || []).reduce(
                  (sum, donation) => sum + (donation.amount || 0),
                  0
                );
                const stipendAmount = totalDonations * 0.20; // 20% of total donations
                
                return {
                  ...intern,
                  totalDonations,
                  stipendAmount,
                };
              } catch (error) {
                console.error(`Error fetching donations for intern ${intern._id}:`, error);
                return {
                  ...intern,
                  totalDonations: 0,
                  stipendAmount: 0,
                };
              }
            })
          );
          
          setInterns(internsWithDonations);
        } else {
          toast.error(data.msg || "Failed to fetch interns. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching interns:", error);
        toast.error(
          "Network error while fetching interns. Check your connection."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterns();
  }, [token]);

  // Generate referral code
  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Add Intern
  const handleAddIntern = async () => {
    const { firstname, lastname, email, password, internshipPeriod } = formData;
    if (!firstname || !lastname || !email || !password || !internshipPeriod) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const referralCode = generateReferralCode();
      const response = await fetch(buildApiUrl("/api/auth/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          referralCode,
          internshipPeriod,
          role: "Intern",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Ensure internshipPeriod is included in the state update
        setInterns([...interns, { ...data.user, internshipPeriod }]);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          internshipPeriod: "1 week",
        });
        setAddDialogOpen(false);
        toast.success("Intern added successfully!");
      } else {
        toast.error(data.msg || "Failed to add intern. Please try again.");
      }
    } catch (error) {
      console.error("Error adding intern:", error);
      toast.error("Network error while adding intern. Check your connection.");
    }
  };

  // Edit Intern
  const handleEditClick = (intern) => {
    setSelectedIntern(intern);
    setFormData({
      firstname: intern.firstname,
      lastname: intern.lastname,
      email: intern.email,
      password: "",
      internshipPeriod: intern.internshipPeriod || "1 week", // Fallback to "1 week" if missing
    });
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!selectedIntern?._id) {
      toast.error("No intern selected for update.");
      setEditDialogOpen(false);
      return;
    }
    const { firstname, lastname, email, password, internshipPeriod } = formData;
    if (!firstname || !lastname || !email || !internshipPeriod) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch(
        buildApiUrl("/api/users/${selectedIntern._id}"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            ...(password && { password }),
            internshipPeriod,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setInterns(
          interns.map((intern) =>
            intern._id === selectedIntern._id
              ? { ...intern, ...data.user, internshipPeriod }
              : intern
          )
        );
        setEditDialogOpen(false);
        toast.success("Intern updated successfully!");
      } else {
        toast.error(data.msg || "Failed to update intern. Please try again.");
      }
    } catch (error) {
      console.error("Error updating intern:", error);
      toast.error(
        "Network error while updating intern. Check your connection."
      );
    }
  };

  // Delete Intern
  const handleDeleteClick = (intern) => {
    setSelectedIntern(intern);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIntern?._id) {
      toast.error("No intern selected for deletion.");
      setDeleteDialogOpen(false);
      return;
    }
    try {
      const response = await fetch(
        buildApiUrl("/api/users/${selectedIntern._id}"),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setInterns(
          interns.filter((intern) => intern._id !== selectedIntern._id)
        );
        setDeleteDialogOpen(false);
        toast.success("Intern deleted successfully!");
      } else {
        toast.error(data.msg || "Failed to delete intern. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting intern:", error);
      toast.error(
        "Network error while deleting intern. Check your connection."
      );
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
          p: { xs: 2, sm: 4, md: 6 },
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 3, sm: 5 },
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "2.5rem" },
                textShadow: "1px 1px 4px rgba(0,0,0,0.1)",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Interns Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "#1E5FA4" },
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: 1.5,
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Add Intern
            </Button>
          </Box>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" size={48} />
            </Box>
          ) : interns.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                fontSize: "1.2rem",
                py: 4,
              }}
            >
              No interns found.
            </Typography>
          ) : (
            <Card
              sx={{
                boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: { xs: 300, sm: 650 } }}
                    aria-label="interns table"
                  >
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.main" }}>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Referral Code
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Internship Period
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Total Amount Raised By Intern
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Stipend Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interns.map((intern) => (
                        <TableRow
                          key={intern._id} // Unique key for each row
                          sx={{
                            "&:hover": { bgcolor: "rgba(33,110,182,0.05)" },
                            transition: "background-color 0.3s",
                          }}
                        >
                          <TableCell
                            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
                          >
                            {`${intern.firstname} ${intern.lastname}`}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
                          >
                            {intern.email}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
                          >
                            {intern.referralCode}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
                          >
                            {intern.internshipPeriod || "N/A"}{" "}
                            {/* Fallback if missing */}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" }, textAlign: 'center' }}
                          >
                            <Tooltip title="View all donations" arrow>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  borderRadius: 2,
                                  fontWeight: 600,
                                  px: 2,
                                  py: 0.5,
                                  fontSize: { xs: '0.8rem', sm: '0.95rem' },
                                  minWidth: 'unset',
                                  boxShadow: 1,
                                  '&:hover': { bgcolor: '#1E5FA4' },
                                }}
                                onClick={async () => {
                                  setSelectedInternName(`${intern.firstname} ${intern.lastname}`);
                                  try {
                                    const donationsResponse = await fetch(
                                      buildApiUrl("/api/donations/by-referral/${intern.referralCode}"),
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    const donationsData = await donationsResponse.json();
                                    setSelectedDonations(donationsData.donations || []);
                                    setDonationsModalOpen(true);
                                  } catch (error) {
                                    toast.error("Failed to fetch donations for this intern.");
                                  }
                                }}
                              >
                                ₹{intern.totalDonations?.toLocaleString() || 0}
                              </Button>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
                          >
                            ₹{intern.stipendAmount?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title="Edit Intern Details"
                              enterDelay={300}
                              leaveDelay={200}
                            >
                              <IconButton
                                color="primary"
                                onClick={() => handleEditClick(intern)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "rgba(33,110,182,0.1)",
                                  },
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title="Delete Intern"
                              enterDelay={300}
                              leaveDelay={200}
                            >
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(intern)}
                                sx={{
                                  "&:hover": { bgcolor: "rgba(211,47,47,0.1)" },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Add Intern Dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 3,
              boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
              width: { xs: "90%", sm: "400px" },
              p: 1,
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
            Register New Intern
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <TextField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Internship Period</InputLabel>
                <Select
                  label="Internship Period"
                  name="internshipPeriod"
                  value={formData.internshipPeriod}
                  onChange={handleInputChange}
                  required
                  sx={{
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  {internshipPeriods.map((period) => (
                    <MenuItem key={period} value={period}>
                      {period}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button
              onClick={() => setAddDialogOpen(false)}
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
              onClick={handleAddIntern}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "#1E5FA4" },
                px: 3,
                py: 1,
              }}
            >
              Add Intern
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Intern Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 3,
              boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
              width: { xs: "90%", sm: "400px" },
              p: 1,
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
            Edit Intern Details
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <TextField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <TextField
                label="New Password (optional)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel>Internship Period</InputLabel>
                <Select
                  label="Internship Period"
                  name="internshipPeriod"
                  value={formData.internshipPeriod}
                  onChange={handleInputChange}
                  required
                  sx={{
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  {internshipPeriods.map((period) => (
                    <MenuItem key={period} value={period}>
                      {period}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
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
              onClick={handleEditConfirm}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "#1E5FA4" },
                px: 3,
                py: 1,
              }}
            >
              Update Intern
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Intern Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 3,
              boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
              width: { xs: "90%", sm: "400px" },
              p: 1,
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
              This action is irreversible. Are you sure you want to delete{" "}
              <strong>
                {selectedIntern?.firstname} {selectedIntern?.lastname}
              </strong>
              ?
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

        <MuiDialog
          open={donationsModalOpen}
          onClose={() => setDonationsModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 6,
              m: { xs: 1, sm: 3 },
              bgcolor: 'background.default',
            },
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              letterSpacing: 1,
              textAlign: 'center',
              py: 2,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              mb: 2,
            }}
          >
            Donations Raised by {selectedInternName}
          </DialogTitle>
          <DialogContent
            sx={{
              bgcolor: 'background.default',
              px: { xs: 1, sm: 4 },
              pt: 0,
              pb: 2,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              minHeight: 120,
              maxHeight: { xs: 350, sm: 500 },
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            {selectedDonations.length === 0 ? (
              <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No donations found for this intern.
              </Typography>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  overflowX: 'auto',
                  maxWidth: '100%',
                  p: { xs: 1, sm: 2 },
                }}
              >
                <Table size="small" sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main', position: 'sticky', top: 0, zIndex: 1 }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Donor Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Email</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Amount</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Date</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>Campaign Title</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDonations.map((donation, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          bgcolor: idx % 2 === 0 ? 'background.paper' : 'rgba(33,110,182,0.04)',
                          '&:hover': { bgcolor: 'rgba(33,110,182,0.10)' },
                          transition: 'background-color 0.2s',
                          borderRadius: 2,
                        }}
                      >
                        <TableCell sx={{ py: 1.2 }}>{donation.donorName || (donation.donor ? `${donation.donor.firstname} ${donation.donor.lastname}` : "-")}</TableCell>
                        <TableCell sx={{ py: 1.2 }}>{donation.email || "-"}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main', py: 1.2 }}>₹{donation.amount?.toLocaleString() || 0}</TableCell>
                        <TableCell sx={{ py: 1.2 }}>{donation.date ? new Date(donation.date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell sx={{ py: 1.2 }}>{donation.campaign?.title || donation.campaignDetails?.title || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'background.default', p: 2, justifyContent: 'center', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <Button
              onClick={() => setDonationsModalOpen(false)}
              variant="contained"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                fontSize: '1rem',
                boxShadow: 2,
                '&:hover': { bgcolor: '#1E5FA4' },
                width: { xs: '100%', sm: 'auto' },
                maxWidth: 300,
              }}
              fullWidth={true}
            >
              Close
            </Button>
          </DialogActions>
        </MuiDialog>

        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    </ThemeProvider>
  );
};

export default InternsList;
