import { useState } from "react";
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
import mainLogo from "../assets/NayePankh-logo.png";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

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
  };

  const handleNayePankhClick = () => {
    navigate("/");
  };

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "About", path: "/about" },
    { text: "Certificates", path: "/certificates" },
    { text: "Newspaper", path: "/newspaper" },
    { text: "Donate", path: "/donate" },
  ];

  return (
    <>
      <AppBar
        position="absolute"
        sx={{
          bgcolor: "transparent", // Transparent background
          color: "#FFFFFF", // White text for visibility
          boxShadow: "none", // No shadow for transparency
          zIndex: 10,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 2,
            px: { xs: 2, md: 4 },
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                bgcolor: "white", // White background only for logo
                borderRadius: 2,
                p: 0.8, // Padding around logo
                boxShadow: "0px 4px 15px rgba(0,0,0,0.15)", // Subtle shadow for depth
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.05)" }, // Slight scale on hover
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
                  alt="NayePankh Logo"
                  style={{
                    height: "91px", // Larger logo size
                  }}
                />
              </Link>
            </Box>
            <Link
              onClick={handleNayePankhClick}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: "#FFFFFF", // White for visibility on transparent bg
                  fontWeight: 800,
                  ml: 2, // Margin left to separate from logo
                  fontSize: { xs: "1.5rem", md: "2rem" }, // Larger for prominence
                  transition: "color 0.3s ease",
                  textShadow: "2px 2px 6px rgba(0,0,0,0.5)", // Stronger shadow for readability
                  "&:hover": {
                    color: "#F1C40F", // Yellow on hover
                  },
                }}
              >
                NayePankh Foundation
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.text}
                onClick={() => handleNavClick(link.path)}
                sx={{
                  color: "#FFFFFF", // White for visibility
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  position: "relative",
                  "&:hover": {
                    color: "#F1C40F", // Yellow on hover
                    "&::after": {
                      width: "100%",
                    },
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0",
                    height: "3px",
                    bottom: "-8px",
                    left: 0,
                    bgcolor: "#2ECC71", // Green underline
                    transition: "width 0.3s ease",
                  },
                  textShadow: "2px 2px 6px rgba(0,0,0,0.5)", // Strong shadow for readability
                  transition: "all 0.3s ease",
                }}
              >
                {link.text}
              </Button>
            ))}
          </Box>

          <IconButton
            edge="end"
            aria-label="Open menu"
            onClick={toggleDrawer(true)}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#FFFFFF", // White for visibility
              "&:hover": { color: "#F1C40F" }, // Yellow on hover
              fontSize: "2rem", // Larger icon
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 280,
            bgcolor: "#FFFFFF",
            height: "100%",
            boxShadow: "-2px 0px 10px rgba(0,0,0,0.15)",
            borderRadius: "0 0 0 10px", // Rounded bottom-left corner
          }}
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
              borderBottom: "2px solid rgba(46, 204, 113, 0.2)", // Subtle green border
            }}
          >
            <img
              src={mainLogo}
              alt="NayePankh Logo"
              style={{
                height: "90px", // Larger logo size in drawer
                marginRight: "12px",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#2ECC71",
                fontSize: { xs: "1.4rem", sm: "1.6rem" }, // Slightly larger
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)", // Subtle shadow
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
                    color: "#263238", // Darker gray on white
                    fontWeight: 600,
                    py: 1.5,
                    px: 3,
                    fontSize: "1rem",
                    "&:hover": {
                      bgcolor: "rgba(46, 204, 113, 0.1)",
                      color: "#2ECC71", // Green on hover
                    },
                    transition: "all 0.3s ease",
                    borderRadius: "0 10px 10px 0", // Rounded right edge
                  }}
                >
                  {link.text}
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ borderColor: "rgba(46, 204, 113, 0.2)" }} />
          <List>
            <ListItem disablePadding>
              <Button
                variant="contained"
                startIcon={<VolunteerActivismIcon />}
                onClick={() => handleNavClick("/donate")}
                fullWidth
                sx={{
                  m: 2,
                  bgcolor: "#F1C40F", // Yellow button
                  color: "#263238", // Darker gray text
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  borderRadius: 20, // More rounded
                  py: 1.5,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#F39C12", // Darker yellow on hover
                    transform: "scale(1.02)", // Slight scale on hover
                  },
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                }}
              >
                Donate Now
              </Button>
            </ListItem>
            <ListItem disablePadding></ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
