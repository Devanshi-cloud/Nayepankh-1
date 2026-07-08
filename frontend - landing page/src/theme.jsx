import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF9933", // Saffron
    },
    secondary: {
      main: "#138808", // Green
    },
    background: {
      default: "#FFF4E6", // Light saffron tint
    },
    lightOrange: {
      main: "#FFE5B4", // Light orange for General background
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Modern font
  },
});

export default theme;

