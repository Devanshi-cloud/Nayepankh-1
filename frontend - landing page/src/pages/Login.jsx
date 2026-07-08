import { useState, useRef } from "react";
import { buildApiUrl } from '../constants.js';
import { IS_PREVIEW_MODE } from '../supabaseClient.js';
import { getMockUser } from '../mockData.js';
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
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../portalTheme";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../assets/loginBgm.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: login form, 2: otp, 3: done
  const [internEmail, setInternEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if it's likely an intern (Gmail address) and validate
    if (validateGmail(formData.email)) {
      if (!validateGmail(formData.email)) {
        toast.error("Please use a valid Gmail address for intern login.");
        return;
      }
    }
    
    setLoading(true);

    if (IS_PREVIEW_MODE) {
      setTimeout(() => {
        const emailLower = formData.email.toLowerCase();
        if (emailLower === "superadmin@gmail.com") {
          localStorage.setItem("token", "mock-superadmin-token");
          toast.success("Login successful (Preview: Super Admin)!");
          setLoading(false);
          navigate("/superadmin");
        } else if (emailLower === "admin@gmail.com" || emailLower === "moderator@gmail.com") {
          localStorage.setItem("token", "mock-moderator-token");
          toast.success("Login successful (Preview: Moderator)!");
          setLoading(false);
          navigate("/moderator");
        } else {
          // Intern login
          setInternEmail(formData.email);
          setStep(2);
          toast.info("OTP sent to your email. Please verify (Preview OTP: 123456).");
          setLoading(false);
        }
      }, 600);
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.ok && data.msg && data.msg.includes("OTP sent")) {
        setInternEmail(formData.email);
        setStep(2); // Show OTP input
        toast.info("OTP sent to your email.");
        setLoading(false);
      } else if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        let role = data.user.role;
        if (!role) {
          const decoded = jwtDecode(data.token);
          role = decoded.role;
        }
        toast.success("Login successful!");
        setLoading(false);
        if (role === "Super Admin") navigate("/superadmin");
        else if (role === "Admin") navigate("/moderator");
        else navigate("/dashboard");
      } else {
        toast.error(data.msg || "Login failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
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
        localStorage.setItem("token", "mock-intern-token");
        toast.success("Login successful!");
        setLoading(false);
        navigate("/dashboard");
      }, 600);
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/api/auth/login-verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: internEmail, otp }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        setLoading(false);
        navigate("/dashboard");
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
              mx: "auto",
            }}
          >
            <Box
              sx={{
                flex: { md: 1.2 },
                backgroundImage: {
                  xs: `linear-gradient(rgba(245, 249, 255, 0.2), rgba(245, 249, 255, 0.2)), url(${loginImage})`,
                  sm: `url(${loginImage})`,
                },
                backgroundSize: "cover",
                backgroundPosition: { xs: "center 50%", md: "center" },
                backgroundRepeat: "no-repeat",
                backgroundColor: "#f5f9ff",
                minHeight: { xs: 260, sm: 400 },
                display: "block",
                borderBottom: { xs: "4px solid #216eb6", md: "none" },
                transition: "background-position 0.3s ease",
              }}
            />
            <Box sx={{ flex: { md: 1 }, p: { xs: 2, sm: 4 } }}>
              <Box
                sx={{
                  p: { xs: 2, sm: 3 },
                  textAlign: "center",
                  bgcolor: "primary.main",
                  borderRadius: 10,
                  mb: { xs: 2, sm: 3 },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                    fontSize: { xs: "1rem", sm: "1.6rem" },
                    fontStyle: "italic",
                  }}
                >
                  Sign In
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                {step === 1 && (
                  <Box component="form" onSubmit={handleLogin}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
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
                          placeholder="Enter your Gmail address"
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
                                    opacity: validateGmail(formData.email) ? 1 : 0.3,
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
                            "Login"
                          )}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Link
                          href="/register"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            fontSize: { xs: "0.8rem", sm: "1rem" },
                            textDecoration: "underline",
                          }}
                        >
                          New User? Please Register
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
                        "Verify OTP & Login"
                      )}
                    </Button>
                  </Box>
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

export default Login;