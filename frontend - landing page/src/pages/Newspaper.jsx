import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import newspaperBg from "../assets/media-coverage.avif"; // Background for hero section
import article1 from "../assets/image.png"; // Replace with your newspaper clippings
import article2 from "../assets/image1.png";
import article3 from "../assets/image2.png";
import article4 from "../assets/image3.png";

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
    h1: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    body1: { fontWeight: 400 },
  },
});

const articles = [
  {
    title: "NayePankh’s COVID Relief Efforts Shine",
    image: article1,
    excerpt: "During the pandemic, NayePankh stepped up to provide essential supplies to the underprivileged.",
    date: "April 15, 2021",
  },
  {
    title: "Youth-Led NGO Expands Reach",
    image: article2,
    excerpt: "From a small group to a statewide force, NayePankh’s growth story inspires.",
    date: "July 22, 2021",
  },
  {
    title: "Menstrual Hygiene Campaign Gains Traction",
    image: article3,
    excerpt: "NayePankh’s efforts to educate and support women make headlines.",
    date: "March 8, 2022",
  },
  {
    title: "Feeding Hope: NayePankh’s Hunger Initiative",
    image: article4,
    excerpt: "Distributing food to communities and strays, NayePankh shows loyalty to all.",
    date: "November 10, 2022",
  },
];

function Newspaper() {
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
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            height: "100vh", // Full viewport height
            width: "100vw", // Full viewport width
            backgroundImage: `url(${newspaperBg})`,
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
                "linear-gradient(to bottom, rgba(52, 73, 94, 0.7), rgba(52, 73, 94, 0.3))",
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
              fontSize: { xs: "2rem", sm: "3rem", md: "4.5rem" }, // Responsive font size
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
            NayePankh in the News
          </Typography>
        </Box>

        {/* Articles Section */}
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            bgcolor: "#F7F9FC",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                color: "primary.main",
                mb: 6,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                letterSpacing: "1px",
                textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
                animation: "fadeInUp 1s ease-in-out",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(20px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              Our Journey in Print
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {articles.map((article, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
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
                      },
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={article.image}
                      alt={article.title}
                      sx={{
                        height: { xs: 160, sm: 200, md: 220 },
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        "&:hover": {
                          transform: "scale(1.05)", // Zoom effect
                        },
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        py: { xs: 2, md: 3 },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            color: "primary.main",
                            fontWeight: 700,
                            fontSize: { xs: "1.1rem", md: "1.25rem" },
                            mb: 1,
                            lineHeight: 1.4,
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            fontSize: { xs: "0.85rem", md: "1rem" },
                            mb: 2,
                            lineHeight: 1.6,
                          }}
                        >
                          {article.excerpt}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "secondary.main",
                            fontWeight: 600,
                            fontSize: { xs: "0.75rem", md: "0.9rem" },
                          }}
                        >
                          {article.date}
                        </Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            mt: 2,
                            color: "primary.main",
                            borderColor: "primary.main",
                            borderRadius: 50,
                            px: 3,
                            py: 0.5,
                            fontWeight: 600,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "primary.main",
                              color: "#FFFFFF",
                              borderColor: "primary.main",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Newspaper;