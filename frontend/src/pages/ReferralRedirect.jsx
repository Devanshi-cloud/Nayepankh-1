import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { buildApiUrl } from "../constants";

const ReferralRedirect = () => {
  const { referralCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        // Validate referral code via the backend API (uses service_role key, bypasses RLS)
        const response = await fetch(
          buildApiUrl(`/api/donate/${referralCode.toUpperCase()}`)
        );

        if (response.ok) {
          // Store the referral code for checkout linkage
          localStorage.setItem("referralCode", referralCode.toUpperCase());
          // Redirect to the donation page with the ref query parameter
          navigate(`/donate?ref=${referralCode.toUpperCase()}`, { replace: true });
        } else {
          const data = await response.json().catch(() => ({}));
          setError(data.msg || "Invalid referral code. Redirecting to home...");
          setTimeout(() => navigate("/", { replace: true }), 3000);
        }
      } catch (err) {
        console.error("Referral verification failed:", err);
        setError("Error verifying referral code. Redirecting to home...");
        setTimeout(() => navigate("/", { replace: true }), 3000);
      }
    };

    if (referralCode) {
      verifyAndRedirect();
    } else {
      navigate("/", { replace: true });
    }
  }, [referralCode, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#E3F2FD",
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <>
          <CircularProgress size={50} sx={{ mb: 2 }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            Linking referral code "{referralCode}"...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ReferralRedirect;
