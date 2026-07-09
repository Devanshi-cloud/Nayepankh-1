import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import mainLogo from "../assets/NayePankh-logo.png";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 30;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return Math.min(next, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#ffffff",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background decorative gradient */}
      <Box
        component={motion.div}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(33,110,182,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Logo */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "back.out(1.7)" }}
      >
        <Box
          sx={{
            width: 160,
            height: 130,
            bgcolor: "#fff",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.06)",
            borderRadius: 3,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <img
            src={mainLogo}
            alt="NayePankh Foundation"
            style={{ width: "90%", height: "auto", objectFit: "contain" }}
          />
        </Box>
      </motion.div>

      {/* Spinning Outer Ring with Pulse */}
      <Box sx={{ position: "relative", width: 64, height: 64, mb: 3 }}>
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid rgba(33,110,182,0.15)",
            borderTopColor: "#216eb6",
            borderRightColor: "#42A5F5",
          }}
        />
        {/* Inner pulsing dot */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#216eb6",
              boxShadow: "0 0 12px rgba(33,110,182,0.4)",
            }}
          />
        </motion.div>
      </Box>

      {/* Progress Percentage */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#216eb6",
          fontFamily: "'Poppins', sans-serif",
          mb: 2,
        }}
      >
        {Math.floor(progress)}%
      </Typography>

      {/* Progress Bar */}
      <Box
        sx={{
          width: "280px",
          height: 6,
          bgcolor: "#e0e0e0",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
          style={{
            height: "100%",
            borderRadius: 3,
            background:
              "linear-gradient(90deg, #42A5F5, #216eb6)",
            boxShadow: "0 0 8px rgba(33,110,182,0.3)",
          }}
        />
      </Box>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Typography
          variant="caption"
          sx={{
            mt: 2,
            color: "#546E7A",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Creating wings for dreams...
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;
