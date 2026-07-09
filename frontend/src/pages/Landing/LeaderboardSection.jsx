import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Avatar,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  EmojiEventsOutlined,
  WorkspacePremiumOutlined,
  MilitaryTechOutlined,
} from "@mui/icons-material";
import { buildApiUrl } from "../../constants";

const prefersReducedMotion = typeof window !== "undefined"
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const mockLeaderboard = [
  { name: "Devanshi Jaiswal", totalAmount: 18500 },
  { name: "Ankit Sharma", totalAmount: 15000 },
  { name: "Meera Nair", totalAmount: 7200 },
  { name: "Rahul Verma", totalAmount: 3600 },
  { name: "Priya Sen", totalAmount: 2400 },
];

const rankIcons = [
  <EmojiEventsOutlined sx={{ color: "#FFD700", fontSize: 28 }} />,
  <WorkspacePremiumOutlined sx={{ color: "#C0C0C0", fontSize: 28 }} />,
  <MilitaryTechOutlined sx={{ color: "#CD7F32", fontSize: 28 }} />,
];

const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function LeaderboardSection() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/donations/leaderboard"));
        const data = await response.json();
        if (response.ok && data.leaderboard?.length) {
          setLeaderboard(data.leaderboard.slice(0, 10));
        } else {
          setLeaderboard(mockLeaderboard);
        }
      } catch {
        setLeaderboard(mockLeaderboard);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const formatAmount = (amount) => {
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  return (
    <Box
      id="leaderboard"
      component="section"
      aria-label="Top Fundraisers Leaderboard"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: "#F8F9FA",
        position: "relative",
      }}
    >
      <Container maxWidth="md">
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
            LEADERBOARD
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
            Top Fundraisers
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
            Celebrating our amazing fundraisers who are making a difference
            through their dedication and generosity.
          </Typography>
        </motion.div>

        {/* Leaderboard List */}
        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={72}
                animation="wave"
                sx={{ borderRadius: 3, bgcolor: "grey.100" }}
              />
            ))}
          </Box>
        ) : (
          <Box
            component={motion.div}
            initial={prefersReducedMotion ? {} : "hidden"}
            whileInView={prefersReducedMotion ? {} : "visible"}
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {leaderboard.map((entry, index) => {
              const initials = entry.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);

              return (
                <motion.div
                  key={entry.name + index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.4, ease: "easeOut" },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: { xs: 2, md: 2.5 },
                      mb: 1.5,
                      borderRadius: 3,
                      bgcolor: index < 3 ? "rgba(255,255,255,0.8)" : "#FFFFFF",
                      border: "1px solid",
                      borderColor:
                        index === 0
                          ? "rgba(255,215,0,0.3)"
                          : index === 1
                          ? "rgba(192,192,192,0.3)"
                          : index === 2
                          ? "rgba(205,127,50,0.3)"
                          : "rgba(0,0,0,0.05)",
                      boxShadow:
                        index === 0
                          ? "0 4px 20px rgba(255,215,0,0.15)"
                          : "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateX(4px)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    {/* Rank */}
                    <Box
                      sx={{
                        width: 40,
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {index < 3 ? (
                        rankIcons[index]
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: "text.secondary",
                            fontSize: "1.1rem",
                          }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </Box>

                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor:
                          index === 0
                            ? "#216eb6"
                            : index === 1
                            ? "#42A5F5"
                            : index === 2
                            ? "#F1C40F"
                            : "rgba(0,0,0,0.1)",
                        color:
                          index < 3 ? "#FFFFFF" : "text.secondary",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {initials}
                    </Avatar>

                    {/* Name */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: "#2C3E50",
                          fontSize: { xs: "0.95rem", md: "1rem" },
                        }}
                      >
                        {entry.name}
                      </Typography>
                      {index < 3 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: rankColors[index],
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        >
                          {index === 0
                            ? "Gold Fundraiser"
                            : index === 1
                            ? "Silver Fundraiser"
                            : "Bronze Fundraiser"}
                        </Typography>
                      )}
                    </Box>

                    {/* Amount */}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        fontSize: { xs: "0.95rem", md: "1.05rem" },
                      }}
                    >
                      {formatAmount(entry.totalAmount)}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}
