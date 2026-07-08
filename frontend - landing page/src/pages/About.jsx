import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import aboutImg from "../assets/team-img.avif"; // Updated to use aboutImg
import aboutSideImg from "../assets/about-us-page-sub.webp"; // Side image for Section 2
import howItStartedBg from "../assets/artistic-bgm.avif"; // Subtle background for Section 2
import NGObgimg from "../assets/NGO-bgimg.avif"; // Subtle background for Section 3
import Footer from "./Footer";

// Theme matching your site with enhanced styling
const theme = createTheme({
  palette: {
    primary: {
      main: "#2ECC71", // Emerald Green
    },
    secondary: {
      main: "#F1C40F", // Sunflower Yellow
    },
    background: {
      default: "#FFFFFF", // Clean white
    },
    text: {
      primary: "#34495E", // Dark Slate
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    body1: { fontWeight: 400 },
  },
});

function AboutUs() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Section 1: Background Image with Big Text */}
        <Box
          sx={{
            position: "relative",
            height: "100vh", // Full viewport height
            width: "100vw", // Full viewport width
            backgroundImage: `url(${aboutImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, rgba(58, 59, 61, 0.7), rgba(52, 73, 94, 0.4))",
              zIndex: 1,
            },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: "#F1C40F", // Sunflower Yellow
              textAlign: "center",
              fontSize: { xs: "2rem", sm: "3rem", md: "5rem" }, // Responsive font size
              textShadow: "4px 4px 12px rgba(0,0,0,0.7)",
              zIndex: 2,
              px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              lineHeight: 1.2,
              animation: "fadeIn 2s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(30px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            Empowering Change <br /> with NayePankh
          </Typography>
        </Box>

        {/* Section 2: Timeline with Left Text, Right Image */}
        <Box
          sx={{
            py: { xs: 8, md: 14 },
            position: "relative",
            zIndex: 1,
            backgroundImage: `url(${howItStartedBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(247, 249, 252, 0.85)", // Slightly less opaque for vibrancy
              zIndex: 0,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={6} alignItems="flex-start">
              <Grid item xs={12} md={6}>
                <Box sx={{ position: "relative" }}>
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      color: "primary.main",
                      mb: 5,
                      fontSize: { xs: "1.75rem", md: "2.5rem" },
                      letterSpacing: "1px",
                      lineHeight: 1.2,
                      textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    How It Started?
                  </Typography>
                  <Timeline
                    sx={{
                      p: 0,
                      mt: -1,
                      "& .MuiTimelineItem-root:before": { display: "none" },
                    }}
                  >
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: "primary.main",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
                            mt: "12px",
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.2)" },
                          }}
                        />
                        <TimelineConnector
                          sx={{ bgcolor: "secondary.main", width: "3px" }}
                        />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            color: "text.primary",
                            mb: 2,
                            lineHeight: 1.8,
                            animation: "slideIn 1s ease-in-out",
                            "@keyframes slideIn": {
                              "0%": {
                                opacity: 0,
                                transform: "translateX(-20px)",
                              },
                              "100%": {
                                opacity: 1,
                                transform: "translateX(0)",
                              },
                            },
                          }}
                        >
                          <strong>2020:</strong> As the world battled the
                          COVID-19 pandemic, a group of high schoolers felt an{" "}
                          <span style={{ color: "#2ECC71" }}>urge</span> to make
                          an impact with whatever resources they had.
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: "primary.main",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.2)" },
                          }}
                        />
                        <TimelineConnector
                          sx={{ bgcolor: "secondary.main", width: "3px" }}
                        />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            color: "text.primary",
                            mb: 2,
                            lineHeight: 1.8,
                            animation: "slideIn 1.5s ease-in-out",
                          }}
                        >
                          <strong>Early Efforts:</strong> We uplifted the
                          underprivileged and helped the needy, pushing through
                          tough times with{" "}
                          <span style={{ color: "darkgoldenrod" }}>hope</span> and
                          determination.
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: "primary.main",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.2)" },
                          }}
                        />
                        <TimelineConnector
                          sx={{ bgcolor: "secondary.main", width: "3px" }}
                        />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            color: "text.primary",
                            mb: 2,
                            lineHeight: 1.8,
                            animation: "slideIn 2s ease-in-out",
                          }}
                        >
                          <strong>March 28, 2021:</strong> Officially founded as
                          NayePankh, we grew from a small group to a{" "}
                          <span style={{ color: "#2ECC71" }}>team</span>{" "}
                          spanning cities and states, driven by youth.
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={aboutSideImg}
                  alt="NayePankh Team"
                  sx={{
                    width: "100%",
                    maxHeight: { xs: "350px", md: "700px" },
                    objectFit: "cover",
                    borderRadius: 8,
                    boxShadow: "0px 8px 25px rgba(0,0,0,0.25)",
                    transition: "transform 0.5s ease, box-shadow 0.5s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0px 12px 35px rgba(0,0,0,0.3)",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Section 3: What is NayePankh? */}
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            position: "relative",
            zIndex: 1,
            backgroundImage: `url(${NGObgimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.8)", // Subtle white overlay
              zIndex: 0,
            },
          }}
        >
          <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                color: "primary.main",
                fontWeight: 700,
                mb: 4,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                letterSpacing: "1px",
                textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                animation: "fadeInUp 1s ease-in-out",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(20px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              What is NayePankh?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.6,
                maxWidth: "700px",
                mx: "auto",
                textAlign: "justify",
                animation: "fadeInUp 1.5s ease-in-out",
              }}
            >
              NayePankh Foundation was initiated to bring a{" "}
              <strong>change</strong> and <strong>help people</strong> during
              the tough times of Covid. Later in the year, the NGO expanded its
              operations to reach a wider society. With this vision, it became
              NayePankh – giving wings to uplift the underprivileged. We’re a
              leading NGO providing food, sanitary napkins, clothes, and
              education to underprivileged communities. We address daily
              challenges in India, like menstrual hygiene through awareness
              campaigns and sanitary napkin distribution, and fight hunger by
              feeding both people and stray animals. We’ve clothed poor
              families and impacted over two lakhs of lives. Though a
              significant milestone, our mission continues. Certified under
              12A and 80G, donors enjoy 50% tax relief. Led by youth—many still
              in college—we aim to make Earth a better place, embodying{" "}
              <strong>'BADALTE BHARAT KI NAYI TASVEER'</strong>.
            </Typography>
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default AboutUs;