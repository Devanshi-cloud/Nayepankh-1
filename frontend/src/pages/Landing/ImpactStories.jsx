import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Container, Avatar, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FormatQuote, ArrowBack, ArrowForward } from "@mui/icons-material";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Beneficiary, Education Program",
    quote:
      "NayePankh Foundation gave me the opportunity to continue my education when my family couldn't afford it. Today, I'm pursuing my dream of becoming a teacher, thanks to their support.",
    avatar: "",
    color: "#216eb6",
  },
  {
    name: "Rahul Verma",
    role: "Volunteer & Fundraiser",
    quote:
      "Volunteering with NayePankh has been the most rewarding experience. Seeing the smiles on children's faces when they receive school supplies is something I'll never forget. Every contribution truly matters.",
    avatar: "",
    color: "#3498DB",
  },
  {
    name: "Anita Deshmukh",
    role: "Community Leader",
    quote:
      "The healthcare camps organized by NayePankh reached our village at a time when we had no access to medical facilities. They didn't just treat us—they gave us hope and dignity.",
    avatar: "",
    color: "#F1C40F",
  },
  {
    name: "Vikram Patel",
    role: "Monthly Donor",
    quote:
      "Being a monthly donor gives me peace of mind knowing that my contribution consistently supports those in need. NayePankh's transparency and dedication inspire me to keep giving.",
    avatar: "",
    color: "#E74C3C",
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function ImpactStories() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [autoPlay, setAutoPlay] = useState(true);

  const paginate = useCallback(
    (newDirection) => {
      setCurrentIndex((prev) => {
        const nextIndex =
          (prev[0] + newDirection + testimonials.length) % testimonials.length;
        return [nextIndex, newDirection];
      });
      setAutoPlay(false);
      setTimeout(() => setAutoPlay(true), 5000);
    },
    []
  );

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [autoPlay, paginate]);

  const testimonial = testimonials[currentIndex];
  const placeholderLetter = testimonial.name.charAt(0);

  return (
    <Box
      id="impact"
      component="section"
      aria-label="Impact Stories"
      aria-roledescription="carousel"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(33,110,182,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="overline"
            component="span"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 3,
              display: "block",
              textAlign: "center",
              mb: 1,
              fontSize: "0.85rem",
            }}
          >
            IMPACT STORIES
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              color: "#2C3E50",
              textAlign: "center",
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Voices of Change
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              maxWidth: 500,
              mx: "auto",
              mb: 6,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            Real stories from the people whose lives have been transformed through your support.
          </Typography>
        </motion.div>

        {/* Carousel */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 320, md: 280 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={() => paginate(-1)}
            aria-label="Previous testimonial"
            sx={{
              position: "absolute",
              left: { xs: -10, md: -60 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              color: "#2C3E50",
              bgcolor: "rgba(0,0,0,0.03)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
              width: 48,
              height: 48,
              display: { xs: "none", md: "flex" },
            }}
          >
            <ArrowBack />
          </IconButton>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={prefersReducedMotion ? {} : slideVariants}
              initial={prefersReducedMotion ? {} : "enter"}
              animate={prefersReducedMotion ? {} : "center"}
              exit={prefersReducedMotion ? {} : "exit"}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ width: "100%" }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Testimonial ${currentIndex + 1} of ${testimonials.length}`}
            >
              <Box sx={{ textAlign: "center", px: { xs: 2, md: 6 } }}>
                <FormatQuote
                  sx={{
                    fontSize: 48,
                    color: testimonial.color,
                    opacity: 0.3,
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  component="blockquote"
                  sx={{
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "#555",
                    lineHeight: 1.8,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    mb: 4,
                    maxWidth: 650,
                    mx: "auto",
                  }}
                >
                  "{testimonial.quote}"
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: testimonial.color,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                    aria-hidden="true"
                  >
                    {placeholderLetter}
                  </Avatar>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: "#2C3E50",
                        fontSize: { xs: "0.95rem", md: "1rem" },
                      }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.85rem", md: "0.9rem" },
                      }}
                    >
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>

          <IconButton
            onClick={() => paginate(1)}
            aria-label="Next testimonial"
            sx={{
              position: "absolute",
              right: { xs: -10, md: -60 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              color: "#2C3E50",
              bgcolor: "rgba(0,0,0,0.03)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
              width: 48,
              height: 48,
              display: { xs: "none", md: "flex" },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>

        {/* Navigation Dots */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 4 }}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => {
                const dir = index > currentIndex ? 1 : -1;
                setCurrentIndex([index, dir]);
                setAutoPlay(false);
                setTimeout(() => setAutoPlay(true), 5000);
              }}
              sx={{
                width: index === currentIndex ? 28 : 10,
                height: 10,
                borderRadius: 5,
                bgcolor: index === currentIndex ? "#216eb6" : "rgba(0,0,0,0.15)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: index === currentIndex ? "#216eb6" : "rgba(0,0,0,0.3)",
                },
              }}
              role="button"
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
