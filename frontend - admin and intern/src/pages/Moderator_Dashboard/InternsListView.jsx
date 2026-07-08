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
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";
import PeopleIcon from "@mui/icons-material/People";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const InternsListView = () => {
  const [interns, setInterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [referralFilter, setReferralFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const internshipPeriods = [
    "1 week",
    "2 weeks",
    "1 month",
    "3 months",
    "6 months",
  ];

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/users"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const internList = data.users.filter((user) => user.role === "Intern");
          // Fetch donations for each intern
          const internsWithDonations = await Promise.all(
            internList.map(async (intern) => {
              try {
                const donationsResponse = await fetch(
                  buildApiUrl("/api/donations/by-referral/${intern.referralCode}"),
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                const donationsData = await donationsResponse.json();
                const totalDonations = (donationsData.donations || []).reduce(
                  (sum, donation) => sum + (donation.amount || 0),
                  0
                );
                const stipendAmount = totalDonations * 0.20; // 20% of total donations
                return {
                  ...intern,
                  totalDonations,
                  stipendAmount,
                };
              } catch (error) {
                return {
                  ...intern,
                  totalDonations: 0,
                  stipendAmount: 0,
                };
              }
            })
          );
          setInterns(internsWithDonations);
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterns();
  }, [token]);

  const filteredInterns = interns.filter((intern) => {
    const name = `${intern.firstname} ${intern.lastname}`.toLowerCase();
    const email = intern.email.toLowerCase();
    const referral = (intern.referralCode || "").toLowerCase();
    const period = (intern.internshipPeriod || "").toLowerCase();
    return (
      name.includes(nameFilter.toLowerCase()) &&
      email.includes(emailFilter.toLowerCase()) &&
      referral.includes(referralFilter.toLowerCase()) &&
      (periodFilter === "" || period === periodFilter.toLowerCase())
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, sm: 4, md: 6 }, bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
            <Card sx={{ bgcolor: "primary.main", color: "white", borderRadius: 3, boxShadow: 2, px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", sm: "2.5rem" }, textShadow: "1px 1px 4px rgba(0,0,0,0.1)" }}>
                Interns List
              </Typography>
            </Card>
          </Box>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" size={48} />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3, boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.main" }}>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>Internship Period</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>Referral Code</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>Total Donations</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>Stipend (20%)</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#e3f2fd', '& td': { borderBottom: 0, py: 1.2 } }}>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={nameFilter}
                        onChange={e => setNameFilter(e.target.value)}
                        placeholder="Filter by name"
                        size="small"
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: 2, fontSize: '0.95rem' }}
                        InputProps={{ style: { fontSize: '0.95rem', padding: 8 } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={emailFilter}
                        onChange={e => setEmailFilter(e.target.value)}
                        placeholder="Filter by email"
                        size="small"
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: 2, fontSize: '0.95rem' }}
                        InputProps={{ style: { fontSize: '0.95rem', padding: 8 } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        variant="outlined"
                        value={periodFilter}
                        onChange={e => setPeriodFilter(e.target.value)}
                        placeholder="Filter"
                        size="small"
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: 2, fontSize: '0.95rem' }}
                        InputProps={{ style: { fontSize: '0.95rem', padding: 8 } }}
                      >
                        <MenuItem value="">All</MenuItem>
                        {internshipPeriods.map(period => (
                          <MenuItem key={period} value={period}>{period}</MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        value={referralFilter}
                        onChange={e => setReferralFilter(e.target.value)}
                        placeholder="Filter by code"
                        size="small"
                        fullWidth
                        sx={{ bgcolor: 'white', borderRadius: 2, fontSize: '0.95rem' }}
                        InputProps={{ style: { fontSize: '0.95rem', padding: 8 } }}
                      />
                    </TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInterns.map((intern) => (
                    <TableRow key={intern._id}>
                      <TableCell>{intern.firstname} {intern.lastname}</TableCell>
                      <TableCell>{intern.email}</TableCell>
                      <TableCell>{intern.internshipPeriod}</TableCell>
                      <TableCell>{intern.referralCode}</TableCell>
                      <TableCell>₹{intern.totalDonations ? intern.totalDonations.toLocaleString() : 0}</TableCell>
                      <TableCell>₹{intern.stipendAmount ? intern.stipendAmount.toLocaleString() : 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default InternsListView; 