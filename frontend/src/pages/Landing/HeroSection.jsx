import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { VolunteerActivismOutlined, GroupsOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import backgroundVideo from "../../assets/MashUp_Video.mp4";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.2, ease: "easeOut" },
  }),
};

const floatAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function HeroSection() {
  const navigate = useNavigate();
  const [videoSrc, setVideoSrc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setVideoSrc(backgroundVideo), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      id="hero"
      sx={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      {videoSrc ? (
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </motion.video>
      ) : (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "#2C3E50",
            zIndex: 0,
          }}
        />
      )}

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(44,62,80,0.85) 0%, rgba(33,110,182,0.3) 50%, rgba(44,62,80,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* Decorative elements */}
      <Box
        component={motion.div}
        variants={floatAnimation}
        animate="animate"
        sx={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(241,196,15,0.15) 0%, transparent 70%)",
          zIndex: 1,
          display: { xs: "none", md: "block" },
        }}
      />
      <Box
        component={motion.div}
        variants={floatAnimation}
        animate="animate"
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "8%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(33,110,182,0.12) 0%, transparent 70%)",
          zIndex: 1,
          display: { xs: "none", md: "block" },
        }}
      />

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: { xs: 3, md: 4 },
        }}
      >
        {/* Badge */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Box
            sx={{
              display: "inline-block",
              px: 3,
              py: 1,
              borderRadius: 50,
              bgcolor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              mb: 3,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#F1C40F",
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontSize: { xs: "0.75rem", md: "0.85rem" },
              }}
            >
              NayePankh Foundation — Est. 2020
            </Typography>
          </Box>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial={prefersReducedMotion ? {} : "hidden"}
          animate={prefersReducedMotion ? {} : "visible"}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
              mb: 2,
              textShadow: "2px 2px 12px rgba(0,0,0,0.4)",
            }}
            aria-label="Give Wings to Dreams"
          >
            Give{" "}
            <Box component="span" sx={{ color: "#42A5F5" }}>
              Wings
            </Box>{" "}
            to{" "}
            <Box component="span" sx={{ color: "#F1C40F" }}>
              Dreams
            </Box>
          </Typography>
        </motion.div>

        {/* Subheadline */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial={prefersReducedMotion ? {} : "hidden"}
          animate={prefersReducedMotion ? {} : "visible"}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontWeight: 300,
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              maxWidth: "650px",
              mx: "auto",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Empowering underprivileged communities through education, healthcare, and sustainable development. Your support transforms lives.
          </Typography>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial={prefersReducedMotion ? {} : "hidden"}
          animate={prefersReducedMotion ? {} : "visible"}
          style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<VolunteerActivismOutlined />}
            onClick={() => navigate("/donate")}
            sx={{
              bgcolor: "#F1C40F",
              color: "#2C3E50",
              fontWeight: 700,
              fontSize: { xs: "1rem", md: "1.1rem" },
              py: 1.8,
              px: 4,
              borderRadius: 50,
              textTransform: "none",
              boxShadow: "0 8px 25px rgba(241,196,15,0.35)",
              "&:hover": {
                bgcolor: "#F39C12",
                transform: "translateY(-3px) scale(1.02)",
                boxShadow: "0 12px 35px rgba(241,196,15,0.45)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Donate Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GroupsOutlined />}
            onClick={() => navigate("/register")}
            sx={{
              color: "#FFFFFF",
              borderColor: "rgba(255,255,255,0.6)",
              borderWidth: 2,
              fontWeight: 600,
              fontSize: { xs: "1rem", md: "1.1rem" },
              py: 1.8,
              px: 4,
              borderRadius: 50,
              textTransform: "none",
              "&:hover": {
                borderColor: "#FFFFFF",
                bgcolor: "rgba(255,255,255,0.1)",
                transform: "translateY(-3px)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Join Us
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)" }}
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Box
              sx={{
                width: 24,
                height: 40,
                borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.4)",
                display: "flex",
                justifyContent: "center",
                pt: 1,
              }}
            >
              <Box
                sx={{
                  width: 3,
                  height: 10,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.6)",
                }}
              />
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
