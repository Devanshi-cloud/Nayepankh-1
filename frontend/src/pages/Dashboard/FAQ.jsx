import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const theme = createTheme({
  palette: {
    primary: {
      main: "#216eb6", // Logo-matching blue
    },
    secondary: {
      main: "#42A5F5", // Lighter blue
    },
    background: {
      default: "#E3F2FD", // Very light blue
    },
    text: {
      primary: "#263238", // Darker gray
      secondary: "#546E7A", // Softer gray
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 },
  },
});

const faqData = {
  startOfInternship: [
    { question: "When does the internship program start?", answer: "The internship program typically starts in the first week of June each year, with specific dates announced in May." },
    { question: "What is the duration of the internship?", answer: "The internship lasts for 8 weeks, though some projects may extend to 12 weeks based on performance and project needs." },
    { question: "Who is eligible to apply?", answer: "Students and young professionals aged 18-25 with a passion for social impact and relevant skills are eligible to apply." },
    { question: "How do I apply for the internship?", answer: "Applications are submitted online through our portal. You’ll need to provide your resume, a cover letter, and details of your interests." },
    { question: "Is there an application deadline?", answer: "Yes, the deadline is typically mid-May, but check the portal for exact dates as they may vary each year." },
  ],
  technicalQueries: [
    { question: "Do I need prior technical skills to join?", answer: "No prior technical skills are required, but familiarity with tools like Google Suite, social media platforms, or basic coding is a plus." },
    { question: "Will I receive training?", answer: "Yes, all interns receive initial training sessions covering project management, communication, and any specific tools required for their tasks." },
    { question: "What kind of projects will I work on?", answer: "Projects vary and may include website maintenance, social media campaigns, data analysis, or fieldwork coordination, depending on your skills and interests." },
    { question: "What tools or software will I need?", answer: "Basic tools include Google Suite and Zoom. Specific projects may require Canva, WordPress, or Excel, but we’ll provide access or training as needed." },
    { question: "Can I work remotely?", answer: "Yes, most internships offer remote options, though some fieldwork roles may require on-site presence in specific locations." },
  ],
  donorQueries: [
    { question: "How are donations utilized?", answer: "Donations are used to fund educational resources, healthcare supplies, food distribution, and operational costs for our programs." },
    { question: "Are donations tax-deductible?", answer: "Yes, donations are tax-exempted under Section 80G of the Indian Income Tax Act, and you’ll receive a certificate for tax purposes." },
    { question: "Can donors choose where their money goes?", answer: "While we allocate funds based on priority needs, donors can specify preferences (e.g., education or healthcare), and we’ll strive to honor them." },
    { question: "How can I make a donation?", answer: "You can donate online via our secure Razorpay portal or contact us for bank transfer details." },
    { question: "What is the minimum donation amount?", answer: "There’s no minimum—every contribution, big or small, helps us make a difference!" },
  ],
};

function FAQ() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          borderRadius: 5,
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 4, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: "center",
              color: "primary.main",
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 6,
              letterSpacing: "1px",
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: "primary.main",
              fontSize: { xs: "1.75rem", md: "2rem" },
              fontWeight: 700,
              mb: 2,
              letterSpacing: "0.5px",
            }}
          >
            Start of the Internship
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", fontSize: { xs: "1rem", md: "1.1rem" }, mb: 4, lineHeight: 1.6 }}
          >
            Everything you need to know about beginning your journey with NayePankh Foundation as an intern.
          </Typography>
          {faqData.startOfInternship.map((item, index) => (
            <Accordion
              key={index}
              sx={{ mb: 2, borderRadius: 2, boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", bgcolor: "#FFFFFF", "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                sx={{ bgcolor: "#FFFFFF", borderBottom: "1px solid rgba(0,0,0,0.05)", "& .MuiAccordionSummary-content": { m: 0 }, py: 1 }}
              >
                <Typography variant="h6" sx={{ color: "text.primary", fontSize: { xs: "1rem", md: "1.1rem" }, fontWeight: 600 }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: { xs: "0.9rem", md: "1rem" }, lineHeight: 1.6 }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Typography
            variant="h3"
            component="h2"
            sx={{ color: "primary.main", fontSize: { xs: "1.75rem", md: "2rem" }, fontWeight: 700, mb: 2, mt: 6, letterSpacing: "0.5px" }}
          >
            Technical Queries
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", fontSize: { xs: "1rem", md: "1.1rem" }, mb: 4, lineHeight: 1.6 }}
          >
            Answers to common technical questions about your internship experience.
          </Typography>
          {faqData.technicalQueries.map((item, index) => (
            <Accordion
              key={index}
              sx={{ mb: 2, borderRadius: 2, boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", bgcolor: "#FFFFFF", "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                sx={{ bgcolor: "#FFFFFF", borderBottom: "1px solid rgba(0,0,0,0.05)", "& .MuiAccordionSummary-content": { m: 0 }, py: 1 }}
              >
                <Typography variant="h6" sx={{ color: "text.primary", fontSize: { xs: "1rem", md: "1.1rem" }, fontWeight: 600 }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: { xs: "0.9rem", md: "1rem" }, lineHeight: 1.6 }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Typography
            variant="h3"
            component="h2"
            sx={{ color: "primary.main", fontSize: { xs: "1.75rem", md: "2rem" }, fontWeight: 700, mb: 2, mt: 6, letterSpacing: "0.5px" }}
          >
            Donor Related Queries
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", fontSize: { xs: "1rem", md: "1.1rem" }, mb: 4, lineHeight: 1.6 }}
          >
            Information for donors supporting our mission to uplift communities.
          </Typography>
          {faqData.donorQueries.map((item, index) => (
            <Accordion
              key={index}
              sx={{ mb: 2, borderRadius: 2, boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", bgcolor: "#FFFFFF", "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                sx={{ bgcolor: "#FFFFFF", borderBottom: "1px solid rgba(0,0,0,0.05)", "& .MuiAccordionSummary-content": { m: 0 }, py: 1 }}
              >
                <Typography variant="h6" sx={{ color: "text.primary", fontSize: { xs: "1rem", md: "1.1rem" }, fontWeight: 600 }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: { xs: "0.9rem", md: "1rem" }, lineHeight: 1.6 }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default FAQ;