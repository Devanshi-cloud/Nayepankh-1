import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

// Loading Screen
import LoadingScreen from "./components/LoadingScreen";



// Landing Page Components
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import About from "./pages/About";
import Certificates from "./pages/Certificates";
import Newspaper from "./pages/Newspaper";
import DonationPage from "./pages/DonationPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Portal Components
import PortalHome from "./pages/PortalHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import SuperAdminDashboard from "./pages/Super_Admin_Dashboard/SuperAdminDashboard";
import ModeratorDashboard from "./pages/Moderator_Dashboard/ModeratorDashboard";
import PortalDonate from "./pages/PortalDonate";
import ReferralRedirect from "./pages/ReferralRedirect";

// Themes
import landingTheme from "./theme";
import portalTheme from "./portalTheme";

// Error Fallback for Portal
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ padding: "20px", textAlign: "center", backgroundColor: "#ffebee", color: "#d32f2f" }}>
      <h2>Something Went Wrong</h2>
      <p>An error occurred: {error.message}</p>
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#FF9933",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Try Again
      </button>
    </div>
  );
}

// Layout Wrappers for Styling Isolation
function LandingLayout() {
  return (
    <ThemeProvider theme={landingTheme}>
      <CssBaseline />
      <Navbar />
      <Outlet />
    </ThemeProvider>
  );
}

function PortalLayout() {
  return (
    <ThemeProvider theme={portalTheme}>
      <CssBaseline />
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Outlet />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page Subtree (Saffron/Blue theme + Top Navbar) */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/newspaper" element={<Newspaper />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        {/* Portal Subtree (Blue theme, No Landing Navbar) */}
        <Route element={<PortalLayout />}>
          <Route path="/portal" element={<PortalHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:section" element={<Dashboard />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/moderator" element={<ModeratorDashboard />} />
          <Route path="/portal-donate" element={<PortalDonate />} />
          <Route path="/:referralCode" element={<ReferralRedirect />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
