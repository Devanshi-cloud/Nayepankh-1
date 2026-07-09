import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Button,
  Snackbar,
  Avatar,
  Popover,
  ListItemButton as PopoverListItemButton,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Breadcrumbs,
  Link,
  TextField,
  Divider,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ListAlt as ListAltIcon,
  ProductionQuantityLimits,
  WhatsApp as WhatsAppIcon,
  ContentCopy as ContentCopyIcon,
  Message,
  QuestionMark,
  BookOnline,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  EmojiEvents as EmojiEventsIcon,
  Leaderboard as LeaderboardIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "@emotion/styled";
import { jwtDecode } from "jwt-decode";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { IS_PREVIEW_MODE, supabase } from "../../supabaseClient";
import { getMockUser, saveMockUser, getMockLeaderboard, getMockDonations, getMockCampaigns } from "../../mockData";

import Transactions from "./Transactions";
import CampaignStatus from "./CampaignStatus";
import Feedback from "./Feedback";
import LearningModules from "./LearningModules";
import FAQ from "./FAQ";
import Footer from "./Footer";
import bgImg from "../../assets/welcome-img.webp";

const drawerWidth = 260;

const theme = createTheme({
  palette: {
    primary: { main: "#216eb6" },
    secondary: { main: "#42A5F5" },
    background: { default: "#E3F2FD" },
    lightBlue: { main: "#BBDEFB" },
    whatsappGreen: { main: "#25D366" },
    referralPink: { main: "#ffa800" },
    text: { primary: "#263238", secondary: "#546E7A" },
  },
  typography: { fontFamily: "'Poppins', sans-serif" },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
});

// Styled Progress Bar
const AnimatedLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
  height: 20,
  borderRadius: 10,
  backgroundColor: "#e0e0e0",
  boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.1)",
  "& .MuiLinearProgress-bar": {
    background: "linear-gradient(90deg, #42A5F5, #216eb6)",
    borderRadius: 10,
  },
}));

const DashboardPage = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [campaigns, setCampaigns] = useState([]);
  const [userGoalData, setUserGoalData] = useState({ totalRaised: 0, totalGoal: 30000 });
  const [userDetails, setUserDetails] = useState({ name: "Intern", email: "", referralCode: "", whatsapp: "" });
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Tour States
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Profile", icon: <PersonIcon /> },
    { text: "Rewards", icon: <EmojiEventsIcon /> },
    { text: "Leaderboard", icon: <LeaderboardIcon /> },
    { text: "Transactions", icon: <ListAltIcon /> },
    { text: "Ongoing Campaigns", icon: <ProductionQuantityLimits /> },
    { text: "Learning Modules", icon: <BookOnline /> },
    { text: "Feedback", icon: <Message /> },
    { text: "FAQ", icon: <QuestionMark /> },
  ];

  const TOUR_STEPS = [
    {
      title: `Welcome to NayePankh, ${userDetails.name || 'Intern'}! 👋`,
      text: "This is your Internship Dashboard! From here you can track your fundraising, manage your profile, and see your reward achievements.",
      targetId: null,
    },
    {
      title: "Your Referral Code 🔑",
      text: "This is your unique referral code. Every donation made using this code will automatically credit your account.",
      targetId: "onboarding-referral-code",
    },
    {
      title: "Copy Donation Link 🔗",
      text: "Click here to copy your personalized donation link. Share it with your friends, family, and supporters.",
      targetId: "onboarding-copy-link",
    },
    {
      title: "Direct WhatsApp Share 💬",
      text: "Use this button to instantly post your pre-crafted donation pitch directly onto WhatsApp chats.",
      targetId: "onboarding-share-whatsapp",
    },
    {
      title: "Milestone Tracker 🎯",
      text: "Track your goal completion percentage and level achievements (Beginner ➔ Star ➔ Ninja ➔ Master) in real time.",
      targetId: "onboarding-milestone-tracker",
    },
    {
      title: "Leadership Board 🏆",
      text: "See where you rank in real time compared to other interns! Rise to the top to earn prestigious reward badges.",
      targetId: "onboarding-leaderboard",
    }
  ];

  // Resolve section from URL parameter
  useEffect(() => {
    if (section) {
      const sectionMap = {
        general: "Dashboard",
        profile: "Profile",
        rewards: "Rewards",
        leaderboard: "Leaderboard",
      };
      const resolved = sectionMap[section.toLowerCase()];
      if (resolved) {
        setSelectedSection(resolved);
      }
    }
  }, [section]);

  // Load user data
  useEffect(() => {
    if (IS_PREVIEW_MODE) {
      const mockUser = getMockUser();
      setUserDetails({
        name: `${mockUser.firstname} ${mockUser.lastname}`,
        email: mockUser.email,
        referralCode: mockUser.referralCode,
        whatsapp: mockUser.phone,
      });
      const mockDonations = getMockDonations().filter(d => d.referralCode === mockUser.referralCode);
      const totalRaised = mockDonations.reduce((sum, d) => sum + d.amount, 0);
      setUserGoalData({
        totalRaised: totalRaised,
        totalGoal: mockUser.goal
      });
      setCampaigns(getMockCampaigns());
      setLeaderboardData(getMockLeaderboard());
      setIsLoading(false);
      return;
    }

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role === "Super Admin") {
        navigate("/superadmin");
        return;
      } else if (decoded.role === "Admin") {
        navigate("/moderator");
        return;
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch User details
        const uRes = await fetch(buildApiUrl("/api/auth/user"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const uData = await uRes.json();
        if (uRes.ok) {
          setUserDetails({
            name: `${uData.user.firstname} ${uData.user.lastname}`,
            email: uData.user.email,
            referralCode: uData.user.referralCode || "N/A",
            whatsapp: uData.user.phone || "",
          });
        }

        // Fetch Campaigns
        const cRes = await fetch(buildApiUrl("/api/campaign"));
        const cData = await cRes.json();
        if (cRes.ok) setCampaigns(cData.campaigns || []);

        // Fetch Leaderboard
        const lRes = await fetch(buildApiUrl("/api/donations/leaderboard"));
        const lData = await lRes.json();
        if (lRes.ok) {
          setLeaderboardData(lData.leaderboard.map(entry => ({
            name: entry.name || "Anonymous",
            totalAmount: entry.totalAmount,
            referrals: entry.referralsCount || 1,
            referralCode: entry.referralCode,
          })));
        }

        // Fetch user donations for goal tracking
        const dRes = await fetch(buildApiUrl("/api/donations"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dData = await dRes.json();
        if (dRes.ok) {
          const raised = (dData.donations || []).reduce((sum, d) => sum + d.amount, 0);
          setUserGoalData({ totalRaised: raised, totalGoal: uData.user.goal || 30000 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn, token, navigate]);

  // Tour Auto Start
  useEffect(() => {
    if (!isLoading && userDetails.name) {
      const tourCompleted = localStorage.getItem("onboarding_completed");
      if (!tourCompleted) {
        setTourOpen(true);
      }
    }
  }, [isLoading, userDetails]);

  // Tour Element Highlight Class Handler
  useEffect(() => {
    if (tourOpen && TOUR_STEPS[tourStep]?.targetId) {
      const el = document.getElementById(TOUR_STEPS[tourStep].targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("tour-highlight");
        TOUR_STEPS.forEach((step, idx) => {
          if (idx !== tourStep && step.targetId) {
            const otherEl = document.getElementById(step.targetId);
            if (otherEl) otherEl.classList.remove("tour-highlight");
          }
        });
      }
    }
    return () => {
      TOUR_STEPS.forEach((step) => {
        if (step.targetId) {
          const el = document.getElementById(step.targetId);
          if (el) el.classList.remove("tour-highlight");
        }
      });
    };
  }, [tourStep, tourOpen, userDetails]);

  const handleSectionChange = (sectionName) => {
    const routeMap = {
      "Dashboard": "/dashboard/general",
      "Profile": "/dashboard/profile",
      "Rewards": "/dashboard/rewards",
      "Leaderboard": "/dashboard/leaderboard",
    };
    setSelectedSection(sectionName);
    if (mobileOpen) setMobileOpen(false);
    if (routeMap[sectionName]) {
      navigate(routeMap[sectionName]);
    } else {
      navigate("/dashboard");
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogoClick = () => navigate("/");
  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${userDetails.referralCode}`;
    navigator.clipboard.writeText(link);
    setSnackbarOpen(true);
  };

  const handleShareWhatsAppHero = () => {
    const link = `${window.location.origin}/${userDetails.referralCode}`;
    const text = `Hey! Please support my fundraising campaign for NayePankh Foundation. Every contribution helps underprivileged kids. Donate here: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareWhatsAppCampaign = (campaign) => {
    const link = `${window.location.origin}/${userDetails.referralCode}`;
    const text = `Please support: "${campaign.title}" under NayePankh Foundation. Donate using my referral link to empower communities: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getLevelAchieved = (raised) => {
    if (raised >= 10000) return "Master 🥇";
    if (raised >= 5000) return "Ninja 🥈";
    if (raised >= 1000) return "Star 🥉";
    return "Beginner 🌱";
  };

  // Drawer Sidebar Layout
  const drawerContent = (
    <Box sx={{ bgcolor: "#F9F9F9", height: "100%", borderRight: "1px solid #E0E0E0" }}>
      <Box
        sx={{
          p: 2.5,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={handleLogoClick}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1.2 }}>
          NayePankh
        </Typography>
      </Box>
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <PopoverListItemButton
              onClick={() => handleSectionChange(item.text)}
              sx={{
                py: 1.5,
                px: 3,
                bgcolor: selectedSection === item.text ? "rgba(33,110,182,0.1)" : "transparent",
                color: selectedSection === item.text ? "primary.main" : "text.secondary",
                "&:hover": { bgcolor: "rgba(33,110,182,0.05)" },
                transition: "all 0.25s",
                borderRadius: 1,
                mx: 1,
              }}
            >
              <ListItemIcon sx={{ color: selectedSection === item.text ? "primary.main" : "text.secondary", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ "& .MuiTypography-root": { fontWeight: selectedSection === item.text ? 600 : 400 } }} />
            </PopoverListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6">Loading Intern Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        .tour-highlight {
          position: relative !important;
          z-index: 10001 !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 25px 8px #FF9933 !important;
          transition: all 0.3s ease !important;
          pointer-events: none !important;
        }
      `}</style>

      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header App Bar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "white", color: "text.primary", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: "bold", color: "primary.main" }}>
              Intern Dashboard
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, fontWeight: 500 }}>
                {userDetails.name}
              </Typography>
              <Avatar
                onClick={handleMenuOpen}
                sx={{ bgcolor: "primary.main", cursor: "pointer", width: 38, height: 38 }}
              >
                {userDetails.name[0]}
              </Avatar>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <List sx={{ p: 1, minWidth: 150 }}>
                  <PopoverListItemButton onClick={() => { handleSectionChange("Profile"); handleMenuClose(); }}>
                    <ListItemIcon sx={{ minWidth: 35 }}><PersonIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Profile" />
                  </PopoverListItemButton>
                  <PopoverListItemButton onClick={handleLogout}>
                    <ListItemIcon sx={{ minWidth: 35 }}><LogoutIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Logout" />
                  </PopoverListItemButton>
                </List>
              </Popover>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawers */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
          >
            {drawerContent}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content Pane */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
          
          {selectedSection === "Dashboard" && (
            <Box>
              {/* Welcome Jumbotron Banner */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  height: "35vh",
                  backgroundImage: `url(${bgImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  px: { xs: 3, sm: 6 },
                  mb: 4,
                  overflow: "hidden",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                }}
              >
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(33, 110, 182, 0.75)" }} />
                <Box sx={{ position: "relative", color: "white", maxWidth: "600px" }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: "1.8rem", sm: "2.8rem" } }}>
                    Hello, {userDetails.name}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, fontSize: { xs: "0.9rem", sm: "1.2rem" }, mb: 2 }}>
                    Every contribution makes a massive difference. Let's shape this world with more love and care.
                  </Typography>
                </Box>
              </Box>

              {/* Referral details cards */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                        Your Referral Code
                      </Typography>
                      <Box
                        id="onboarding-referral-code"
                        sx={{
                          p: 2,
                          border: "2px solid #FF9933",
                          borderRadius: 2,
                          display: "inline-block",
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          color: "primary.main",
                          bgcolor: "#FFF4E6",
                          mb: 2,
                        }}
                      >
                        {userDetails.referralCode}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Share your unique code or link. Supporters using it will credit your campaign totals instantly.
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        id="onboarding-copy-link"
                        variant="contained"
                        startIcon={<ContentCopyIcon />}
                        onClick={handleCopyLink}
                        sx={{ py: 1, px: 3, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                      >
                        Copy Link
                      </Button>
                      <Button
                        id="onboarding-share-whatsapp"
                        variant="contained"
                        startIcon={<WhatsAppIcon />}
                        onClick={handleShareWhatsAppHero}
                        sx={{ py: 1, px: 3, borderRadius: 2, bgcolor: "whatsappGreen.main", "&:hover": { bgcolor: "#20B858" }, textTransform: "none", fontWeight: "bold" }}
                      >
                        Share
                      </Button>
                    </Box>
                  </Card>
                </Grid>

                {/* Milestone progress tracker */}
                <Grid item xs={12} md={6}>
                  <Card id="onboarding-milestone-tracker" sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "100%" }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                        Milestone Progress Tracker
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <AnimatedLinearProgress variant="determinate" value={Math.min((userGoalData.totalRaised / userGoalData.totalGoal) * 100, 100)} />
                        <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold", color: "primary.main" }}>
                          ₹{userGoalData.totalRaised.toLocaleString()} Raised of ₹{userGoalData.totalGoal.toLocaleString()}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                        Badge Level: {getLevelAchieved(userGoalData.totalRaised)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Collect more donations to level up and unlock new achievement rewards.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Leadership Chart Board */}
              <Card id="onboarding-leaderboard" sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", mb: 4 }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}>
                    Top Fundraising Campaigns
                  </Typography>
                  {leaderboardData.length > 0 ? (
                    <Box sx={{ width: "100%", height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={leaderboardData.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="totalAmount" fill="#216eb6" radius={[4, 4, 0, 0]} name="Raised (₹)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">No donations leaderboard logs found.</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Active Campaigns List */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}>
                  Active Fundraising Campaigns
                </Typography>
                <Grid container spacing={3}>
                  {campaigns.map((camp) => (
                    <Grid item xs={12} sm={6} md={4} key={camp._id}>
                      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}>
                            {camp.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60, mb: 2 }}>
                            {camp.description}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <LinearProgress variant="determinate" value={Math.min((camp.raisedAmount / camp.goalAmount) * 100, 100)} />
                            <Typography variant="caption" sx={{ display: "block", mt: 0.5, fontWeight: "bold" }}>
                              ₹{camp.raisedAmount.toLocaleString()} Raised of ₹{camp.goalAmount.toLocaleString()}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<WhatsAppIcon />}
                            onClick={() => handleShareWhatsAppCampaign(camp)}
                            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
                          >
                            Share on WhatsApp
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}

          {/* Subpages Section Mapping */}
          {selectedSection === "Profile" && (
            <ProfileView 
              userDetails={userDetails} 
              setUserDetails={setUserDetails} 
              userGoalData={userGoalData}
              setUserGoalData={setUserGoalData}
              token={token}
            />
          )}

          {selectedSection === "Rewards" && (
            <RewardsView userGoalData={userGoalData} />
          )}

          {selectedSection === "Leaderboard" && (
            <LeaderboardView leaderboardData={leaderboardData} />
          )}

          {selectedSection === "Transactions" && <Transactions />}
          {selectedSection === "Ongoing Campaigns" && <CampaignStatus />}
          {selectedSection === "Learning Modules" && <LearningModules />}
          {selectedSection === "Feedback" && <Feedback />}
          {selectedSection === "FAQ" && <FAQ />}
          
          <Footer />
        </Box>
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseSnackbar} sx={{ bgcolor: "#20b858", color: "white", fontWeight: "bold" }}>
          Donation Link copied to clipboard! 🔗
        </Alert>
      </Snackbar>

      {/* Onboarding tour overlay popup */}
      {tourOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 10005,
            bgcolor: TOUR_STEPS[tourStep]?.targetId ? "transparent" : "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Card
            sx={{
              position: "relative",
              maxWidth: 450,
              width: "90%",
              boxShadow: "0px 10px 40px rgba(0,0,0,0.35)",
              borderRadius: 4,
              p: 2,
              pointerEvents: "auto",
              bgcolor: "#ffffff",
              border: "2px solid #216eb6",
              // Floating positioning if targeting element
              ...(TOUR_STEPS[tourStep]?.targetId ? {
                position: "fixed",
                bottom: { xs: 20, md: 40 },
                right: { xs: "5%", md: 40 },
                left: { xs: "5%", md: "auto" },
              } : {})
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 1.5 }}>
                {TOUR_STEPS[tourStep].title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", mb: 3, lineHeight: 1.6 }}>
                {TOUR_STEPS[tourStep].text}
              </Typography>

              {/* Progress dots */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
                {TOUR_STEPS.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: idx === tourStep ? "primary.main" : "#e0e0e0",
                      transition: "background-color 0.2s"
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => {
                    localStorage.setItem("onboarding_completed", "true");
                    setTourOpen(false);
                  }}
                  sx={{ fontWeight: "bold", textTransform: "none" }}
                >
                  Skip Tour
                </Button>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {tourStep > 0 && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setTourStep(prev => prev - 1)}
                      sx={{ textTransform: "none", fontWeight: "bold" }}
                    >
                      ← Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      if (tourStep < TOUR_STEPS.length - 1) {
                        setTourStep(prev => prev + 1);
                      } else {
                        localStorage.setItem("onboarding_completed", "true");
                        setTourOpen(false);
                      }
                    }}
                    sx={{ bgcolor: "primary.main", textTransform: "none", fontWeight: "bold" }}
                  >
                    {tourStep === TOUR_STEPS.length - 1 ? "Finish Tour" : "Next →"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </ThemeProvider>
  );
};

// Profile settings subpage view
const ProfileView = ({ userDetails, setUserDetails, userGoalData, setUserGoalData, token }) => {
  const [profileData, setProfileData] = useState({ firstname: "", lastname: "", email: "", phone: "", goal: 30000, avatar: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [otpDialog, setOtpDialog] = useState(false);
  const [otpType, setOtpType] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [alert, setAlert] = useState({ show: false, text: "", type: "success" });

  useEffect(() => {
    if (IS_PREVIEW_MODE) {
      const u = getMockUser();
      setProfileData({
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        phone: u.phone,
        goal: u.goal,
        avatar: u.avatar || "",
      });
    } else {
      const [first, ...lastParts] = userDetails.name.split(" ");
      setProfileData({
        firstname: first || "",
        lastname: lastParts.join(" ") || "",
        email: userDetails.email || "",
        phone: userDetails.whatsapp || "",
        goal: userGoalData.totalGoal || 30000,
        avatar: userDetails.avatar || "",
      });
    }
  }, [userDetails, userGoalData]);

  const handleProfileSave = async () => {
    setLoading(true);
    setAlert({ show: false, text: "", type: "success" });
    if (IS_PREVIEW_MODE) {
      const u = getMockUser();
      const updated = {
        ...u,
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        email: profileData.email,
        phone: profileData.phone,
        goal: parseFloat(profileData.goal),
        avatar: profileData.avatar,
      };
      saveMockUser(updated);
      setUserDetails({
        name: `${updated.firstname} ${updated.lastname}`,
        email: updated.email,
        referralCode: updated.referralCode,
        whatsapp: updated.phone,
      });
      setUserGoalData(prev => ({ ...prev, totalGoal: updated.goal }));
      setAlert({ show: true, text: "Profile details updated successfully!", type: "success" });
    } else {
      try {
        const { error } = await supabase
          .from("users")
          .update({
            first_name: profileData.firstname,
            last_name: profileData.lastname,
            email: profileData.email,
            phone: profileData.phone,
          })
          .eq("referral_code", userDetails.referralCode);
        
        const { error: fError } = await supabase
          .from("fundraisers")
          .update({ goal_amount: parseFloat(profileData.goal) })
          .eq("referral_code", userDetails.referralCode);

        if (error || fError) {
          setAlert({ show: true, text: error?.message || fError?.message || "Failed to update profile", type: "error" });
        } else {
          setUserDetails(prev => ({
            ...prev,
            name: `${profileData.firstname} ${profileData.lastname}`,
            email: profileData.email,
            whatsapp: profileData.phone,
          }));
          setUserGoalData(prev => ({ ...prev, totalGoal: parseFloat(profileData.goal) }));
          setAlert({ show: true, text: "Profile details saved successfully to database!", type: "success" });
        }
      } catch (err) {
        setAlert({ show: true, text: "Error connecting to Supabase database", type: "error" });
      }
    }
    setLoading(false);
  };

  const handlePasswordSave = async () => {
    setAlert({ show: false, text: "", type: "success" });
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ show: true, text: "New passwords do not match!", type: "error" });
      return;
    }
    if (IS_PREVIEW_MODE) {
      setAlert({ show: true, text: "Password changed successfully (Simulated)!", type: "success" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      try {
        const response = await fetch(buildApiUrl("/api/auth/change-password"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          })
        });
        const data = await response.json();
        if (response.ok) {
          setAlert({ show: true, text: "Password updated successfully!", type: "success" });
          setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          setAlert({ show: true, text: data.msg || "Failed to update password", type: "error" });
        }
      } catch (err) {
        setAlert({ show: true, text: "Failed to connect to API server", type: "error" });
      }
    }
  };

  const triggerVerification = async (type) => {
    setOtpType(type);
    setOtpCode("");
    setAlert({ show: false, text: "", type: "success" });
    
    if (IS_PREVIEW_MODE) {
      setAlert({ show: true, text: `Verification code sent to your ${type}!`, type: "info" });
      setOtpDialog(true);
    } else {
      try {
        const endpoint = type === "email" ? "/api/auth/send-email-otp" : "/api/auth/send-sms-otp";
        const response = await fetch(buildApiUrl(endpoint), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            target: type === "email" ? profileData.email : profileData.phone,
          })
        });
        if (response.ok) {
          setAlert({ show: true, text: `Verification code dispatched!`, type: "success" });
          setOtpDialog(true);
        } else {
          const data = await response.json();
          setAlert({ show: true, text: data.msg || "Failed to request OTP code", type: "error" });
        }
      } catch (err) {
        setAlert({ show: true, text: "OTP service connection failed", type: "error" });
      }
    }
  };

  const handleVerifyOtp = async () => {
    setAlert({ show: false, text: "", type: "success" });
    if (IS_PREVIEW_MODE) {
      if (otpCode === "123456") {
        setAlert({ show: true, text: `${otpType === "email" ? "Email" : "Phone"} verified successfully!`, type: "success" });
        setOtpDialog(false);
        const u = getMockUser();
        if (otpType === "email") u.email_verified = true;
        else u.phone_verified = true;
        saveMockUser(u);
      } else {
        setAlert({ show: true, text: "Invalid code. Use 123456 for local testing.", type: "error" });
      }
    } else {
      try {
        const endpoint = otpType === "email" ? "/api/auth/verify-email-otp" : "/api/auth/verify-sms-otp";
        const response = await fetch(buildApiUrl(endpoint), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: otpCode })
        });
        const data = await response.json();
        if (response.ok) {
          setAlert({ show: true, text: "Verified successfully!", type: "success" });
          setOtpDialog(false);
        } else {
          setAlert({ show: true, text: data.msg || "Invalid code", type: "error" });
        }
      } catch (err) {
        setAlert({ show: true, text: "OTP verification failed", type: "error" });
      }
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (IS_PREVIEW_MODE) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
      return;
    }

    setLoading(true);
    setAlert({ show: false, text: "", type: "success" });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(buildApiUrl("/api/users/upload-avatar"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setProfileData(prev => ({ ...prev, avatar: data.avatarUrl }));
        setUserDetails(prev => ({ ...prev, avatar: data.avatarUrl }));
        setAlert({ show: true, text: "Profile picture uploaded successfully!", type: "success" });
      } else {
        setAlert({ show: true, text: data.msg || "Failed to upload avatar", type: "error" });
      }
    } catch (err) {
      setAlert({ show: true, text: "Error connecting to upload server", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}>
        Edit Fundraiser Profile
      </Typography>

      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3, fontWeight: 500 }}>
          {alert.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={profileData.avatar}
            sx={{ width: 140, height: 140, mb: 2, border: "4px solid #216eb6", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          />
          <Button variant="outlined" component="label" size="small" sx={{ textTransform: "none", fontWeight: "bold" }}>
            Upload Photo
            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
          </Button>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField fullWidth label="First Name" value={profileData.firstname} onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Last Name" value={profileData.lastname} onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <Button size="small" variant="contained" onClick={() => triggerVerification("email")} sx={{ ml: 1, textTransform: "none", py: 0.8 }}>
                          Verify
                        </Button>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact / WhatsApp Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <Button size="small" variant="contained" onClick={() => triggerVerification("phone")} sx={{ ml: 1, textTransform: "none", py: 0.8 }}>
                          Verify
                        </Button>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth type="number" label="Personal Fundraising Goal (₹)" value={profileData.goal} onChange={(e) => setProfileData({ ...profileData, goal: parseFloat(e.target.value) || 0 })} />
                </Grid>
              </Grid>

              <Button variant="contained" onClick={handleProfileSave} disabled={loading} sx={{ mt: 2, py: 1.2, fontWeight: "bold", textTransform: "none" }}>
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 3, mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
              Update Password
            </Typography>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3, p: 0 }}>
              <TextField fullWidth type="password" label="Current Password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
              <TextField fullWidth type="password" label="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
              <TextField fullWidth type="password" label="Confirm New Password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
              <Button variant="contained" onClick={handlePasswordSave} sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" }, fontWeight: "bold", textTransform: "none", py: 1.2, width: "fit-content" }}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* OTP verification popup modal */}
      <Dialog open={otpDialog} onClose={() => setOtpDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Verify {otpType === "email" ? "Email Address" : "Phone Number"}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            We've sent a 6-digit OTP verification code. Enter the code below. (Mock OTP: <strong>123456</strong>)
          </Typography>
          <TextField fullWidth label="OTP Verification Code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOtpDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleVerifyOtp} sx={{ bgcolor: "primary.main" }}>
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Rewards subpage view
const RewardsView = ({ userGoalData }) => {
  const raised = userGoalData.totalRaised || 0;
  
  const rewards = [
    { title: "Beginner", threshold: 0, badge: "🌱", color: "#64B5F6", desc: "Your fundraising journey has begun! Keep sharing." },
    { title: "Star", threshold: 1000, badge: "🥉", color: "#CD7F32", desc: "Raise ₹1,000 to earn the bronze Star Intern badge." },
    { title: "Ninja", threshold: 5000, badge: "🥈", color: "#C0C0C0", desc: "Raise ₹5,000 to earn the silver Ninja Intern badge." },
    { title: "Master", threshold: 10000, badge: "🥇", color: "#FFD700", desc: "Raise ₹10,000 to earn the gold Master Intern badge." },
  ];

  let activeTier = rewards[0];
  let nextTier = rewards[1];
  for (let i = rewards.length - 1; i >= 0; i--) {
    if (raised >= rewards[i].threshold) {
      activeTier = rewards[i];
      nextTier = rewards[i + 1] || null;
      break;
    }
  }

  const progressToNext = nextTier 
    ? Math.min(((raised - activeTier.threshold) / (nextTier.threshold - activeTier.threshold)) * 100, 100)
    : 100;

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}>
        Your Badges & Rewards
      </Typography>

      <Card sx={{ p: 4, mb: 4, borderRadius: 4, background: "linear-gradient(135deg, #1565C0, #1E88E5)", color: "white", boxShadow: "0 10px 30px rgba(21,101,192,0.15)" }}>
        <CardContent sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 3, p: 0 }}>
          <Box>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>Current Status</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 2 }}>
              {activeTier.badge} {activeTier.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
              Total Amount Raised: <strong>₹{raised.toLocaleString()}</strong>
            </Typography>
          </Box>
          {nextTier && (
            <Box sx={{ minWidth: 200, flex: 1, maxWidth: 350 }}>
              <Typography variant="body2" sx={{ mb: 1, textAlign: "right", fontWeight: 500 }}>
                ₹{(nextTier.threshold - raised).toLocaleString()} left to unlock {nextTier.title} {nextTier.badge}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressToNext}
                sx={{ height: 12, borderRadius: 6, bgcolor: "rgba(255,255,255,0.2)", "& .MuiLinearProgress-bar": { bgcolor: "#FFD700" } }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Badges Milestones
      </Typography>
      <Grid container spacing={3}>
        {rewards.map((reward) => {
          const unlocked = raised >= reward.threshold;
          return (
            <Grid item xs={12} sm={6} key={reward.title}>
              <Card sx={{
                p: 3,
                borderRadius: 3,
                border: unlocked ? `2px solid ${reward.color}` : "2px dashed #cfd8dc",
                bgcolor: unlocked ? "white" : "#fafafa",
                opacity: unlocked ? 1 : 0.6,
                boxShadow: unlocked ? "0 4px 15px rgba(0,0,0,0.03)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 3
              }}>
                <Typography sx={{ fontSize: "3.5rem", p: 1, borderRadius: "50%", bgcolor: unlocked ? `${reward.color}15` : "#eceff1", lineHeight: 1 }}>
                  {reward.badge}
                </Typography>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: unlocked ? reward.color : "text.secondary", display: "flex", alignItems: "center", gap: 1 }}>
                    {reward.title} {unlocked ? "✓" : "🔒"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {reward.desc}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 1, fontWeight: "bold", color: "text.secondary" }}>
                    Threshold Goal: ₹{reward.threshold.toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

// Leaderboard subpage view
const LeaderboardView = ({ leaderboardData }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (IS_PREVIEW_MODE) {
      setList(getMockLeaderboard());
    } else {
      setList(leaderboardData);
    }
  }, [leaderboardData]);

  const getRankEmoji = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getRewardBadge = (amount) => {
    if (amount >= 10000) return "🥇 Master";
    if (amount >= 5000) return "🥈 Ninja";
    if (amount >= 1000) return "🥉 Star";
    return "🌱 Beginner";
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}>
        Intern Leaderboard 🏆
      </Typography>

      <Card sx={{ borderRadius: 4, boxShadow: "0 6px 25px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <Box sx={{ p: 2.5, bgcolor: "primary.main", color: "white" }}>
          <Grid container sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
            <Grid item xs={2} sm={1.5} sx={{ textAlign: "center" }}>Rank</Grid>
            <Grid item xs={5} sm={5.5}>Intern Profile</Grid>
            <Grid item xs={2.5} sx={{ textAlign: "center" }}>Award Badge</Grid>
            <Grid item xs={2} sx={{ textAlign: "right" }}>Total Raised</Grid>
          </Grid>
        </Box>

        <List sx={{ p: 0 }}>
          {list.map((entry, index) => {
            const raisedVal = entry.totalAmount || entry.donations || 0;
            return (
              <ListItem
                key={entry.referralCode || index}
                sx={{
                  py: 2,
                  px: 3,
                  borderBottom: "1px solid #f0f0f0",
                  bgcolor: index === 0 ? "#FFD70008" : index === 1 ? "#C0C0C008" : index === 2 ? "#CD7F3208" : "white",
                  "&:hover": { bgcolor: "#fbfcfe" }
                }}
              >
                <Grid container alignItems="center">
                  <Grid item xs={2} sm={1.5} sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
                    {getRankEmoji(index)}
                  </Grid>
                  <Grid item xs={5} sm={5.5} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold", width: 36, height: 36 }}>
                      {entry.name[0]}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem", color: "text.primary" }}>{entry.name}</Typography>
                      {entry.referralCode && (
                        <Typography variant="caption" sx={{ color: "text.secondary", bgcolor: "#f0f0f0", px: 0.8, py: 0.1, borderRadius: 1 }}>
                          {entry.referralCode}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={2.5} sx={{ textAlign: "center", fontWeight: "bold", color: "text.secondary", fontSize: "0.85rem" }}>
                    {getRewardBadge(raisedVal)}
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: "right", fontWeight: "bold", color: "primary.main" }}>
                    ₹{raisedVal.toLocaleString()}
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Card>
    </Container>
  );
};

export default DashboardPage;
