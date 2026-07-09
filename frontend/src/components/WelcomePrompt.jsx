import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close, VolunteerActivismOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const WelcomePrompt = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the welcome prompt after a brief delay when user first lands
    const hasSeenWelcome = sessionStorage.getItem("np_welcome_seen");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("np_welcome_seen", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => setOpen(false);

  const handleSignUp = () => {
    setOpen(false);
    navigate("/register");
  };

  const handleLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: "hidden",
              maxWidth: 440,
              width: "90%",
            },
          }}
        >
          {/* Blue header strip */}
          <Box
            sx={{
              height: 6,
              background: "linear-gradient(90deg, #216eb6, #42A5F5)",
            }}
          />

          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "text.secondary",
              zIndex: 1,
            }}
            aria-label="Close welcome prompt"
          >
            <Close />
          </IconButton>

          <DialogContent sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: "#E3F2FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2.5,
                }}
              >
                <VolunteerActivismOutlined
                  sx={{ fontSize: 36, color: "#216eb6" }}
                />
              </Box>

              <DialogTitle
                sx={{
                  p: 0,
                  mb: 1.5,
                  fontWeight: 800,
                  color: "#216eb6",
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Welcome to NayePankh
              </DialogTitle>

              <Typography
                variant="body1"
                sx={{
                  color: "#546E7A",
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Join us in empowering under-privileged children through
                education, healthcare, and community support. Create an account
                or log in to start making a difference.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSignUp}
                  sx={{
                    bgcolor: "#216eb6",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    py: 1.5,
                    px: 4,
                    borderRadius: 50,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 6px 20px rgba(33,110,182,0.3)",
                    "&:hover": {
                      bgcolor: "#1a5a9e",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(33,110,182,0.4)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleLogin}
                  sx={{
                    color: "#216eb6",
                    borderColor: "#216eb6",
                    borderWidth: 2,
                    fontWeight: 600,
                    py: 1.5,
                    px: 4,
                    borderRadius: 50,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      borderColor: "#1a5a9e",
                      bgcolor: "rgba(33,110,182,0.04)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Log In
                </Button>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 3,
                  color: "#90A4AE",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Or continue browsing our impact &darr;
              </Typography>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default WelcomePrompt;
