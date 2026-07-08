import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Modal,
  Fade,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import cert1 from "../assets/certificate1.avif"; // Replace with your certificate images
import cert3 from "../assets/certificate2.avif";
import cert2 from "../assets/certificate3.avif";
import aboutBg from "../assets/about-us-page.webp"; // Background image for top section
import Footer from "./Footer";

// Theme matching your site
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

const certificates = [
  {
    title: "UP Government Registration",
    image: cert1,
    description: "Certified by the Uttar Pradesh Government as a recognized NGO.",
  },
  {
    title: "80G Certification",
    image: cert2,
    description: "Tax exemption under 80G for our donors’ contributions.",
  },
  {
    title: "12A Certification",
    image: cert3,
    description: "Registered under 12A, showcasing our commitment to transparency.",
  },
];

function Certificates() {
  const [open, setOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const handleOpen = (cert) => {
    setSelectedCert(cert);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCert(null);
  };

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
        {/* Top Section: Full-Screen Background Image */}
        <Box
          sx={{
            position: "relative",
            height: "100vh", // Full viewport height
            width: "100vw", // Full viewport width
            backgroundImage: `url(${aboutBg})`,
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
                "linear-gradient(to bottom, rgba(52, 73, 94, 0.7), rgba(52, 73, 94, 0.4))",
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
              fontWeight:600,
              px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              lineHeight: 1.2,
              animation: "fadeIn 2s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(30px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            Our Certificates
          </Typography>
        </Box>

        {/* Certificates Section */}
        <Box
          sx={{
            py: { xs: 6, md: 8 }, // Reduced padding on mobile
            position: "relative",
            zIndex: 1,
            bgcolor: "background.default",
          }}
        >
          {/* Subtle Background Gradient */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `
                radial-gradient(circle at 20% 30%, rgba(46, 204, 113, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(241, 196, 15, 0.1) 0%, transparent 50%)
              `,
              zIndex: 0,
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "text.primary",
                fontSize: { xs: "1.5rem", md: "1.55rem" },
                mb: { xs: 4, md: 8 }, // Reduced margin on mobile
                maxWidth: "950px",
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              These certifications reflect our dedication, trustworthiness, and the emotional commitment we have towards uplifting lives across communities.
            </Typography>

            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
              {certificates.map((cert, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => handleOpen(cert)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                      transition: "transform 0.5s ease, box-shadow 0.5s ease",
                      "&:hover": {
                        transform: "translateY(-10px) scale(1.03)",
                        boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
                        cursor: "pointer",
                      },
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={cert.image}
                      alt={cert.title}
                      sx={{
                        height: { xs: 160, sm: 200, md: 250 }, // Optimized heights
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        "&:hover": {
                          transform: "scale(1.05)", // Zoom effect on hover
                        },
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "center",
                        py: { xs: 2, md: 3 }, // Reduced padding on mobile
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          color: "primary.main",
                          fontWeight: 700,
                          fontSize: { xs: "1.1rem", md: "1.5rem" },
                          mb: 1,
                        }}
                      >
                        {cert.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.primary",
                          fontSize: { xs: "0.85rem", md: "1rem" },
                          lineHeight: 1.6,
                        }}
                      >
                        {cert.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Modal for Viewing Certificate */}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="certificate-modal-title"
              aria-describedby="certificate-modal-description"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Fade in={open}>
                <Box
                  sx={{
                    bgcolor: "#FFFFFF",
                    borderRadius: 4,
                    boxShadow: "0px 8px 40px rgba(0,0,0,0.3)",
                    p: { xs: 2, md: 4 },
                    maxWidth: { xs: "90%", md: "80%" },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    outline: "none",
                  }}
                >
                  {selectedCert && (
                    <>
                      <Typography
                        id="certificate-modal-title"
                        variant="h5"
                        sx={{
                          color: "primary.main",
                          fontWeight: 700,
                          mb: 2,
                          textAlign: "center",
                          fontSize: { xs: "1.25rem", md: "1.75rem" },
                        }}
                      >
                        {selectedCert.title}
                      </Typography>
                      <Box
                        component="img"
                        src={selectedCert.image}
                        alt={selectedCert.title}
                        sx={{
                          width: "100%",
                          maxHeight: { xs: "50vh", md: "70vh" },
                          objectFit: "contain",
                          borderRadius: 2,
                          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                        }}
                      />
                      <Typography
                        id="certificate-modal-description"
                        variant="body1"
                        sx={{
                          color: "text.primary",
                          mt: 2,
                          textAlign: "center",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                        }}
                      >
                        {selectedCert.description}
                      </Typography>
                    </>
                  )}
                </Box>
              </Fade>
            </Modal>
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default Certificates;