import { lazy, Suspense } from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import Footer from "./Footer";

// Lazy-load heavy animation components for code splitting
const HeroSection = lazy(() => import("./Landing/HeroSection"));
const MissionSection = lazy(() => import("./Landing/MissionSection"));
const ImpactStories = lazy(() => import("./Landing/ImpactStories"));
const CampaignsSection = lazy(() => import("./Landing/CampaignsSection"));
const VolunteerSection = lazy(() => import("./Landing/VolunteerSection"));
const LeaderboardSection = lazy(() => import("./Landing/LeaderboardSection"));

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

// Fallback skeleton for lazy-loaded sections
function SectionSkeleton({ height = 400 }) {
  return (
    <Box
      sx={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F8F9FA",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            mx: "auto",
            borderRadius: "50%",
            border: "3px solid rgba(33,110,182,0.2)",
            borderTopColor: "#216EB6",
            animation: "spin 0.8s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 2, fontWeight: 500 }}
        >
          Loading...
        </Typography>
      </Container>
    </Box>
  );
}

// Quote section - since it's small, keep inline
function QuoteSection() {
  return (
    <Box
      component="section"
      aria-label="Founder's Quote"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#23201e",
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            component="blockquote"
            sx={{
              color: "#FFFFFF",
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "1.3rem", md: "2rem" },
              lineHeight: 1.4,
              fontStyle: "italic",
              maxWidth: 800,
              mx: "auto",
            }}
          >
            "If we all do something, then together there is no problem that we cannot solve!"
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 2,
                bgcolor: "#F1C40F",
                borderRadius: 1,
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#FFECB3",
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                }}
              >
                PRASHANT SHUKLA
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#FFECB3",
                  opacity: 0.8,
                  fontWeight: 500,
                  display: "block",
                }}
              >
                Founder & President, NayePankh Foundation
              </Typography>
            </Box>
            <Box
              sx={{
                width: 40,
                height: 2,
                bgcolor: "#F1C40F",
                borderRadius: 1,
              }}
            />
          </Box>
        </motion.div>

        {/* Ticker */}
        <Box
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "100%",
            mt: 4,
          }}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            <Typography
              variant="body1"
              component="span"
              sx={{
                color: "#ffdabb",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                mr: 8,
                display: "inline-block",
              }}
            >
              ✦ All our efforts are made possible only because of your support
            </Typography>
            <Typography
              variant="body1"
              component="span"
              sx={{
                color: "#ffdabb",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                display: "inline-block",
              }}
            >
              ✦ Your donations are tax exempted under 80G of the Indian Income Tax Act
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Sections rendered in order with lazy loading */}
      <Suspense fallback={<SectionSkeleton height="100vh" />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={600} />}>
        <MissionSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={500} />}>
        <ImpactStories />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={600} />}>
        <CampaignsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={500} />}>
        <VolunteerSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height={500} />}>
        <LeaderboardSection />
      </Suspense>

      <QuoteSection />

      {/* Footer */}
      <Footer />
    </Box>
  );
}
