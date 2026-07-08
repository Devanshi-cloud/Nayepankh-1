import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import mainLogo from "../assets/NayePankh-logo.png"; // Logo from main site
import sampleVideo from "../assets/sample-video.mp4"; // Your background video

// Theme matching NayePankh Foundation
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

function InternsHome() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to /login
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={sampleVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Hero Section */}
        <Box
        sx={{
        position: "relative",
        height: "100vh", // Full viewport height
        width: "100%", // Changed from 100vw to avoid horizontal overflow
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
                "linear-gradient(to bottom, rgba(52, 73, 94, 0.7), rgba(52, 73, 94, 0.3))",
              zIndex: 1,
            },
          }}
        >
          <Container
            maxWidth="md"
            sx={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                color: "#FFFFFF",
                px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
            }}
          >
            <Box
            sx={{
            display: "flex",
            justifyContent: "center",
            mb: { xs: 2, sm: 2.5, md: 3 }, // Responsive margin
            }}
            >
            <Box sx={{
            backgroundColor: "#FFFFFF",
            padding: { xs: 0.75, sm: 1, md: 1.5 }, // Responsive padding
            width: { xs: "150px", sm: "180px", md: "200px" }, // Responsive width
            height: { xs: "130px", sm: "150px", md: "170px" }, // Responsive height
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            }}>
                <img
                    src={mainLogo}
                    alt="NayePankh Logo"
                    style={{ 
                    maxHeight: "90%", 
                    maxWidth: "90%", 
                    width: "auto", 
                    height: "auto",
                    objectFit: "contain" 
                    }}
                />
              </Box>
            </Box>
            <Typography
                variant="h1"
                component="h1"
                sx={{
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" }, // More granular font scaling
                textShadow: "4px 4px 12px rgba(0,0,0,0.7)",
                mb: { xs: 1.5, sm: 2, md: 2.5 }, // Responsive margin
                lineHeight: { xs: 1.1, sm: 1.2 }, // Adjusted line height for small screens
                px: { xs: 1, sm: 2, md: 0 }, // Add padding on smaller screens
                animation: "fadeIn 2s ease-in-out",
                "@keyframes fadeIn": {
                    "0%": { opacity: 0, transform: "translateY(30px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                }}
            >
              Welcome to the Interns Portal
            </Typography>
            <Typography
                variant="h5"
                component="p"
                sx={{
                fontSize: { xs: "0.875rem", sm: "1.125rem", md: "1.25rem", lg: "1.5rem" }, // More granular font scaling
                fontWeight: 300,
                maxWidth: "700px",
                width: "100%", // Ensure it takes full width within constraints
                mx: "auto",
                mb: { xs: 3, sm: 3.5, md: 4 }, // Responsive margin
                px: { xs: 1, sm: 2, md: 2 }, // Add padding on all screens
                textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
                }}
            >
              Join our team of dedicated interns to empower communities and
              create lasting change with NayePankh Foundation.
            </Typography>
            <Button
                variant="contained"
                onClick={handleLoginClick}
                size="large" // Default size large for the button
                sx={{
                bgcolor: "#F1C40F", // Yellow
                color: "#34495E",
                textTransform: "uppercase",
                fontWeight: "bold",
                borderRadius: 50,
                py: { xs: 1, sm: 1.25, md: 1.5 }, // Responsive padding
                px: { xs: 3, sm: 4, md: 6 }, // Responsive padding
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" }, // More granular font scaling
                boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
                minWidth: { xs: '120px', sm: '140px', md: '160px' }, // Ensure minimum width
                "&:hover": {
                    bgcolor: "#F39C12",
                    transform: "scale(1.05)",
                    boxShadow: "0px 8px 25px rgba(0,0,0,0.3)",
                },
                }}
            >
              Login
            </Button>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default InternsHome;
