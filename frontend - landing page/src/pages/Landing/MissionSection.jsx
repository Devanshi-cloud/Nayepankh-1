import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import {
  SchoolOutlined,
  HealthAndSafetyOutlined,
  Diversity3Outlined,
} from "@mui/icons-material";
import AnimatedCounter from "./AnimatedCounter";
import LottieAnimation from "./LottieAnimation";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const missions = [
  {
    icon: <SchoolOutlined sx={{ fontSize: 48 }} />,
    title: "Education",
    description:
      "Providing quality education and learning resources to underprivileged children, enabling them to build a brighter future.",
    color: "#216eb6",
  },
  {
    icon: <HealthAndSafetyOutlined sx={{ fontSize: 48 }} />,
    title: "Healthcare",
    description:
      "Ensuring access to essential healthcare services, medical checkups, and health awareness programs for marginalized communities.",
    color: "#42A5F5",
  },
  {
    icon: <Diversity3Outlined sx={{ fontSize: 48 }} />,
    title: "Community Support",
    description:
      "Empowering communities through sustainable development, skill training, and basic necessities like food and shelter.",
    color: "#F1C40F",
  },
];

const impactStats = [
  { end: 2500, suffix: "+", label: "Children Educated" },
  { end: 10000, suffix: "+", label: "Lives Impacted" },
  { end: 50, suffix: "+", label: "Communities Served" },
  { end: 8, suffix: " Years", label: "Of Service" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function MissionSection() {
  return (
    <Box
      id="mission"
      component="section"
      aria-label="Our Mission"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: "#F8F9FA",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
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
            OUR MISSION
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
            What We Stand For
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
              lineHeight: 1.7,
            }}
          >
            We believe every individual deserves the opportunity to thrive. Our work focuses on three core pillars that create lasting change.
          </Typography>
        </motion.div>

        {/* Mission Cards */}
        <Grid
          container
          spacing={4}
          component={motion.div}
          variants={containerVariants}
          initial={prefersReducedMotion ? {} : "hidden"}
          whileInView={prefersReducedMotion ? {} : "visible"}
          viewport={{ once: true, margin: "-50px" }}
        >
          {missions.map((mission, index) => (
            <Grid item xs={12} md={4} key={mission.title}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 5 },
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.06)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                      borderColor: mission.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: `${mission.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                      color: mission.color,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: `${mission.color}25`,
                        transform: "scale(1.05)",
                      },
                    }}
                    aria-hidden="true"
                  >
                    {mission.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: "#2C3E50",
                      mb: 2,
                      fontSize: { xs: "1.25rem", md: "1.4rem" },
                    }}
                  >
                    {mission.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      fontSize: { xs: "0.95rem", md: "1rem" },
                    }}
                  >
                    {mission.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Storytelling Illustration with Lottie */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: "64px", textAlign: "center" }}
        >
          <Typography
            variant="overline"
            component="span"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 3,
              fontSize: "0.8rem",
              mb: 2,
              display: "block",
            }}
          >
            OUR IMPACT IN ACTION
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 2, md: 6 },
              flexWrap: "wrap",
              mb: 4,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <LottieAnimation type="education" />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mt: 1, display: "block" }}>
                Education
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <LottieAnimation type="healthcare" />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mt: 1, display: "block" }}>
                Healthcare
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <LottieAnimation type="community" />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mt: 1, display: "block" }}>
                Community
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Impact Statistics */}
        <Box sx={{ mt: { xs: 8, md: 10 } }}>
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontWeight: 700,
                color: "#2C3E50",
                textAlign: "center",
                mb: 6,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Our Impact in Numbers
            </Typography>
          </motion.div>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            {impactStats.map((stat, index) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  label={stat.label}
                  duration={2 + index * 0.3}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
