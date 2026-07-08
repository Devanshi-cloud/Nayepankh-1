import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Home from "./pages/Home";
import SuperAdminDashboard from "./pages/Super_Admin_Dashboard/SuperAdminDashboard";
import ModeratorDashboard from "./pages/Moderator_Dashboard/ModeratorDashboard";
import LoadingScreen from "./components/LoadingScreen";
import ReferralRedirect from "./pages/ReferralRedirect";

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

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:section" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/moderator" element={<ModeratorDashboard />} />
          <Route path="/:referralCode" element={<ReferralRedirect />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;