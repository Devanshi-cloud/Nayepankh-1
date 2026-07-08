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
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../portalTheme";
import OngoingIcon from "@mui/icons-material/ProductionQuantityLimits";

const OngoingCampaignsView = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({});
  const token = localStorage.getItem("token");

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
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [token]);

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
    }, 1000);
    return () => clearInterval(interval);
  }, [campaigns]);

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
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    const percentage = ((totalDuration - timeLeft) / totalDuration) * 100;
    return { days, hours, minutes, seconds, percentage };
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Card sx={{ bgcolor: "primary.main", color: "white", borderRadius: 3, boxShadow: 2, px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
              <OngoingIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Ongoing Campaigns
              </Typography>
            </Card>
          </Box>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <LinearProgress color="primary" sx={{ width: "50%" }} />
            </Box>
          ) : campaigns.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "text.secondary", fontSize: "1.2rem" }}>
              No ongoing campaigns found.
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {campaigns.map((campaign) => {
                const { days, hours, minutes, seconds, percentage } =
                  timeRemaining[campaign._id] || getTimeRemaining(campaign.startDate, campaign.endDate);
                return (
                  <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                    <Card
                      sx={{
                        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                        borderRadius: 3,
                        bgcolor: "white",
                        position: "relative",
                        overflow: "visible",
                        minHeight: 220,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                          {campaign.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                          {campaign.description}
                        </Typography>
                        <Chip
                          label={`Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`}
                          color="primary"
                          sx={{ mb: 1, fontWeight: 600 }}
                        />
                        <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 600 }}>
                          Goal Amount: ₹{campaign.goalAmount?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Start: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "-"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          End: {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "-"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default OngoingCampaignsView; 