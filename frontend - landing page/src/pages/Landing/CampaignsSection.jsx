import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { VolunteerActivismOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../constants";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const BLUE_GRADIENT = "linear-gradient(135deg, #1976D2, #1565C0)";
const BLUE_GRADIENT_LIGHT = "linear-gradient(135deg, #42A5F5, #2196F3)";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function CampaignCard({ campaign, index, onDonate }) {
  const progress = Math.min(
    Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
    100
  );

  return (
    <motion.div variants={cardVariants}>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          border: "1px solid rgba(0,0,0,0.06)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            borderColor: "#1976D2",
          },
        }}
      >
        {/* Progress Header */}
        <Box
          sx={{
            height: 6,
            bgcolor: "rgba(0,0,0,0.04)",
            borderRadius: "4px 4px 0 0",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={prefersReducedMotion ? {} : { width: 0 }}
            whileInView={prefersReducedMotion ? {} : { width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
            style={{
              height: "100%",
              borderRadius: "inherit",
              background: `linear-gradient(90deg, ${progress > 60 ? "#1976D2" : progress > 30 ? "#42A5F5" : "#FF7043"}, ${progress > 60 ? "#1565C0" : progress > 30 ? "#2196F3" : "#E64A19"})`,
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, p: { xs: 3, md: 4 } }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              color: "#1A237E",
              mb: 1.5,
              fontSize: { xs: "1.1rem", md: "1.2rem" },
              lineHeight: 1.3,
            }}
          >
            {campaign.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.7,
              fontSize: { xs: "0.875rem", md: "0.95rem" },
            }}
          >
            {campaign.description}
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary" }}
              >
                Progress
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: progress > 60 ? "#1976D2" : "#42A5F5" }}
              >
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(25,118,210,0.1)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: BLUE_GRADIENT,
                },
              }}
            />
          </Box>

          {/* Amount Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block" }}
              >
                Raised
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#1976D2" }}
              >
                ₹{campaign.raisedAmount?.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block" }}
              >
                Goal
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#37474F" }}
              >
                ₹{campaign.goalAmount?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 4 } }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onDonate(campaign)}
            startIcon={<VolunteerActivismOutlined />}
            sx={{
              background: BLUE_GRADIENT,
              color: "#FFFFFF",
              fontWeight: 700,
              py: 1.3,
              borderRadius: 3,
              textTransform: "none",
              fontSize: { xs: "0.9rem", md: "0.95rem" },
              boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
              "&:hover": {
                background: BLUE_GRADIENT_LIGHT,
                transform: "scale(1.02)",
                boxShadow: "0 8px 25px rgba(25,118,210,0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Support This Campaign
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
}

export default function CampaignsSection() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const fetchCampaigns = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/donate/public"), {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.msg || data.error || `HTTP ${response.status}`);
        }
        if (!data.campaigns?.length) {
          throw new Error("No active campaigns available.");
        }
        setCampaigns(data.campaigns);
      } catch (err) {
        clearTimeout(timeout);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const handleDonate = (campaign) => {
    navigate(`/donate?campaign=${campaign._id}`);
  };

  return (
    <Box
      id="campaigns"
      component="section"
      aria-label="Active Campaigns"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: "#FFFFFF",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="overline"
            component="span"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 3,
              display: "block",
              textAlign: "center",
              mb: 1,
              fontSize: "0.85rem",
            }}
          >
            OUR CAMPAIGNS
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              color: "#2C3E50",
              textAlign: "center",
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Make a Direct Impact
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
              mb: 6,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            Every contribution brings us closer to our goals. Support an ongoing campaign and be the change you wish to see.
          </Typography>
        </motion.div>

        {/* Campaigns Grid */}
        <Grid
          container
          spacing={4}
          component={motion.div}
          variants={containerVariants}
          initial={prefersReducedMotion ? {} : "hidden"}
          whileInView={prefersReducedMotion ? {} : "visible"}
          viewport={{ once: true, margin: "-50px" }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton
                  variant="rounded"
                  height={350}
                  animation="wave"
                  sx={{ borderRadius: 4, bgcolor: "grey.100" }}
                />
              </Grid>
            ))
          ) : error ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 4,
                  bgcolor: "#FFF5F5",
                  borderRadius: 4,
                  border: "1px solid #FFCDD2",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#C62828", fontWeight: 700, mb: 2 }}
                >
                  Unable to Load Campaigns
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#C62828", mb: 3, opacity: 0.8 }}
                >
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  sx={{
                    color: "#C62828",
                    borderColor: "#C62828",
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Retry
                </Button>
              </Box>
            </Grid>
          ) : (
            campaigns.map((campaign, index) => (
              <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                <CampaignCard
                  campaign={campaign}
                  index={index}
                  onDonate={handleDonate}
                />
              </Grid>
            ))
          )}
        </Grid>

        {/* View All CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/donate")}
            sx={{
              color: "#37474F",
              borderColor: "rgba(0,0,0,0.2)",
              borderWidth: 2,
              fontWeight: 600,
              py: 1.5,
              px: 4,
              borderRadius: 50,
              textTransform: "none",
              fontSize: { xs: "0.95rem", md: "1rem" },
              "&:hover": {
                borderColor: "#1976D2",
                color: "#1976D2",
                bgcolor: "rgba(25,118,210,0.05)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View All Campaigns
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
}
