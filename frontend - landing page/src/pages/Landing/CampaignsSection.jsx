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
import { VolunteerActivismOutlined, CalendarMonthOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../constants";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const mockCampaigns = [
  {
    _id: "c1",
    title: "Empower Girls Education",
    description: "Provide school supplies, books, and uniforms to underprivileged girls in rural communities.",
    goalAmount: 150000,
    raisedAmount: 45000,
    endDate: "2026-08-31",
  },
  {
    _id: "c2",
    title: "Feed the Hungry",
    description: "Distribute monthly food rations and warm meals to families facing extreme poverty.",
    goalAmount: 200000,
    raisedAmount: 120000,
    endDate: "2026-09-30",
  },
  {
    _id: "c3",
    title: "Clean Water Initiative",
    description: "Install clean drinking water handpumps in dry districts to prevent waterborne illnesses.",
    goalAmount: 80000,
    raisedAmount: 62000,
    endDate: "2026-08-15",
  },
];

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
            borderColor: "primary.main",
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
              background: `linear-gradient(90deg, ${progress > 60 ? "#2ECC71" : progress > 30 ? "#F1C40F" : "#E74C3C"}, ${progress > 60 ? "#27AE60" : progress > 30 ? "#F39C12" : "#C0392B"})`,
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, p: { xs: 3, md: 4 } }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              color: "#2C3E50",
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
                sx={{ fontWeight: 700, color: progress > 60 ? "#2ECC71" : "#F1C40F" }}
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
                bgcolor: "rgba(0,0,0,0.06)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, #2ECC71, #27AE60)`,
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
                sx={{ fontWeight: 700, color: "primary.main" }}
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
                sx={{ fontWeight: 600, color: "#2C3E50" }}
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
              bgcolor: "#2ECC71",
              color: "#FFFFFF",
              fontWeight: 700,
              py: 1.3,
              borderRadius: 3,
              textTransform: "none",
              fontSize: { xs: "0.9rem", md: "0.95rem" },
              "&:hover": {
                bgcolor: "#27AE60",
                transform: "scale(1.02)",
                boxShadow: "0 8px 25px rgba(46,204,113,0.3)",
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

  useEffect(() => {
    const controller = new AbortController();
    // Abort fetch after 5s to avoid hanging on loading skeletons
    const timeout = setTimeout(() => controller.abort(), 5000);

    const fetchCampaigns = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/donate/public"), {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await response.json();
        if (response.ok && data.campaigns?.length) {
          setCampaigns(data.campaigns);
        } else {
          setCampaigns(mockCampaigns);
        }
      } catch {
        clearTimeout(timeout);
        setCampaigns(mockCampaigns);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();

    // Cleanup: prevent state updates after unmount
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
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton
                    variant="rounded"
                    height={350}
                    animation="wave"
                    sx={{ borderRadius: 4, bgcolor: "grey.100" }}
                  />
                </Grid>
              ))
            : campaigns.map((campaign, index) => (
                <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                  <CampaignCard
                    campaign={campaign}
                    index={index}
                    onDonate={handleDonate}
                  />
                </Grid>
              ))}
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
              color: "#2C3E50",
              borderColor: "rgba(0,0,0,0.2)",
              borderWidth: 2,
              fontWeight: 600,
              py: 1.5,
              px: 4,
              borderRadius: 50,
              textTransform: "none",
              fontSize: { xs: "0.95rem", md: "1rem" },
              "&:hover": {
                borderColor: "#2ECC71",
                color: "#2ECC71",
                bgcolor: "rgba(46,204,113,0.05)",
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
