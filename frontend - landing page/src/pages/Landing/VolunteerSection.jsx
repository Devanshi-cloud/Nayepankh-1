import { Box, Typography, Container, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";
import {
  VolunteerActivismOutlined,
  SchoolOutlined,
  FavoriteBorderOutlined,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const benefits = [
  {
    icon: <SchoolOutlined />,
    title: "Learn & Grow",
    description: "Gain real-world experience in social impact work",
  },
  {
    icon: <VolunteerActivismOutlined />,
    title: "Make an Impact",
    description: "Contribute directly to meaningful community projects",
  },
  {
    icon: <FavoriteBorderOutlined />,
    title: "Join a Community",
    description: "Connect with like-minded changemakers",
  },
];

export default function VolunteerSection() {
  const navigate = useNavigate();

  return (
    <Box
      id="volunteer"
      component="section"
      aria-label="Volunteer or Intern with Us"
      sx={{
        py: { xs: 10, md: 14 },
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #2C3E50 0%, #1a252f 100%)",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,204,113,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(241,196,15,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left: Content */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="overline"
                component="span"
                sx={{
                  color: "#2ECC71",
                  fontWeight: 700,
                  letterSpacing: 3,
                  fontSize: "0.85rem",
                  mb: 1,
                  display: "block",
                }}
              >
                GET INVOLVED
              </Typography>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  color: "#FFFFFF",
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                Be the{" "}
                <Box component="span" sx={{ color: "#F1C40F" }}>
                  Change
                </Box>{" "}
                You Wish to See
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  mb: 4,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                  maxWidth: 550,
                }}
              >
                Whether you have a few hours to volunteer or are looking for an
                internship experience, your time and skills can create lasting
                change in the lives of those who need it most.
              </Typography>

              {/* Benefits list */}
              <Box sx={{ mb: 5 }}>
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.4 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          bgcolor: "rgba(46,204,113,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#2ECC71",
                          flexShrink: 0,
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* CTAs */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/register")}
                  sx={{
                    bgcolor: "#2ECC71",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    py: 1.8,
                    px: 4,
                    borderRadius: 50,
                    textTransform: "none",
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    boxShadow: "0 8px 25px rgba(46,204,113,0.3)",
                    "&:hover": {
                      bgcolor: "#27AE60",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 35px rgba(46,204,113,0.4)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Join as Volunteer / Intern
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/donate")}
                  sx={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255,255,255,0.3)",
                    borderWidth: 2,
                    fontWeight: 600,
                    py: 1.8,
                    px: 4,
                    borderRadius: 50,
                    textTransform: "none",
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    "&:hover": {
                      borderColor: "#FFFFFF",
                      bgcolor: "rgba(255,255,255,0.05)",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Make a Donation
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Right: Stats */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {[
                  { value: "120+", label: "Active Volunteers" },
                  { value: "25+", label: "Community Projects" },
                  { value: "8+", label: "Years of Impact" },
                ].map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.08)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: "#F1C40F",
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 500,
                        fontSize: { xs: "0.95rem", md: "1rem" },
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
