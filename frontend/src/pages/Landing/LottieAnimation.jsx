import { lazy, Suspense, useState, useMemo } from "react";
import { Box, Skeleton } from "@mui/material";
import { Diversity3Outlined } from "@mui/icons-material";
import { motion } from "framer-motion";

// Local JSON imports (downloaded to avoid relying on unreliable CDN)
import educationAnim from "../../assets/animations/education.json";
import healthcareAnim from "../../assets/animations/healthcare.json";

const Lottie = lazy(() => import("lottie-react"));

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const animationData = {
  education: educationAnim,
  healthcare: healthcareAnim,
};

// Fallback icons shown if the animation fails to load
const fallbackIcons = {
  education: null, // education URL works, no fallback needed yet
  healthcare: null, // healthcare URL works
  community: <Diversity3Outlined sx={{ fontSize: 80, color: "#F1C40F" }} />,
};

export default function LottieAnimation({ type = "education", ...props }) {
  const [hasError, setHasError] = useState(false);
  const data = useMemo(() => animationData[type], [type]);
  const fallback = fallbackIcons[type];

  // If animation data is available and no error, render Lottie
  if (data && !hasError) {
    return (
      <Suspense
        fallback={
          <Skeleton
            variant="rounded"
            width={180}
            height={180}
            animation="wave"
            sx={{ mx: "auto", borderRadius: 3, bgcolor: "grey.100" }}
          />
        }
      >
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          {...props}
        >
          <Lottie
            loop
            autoplay
            style={{ width: 180, height: 180, margin: "0 auto" }}
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
            animationData={data}
            onError={() => setHasError(true)}
          />
        </motion.div>
      </Suspense>
    );
  }

  // Show fallback icon if available (e.g., for community type)
  if (fallback) {
    return (
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center" }}
        {...props}
      >
        <Box
          sx={{
            width: 180,
            height: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            bgcolor: "rgba(241,196,15,0.08)",
            borderRadius: 4,
          }}
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {fallback}
          </motion.div>
        </Box>
      </motion.div>
    );
  }

  return null;
}
