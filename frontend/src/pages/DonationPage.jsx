import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import donationBg from "../assets/welcome-img.webp"; // Adjust path
import razorpayLogo from "../assets/pow-razorpay.png"; // Adjust path
import Footer from "./Footer"; // Adjust path
import MuiAlert from '@mui/material/Alert';

const theme = createTheme({
  palette: {
    primary: { main: "#2ECC71" },
    secondary: { main: "#F1C40F" },
    background: { default: "#FFFFFF" },
    text: { primary: "#34495E" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    body1: { fontWeight: 400 },
  },
});

function Donation() {
  const [searchParams] = useSearchParams(); // Hook to get URL query params
  const initialReferralCode = searchParams.get("ref") || ""; // Get referral code from URL
  const [timedCampaigns, setTimedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCardInfo, setSelectedCardInfo] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    amount: "",
    referralCode: initialReferralCode, // Initialize with URL referral code
  });
  const [errors, setErrors] = useState({});
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setErrors({ general: "Failed to load payment gateway." });
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("https://naye-pankh-intern-portal-ox93.vercel.app/api/donate/public");
        const data = await response.json();
        if (response.ok) {
          setTimedCampaigns(data.campaigns || []);
        } else {
          console.error("Failed to fetch campaigns:", data.msg);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    fetchCampaigns();
  }, []);

  const staticCampaign = {
    title: "Support Underprivileged Children",
    description:
      "Help us provide education, healthcare, and basic necessities to children in need across rural communities.",
    goalAmount: 500000,
    raisedAmount: 120000,
  };

  const staticDonations = [
    { title: "Education Pack", description: "Fund books and uniforms for 10 kids.", amount: 5000 },
    { title: "Health Kit", description: "Provide medical checkups for 5 families.", amount: 1500 },
    { title: "Meal Support", description: "Feed 20 children for a week.", amount: 2000 },
    { title: "Basic Needs", description: "Support daily essentials for a family.", amount: 400 },
    { title: "School Supplies", description: "Equip a child with school essentials.", amount: 250 },
    { title: "Community Aid", description: "Help a village with sanitation.", amount: 7500 },
    { title: "Future Fund", description: "Sponsor a child's education for a year.", amount: 15000 },
  ];

  const handleDonateClick = (campaign = null, presetAmount = null, cardInfo = null) => {
    setSelectedCampaign(campaign);
    setSelectedCardInfo(cardInfo);
    setFormData((prev) => ({
      ...prev,
      amount: presetAmount ? presetAmount.toString() : prev.amount, // Use presetAmount or keep current amount
      referralCode: initialReferralCode || prev.referralCode, // Apply URL referral code
    }));
    setOpenDialog(true);
    setErrors({});
  };

  const handleCardFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "phoneNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "amount") {
      formattedValue = value.replace(/\D/g, ""); // Only allow numbers
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone Number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Invalid 10-digit phone number (start with 6-9)";
    const amountInINR = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountInINR) || amountInINR <= 0)
      newErrors.amount = "Enter a valid amount greater than 0";
    if (formData.referralCode && !/^[A-Za-z0-9]+$/.test(formData.referralCode))
      newErrors.referralCode = "Referral code must be alphanumeric";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      setErrors({ general: "Payment gateway not loaded. Please try again later." });
      return;
    }

    try {
      const amountInPaise = Math.round(amountInINR * 100);
      const response = await fetch("https://naye-pankh-intern-portal-ox93.vercel.app/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: formData.fullName,
          amount: amountInPaise,
          campaignId: selectedCampaign?._id || null,
          referralCode: formData.referralCode || null,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          campaignDetails: !selectedCampaign && selectedCardInfo ? {
            title: selectedCardInfo.title,
            description: selectedCardInfo.description,
            goalAmount: null,
          } : undefined,
        }),
      });
      const orderData = await response.json();

      if (!response.ok) {
        setErrors({ general: orderData.msg || "Failed to create donation order" });
        return;
      }

      const options = {
        key: "rzp_test_Mitv03aBlFFlQ0",
        amount: orderData.amount,
        currency: "INR",
        name: "NayePankh",
        description: `Donation to ${selectedCampaign?.title || "Custom Donation"}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyResponse = await fetch("https://naye-pankh-intern-portal-ox93.vercel.app/api/donate/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donorName: formData.fullName,
              amount: amountInPaise,
              campaignId: selectedCampaign?._id || null,
              referralCode: formData.referralCode || null,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
            }),
          });
          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok) {
            setFormData({
              fullName: "",
              email: "",
              phoneNumber: "",
              amount: "",
              referralCode: initialReferralCode, // Retain URL referral code after donation
            });
            setOpenDialog(false);
            setSnackbarMessage("Thank you for your donation!");
            setSnackbarOpen(true);
          } else {
            setErrors({ general: verifyData.msg || "Payment verification failed" });
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: `+91${formData.phoneNumber}`,
        },
        theme: { color: "#2ECC71" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrors({ general: "Failed to process donation. Please try again." });
      console.error(err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      amount: "",
      referralCode: initialReferralCode, // Retain URL referral code on dialog close
    });
    setErrors({});
    setSelectedCampaign(null);
    setSelectedCardInfo(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleDonateAgain = () => {
    setSnackbarOpen(false);
    setOpenDialog(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", position: "relative", overflow: "hidden" }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            height: "100vh",
            width: "100vw",
            backgroundImage: `url(${donationBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(52, 73, 94, 0.7), rgba(52, 73, 94, 0.3))",
              zIndex: 1,
            },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: "#F1C40F",
              textAlign: "center",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              textShadow: "4px 4px 12px rgba(0,0,0,0.7)",
              zIndex: 2,
              px: { xs: 2, sm: 3, md: 4 },
              lineHeight: 1.2,
              animation: "fadeIn 2s ease-in-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(30px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            BADALTE BHARAT KI NAYI TASVEER
          </Typography>
        </Box>

        {/* Choose a Donation Amount Section - Moved to top */}
        <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#F7F9FC", position: "relative", zIndex: 1 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h4" 
              sx={{ 
                textAlign: "center", 
                color: "primary.main", 
                mb: 4,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                fontWeight: 700
              }}
            >
              Choose a Donation Amount
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
              {staticDonations.map((donation, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Card
                    sx={{
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      perspective: "1000px",
                      cursor: "pointer",
                      minHeight: { xs: 110, sm: 140, md: 170 },
                      maxWidth: { xs: '100%', sm: 200, md: 220 },
                      margin: '0 auto',
                      boxShadow: '0px 2px 10px rgba(0,0,0,0.06)',
                      borderRadius: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      '&:hover': {
                        boxShadow: "0px 12px 35px rgba(0,0,0,0.18)",
                        transform: 'translateY(-4px) scale(1.03)'
                      },
                      m: { xs: 0.5, sm: 1 },
                    }}
                    onClick={() => handleCardFlip(index)}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        transform: flippedCards[index] ? "rotateY(180deg)" : "rotateY(0deg)",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Front Side */}
                      <CardContent
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          bgcolor: "white",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: 'center',
                          justifyContent: "center",
                          p: { xs: 1, sm: 1.5, md: 2 },
                          textAlign: 'center',
                          gap: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: "primary.main", 
                            fontWeight: 700, 
                            mb: 0.5,
                            fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" }
                          }}
                        >
                          {donation.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "text.primary", 
                            mb: 0.5,
                            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "0.95rem" }
                          }}
                        >
                          {donation.description}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: "secondary.main", 
                            fontWeight: 600,
                            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" }
                          }}
                        >
                          ₹{donation.amount.toLocaleString()}
                        </Typography>
                      </CardContent>
                      {/* Back Side */}
                      <CardContent
                        sx={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          bgcolor: "primary.main",
                          transform: "rotateY(180deg)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: { xs: 1, sm: 1.5, md: 2 },
                        }}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDonateClick(null, donation.amount, donation)}
                          sx={{ 
                            py: { xs: 1, sm: 1.1 }, 
                            px: { xs: 2, sm: 2.2 },
                            fontWeight: "bold", 
                            "&:hover": { bgcolor: "#F39C12" },
                            fontSize: { xs: "0.85rem", sm: "0.95rem" }
                          }}
                        >
                          Donate Now
                        </Button>
                      </CardContent>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Custom Donation Input - Moved below Choose a Donation Amount */}
            <Typography 
              variant="h4" 
              sx={{ 
                textAlign: "center", 
                color: "primary.main", 
                mt: { xs: 6, md: 8 }, 
                mb: 4,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                fontWeight: 700
              }}
            >
              Make a Custom Donation
            </Typography>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              mb: 6,
              px: { xs: 2, sm: 3, md: 4 }
            }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  bgcolor: "white",
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                  maxWidth: 600,
                  width: "100%",
                  gap: { xs: 2, sm: 0 }
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="00.0"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ color: "text.primary", fontWeight: 700 }}>₹</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "primary.main" },
                      "&:hover fieldset": { borderColor: "secondary.main" },
                      "&.Mui-focused fieldset": { borderColor: "secondary.main" },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDonateClick(null)}
                  sx={{
                    ml: { xs: 0, sm: 2 },
                    mt: { xs: 2, sm: 0 },
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 3, sm: 4 },
                    fontWeight: "bold",
                    width: { xs: "100%", sm: "auto" },
                    "&:hover": { bgcolor: "#F39C12" },
                  }}
                >
                  Donate
                </Button>
              </Box>
            </Box>

            {/* Together, Let's Make a Difference Section - Moved below Custom Donation */}
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                color: "primary.main",
                mb: 4,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
                letterSpacing: "1px",
                textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
                animation: "fadeInUp 1s ease-in-out",
                "@keyframes fadeInUp": {
                  "0%": { opacity: 0, transform: "translateY(20px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              Together, Let's Make a Difference!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                lineHeight: 1.8,
                textAlign: "justify",
                mb: 4,
                animation: "fadeInUp 1.5s ease-in-out",
                px: { xs: 2, sm: 3, md: 4 }
              }}
            >
              <strong>Dear Supporters and Friends,</strong>
              <br /><br />
              NayePankh Foundation was founded with a simple yet powerful vision - to uplift the underprivileged and marginalized communities and provide them with access to education, healthcare, and basic necessities that we often take for granted. We strongly believe that every child has the right to dream and achieve their aspirations, irrespective of their socio-economic background. We have been working relentlessly towards this goal, but we need <span style={{ color: "#2ECC71", fontWeight: 700 }}>your support</span> to continue our efforts and make a lasting impact.
              <br /><br />
              As you read this, countless children and families are struggling to survive without the most basic necessities. They lack access to clean water, sanitation, and proper healthcare facilities. Most of them are unable to attend school due to financial constraints or lack of infrastructure. They are trapped in a cycle of poverty and hopelessness, and they need <span style={{ color: "#F1C40F", fontWeight: 700 }}>our help</span>. We at NayePankh Foundation strive to break this cycle and provide a ray of hope to those in need.
              <br /><br />
              With your support, we can continue to provide <span style={{ color: "#2ECC71", fontWeight: 700 }}>education</span>, <span style={{ color: "#2ECC71", fontWeight: 700 }}>healthcare</span>, and other basic amenities to these communities. We can empower them to lead better lives and realize their true potential. Every donation, no matter how small, can make a <span style={{ color: "#F1C40F", fontWeight: 700 }}>huge difference</span>. Your support can provide a child with a school uniform, a pair of shoes, or even a nutritious meal. It can provide a family with access to clean water, sanitation, and healthcare facilities. It can change the trajectory of someone's life forever.
              <br /><br />
              We understand that times are tough, and everyone is going through their own struggles. But we urge you to think of those who are less fortunate and extend a helping hand. Your generosity can make a world of difference to someone in need. We know that we can count on your support to continue our mission. Your donations will help us reach more communities and make a meaningful impact in the lives of those who need it the most.
              <br /><br />
              Let's come together and make a difference. Thank you for considering our cause and supporting NayePankh Foundation. Your support means the world to us and those we serve. Let's work together to create a better world for all.
              <br /><br />
              With heartfelt gratitude,
              <br />
              <strong>Prashant Shukla</strong>
              <br />
              Founder & President, NayePankh Foundation
            </Typography>

            {/* Timed Campaigns */}
            <Typography variant="h4" sx={{ textAlign: "center", color: "primary.main", mt: 8, mb: 4 }}>
              Support our Ongoing Campaigns
            </Typography>
            <Grid container spacing={4}>
              {isLoading
                ? Array.from(new Array(3)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Skeleton
                        variant="rectangular"
                        height={250}
                        animation="wave"
                        sx={{ borderRadius: 3, bgcolor: "grey.200" }}
                      />
                    </Grid>
                  ))
                : timedCampaigns.map((campaign) => (
                    <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                      <Card
                        sx={{
                          boxShadow: "0px 8px 25px rgba(0,0,0,0.15)",
                          borderRadius: 3,
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "translateY(-5px)", boxShadow: "0px 12px 35px rgba(0,0,0,0.25)" },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 2 }}>
                            {campaign.title}
                          </Typography>
                          <Typography variant="body1" sx={{ color: "text.primary", mb: 2 }}>
                            {campaign.description}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            Goal: ₹{campaign.goalAmount.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            Raised: ₹{campaign.raisedAmount.toLocaleString()}
                          </Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={() => handleDonateClick(campaign)}
                            sx={{ py: 1.5, fontWeight: "bold", "&:hover": { bgcolor: "#F39C12" } }}
                          >
                            Donate Now
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
            </Grid>

            {/* Original Donate Now Button */}
            <Box sx={{ textAlign: "center", mt: 6, mb: 6 }}>
              <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 2 }}>
                Donate Now
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", mb: 3 }}>
                Click on the button below to donate to us
              </Typography>
              <Button
                variant="contained"
                href="https://pages.razorpay.com/pl_NUcVhpQzK8rI1b/view"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "#F1C40F",
                  color: "#34495E",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  borderRadius: 50,
                  py: 1.5,
                  px: 6,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.25)",
                  transition: "all 0.3s ease",
                  "&:hover": { bgcolor: "#F39C12", transform: "scale(1.05)", boxShadow: "0px 8px 25px rgba(0,0,0,0.3)" },
                }}
              >
                Donate
              </Button>
              <Box sx={{ mt: 2 }}>
                <img src={razorpayLogo} alt="Powered by Razorpay" style={{ width: "150px", height: "auto" }} />
              </Box>
            </Box>
          </Container>

          {/* Closing Emotional Appeal Section */}
          <Grid container spacing={4} sx={{ py: { xs: 4, md: 6 } }}>
            <Grid item xs={12} md={7}>
              <Box sx={{ mx: { xs: 2, md: 4 }, p: { xs: 3, md: 6 }, maxWidth: "800px" }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                    lineHeight: 2,
                    textAlign: { xs: "center", md: "left" },
                    animation: "fadeInUp 2s ease-in-out",
                  }}
                >
                  Imagine for a moment that you are struggling to make ends meet. You're worried about how you'll pay for basic necessities like food, shelter, and healthcare. Now, imagine that someone steps forward and offers a{" "}
                  <span style={{ color: "#2ECC71", fontWeight: 700 }}>helping hand</span> - a small donation that can make all the difference in your life. That feeling of relief and gratitude is immeasurable. By donating to a cause you care about, you have the{" "}
                  <span style={{ color: "#F1C40F", fontWeight: 700 }}>power</span> to make that difference in someone's life. You can provide hope and support to those who need it most, and create a ripple effect of kindness and generosity in the world. So, if you have the means to give, think about the{" "}
                  <span style={{ color: "#2ECC71", fontWeight: 700 }}>impact</span> you can make. Your donation may just be the lifeline that someone desperately needs.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={donationBg}
                alt="Donation Background"
                sx={{ width: "70%", height: "100%", borderRadius: { xs: 0, md: 4 }, border: "10px solid #FFFFFF", boxShadow: "0px 6px 20px rgba(0,0,0,0.2)" }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Donation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white", textAlign: "center" }}>
            Donate to {selectedCampaign?.title || "General Fund"}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Referral Code (Optional)"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  error={!!errors.referralCode}
                  helperText={errors.referralCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount (INR)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  error={!!errors.amount}
                  helperText={errors.amount}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ color: "text.primary", fontWeight: 700 }}>₹</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {errors.general && (
                <Grid item xs={12}>
                  <Typography color="error">{errors.general}</Typography>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", p: 2 }}>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDonate} variant="contained" color="secondary">
              Donate
            </Button>
          </DialogActions>
        </Dialog>

        {/* Footer */}
        <Footer />
      </Box>
      {/* Thank You Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          icon={false}
          sx={{
            bgcolor: '#2ECC71',
            color: '#fff',
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            boxShadow: '0px 4px 20px rgba(46,204,113,0.15)',
            border: '2px solid #F1C40F',
            letterSpacing: 0.5,
          }}
          action={
            <Button
              onClick={handleDonateAgain}
              size="small"
              sx={{
                color: '#34495E',
                bgcolor: '#F1C40F',
                fontWeight: 700,
                ml: 2,
                borderRadius: 2,
                '&:hover': { bgcolor: '#FFD700' },
                boxShadow: 'none',
                textTransform: 'none',
              }}
            >
              Donate Again ?
            </Button>
          }
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Donation;
