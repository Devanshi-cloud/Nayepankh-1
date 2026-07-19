import { useState, useEffect } from "react";
import { buildApiUrl } from '../../constants.js';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Breadcrumbs,
  Link,
  Avatar,
  Popover,
  ListItemButton as PopoverListItemButton,
  Divider,
  Button,
} from "@mui/material";
import {
  Lock as LockIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ProductionQuantityLimits as OngoingIcon,
  MonetizationOn as DonationsIcon,
  NavigateNext as NavigateNextIcon,
  Assignment,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import bgImg from "../../assets/welcome-img.webp";
import CampaignsInfoView from "./CampaignsInfoView";
import InternsListView from "./InternsListView";
import OngoingCampaignsView from "./OngoingCampaignsView";
import TotalDonationsView from "./TotalDonationsView";

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: { main: "#216eb6" },
    secondary: { main: "#42A5F5" },
    background: { default: "#E3F2FD" },
    text: { primary: "#263238", secondary: "#546E7A" },
  },
  typography: { fontFamily: "'Poppins', sans-serif" },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
});

const ModeratorDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [userDetails, setUserDetails] = useState({ name: "Moderator", email: "", role: "Moderator" });
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalCampaigns: null,
    totalInterns: null,
    totalDonations: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Frontend auth guard: check token and role on mount
  useEffect(() => {
    if (!token) {
      setAuthError("no_token");
      setAuthChecked(true);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Check token expiration client-side to prevent brief flash of dashboard
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        setAuthError("invalid_token");
        setAuthChecked(true);
        return;
      }
      // Moderator dashboard allows both "Admin" and "Super Admin" roles
      if (decoded.role !== "Admin" && decoded.role !== "Super Admin") {
        setAuthError("wrong_role");
        setAuthChecked(true);
        return;
      }
      setAuthChecked(true);
    } catch {
      setAuthError("invalid_token");
      setAuthChecked(true);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (authError) return;
      setIsLoading(true);
      try {
        const response = await fetch(buildApiUrl("/api/auth/user"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUserDetails({
            name: `${data.user.firstname} ${data.user.lastname}`,
            email: data.user.email,
            role: data.user.role,
          });
        } else {
          console.error("Failed to fetch user details:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authChecked && !authError) {
      fetchUserDetails();
    }
  }, [authChecked, authError]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (authError) return;
      setStatsLoading(true);
      try {
        // Fetch campaigns count
        const campaignsRes = await fetch(buildApiUrl("/api/campaign"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const campaignsData = await campaignsRes.json();
        // Fetch interns count
        const internsRes = await fetch(buildApiUrl("/api/users"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const internsData = await internsRes.json();
        // Fetch donations sum
        const donationsRes = await fetch(buildApiUrl("/api/donations"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const donationsData = await donationsRes.json();
        setDashboardStats({
          totalCampaigns: campaignsData.campaigns ? campaignsData.campaigns.length : 0,
          totalInterns: internsData.users ? internsData.users.filter(u => u.role === 'Intern').length : 0,
          totalDonations: donationsData.donations ? donationsData.donations.reduce((sum, d) => sum + (d.amount || 0), 0) : 0,
        });
      } catch (err) {
        setDashboardStats({ totalCampaigns: 0, totalInterns: 0, totalDonations: 0 });
      } finally {
        setStatsLoading(false);
      }
    };
    if (authChecked && !authError) {
      fetchDashboardStats();
    }
  }, [token, authChecked, authError]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setAnchorEl(null);
  };
  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (mobileOpen) setMobileOpen(false);
  };
  const handleLogoClick = () => navigate("/");

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Interns Info", icon: <PeopleIcon /> },
    { text: "Ongoing Campaigns", icon: <OngoingIcon /> },
    { text: "Total Donations", icon: <DonationsIcon /> },
    { text: "Campaigns Info", icon: <OngoingIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ bgcolor: "#F9F9F9", height: "100%", borderRight: "1px solid #E0E0E0" }}>
      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
        }}
        onClick={handleLogoClick}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "white",
            letterSpacing: 1,
            fontSize: { xs: "1.5rem", sm: "1.8rem" },
          }}
        >
          NayePankh
        </Typography>
      </Box>
      <List sx={{ py: { xs: 1, sm: 2 } }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <PopoverListItemButton
              onClick={() => handleSectionChange(item.text)}
              sx={{
                py: { xs: 1.2, sm: 1.5 },
                px: { xs: 2, sm: 3 },
                bgcolor: selectedSection === item.text ? "rgba(33,110,182,0.1)" : "transparent",
                color: selectedSection === item.text ? "primary.main" : "text.secondary",
                "&:hover": { bgcolor: "rgba(33,110,182,0.1)", color: "primary.main" },
                transition: "all 0.3s ease",
                borderRadius: 1,
                mx: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  color: selectedSection === item.text ? "primary.main" : "text.secondary",
                  minWidth: { xs: 40, sm: 48 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    fontWeight: selectedSection === item.text ? 600 : 400,
                  },
                }}
              />
            </PopoverListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // If auth check is pending, show a loading screen
  if (!authChecked) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "background.default" }}>
          <CircularProgress size={48} color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  // If not authorized, show Access Denied screen
  if (authError) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            p: 4,
            textAlign: "center",
          }}
        >
          <LockIcon sx={{ fontSize: 80, color: "#d32f2f", mb: 3 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#d32f2f", mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1, maxWidth: 480 }}>
            {authError === "no_token" && "You are not logged in. Please log in with your Moderator or Super Admin credentials to access this page."}
            {authError === "wrong_role" && "You do not have Moderator privileges. Only Admin and Super Admin users can access this dashboard."}
            {authError === "invalid_token" && "Your session is invalid or expired. Please log in again."}
          </Typography>
          <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}
            >
              Go to Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/dashboard")}
              sx={{ px: 4, py: 1.5, fontWeight: 600, borderRadius: 2 }}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "primary.main",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: { xs: 1, sm: 2 }, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1, color: "white", fontWeight: 700, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
            >
              Welcome, {userDetails.name}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <Avatar
                alt={userDetails.name}
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  border: "2px solid white",
                  boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.5)",
                }}
              />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ "& .MuiPopover-paper": { borderRadius: 2, boxShadow: "0px 6px 25px rgba(0,0,0,0.15)" } }}
            >
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "primary.main" }}>
                  {userDetails.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                  {userDetails.email}
                </Typography>
                <PopoverListItemButton
                  onClick={handleLogout}
                  sx={{ py: 1, px: 2, color: "primary.main", "&:hover": { bgcolor: "rgba(33,110,182,0.1)" } }}
                >
                  Logout
                </PopoverListItemButton>
              </Box>
            </Popover>
          </Toolbar>
        </AppBar>
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: 8, sm: 10 },
            bgcolor: "background.default",
          }}
        >
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <CircularProgress color="primary" size={48} />
            </Box>
          )}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: "text.secondary" }} />}
              sx={{ bgcolor: "white", p: { xs: 1.5, sm: 2 }, borderRadius: 2, boxShadow: "0px 2px 10px rgba(0,0,0,0.05)" }}
            >
              <Link
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, cursor: "pointer" }}
                onClick={() => handleSectionChange("Dashboard")}
              >
                / Moderator
              </Link>
              <Typography
                color="primary.main"
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, fontWeight: 600 }}
              >
                {selectedSection}
              </Typography>
            </Breadcrumbs>
          </Box>

          {selectedSection === "Dashboard" && (
            <Box>
              <Card
                sx={{
                  minHeight: { xs: 380, sm: 480 },
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Box
                  sx={{
                    p: { xs: 3, sm: 5 },
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: "white",
                      mt: 17,
                      textShadow: "3px 3px 8px rgba(0,0,0,0.5)",
                      fontSize: { xs: "2rem", sm: "3.5rem" },
                    }}
                  >
                    Hello, {userDetails.name}!
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255,255,255,0.95)",
                      maxWidth: 600,
                      fontWeight: 400,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      mb: 3,
                    }}
                  >
                    You have view-only access to all campaigns, interns, and donations.
                  </Typography>
                </Box>
              </Card>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, sm: 6 } }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
                      bgcolor: "white",
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 180,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0px 8px 25px rgba(0,0,0,0.15)' },
                    }}
                  >
                    <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 2, mb: 2, boxShadow: 2 }}>
                      <Assignment sx={{ color: 'white', fontSize: 40 }} />
                    </Box>
                    <CardContent sx={{ textAlign: "center", p: 0 }}>
                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                        Total Campaigns
                      </Typography>
                      {statsLoading ? (
                        <CircularProgress color="primary" size={32} />
                      ) : (
                        <Typography variant="h3" sx={{ color: "primary.main", fontWeight: 800 }}>
                          {dashboardStats.totalCampaigns}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
                      bgcolor: "white",
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 180,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0px 8px 25px rgba(0,0,0,0.15)' },
                    }}
                  >
                    <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 2, mb: 2, boxShadow: 2 }}>
                      <PeopleIcon sx={{ color: 'white', fontSize: 40 }} />
                    </Box>
                    <CardContent sx={{ textAlign: "center", p: 0 }}>
                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                        Total Interns
                      </Typography>
                      {statsLoading ? (
                        <CircularProgress color="primary" size={32} />
                      ) : (
                        <Typography variant="h3" sx={{ color: "primary.main", fontWeight: 800 }}>
                          {dashboardStats.totalInterns}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
                      bgcolor: "white",
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 180,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0px 8px 25px rgba(0,0,0,0.15)' },
                    }}
                  >
                    <Box sx={{ bgcolor: 'primary.main', borderRadius: '50%', p: 2, mb: 2, boxShadow: 2 }}>
                      <DonationsIcon sx={{ color: 'white', fontSize: 40 }} />
                    </Box>
                    <CardContent sx={{ textAlign: "center", p: 0 }}>
                      <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                        Total Donations
                      </Typography>
                      {statsLoading ? (
                        <CircularProgress color="primary" size={32} />
                      ) : (
                        <Typography variant="h3" sx={{ color: "primary.main", fontWeight: 800 }}>
                          ₹{dashboardStats.totalDonations?.toLocaleString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
          {selectedSection === "Interns Info" && <InternsListView />}
          {selectedSection === "Ongoing Campaigns" && <OngoingCampaignsView />}
          {selectedSection === "Total Donations" && <TotalDonationsView />}
          {selectedSection === "Campaigns Info" && <CampaignsInfoView />}

          <Divider sx={{ my: { xs: 2, sm: 3 }, bgcolor: 'primary.main', opacity: 0.10 }} />
          <Box
            component="footer"
            sx={{
              mt: 'auto',
              py: 3,
              px: { xs: 2, sm: 4 },
              textAlign: 'center',
              bgcolor: 'white',
              color: 'primary.main',
              boxShadow: '0px -4px 32px 0px rgba(33,110,182,0.07)',
              fontWeight: 500,
              letterSpacing: 0.5,
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              borderRadius: '22px 22px 0 0',
              maxWidth: 700,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(180deg, #fafdff 60%, #e3f2fd 100%)',
              transition: 'box-shadow 0.2s',
            }}
          >
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.2em', color: '#1976d2', fontWeight: 700, marginRight: 4 }}>🌱</span>
              © {new Date().getFullYear()} NayePankh Foundation. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ModeratorDashboard;
