import { useState, useRef } from "react";
import { buildApiUrl } from '../constants.js';
import { IS_PREVIEW_MODE } from '../supabaseClient.js';
import { saveMockUser } from '../mockData.js';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Link,
  Grid,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../portalTheme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registerImage from "../assets/registerBgm.jpg";

const OTP_LENGTH = 6;

const OtpInput = ({ value, onChange, loading }) => {
  const inputs = useRef([]);
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    let otpArr = value.split("");
    otpArr[idx] = val[val.length - 1];
    const newOtp = otpArr.join("");
    onChange(newOtp);
    if (val && idx < OTP_LENGTH - 1) {
      inputs.current[idx + 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (paste.length === OTP_LENGTH) {
      onChange(paste);
      inputs.current[OTP_LENGTH - 1].focus();
      e.preventDefault();
    }
  };
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
      {[...Array(OTP_LENGTH)].map((_, idx) => (
        <input
          key={idx}
          ref={el => inputs.current[idx] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ""}
          onChange={e => handleChange(e, idx)}
          onPaste={handlePaste}
          onKeyDown={e => handleKeyDown(e, idx)}
          disabled={loading}
          style={{
            width: 44,
            height: 54,
            fontSize: "2rem",
            textAlign: "center",
            border: "2px solid #216eb6",
            borderRadius: 8,
            background: "#fafdff",
            color: "#216eb6",
            outline: "none",
            boxShadow: "0 2px 8px rgba(33,110,182,0.07)",
            transition: "border 0.2s, box-shadow 0.2s",
            marginRight: idx !== OTP_LENGTH - 1 ? 8 : 0,
            fontWeight: 600,
            letterSpacing: 2,
          }}
        />
      ))}
    </Box>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    internshipPeriod: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: otp, 3: done
  const [internEmail, setInternEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate Gmail for interns
    if (!validateGmail(formData.email)) {
      toast.error("Please use a valid Gmail address for intern registration.");
      return;
    }
    
    setLoading(true);
    if (IS_PREVIEW_MODE) {
      setTimeout(() => {
        setInternEmail(formData.email);
        setStep(2); // Show OTP input
        toast.info("OTP sent to your email. Please verify (Preview OTP: 123456).");
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/api/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.msg && data.msg.includes("OTP sent")) {
        setInternEmail(formData.email);
        setStep(2); // Show OTP input
        toast.info("OTP sent to your email. Please verify.");
        setLoading(false);
      } else if (response.ok && data.token) {
        // Admin/Super Admin
        localStorage.setItem("token", data.token);
        toast.success("Registration successful!");
        setLoading(false);
        window.location.href = "/dashboard";
      } else {
        toast.error(data.msg || "Registration failed");
        setLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (IS_PREVIEW_MODE) {
      if (otp !== "123456") {
        toast.error("Invalid OTP. For testing, use: 123456");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        saveMockUser({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          whatsapp: "",
          goal: 30000,
          referralCode: "DEVA6656",
        });
        setStep(3);
        toast.success("Registration verified! Redirecting to login page...");
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }, 600);
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/api/auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: internEmail, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(3);
        toast.success("Registration verified! Redirecting to login page...");
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        toast.error(data.msg || "OTP verification failed");
        setLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              maxWidth: { xs: 400, sm: 800 },
              width: "100%",
              boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Image Section */}
            <Box
              sx={{
                flex: { xs: 1, md: 1.2 },
                position: "relative",
                display: "block",
                overflow: "hidden",
                borderRight: { xs: "none", md: "1px solid #e0e0e0" },
                minHeight: { xs: 300, sm: 500 },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `url(${registerImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 80%",
                  backgroundRepeat: "no-repeat",
                  transition: "transform 0.3s ease-in-out",
                },
                bgcolor: "#216eb6",
                "&:hover::before": {
                  transform: "scale(1.05)",
                },
              }}
            />
            {/* Form Section */}
            <Box
              sx={{
                flex: { md: 1 },
                p: { xs: 2, sm: 4 },
              }}
            >
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  textAlign: "center",
                  bgcolor: "primary.main",
                  borderRadius: 10,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                    fontSize: { xs: "1rem", sm: "1.4rem" },
                    fontStyle: "italic",
                  }}
                >
                  Sign Up
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                {step === 1 && (
                  <Box component="form" onSubmit={handleRegister}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstname"
                          variant="outlined"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastname"
                          variant="outlined"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Gmail Address"
                          name="email"
                          variant="outlined"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          type="email"
                          helperText="Please use your Gmail address for intern registration"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box
                                  component="img"
                                  src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"
                                  alt="Gmail"
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    opacity: validateGmail(formData.email) ? 1 : 0.5,
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          variant="outlined"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          type="password"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth required>
                          <InputLabel id="internship-period-label">Internship Period</InputLabel>
                          <Select
                            labelId="internship-period-label"
                            id="internship-period"
                            name="internshipPeriod"
                            value={formData.internshipPeriod}
                            onChange={handleInputChange}
                            variant="outlined"
                            label="Internship Period"
                          >
                            <MenuItem value="1 week">1 Week</MenuItem>
                            <MenuItem value="2 weeks">2 Weeks</MenuItem>
                            <MenuItem value="1 month">1 Month</MenuItem>
                            <MenuItem value="3 months">3 Months</MenuItem>
                            <MenuItem value="6 months">6 Months</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          type="submit"
                          disabled={loading}
                          sx={{
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            fontWeight: 700,
                            borderRadius: 2,
                            bgcolor: "secondary.main",
                            "&:hover": { bgcolor: "#1E88E5" },
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                            transition: "all 0.3s ease",
                            color: "white",
                            position: "relative",
                          }}
                        >
                          {loading ? (
                            <CircularProgress
                              size={24}
                              sx={{
                                color: "white",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                marginTop: "-12px",
                                marginLeft: "-12px",
                              }}
                            />
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Link
                          href="/login"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            fontSize: { xs: "0.8rem", sm: "1rem" },
                            textDecoration: "underline",
                            "&:hover": { color: "secondary.main" },
                          }}
                        >
                          Already have an account? Login
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {step === 2 && (
                  <Box component="form" onSubmit={handleOtpSubmit}>
                    <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', fontWeight: 500, color: 'primary.main' }}>
                      Enter the 6-digit OTP sent to your email
                    </Typography>
                    <OtpInput value={otp} onChange={setOtp} loading={loading} />
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      sx={{
                        py: { xs: 1, sm: 1.5 },
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                        fontWeight: 700,
                        borderRadius: 2,
                        bgcolor: "secondary.main",
                        "&:hover": { bgcolor: "#1E88E5" },
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        transition: "all 0.3s ease",
                        color: "white",
                        position: "relative",
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: "white",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                          }}
                        />
                      ) : (
                        "Verify OTP & Register"
                      )}
                    </Button>
                  </Box>
                )}
                {step === 3 && (
                  <Typography variant="h6" color="success.main" align="center">Registration successful! Redirecting to login page...</Typography>
                )}
              </CardContent>
            </Box>
          </Card>
        </Container>
        <ToastContainer 
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="colored"
        />
      </Box>
    </ThemeProvider>
  );
};

export default Register;