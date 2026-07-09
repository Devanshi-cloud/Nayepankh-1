import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Box,
  Divider,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  VolunteerActivism as VolunteerActivismIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import mainLogo from "../assets/NayePankh-logo.png";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleNayePankhClick = () => {
    navigate("/");
    setDrawerOpen(false);
  };

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "About", path: "/about" },
    { text: "Certificates", path: "/certificates" },
    { text: "Newspaper", path: "/newspaper" },
    { text: "Donate", path: "/donate" },
    { text: "Portal Login", path: "/login" },
  ];

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <>
      <AppBar
        component={motion.nav}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
          position="fixed"
          elevation={scrolled ? 4 : 0}
          sx={{
            bgcolor: scrolled
              ? "rgba(44, 62, 80, 0.97)"
              : "transparent",
            backdropFilter: scrolled ? "blur(10px)" : "none",
            color: "#FFFFFF",
            zIndex: 1100,
            transition: prefersReducedMotion
              ? "none"
              : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: scrolled ? 1 : 2,
              px: { xs: 2, md: 4 },
              alignItems: "center",
              transition: prefersReducedMotion ? "none" : "padding 0.3s ease",
            }}
          >
            {/* Logo + Title */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  p: 0.6,
                  boxShadow: scrolled
                    ? "0px 2px 8px rgba(0,0,0,0.1)"
                    : "0px 4px 15px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Link
                  onClick={handleNayePankhClick}
                  sx={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={mainLogo}
                    alt="NayePankh Foundation Logo"
                    style={{
                      height: scrolled ? "55px" : "75px",
                      transition: "height 0.3s ease",
                    }}
                  />
                </Link>
              </Box>
              <Link
                onClick={handleNayePankhClick}
                sx={{
                  textDecoration: "none",
                  cursor: "pointer",
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 800,
                    ml: 2,
                    fontSize: scrolled
                      ? { xs: "1.2rem", md: "1.5rem" }
                      : { xs: "1.4rem", md: "1.8rem" },
                    transition: "all 0.3s ease",
                    textShadow: scrolled
                      ? "none"
                      : "2px 2px 6px rgba(0,0,0,0.5)",
                    "&:hover": { color: "#F1C40F" },
                  }}
                >
                  NayePankh Foundation
                </Typography>
              </Link>
            </Box>

            {/* Desktop Nav Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  onClick={() => handleNavClick(link.path)}
                  sx={{
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    letterSpacing: 0.5,
                    position: "relative",
                    "&:hover": {
                      color: "#F1C40F",
                      "&::after": { width: "100%" },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: "0",
                      height: "3px",
                      bottom: "-6px",
                      left: 0,
                      bgcolor: "#42A5F5",
                      transition: "width 0.3s ease",
                      borderRadius: 2,
                    },
                    textShadow: scrolled
                      ? "none"
                      : "2px 2px 6px rgba(0,0,0,0.5)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {link.text}
                </Button>
              ))}
              <Button
                variant="contained"
                startIcon={<VolunteerActivismIcon />}
                onClick={() => handleNavClick("/donate")}
                sx={{
                  ml: 1,
                  bgcolor: "#F1C40F",
                  color: "#2C3E50",
                  fontWeight: 700,
                  borderRadius: 50,
                  py: 1,
                  px: 2.5,
                  textTransform: "none",
                  fontSize: "0.9rem",
                  boxShadow: scrolled
                    ? "0 4px 12px rgba(241,196,15,0.3)"
                    : "0 6px 20px rgba(241,196,15,0.35)",
                  "&:hover": {
                    bgcolor: "#F39C12",
                    transform: "translateY(-2px) scale(1.02)",
                    boxShadow: "0 8px 25px rgba(241,196,15,0.4)",
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                Donate
              </Button>
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              edge="end"
              aria-label="Open navigation menu"
              onClick={toggleDrawer(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#FFFFFF",
                "&:hover": { color: "#F1C40F" },
                fontSize: "1.8rem",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "#FFFFFF",
            borderRadius: "0 0 0 16px",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              borderBottom: "2px solid rgba(33, 110, 182, 0.15)",
            }}
          >
            <img
              src={mainLogo}
              alt="NayePankh Foundation"
              style={{ height: "80px", marginBottom: "8px" }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#216eb6",
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
              }}
            >
              NayePankh Foundation
            </Typography>
          </Box>
          <List sx={{ py: 2 }}>
            {navLinks.map((link) => (
              <ListItem key={link.text} disablePadding>
                <Button
                  onClick={() => handleNavClick(link.path)}
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    textTransform: "uppercase",
                    color: "#263238",
                    fontWeight: 600,
                    py: 1.5,
                    px: 3,
                    fontSize: "0.95rem",
                    "&:hover": {
                      bgcolor: "rgba(33, 110, 182, 0.08)",
                      color: "#216eb6",
                      pl: 4,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {link.text}
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ borderColor: "rgba(33, 110, 182, 0.15)" }} />
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              startIcon={<VolunteerActivismIcon />}
              onClick={() => handleNavClick("/donate")}
              fullWidth
              sx={{
                bgcolor: "#F1C40F",
                color: "#263238",
                textTransform: "uppercase",
                fontWeight: "bold",
                borderRadius: 50,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#F39C12",
                  transform: "scale(1.02)",
                },
                boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              Donate Now
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
