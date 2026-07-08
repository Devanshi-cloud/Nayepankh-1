import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import backgroundImage from '../assets/NGO-bgimg.avif'; // Assuming this image is suitable

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: `calc(${theme.spacing(4)} + ${theme.mixins.toolbar.minHeight}px)`,
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    marginTop: `calc(${theme.spacing(4)} + 64px)`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginTop: `calc(${theme.spacing(2)} + 56px)`,
  },
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const PrivacyPolicy = () => {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          height: '100vh', // Adjust height as needed
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
          },
        }}
      >
        <Typography variant="h2" component="h1" sx={{ 
          zIndex: 1, 
          fontWeight: 'bold',
          fontSize: { xs: '2.5rem', md: '4rem' },
          textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
        }}>
          OUR PRIVACY POLICY
        </Typography>
      </Box>
      <Container maxWidth="lg">
        <StyledPaper elevation={3}>
          {/* <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            [theme => theme.breakpoints.down('sm')]: {
              fontSize: '2rem',
            }
          }}>
            Privacy Policy
          </Typography> */}

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              1. Introduction
            </Typography>
            <Typography paragraph>
              At NayePankh Foundation, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services.
            </Typography>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              2. Information We Collect
            </Typography>
            <Typography paragraph>
              We collect information that you provide directly to us, including:
            </Typography>
            <ul>
              <li>Name and contact information</li>
              <li>Donation details and payment information</li>
              <li>Communication preferences</li>
              <li>Volunteer information</li>
              <li>Event registration details</li>
            </ul>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              3. How We Use Your Information
            </Typography>
            <Typography paragraph>
              We use the collected information for various purposes:
            </Typography>
            <ul>
              <li>Processing donations and maintaining donation records</li>
              <li>Sending newsletters and updates about our work</li>
              <li>Responding to your inquiries and requests</li>
              <li>Managing volunteer programs</li>
              <li>Improving our website and services</li>
              <li>Complying with legal obligations</li>
            </ul>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              4. Information Sharing and Disclosure
            </Typography>
            <Typography paragraph>
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </Typography>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
              <li>Partners with your explicit consent</li>
            </ul>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              5. Data Security
            </Typography>
            <Typography paragraph>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </Typography>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              6. Your Rights
            </Typography>
            <Typography paragraph>
              You have the right to:
            </Typography>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              7. Cookies and Tracking
            </Typography>
            <Typography paragraph>
              We use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences.
            </Typography>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              8. Children's Privacy
            </Typography>
            <Typography paragraph>
              Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </Typography>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              9. Changes to Privacy Policy
            </Typography>
            <Typography paragraph>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </Typography>
          </Section>

          <Section>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
              10. Contact Us
            </Typography>
            <Typography paragraph>
              If you have any questions about this Privacy Policy, please contact us at:
            </Typography>
            <Typography>
              Email: president@nayepankh.com<br />
              Phone: +91- 8318500748<br />
              Address: Kanpur, Ghaziabad, India
            </Typography>
          </Section>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Last Updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </StyledPaper>
      </Container>
    </>
  );
};

export default PrivacyPolicy; 