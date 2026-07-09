import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { buildApiUrl } from '../constants.js';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  LinearProgress,
  Container,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IS_PREVIEW_MODE } from "../supabaseClient";
import { getMockCampaigns, addMockDonation } from "../mockData";

const theme = createTheme({
  palette: {
    primary: { main: "#FF9933" },
    secondary: { main: "#138808" },
    background: { default: "#FFF4E6" },
  },
  typography: { fontFamily: "'Poppins', sans-serif" },
});

const Donate = () => {
  const [searchParams] = useSearchParams();
  const cachedRef = localStorage.getItem("referralCode");
  const initialReferralCode = searchParams.get("ref") || cachedRef || "";
  
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
    address: "",
    amount: "",
    campaignId: "",
    referralCode: initialReferralCode,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [openDonateDialog, setOpenDonateDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cache referral code from query params
    const queryRef = searchParams.get("ref");
    if (queryRef) {
      localStorage.setItem("referralCode", queryRef);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        if (IS_PREVIEW_MODE) {
          setCampaigns(getMockCampaigns());
          setIsLoading(false);
          return;
        }

        // Use public endpoint if no referral code, otherwise use referral-specific endpoint
        const url = initialReferralCode
          ? buildApiUrl(`/api/donate/${encodeURIComponent(initialReferralCode)}`)
          : buildApiUrl("/api/donate/public");
        console.log("Fetching campaigns from:", url);

        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setCampaigns(data.campaigns || []);
        } else {
          setErrors({ general: data.msg || "Failed to load campaigns" });
        }
      } catch (err) {
        setErrors({ general: "Failed to fetch campaigns. Please ensure the server is running." });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [initialReferralCode]);

  useEffect(() => {
    if (IS_PREVIEW_MODE) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully");
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setErrors({ general: "Failed to load payment gateway. Please check your internet connection." });
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "phoneNumber" || name === "whatsappNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
      if (formattedValue.length > 5) {
        formattedValue = `${formattedValue.slice(0, 5)} ${formattedValue.slice(5)}`;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue.replace(/\s/g, ""),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleDonateClick = (campaignId) => {
    if (!campaignId || typeof campaignId !== "string") {
      setErrors({ general: "Invalid campaign selected" });
      return;
    }
    const campaign = campaigns.find((c) => c._id === campaignId);
    setSelectedCampaign(campaign);
    setFormData((prev) => ({ ...prev, campaignId }));
    setOpenDonateDialog(true);
    setErrors({});
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Contact Number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit number (starting with 6-9)";
    }
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp Number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsappNumber.replace(/\s/g, ""))) {
      newErrors.whatsappNumber = "Please enter a valid 10-digit WhatsApp number (starting with 6-9)";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    const amountInINR = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountInINR) || amountInINR <= 0) {
      newErrors.amount = "Please enter a valid donation amount greater than 0";
    }
    if (!formData.campaignId) newErrors.campaignId = "Please select a campaign";
    if (formData.referralCode && !/^[A-Za-z0-9]+$/.test(formData.referralCode)) {
      newErrors.referralCode = "Referral code must be alphanumeric";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (IS_PREVIEW_MODE) {
      addMockDonation({
        donorName: formData.fullName,
        amount: amountInINR,
        campaignId: formData.campaignId,
        referralCode: formData.referralCode || null,
        email: formData.email,
        phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
        whatsappNumber: formData.whatsappNumber.replace(/\s/g, ""),
        address: formData.address,
      });
      setSuccess(true);
      setOpenDonateDialog(false);
      setErrors({});
      setSelectedCampaign(null);
      return;
    }

    try {
      const amountInPaise = Math.round(amountInINR * 100);

      const response = await fetch(buildApiUrl("/api/donate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: formData.fullName,
          amount: amountInPaise,
          campaignId: formData.campaignId,
          referralCode: formData.referralCode || null,
          email: formData.email,
          phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
          whatsappNumber: formData.whatsappNumber.replace(/\s/g, ""),
          address: formData.address,
        }),
      });
      const orderData = await response.json();

      if (!response.ok) {
        setErrors({ general: orderData.msg || "Failed to create donation order" });
        return;
      }

      const options = {
        key: "rzp_test_TBNBuPaPRaIZWu",
        amount: orderData.amount,
        currency: "INR",
        name: "NayePankh",
        description: `Donation to ${selectedCampaign?.title || "Campaign"}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyResponse = await fetch(buildApiUrl("/api/donate/verify"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donorName: formData.fullName,
              amount: amountInPaise,
              campaignId: formData.campaignId,
              referralCode: formData.referralCode || null,
              email: formData.email,
              phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
              whatsappNumber: formData.whatsappNumber.replace(/\s/g, ""),
              address: formData.address,
            }),
          });
          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok) {
            setSuccess(true);
            setFormData({
              fullName: "",
              email: "",
              phoneNumber: "",
              whatsappNumber: "",
              address: "",
              amount: "",
              campaignId: "",
              referralCode: initialReferralCode,
            });
            setOpenDonateDialog(false);
            setErrors({});
            setSelectedCampaign(null);
          } else {
            setErrors({ general: verifyData.msg || "Payment verification failed" });
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: `+91${formData.phoneNumber.replace(/\s/g, "")}`,
        },
        theme: { color: "#FF9933" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrors({ general: "Failed to process donation. Please ensure the server is running and online." });
      console.error(err);
    }
  };

  const handleCloseSnackbar = () => setSuccess(false);

  const handleCloseDialog = () => {
    setOpenDonateDialog(false);
    setErrors({});
    setSelectedCampaign(null);
  };

  if (errors.general) {
    return (
      <Typography sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        {errors.general}
      </Typography>
    );
  }
  if (isLoading) {
    return (
      <Typography sx={{ p: 4, textAlign: "center" }}>
        Loading campaigns...
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Box sx={{ p: 4, bgcolor: "white", boxShadow: "0px 6px 20px rgba(0,0,0,0.05)", mb: 6, borderRadius: 3, border: `2px solid ${theme.palette.primary.main}` }}>
          <Container maxWidth="md">
            <Typography variant="h4" sx={{ mb: 3, color: "primary.main", fontWeight: 700, textAlign: "center", textShadow: "2px 2px 4px rgba(0,0,0,0.1)", fontStyle: "italic" }}>
              About NayePankh
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary", lineHeight: 1.8, textAlign: "center", fontStyle: "italic", maxWidth: "800px", mx: "auto", fontSize: { xs: "0.9rem", md: "1rem" } }}>
              NayePankh is a platform dedicated to empowering communities through impactful campaigns. As part of the NayePankh Foundation, a distinguished NGO based in Noida, Uttar Pradesh, we are recognized by the government with 80G & 12A registration and featured in esteemed publications like The Pioneer, Dainik Jagran, and Hindustan. We engage with over 475 children across 10 shelter homes, 3 community centers, and 5 villages, fostering holistic growth and development. Join us in creating a brighter future for underprivileged children by supporting our campaigns!
            </Typography>
          </Container>
        </Box>

        <Box
          sx={{
            height: "40vh",
            backgroundImage: "url(/assets/donate-hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 6,
          }}
        >
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4))" }} />
          <Container maxWidth="md" sx={{ position: "relative", textAlign: "center", color: "white" }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, textShadow: "2px 2px 4px rgba(0,0,0,0.5)", fontSize: { xs: "2rem", md: "3.5rem" } }}>
              Support Our Campaigns
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "600px", mx: "auto", fontWeight: 300, fontSize: { xs: "1rem", md: "1.25rem" }, mb: 3 }}>
              Choose a campaign below to make a donation and help make a difference.
            </Typography>
            {initialReferralCode && (
              <Typography variant="body1" sx={{ mt: 2, color: "white", fontWeight: 500, fontSize: "1.1rem", textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>
                Using Referral Code: <strong>{initialReferralCode}</strong>
              </Typography>
            )}
          </Container>
        </Box>

        <Container maxWidth="lg">
          {campaigns.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
              No active campaigns available at the moment. Please check back later!
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {campaigns.map((campaign) => (
                <Grid item xs={12} sm={6} md={4} key={campaign._id}>
                  <Card
                    sx={{
                      boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
                      borderRadius: 3,
                      bgcolor: "white",
                      border: `2px solid ${theme.palette.primary.main}`,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": { transform: "translateY(-8px)", boxShadow: "0px 12px 35px rgba(0, 0, 0, 0.25)" },
                      mb: 6,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ mb: 3, color: "primary.main", fontWeight: 600, textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                        {campaign.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6, fontStyle: "italic" }}>
                        {campaign.description}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        Goal: ₹{campaign.goalAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                        Raised: ₹{campaign.raisedAmount.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100) || 0}
                        sx={{ height: 10, borderRadius: 5, bgcolor: "grey.300", "& .MuiLinearProgress-bar": { bgcolor: "secondary.main" }, mb: 3 }}
                      />
                      <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "text.secondary", fontWeight: 500 }}>
                        {Math.round((campaign.raisedAmount / campaign.goalAmount) * 100) || 0}% of goal reached
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleDonateClick(campaign._id)}
                        sx={{
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          borderRadius: 2,
                          bgcolor: "primary.main",
                          "&:hover": { bgcolor: "primary.dark", transform: "scale(1.03)" },
                          transition: "all 0.3s ease",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        }}
                      >
                        Donate Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        {/* Custom Donation Checkout Popup */}
        <Dialog open={openDonateDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white", textAlign: "center", px: 3, py: 2.5 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              Let's shape this world with more love and care ❤️
            </Typography>
            {selectedCampaign && (
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Supporting: {selectedCampaign.title}
              </Typography>
            )}
          </DialogTitle>

          <DialogContent sx={{ p: 4, mt: 2 }}>
            <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <Grid container spacing={3}>
                {/* Full Name */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                  />
                </Grid>

                {/* WhatsApp Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    value={formData.whatsappNumber ? `${formData.whatsappNumber.slice(0, 5)} ${formData.whatsappNumber.slice(5, 10) || ""}` : ""}
                    onChange={handleInputChange}
                    required
                    type="tel"
                    variant="outlined"
                    error={!!errors.whatsappNumber}
                    helperText={errors.whatsappNumber}
                    InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: "text.secondary", fontWeight: 500 }}>+91</Typography> }}
                  />
                </Grid>

                {/* Contact Number */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="phoneNumber"
                    value={formData.phoneNumber ? `${formData.phoneNumber.slice(0, 5)} ${formData.phoneNumber.slice(5, 10) || ""}` : ""}
                    onChange={handleInputChange}
                    required
                    type="tel"
                    variant="outlined"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: "text.secondary", fontWeight: 500 }}>+91</Typography> }}
                  />
                </Grid>

                {/* Email Address */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    error={!!errors.address}
                    helperText={errors.address}
                    multiline
                    rows={2}
                  />
                </Grid>

                {/* Referral Code */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Referral Code (Optional)"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!errors.referralCode}
                    helperText={errors.referralCode}
                    InputProps={{
                      readOnly: !!initialReferralCode,
                    }}
                    sx={{
                      "& .MuiInputBase-root": { bgcolor: formData.referralCode ? "rgba(255,153,51,0.05)" : "inherit" },
                    }}
                  />
                </Grid>

                {/* Preset Amount Buttons */}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Select Donation Amount:
                  </Typography>
                  <Grid container spacing={1}>
                    {[3600, 7200, 12000, 24000].map((val) => (
                      <Grid item xs={6} sm={3} key={val}>
                        <Button
                          fullWidth
                          variant={parseFloat(formData.amount) === val ? "contained" : "outlined"}
                          onClick={() => setFormData((prev) => ({ ...prev, amount: val.toString() }))}
                          sx={{
                            py: 1,
                            borderRadius: 2,
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            borderWidth: 2,
                            "&:hover": { borderWidth: 2 },
                          }}
                        >
                          ₹{val.toLocaleString()}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Donation Amount Field */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Custom Donation Amount (INR)"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    error={!!errors.amount}
                    helperText={errors.amount}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", p: 3, gap: 2 }}>
            <Button onClick={handleCloseDialog} variant="outlined" color="primary" sx={{ borderRadius: 2, py: 1.5, px: 3, fontWeight: "bold" }}>
              Close
            </Button>
            <Button onClick={handleDonate} variant="contained" color="primary" sx={{ bgcolor: "primary.main", borderRadius: 2, py: 1.5, px: 4, fontWeight: "bold", "&:hover": { bgcolor: "primary.dark", transform: "scale(1.02)" }, transition: "all 0.2s" }}>
              Donate Now
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={success} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            Donation of ₹{formData.amount || "N/A"} Completed successfully! Thank you for your support ❤️
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Donate;