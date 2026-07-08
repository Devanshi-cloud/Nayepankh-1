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
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import DonationsIcon from "@mui/icons-material/MonetizationOn";

const TotalDonationsView = () => {
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
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, [token]);

  useEffect(() => {
    setVisibleCount(10);
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Card sx={{ bgcolor: "primary.main", color: "white", borderRadius: 3, boxShadow: 2, px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
              <DonationsIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Total Donations Overview
              </Typography>
            </Card>
          </Box>
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
                                inputProps={{ 'aria-label': 'Type' }}
                              >
                                <MenuItem value="">All</MenuItem>
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
                              placeholder="Date"
                              InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem' } }}
                              sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', px: 1, my: 0.5, boxShadow: 0, fontSize: '0.95rem' }}
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredDonations.slice(0, visibleCount).map((donation, idx) => (
                          <TableRow key={donation._id || idx}>
                            <TableCell>{donation.donorName}</TableCell>
                            <TableCell>{donation.campaign?.title}</TableCell>
                            <TableCell>{donation.campaign?.description}</TableCell>
                            <TableCell>₹{donation.campaign?.goalAmount?.toLocaleString()}</TableCell>
                            <TableCell>₹{donation.amount?.toLocaleString()}</TableCell>
                            <TableCell>{donation.referralCode ? "Referral" : "Non-Referral"}</TableCell>
                            <TableCell>{donation.referralCode}</TableCell>
                            <TableCell>{donation.date ? new Date(donation.date).toLocaleDateString() : "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TotalDonationsView; 