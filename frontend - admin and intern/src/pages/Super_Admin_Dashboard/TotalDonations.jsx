import { useState, useEffect } from "react";
import { buildApiUrl } from '../../constants.js';
import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Button,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
const TotalDonations = () => {
  const [allDonations, setAllDonations] = useState([]);
  const [referralTotal, setReferralTotal] = useState(0);
  const [nonReferralTotal, setNonReferralTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [filters, setFilters] = useState({
    donorName: "",
    campaignTitle: "",
    description: "",
    referralCode: "",
    type: "",
    date: "",
  });
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/donations"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const donations = data.donations || [];
          setAllDonations(donations);

          // Calculate totals
          const referralSum = donations
            .filter((d) => d.referralCode)
            .reduce((sum, d) => sum + d.amount, 0);
          const nonReferralSum = donations
            .filter((d) => !d.referralCode)
            .reduce((sum, d) => sum + d.amount, 0);
          setReferralTotal(referralSum);
          setNonReferralTotal(nonReferralSum);
        } else {
          console.error("Failed to fetch donations:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [token]);

  useEffect(() => {
    setVisibleCount(10); // Reset pagination when filters or data change
  }, [filters, allDonations]);

  const filteredDonations = allDonations.filter((donation) => {
    const matchesDonor = filters.donorName === "" || (donation.donorName && donation.donorName.toLowerCase().includes(filters.donorName.toLowerCase()));
    const matchesCampaign = filters.campaignTitle === "" || (donation.campaign && donation.campaign.title && donation.campaign.title.toLowerCase().includes(filters.campaignTitle.toLowerCase()));
    const matchesDescription = filters.description === "" || (donation.campaign && donation.campaign.description && donation.campaign.description.toLowerCase().includes(filters.description.toLowerCase()));
    const matchesReferral = filters.referralCode === "" || (donation.referralCode && donation.referralCode.toLowerCase().includes(filters.referralCode.toLowerCase()));
    const matchesType = filters.type === "" || (filters.type === "Referral" ? donation.referralCode : !donation.referralCode);
    const matchesDate = filters.date === "" || (donation.date && new Date(donation.date).toLocaleDateString().includes(filters.date));
    return matchesDonor && matchesCampaign && matchesDescription && matchesReferral && matchesType && matchesDate;
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 2, sm: 4 },
              textAlign: "center",
              color: "primary.main",
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2.5rem" },
            }}
          >
            Total Donations Overview
          </Typography>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" size={48} />
            </Box>
          ) : (
            <>
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.1)", borderRadius: 3, textAlign: "center" }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                        Referral-Based Total
                      </Typography>
                      <Typography variant="h3" sx={{ color: "primary.main", fontWeight: 800 }}>
                        ₹{referralTotal.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.1)", borderRadius: 3, textAlign: "center" }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
                        Non-Referral Total
                      </Typography>
                      <Typography variant="h3" sx={{ color: "primary.main", fontWeight: 800 }}>
                        ₹{nonReferralTotal.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Merged Donations Table */}
              <Typography variant="h5" sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}>
                All Donations
              </Typography>
              <Card sx={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.1)", borderRadius: 3 }}>
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="all donations table">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "primary.main" }}>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Donor Name</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Campaign Title</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Description</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Goal Amount</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Referral Code</TableCell>
                          <TableCell sx={{ color: "white", fontWeight: 600 }}>Date</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <TextField
                              variant="standard"
                              value={filters.donorName}
                              onChange={e => setFilters(f => ({ ...f, donorName: e.target.value }))}
                              placeholder="Donor Name"
                              InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem' } }}
                              sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', px: 1, my: 0.5, boxShadow: 0, fontSize: '0.95rem' }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="standard"
                              value={filters.campaignTitle}
                              onChange={e => setFilters(f => ({ ...f, campaignTitle: e.target.value }))}
                              placeholder="Campaign Title"
                              InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem' } }}
                              sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', px: 1, my: 0.5, boxShadow: 0, fontSize: '0.95rem' }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="standard"
                              value={filters.description}
                              onChange={e => setFilters(f => ({ ...f, description: e.target.value }))}
                              placeholder="Description"
                              InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem' } }}
                              sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', px: 1, my: 0.5, boxShadow: 0, fontSize: '0.95rem' }}
                            />
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell>
                            <FormControl variant="standard" sx={{ width: '100%', my: 0.5 }}>
                              <Select
                                value={filters.type}
                                onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                                displayEmpty
                                disableUnderline
                                sx={{ bgcolor: 'background.paper', borderRadius: 2, fontSize: '0.95rem', px: 1 }}
                                renderValue={selected => selected === '' ? 'Type' : selected}
                              >
                                <MenuItem value="">All Types</MenuItem>
                                <MenuItem value="Referral">Referral</MenuItem>
                                <MenuItem value="Non-Referral">Non-Referral</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="standard"
                              value={filters.referralCode}
                              onChange={e => setFilters(f => ({ ...f, referralCode: e.target.value }))}
                              placeholder="Referral Code"
                              InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem' } }}
                              sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', px: 1, my: 0.5, boxShadow: 0, fontSize: '0.95rem' }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="standard"
                              value={filters.date}
                              onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
                              placeholder="Date (MM/DD/YYYY)"
                              InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem' } }}
                              sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', px: 1, my: 0.5, boxShadow: 0, fontSize: '0.95rem' }}
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredDonations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                              No donations found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDonations.slice(0, visibleCount).map((donation) => {
                            // Use campaignDetails if campaign is missing or is a custom/card-based donation
                            const campaignInfo = donation.campaign && donation.campaign.title !== 'Custom Donation'
                              ? donation.campaign
                              : donation.campaignDetails || { title: 'Custom Donation', description: 'A custom donation without a specific campaign', goalAmount: null };
                            return (
                              <TableRow
                                key={donation._id}
                                sx={{ "&:hover": { bgcolor: "rgba(33,110,182,0.05)" }, transition: "background-color 0.3s" }}
                              >
                                <TableCell>{donation.donorName || "Anonymous"}</TableCell>
                                <TableCell>{campaignInfo.title}</TableCell>
                                <TableCell>{campaignInfo.description}</TableCell>
                                <TableCell>{campaignInfo.goalAmount ? `₹${campaignInfo.goalAmount.toLocaleString()}` : "N/A"}</TableCell>
                                <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={donation.referralCode ? "Referral" : "Non-Referral"}
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: "0.8rem",
                                      color: "white",
                                      bgcolor: donation.referralCode
                                        ? "linear-gradient(45deg, #42A5F5 30%, #2196F3 90%)"
                                        : "linear-gradient(45deg, #FF7043 30%, #F4511E 90%)",
                                      background: donation.referralCode
                                        ? "linear-gradient(45deg, #42A5F5 30%, #2196F3 90%)"
                                        : "linear-gradient(45deg, #FF7043 30%, #F4511E 90%)",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                      borderRadius: "16px",
                                      padding: "0 8px",
                                      "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                                      },
                                      transition: "all 0.2s ease-in-out",
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{donation.referralCode || "N/A"}</TableCell>
                                <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {filteredDonations.length > 0 && visibleCount < filteredDonations.length && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setVisibleCount(c => c + 10)}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: 2,
                          px: 4,
                          py: 1.2,
                          fontSize: '1rem',
                          boxShadow: 2,
                          '&:hover': { bgcolor: '#1E5FA4' },
                        }}
                      >
                        Show More
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TotalDonations;