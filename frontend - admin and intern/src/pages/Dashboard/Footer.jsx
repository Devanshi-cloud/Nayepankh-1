import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <>
      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          mt: 3,
          py: 2,
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
          borderRadius:"20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            fontWeight: 400,
            letterSpacing: 0.5,
          }}
        >
          © {new Date().getFullYear()} NayePankh Foundation. All rights
          reserved.
        </Typography>
      </Box>
    </>
  );
}

export default Footer;
