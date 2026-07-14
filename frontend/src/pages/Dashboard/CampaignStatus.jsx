import { useState, useEffect } from "react";
import { buildApiUrl } from '../../constants.js';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Container,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#216eb6", // Logo-matching blue
    },
    secondary: {
      main: "#42A5F5", // Lighter blue
    },
    background: {
      default: "#E3F2FD", // Very light blue
    },
    lightBlue: {
      main: "#BBDEFB", // Light blue for accents
    },
    text: {
      primary: "#263238", // Darker gray for contrast
      secondary: "#546E7A", // Softer gray for secondary text
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const CampaignStatus = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [timers, setTimers] = useState({});
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({ referralCode: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view campaigns");
        return;
      }

      try {
        const response = await fetch(buildApiUrl("/api/auth/user"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const { referralCode } = data.user;
          setUserDetails({
            referralCode: /^[A-Za-z0-9]+$/.test(referralCode)
              ? referralCode
              : "",
          });
        } else {
          setError(data.msg || "Failed to fetch user details");
        }
      } catch (err) {
        setError("Failed to fetch user details");
        console.error(err);
      }
    };

    const fetchCampaigns = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view campaigns");
        return;
      }

      setIsLoading(true);
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
          const validCampaigns = data.campaigns || [];
          setCampaigns(
            validCampaigns.filter((c) => c && c._id)
          );
        } else {
          setError(data.msg || "Failed to load campaigns");
        }
      } catch (err) {
        setError("Failed to fetch campaigns");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      campaigns.forEach((campaign) => {
        const endDate = new Date(campaign.endDate);
        const now = new Date();
        const timeLeft = endDate - now;

        if (timeLeft > 0) {
          const totalTime = endDate - new Date(campaign.startDate);
          const progress = ((totalTime - timeLeft) / totalTime) * 100;
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newTimers[campaign._id] = {
            time: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            progress: Math.min(progress, 100),
          };
        } else {
          newTimers[campaign._id] = { time: "Ended", progress: 100 };
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [campaigns]);

  const formatPrettyTimer = (timeStr) => {
    if (timeStr === "Ended") {
      return (
        <Typography
          variant="body2"
          color="error.main"
          sx={{
            fontWeight: 600,
            textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)",
          }}
        >
          Campaign Ended
        </Typography>
      );
    }
    const parts = timeStr.split(" ");
    return (
      <Typography
        variant="body2"
        color="primary.main"
        sx={{
          fontWeight: 500,
          fontStyle: "italic",
          textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)",
          display: "inline-flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        {parts.map((part, index) => (
          <span
            key={index}
            style={{ marginRight: index < parts.length - 1 ? "4px" : 0 }}
          >
            {part}
          </span>
        ))}
      </Typography>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          p: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              mb: { xs: 4, md: 6 },
              textAlign: "center",
              color: "primary.main",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Ongoing Campaigns
          </Typography>
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 2, md: 4 },
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
          {error && (
            <Typography
              color="error"
              sx={{
                mb: { xs: 2, md: 4 },
                textAlign: "center",
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                fontWeight: 500,
              }}
            >
              {error}
            </Typography>
          )}
          {campaigns.length === 0 && !error && (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                color: "text.secondary",
                mb: { xs: 4, md: 6 },
              }}
            >
              No ongoing campaigns found.
            </Typography>
          )}
          {campaigns.length > 0 && (
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {campaigns.map((campaign) => (
                <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                  <Card
                    sx={{
                      boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
                      borderRadius: 3,
                      bgcolor: "white",
                      border: `2px solid ${theme.palette.primary.main}`,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0px 12px 35px rgba(0, 0, 0, 0.25)",
                      },
                      mb: { xs: 4, md: 6 },
                    }}
                  >
                    <CardHeader
                      title={formatPrettyTimer(
                        timers[campaign._id]?.time || "Calculating..."
                      )}
                      sx={{
                        bgcolor: theme.palette.lightBlue.main,
                        color: "primary.main",
                        borderRadius: "3px 3px 0 0",
                        p: { xs: 1, md: 2 },
                        textAlign: "center",
                        fontWeight: 600,
                        textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={timers[campaign._id]?.progress || 0}
                      sx={{
                        height: 8,
                        borderRadius: "0 0 3px 3px",
                        bgcolor: "grey.300",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: theme.palette.primary.main,
                          borderRadius: "0 0 3px 3px",
                        },
                      }}
                    />
                    <CardContent
                      sx={{ p: { xs: 2, md: 4 }, pt: { xs: 1, md: 2 } }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          mb: { xs: 2, md: 3 },
                          color: "primary.main",
                          fontWeight: 600,
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                          fontSize: { xs: "1.5rem", md: "2rem" },
                        }}
                      >
                        {campaign.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          mb: { xs: 2, md: 3 },
                          lineHeight: 1.6,
                          fontStyle: "italic",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        {campaign.description}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: { xs: 1, md: 2 },
                          fontWeight: 500,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        Goal: ₹{campaign.goalAmount.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: { xs: 2, md: 3 },
                          fontWeight: 500,
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        Raised: ₹{campaign.raisedAmount.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          Math.min(
                            (campaign.raisedAmount / campaign.goalAmount) * 100,
                            100
                          ) || 0
                        }
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "grey.300",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "secondary.main",
                          },
                          mb: { xs: 2, md: 3 },
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          mb: { xs: 2, md: 3 },
                          textAlign: "center",
                          color: "text.secondary",
                          fontWeight: 500,
                          textShadow: "0.5px 0.5px 1px rgba(0, 0, 0, 0.05)",
                          fontSize: { xs: "0.8rem", md: "0.9rem" },
                        }}
                      >
                        {Math.round(
                          (campaign.raisedAmount / campaign.goalAmount) * 100
                        ) || 0}
                        % of goal reached
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CampaignStatus;
