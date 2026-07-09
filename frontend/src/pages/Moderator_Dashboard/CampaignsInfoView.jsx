import { useState, useEffect } from "react";
import { buildApiUrl } from '../../constants.js';
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import OngoingIcon from "@mui/icons-material/ProductionQuantityLimits";

const CampaignsInfoView = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(buildApiUrl("/api/campaign"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setCampaigns(data.campaigns || []);
        }
      } catch (err) {
        // Optionally handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, [token]);

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.default", minHeight: "60vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Card sx={{ bgcolor: "primary.main", color: "white", borderRadius: 3, boxShadow: 2, px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
            <OngoingIcon sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Campaigns Info
            </Typography>
          </Card>
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
                      borderTop: `8px solid ${isLive ? '#216EB6' : '#bdbdbd'}`,
                    }}
                  >
                    <CardContent sx={{ p: 3, pt: 5 }}>
                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                        {campaign.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                        {campaign.description}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
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
  );
};

export default CampaignsInfoView; 