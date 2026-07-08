import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { IS_PREVIEW_MODE, supabase } from "../supabaseClient";
import { getMockUser } from "../mockData";

const ReferralRedirect = () => {
  const { referralCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        let isValid = false;

        if (IS_PREVIEW_MODE) {
          // In preview mode, any 6-to-8 character alphanumeric code is simulated as valid
          const mockUser = getMockUser();
          isValid = referralCode.toLowerCase() === mockUser.referralCode.toLowerCase() || referralCode.length >= 6;
        } else {
          // Query Supabase database to check if the fundraiser exists
          const { data, error } = await supabase
            .from("fundraisers")
            .select("referral_code")
            .eq("referral_code", referralCode.toUpperCase())
            .single();
          
          if (data && !error) {
            isValid = true;
          }
        }

        if (isValid) {
          // Store the referral code for checkout linkage
          localStorage.setItem("referralCode", referralCode.toUpperCase());
          // Redirect to the donation page with the ref query parameter
          navigate(`/donate?ref=${referralCode.toUpperCase()}`, { replace: true });
        } else {
          setError("Invalid referral code. Redirecting to home...");
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
