import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#216eb6", // Deep blue
    },
    secondary: {
      main: "#42A5F5", // Light blue
    },
    background: {
      default: "#F0F6FF", // Light blue tint
    },
    lightBlue: {
      main: "#E3F2FD", // Light blue for backgrounds
    },
    warmAccent: {
      main: "#F1C40F", // Gold accent for warmth
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Modern font
  },
});

export default theme;

