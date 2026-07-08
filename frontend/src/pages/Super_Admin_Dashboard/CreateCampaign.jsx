import { useState, useEffect } from "react";
import { buildApiUrl } from '../../constants.js';
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const theme = createTheme({
  palette: {
    primary: { main: "#216eb6" },
    secondary: { main: "#42A5F5" },
    background: { default: "#E3F2FD" },
    text: { primary: "#263238", secondary: "#546E7A" },
  },
  typography: { fontFamily: "'Poppins', sans-serif" },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
});

const CreateCampaigns = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to access this page", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "Super Admin") {
        toast.error("Access denied: Super Admin only", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/dashboard");
        return;
      }
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to create a campaign", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/login");
      return;
    }

    const { title, description, goalAmount, startDate, endDate } = formData;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validation
    if (!title || !description || !goalAmount || !startDate || !endDate) {
      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (isNaN(start) || isNaN(end) || start >= end) {
      toast.error("End date must be after start date", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (parseFloat(goalAmount) <= 0) {
      toast.error("Goal amount must be greater than 0", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl("/api/campaign"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          goalAmount: parseFloat(goalAmount),
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          title: "",
          description: "",
          goalAmount: "",
          startDate: "",
          endDate: "",
        });
        toast.success("Campaign created successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          onClose: () => setIsLoading(false),
        });
      } else {
        toast.error(data.msg || "Failed to create campaign", {
          position: "top-right",
          autoClose: 2000,
          onClose: () => setIsLoading(false),
        });
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        onClose: () => setIsLoading(false),
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 2, sm: 4 },
              textAlign: "center",
              color: "primary.main",
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2.5rem" },
            }}
          >
            Create a New Campaign
          </Typography>
          <Card sx={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.1)", borderRadius: 3, p: { xs: 1, sm: 2 } }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Box component="form" onSubmit={handleCreateCampaign}>
                <Grid container spacing={{ xs: 1, sm: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Campaign Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "primary.main" },
                          "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                        "& .MuiInputLabel-root": { color: "primary.main", fontSize: { xs: "0.9rem", sm: "1rem" } },
                        "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "primary.main" },
                          "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                        "& .MuiInputLabel-root": { color: "primary.main", fontSize: { xs: "0.9rem", sm: "1rem" } },
                        "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
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
                      required
                      inputProps={{ min: 1 }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "primary.main" },
                          "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                        "& .MuiInputLabel-root": { color: "primary.main", fontSize: { xs: "0.9rem", sm: "1rem" } },
                        "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
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
                      required
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "primary.main" },
                          "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                        "& .MuiInputLabel-root": { color: "primary.main", fontSize: { xs: "0.9rem", sm: "1rem" } },
                        "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
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
                      required
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": { borderColor: "primary.main" },
                          "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                        "& .MuiInputLabel-root": { color: "primary.main", fontSize: { xs: "0.9rem", sm: "1rem" } },
                        "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
                      }}
                    />
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <Typography
                        color="error"
                        sx={{ textAlign: "center", fontSize: { xs: "0.8rem", sm: "1rem" } }}
                      >
                        {error}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={isLoading}
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                        fontSize: { xs: "0.9rem", sm: "1.1rem" },
                        fontWeight: "bold",
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        "&:hover": { bgcolor: "#1E5FA4" },
                        position: "relative",
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: "white",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                          }}
                        />
                      ) : (
                        "Create Campaign"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Container>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
};

export default CreateCampaigns;