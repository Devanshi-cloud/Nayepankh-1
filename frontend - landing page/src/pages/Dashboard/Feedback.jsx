import { useState } from "react";
import { Box, Typography, Container, TextField, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#216eb6", // Logo-matching blue
    },
    secondary: {
      main: "#42A5F5", // Lighter blue
    },
    background: {
      default: "#E3F2FD", // Very light blue
    },
    text: {
      primary: "#263238", // Darker gray
      secondary: "#546E7A", // Softer gray
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: { fontWeight: 700 },
    body1: { fontWeight: 400 },
  },
});

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    alert("Thank you for your feedback!");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 4, md: 6 },
          position: "relative",
          overflow: "hidden",
          borderRadius: 5,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: "center",
              color: "primary.main",
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 2,
              letterSpacing: "1px",
            }}
          >
            Share Your Feedback
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: { xs: "1rem", md: "1.1rem" },
              mb: 6,
              lineHeight: 1.6,
            }}
          >
            We value your input! Let us know your thoughts to help us improve
            and better serve our community.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: 2,
              boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
              p: { xs: 3, md: 4 },
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                },
              }}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                },
              }}
              required
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                  "&.Mui-focused": { color: "primary.main" },
                },
              }}
              required
            />
            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "primary.main",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  borderRadius: 50,
                  py: 1.5,
                  px: 6,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#1E5FA4", // Slightly darker blue
                    transform: "scale(1.05)",
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Submit Feedback
              </Button>
              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  py: 2,
                  px: 3,
                  bgcolor: "secondary.light",
                  borderRadius: 3,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Prefer Google Forms?
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  href="https://forms.gle/4pCaDBicMwRDaSo8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#FFFFFF",
                    bgcolor: "primary.main",
                    py: 1,
                    px: 4,
                    borderRadius: 20,
                    textDecoration: "none",
                    display: "inline-block",
                    fontWeight: "bold",
                    transition: "background 0.3s ease",
                    "&:hover": {
                      bgcolor: "#1E5FA4",
                    },
                  }}
                >
                  Submit via Google Form
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Feedback;
