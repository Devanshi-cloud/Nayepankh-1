import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import {
  VolunteerActivismOutlined,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import aboutImg from "../assets/image.png";
import helpBg from "../assets/welcome-img.webp";
import teamImg from "../assets/team-img.avif"; // Replace with your team image
import Footer from "./Footer";
import logoImg1 from "../assets/loop-img-1.jpg";
import logoImg2 from "../assets/loop-img-2.jpg";
import logoImg3 from "../assets/loop-img-3.jpg";
import backgroundVideo from "../assets/MashUp_Video.mp4";
import { keyframes } from "@mui/system";
import Navbar from "./Navbar";
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
  },
});

// Define the ticker animation
const tickerAnimation = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const carouselLoopImages = [logoImg1, logoImg2, logoImg3];

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [carouselIndexLoop, setCarouselIndexLoop] = useState(0);
  const navigate = useNavigate();

  // Typewriting animation for "Join our Team"
  const teamText = "Join our Team";
  const text = "Think global, Act local";
  const [displayedTeamText, setDisplayedTeamText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [teamIndex, setTeamIndex] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndexLoop((prev) => (prev + 1) % carouselLoopImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout;
    if (teamIndex <= teamText.length) {
      timeout = setTimeout(() => {
        setDisplayedTeamText(teamText.substring(0, teamIndex));
        setTeamIndex(teamIndex + 1);
      }, 150); // Faster typing speed
    } else {
      timeout = setTimeout(() => {
        setDisplayedTeamText("");
        setTeamIndex(0);
      }, 2000); // Pause before looping
    }
    return () => clearTimeout(timeout);
  }, [teamIndex]);

  useEffect(() => {
    let timeout;
    if (index <= text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, index));
        setIndex(index + 1);
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [index, text]);

  const handleCloseSnackbar = () => {
    setCopied(false);
  };

  const handleDonateBtn = () => {
    navigate("/donate");
  };

  const handlePrevImage = () => {
    setCarouselIndexLoop((prev) =>
      prev === 0 ? carouselLoopImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCarouselIndexLoop((prev) => (prev + 1) % carouselLoopImages.length);
  };

  return (
    <ThemeProvider theme={theme}>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "transparent",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Hero Section */}
        <Box
          id="home"
          sx={{
            position: "relative",
            height: "100vh",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, rgba(52, 73, 94, 0.7), rgba(52, 73, 94, 0.3))",
            }}
          />
          <Container
            maxWidth="md"
            sx={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: "#FFFFFF",
                fontWeight: 800,
                textAlign: "center",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              }}
            >
              Welcome to NayePankh Foundation
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: "#E8F5E9",
                textAlign: "center",
                mb: 4,
                fontSize: { xs: "1.25rem", md: "1.75rem" },
                fontWeight: 300,
                maxWidth: "700px",
                textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              Giving Wings to Uplift Lives
            </Typography>
            <Button
              variant="contained"
              onClick={handleDonateBtn}
              startIcon={<VolunteerActivismOutlined />}
              sx={{
                bgcolor: "#F1C40F",
                color: "#34495E",
                textTransform: "uppercase",
                fontWeight: "bold",
                borderRadius: 50,
                py: 1.5,
                px: 4,
                "&:hover": {
                  bgcolor: "#F39C12",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
              }}
            >
              Donate Now
            </Button>
          </Container>
        </Box>

        {/* About Us Section */}
        <Box
          id="about"
          sx={{
            py: 14,
            position: "relative",
            zIndex: 1,
            bgcolor: "background.default",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
                <Box
                  sx={{
                    pl: { xs: 0, md: 25 },
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 2,
                      fontSize: { xs: "1.6rem", md: "2.0rem" },
                      letterSpacing: "1px",
                    }}
                  >
                    About Us
                  </Typography>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 800,
                      color: "text.secondary",
                      mb: 2,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {displayedText}
                    <span
                      style={{
                        display: index < text.length ? "inline-block" : "none",
                        borderRight: "0.1em solid",
                        animation: "blink 1s steps(2, start) infinite",
                      }}
                    />
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                      lineHeight: 1.8,
                      color: "text.primary",
                      maxWidth: "600px",
                      mx: { xs: "auto", md: 0 },
                    }}
                  >
                    "NayePankh Foundation" is a non governmental organisation
                    with a strong desire to help the society and make it a
                    better place for all, by doing everything in our power and
                    to make our vision successful we would require your vital
                    support. Service to mankind is the service to god. Let’s
                    revolutionise the society together!
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={aboutImg}
                    alt="About NayePankh"
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "600px",
                      borderRadius: "10%",
                      border: "8px solid #FFFFFF",
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* How You Can Help Section */}
        <Box
          id="how-it-works"
          sx={{
            py: 14,
            position: "relative",
            zIndex: 1,
            backgroundImage: `url(${helpBg})`,
            backgroundSize: "cover",
            filter: "brightness(0.9)",
            backgroundPosition: "center",
            minHeight: "416px",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <Container
            maxWidth="md"
            sx={{ position: "relative", zIndex: 2, textAlign: "center" }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                color: "#FFD700",
                fontWeight: 800,
                mb: 4,
                fontSize: { xs: "2.25rem", md: "3.25rem" },
                letterSpacing: "1.5px",
                textShadow: "3px 3px 12px rgba(0,0,0,0.8)",
              }}
            >
              It’s that easy to bring a{" "}
              <span
                style={{
                  color: "#FFFFFF",
                  textShadow: "3px 3px 12px rgba(0,0,0,0.8)",
                }}
              >
                Smile
              </span>{" "}
              on Their Faces
            </Typography>
            <Button
              variant="contained"
              onClick={handleDonateBtn}
              startIcon={<VolunteerActivismOutlined />}
              sx={{
                bgcolor: "#F1C40F",
                color: "#34495E",
                textTransform: "uppercase",
                fontWeight: "bold",
                borderRadius: 50,
                py: 1.5,
                px: 5,
                mb: 4,
                "&:hover": {
                  bgcolor: "#F39C12",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Donate Now
            </Button>
            <Typography
              variant="body1"
              sx={{
                bgcolor: "transparent",
                color: "#FFFFFF",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                lineHeight: 1.8,
                maxWidth: "800px",
                fontWeight: 700,
                mx: "auto",
                textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              We don’t ask for much, just{" "}
              <span style={{ color: "#F1C40F" }}>help us</span> with what you{" "}
              <span style={{ color: "#2ECC71" }}>can</span>—Be it{" "}
              <span style={{ color: "#2ECC71" }}>Money</span>,{" "}
              <span style={{ color: "#2ECC71" }}>Skill</span> or Your{" "}
              <span style={{ color: "#2ECC71" }}>Time</span>.
            </Typography>
          </Container>
        </Box>

        <Box
          sx={{
            position: "relative",
            height: { xs: "120px", md: "416px" },
            width: "100%",
            backgroundImage: `url(${carouselLoopImages[carouselIndexLoop]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 1s ease-in-out",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Arrow Buttons */}
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: "absolute",
              left: { xs: 10, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              color: "#FFFFFF",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowLeftIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: "absolute",
              right: { xs: 10, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              color: "#FFFFFF",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowRightIcon fontSize="large" />
          </IconButton>
          {/* Circular Buttons */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              display: "flex",
              gap: 1,
            }}
          >
            {carouselLoopImages.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor:
                    carouselIndexLoop === idx
                      ? "#F1C40F"
                      : "rgba(205,205,205,1.0)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  "&:hover": { bgcolor: "#FFD700" },
                }}
                onClick={() => setCarouselIndexLoop(idx)}
              />
            ))}
          </Box>
        </Box>

        {/* Join Our Team Section */}
        <Box
          id="join-team"
          sx={{
            py: 14,
            position: "relative",
            zIndex: 1,
            bgcolor: "background.default",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    textAlign: "center",
                    mb: 4,
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: { xs: "2rem", md: "3rem" },
                    letterSpacing: "1px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {displayedTeamText}
                  <span
                    style={{
                      display:
                        teamIndex < teamText.length ? "inline-block" : "none",
                      borderRight: "0.1em solid #2ECC71",
                      animation: "blink 1s steps(2, start) infinite",
                    }}
                  />
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: { xs: "center", md: "left" },
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    lineHeight: 1.8,
                    color: "text.primary",
                    maxWidth: "700px",
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  Join our team and make a difference in the lives of those in
                  need. At NayePankh Foundation, we are committed to creating
                  positive change and empowering communities. By joining our
                  team, you will have the opportunity to contribute your time,
                  skills, and ideas to help make a real impact. Whether you are
                  passionate about education, health, or providing support
                  during times of crisis, there is a place for you on our team.
                  Join us today and be a part of an organization that is making
                  a difference, one person at a time.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={teamImg}
                    alt="Join Our Team"
                    style={{
                      width: "100%",
                      maxWidth: "500px",
                      height: "auto",
                      borderRadius: "10%",
                      border: "8px solid #2ecc71",
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Quote Section */}
        <Box
          sx={{
            py: 14,
            bgcolor: "#23201e", // Dark gray background
            position: "relative",
            zIndex: 1,
          }}
        >
          <Container maxWidth="lg" sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                color: "#FFFFFF", // Pure white for the main quote
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: "2rem", md: "3.5rem" },
                lineHeight: 1.2,
                textShadow: "2px 2px 10px rgba(0,0,0,0.7)", // Stronger shadow for depth
              }}
            >
              "If we all do something, then together there is no problem that we
              cannot solve!"
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#FFECB3", // Gold for the name
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 700,
                mb: 0.5,
                textShadow: "1px 1px 4px rgba(0,0,0,0.5)", // Subtle shadow
              }}
            >
              PRASHANT SHUKLA
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#FFECB3", // Gold for consistency
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 500,
                mb: 4,
                textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              Founder & President, NayePankh Foundation
            </Typography>
          </Container>
          <Box
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              width: "100%",
              mt: 4,
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                animation: `${tickerAnimation} 14s linear infinite`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#ffdabb", // Light green for contrast
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  fontWeight: 700,
                  textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                  display: "inline",
                  mr: 8, // Space between looping texts
                }}
              >
                All our efforts are made possible only because of your support
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#ffdabb", // Light yellow for warmth
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  fontWeight: 700,
                  textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                  display: "inline",
                }}
              >
                Your donations are tax exempted under 80G of the Indian Income
                Tax Act
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Footer />

        <Snackbar
          open={copied}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Referral code copied to clipboard!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
