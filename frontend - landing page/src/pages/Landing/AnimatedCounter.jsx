import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Typography, Box } from "@mui/material";

export default function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2, label = "", ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, end, duration, count]);

  return (
    <Box ref={ref} sx={{ textAlign: "center", ...props.sx }} {...props}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          lineHeight: 1,
        }}
      >
        {prefix}
        <motion.span>{rounded}</motion.span>
        {suffix}
      </Typography>
      {label && (
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            mt: 1,
            fontSize: { xs: "0.95rem", md: "1.1rem" },
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}
