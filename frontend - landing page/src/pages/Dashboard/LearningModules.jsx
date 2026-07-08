import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const theme = createTheme({
  palette: {
    primary: { main: "#216eb6" },
    secondary: { main: "#42A5F5" },
    background: { default: "#E3F2FD" },
    text: { primary: "#263238", secondary: "#546E7A" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    body1: { fontWeight: 400 },
  },
});

const chapters = [
  {
    id: 1,
    title: "Chapter 1: How does Crowdfunding Work in 2025",
    info: "Explore how crowdfunding can transform ideas into action and empower communities to create change.",
    video: {
      title: "How crowdfunding is changing the world | Simon Sinek",
      url: "https://www.youtube.com/embed/8-EyxMuvE9A", // Updated link
    },
    quiz: [
      {
        question: "According to the speaker, what are the three main obstacles that prevent people from turning their ideas into reality?",
        options: [
          "A) Lack of time, lack of resources, and lack of motivation.",
          "B) Complexity, money, and uncertainty.",
          "C) Fear of failure, lack of support, and lack of creativity.",
          "D) Lack of education, lack of experience, and lack of connections.",
        ],
        correctAnswer: "B",
      },
      {
        question: "What is the speaker's main argument for using crowdfunding to make ideas a reality?",
        options: [
          "A) Crowdfunding is a quick and easy way to get rich.",
          "B) Crowdfunding is a way to avoid taking risks.",
          "C) Crowdfunding allows people to test their ideas and get feedback from potential customers.",
          "D) Crowdfunding is a way to get government funding for new businesses.",
        ],
        correctAnswer: "C",
      },
      {
        question: "What example does the speaker use to illustrate the power of crowdfunding to overcome uncertainty?",
        options: [
          "A) The speaker's own experience of successfully crowdfunding a business.",
          "B) The story of a successful entrepreneur who used crowdfunding to launch a new product.",
          "C) The example of Greg's food truck idea, where the audience's support demonstrates potential customer interest.",
          "D) The speaker's argument that crowdfunding is a way to avoid taking risks.",
        ],
        correctAnswer: "C",
      },
    ],
  },
  {
    id: 2,
    title: "Chapter 2: Building a Community for Impact",
    info: "Learn strategies to engage and grow a community that supports your mission.",
    video: {
      title: "The art of asking | Amanda Palmer",
      url: "https://www.youtube.com/embed/5YtGJKbhUoQ", // Updated link
    },
  },
  {
    id: 3,
    title: "Chapter 3: Storytelling for Social Good",
    info: "Understand the importance of storytelling in connecting with donors and supporters.",
    video: {
      title: "The power of vulnerability | Brené Brown",
      url: "https://www.youtube.com/embed/iCvmsMzlF7o",
    },
  },
  {
    id: 4,
    title: "Chapter 4: Scaling Your Vision",
    info: "Discover how to expand your crowdfunding efforts and sustain long-term impact.",
    video: {
      title: "How great leaders inspire action | Simon Sinek",
      url: "https://www.youtube.com/embed/qp0HIF3SfI4",
    },
  },
  {
    id: 5,
    title: "Chapter 5: Learning from Rejections",
    info: "See how rejections make a good impact that can reshape your future and your perspective.",
    video: {
      title: "The power of collective compassion | Krista Tippett",
      url: "https://www.youtube.com/embed/-vZXgApsPCQ",
    },
  },
];

function LearningModules() {
  const [expanded, setExpanded] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [scores, setScores] = useState(() => {
    const savedScores = localStorage.getItem("quizScores");
    return savedScores ? JSON.parse(savedScores) : {};
  });

  useEffect(() => {
    localStorage.setItem("quizScores", JSON.stringify(scores));
  }, [scores]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleQuizOpen = () => setQuizOpen(true);
  const handleQuizClose = () => {
    setQuizOpen(false);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const handleQuizChange = (questionIndex, value) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleQuizSubmit = (chapterId) => {
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (!chapter.quiz) return;

    let score = 0;
    chapter.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) score += 1;
    });

    const totalQuestions = chapter.quiz.length;
    const percentageScore = (score / totalQuestions) * 100;
    setQuizScore(percentageScore);
    setScores((prev) => ({
      ...prev,
      [chapterId]: percentageScore,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 4, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "primary.main",
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 700,
                mb: 2,
                letterSpacing: "1px",
              }}
            >
              Take one step at a time
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                color: "secondary.main",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 600,
                mb: 3,
              }}
            >
              Let’s Start the Journey
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
                maxWidth: "600px",
              }}
            >
              These are some carefully curated videos to guide you on your journey with NayePankh Foundation. Dive into the world of crowdfunding, community building, and social impact. Each step you take helps us grow stronger and makes the world a better place, one community at a time.
            </Typography>
          </Box>

          <Box>
            {chapters.map((chapter) => (
              <Accordion
                key={chapter.id}
                expanded={expanded === `panel${chapter.id}`}
                onChange={handleAccordionChange(`panel${chapter.id}`)}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
                  bgcolor: "#FFFFFF",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                  sx={{
                    bgcolor: "#FFFFFF",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    "& .MuiAccordionSummary-content": { m: 0 },
                    py: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      color: "primary.main",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      fontWeight: 600,
                    }}
                  >
                    {chapter.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {chapter.info}
                  </Typography>
                  <Box
                    sx={{
                      position: "relative",
                      width: { xs: "100%", sm: "560px" },
                      height: { xs: "200px", sm: "315px" },
                      mb: 3,
                    }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      src={chapter.video.url}
                      title={chapter.video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: "8px", boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.primary",
                      fontSize: { xs: "0.85rem", md: "0.9rem" },
                      mt: 1,
                      display: "block",
                    }}
                  >
                    {chapter.video.title}
                  </Typography>

                  {chapter.id === 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleQuizOpen}
                      sx={{ mt: 2, borderRadius: 20, px: 3, py: 1 }}
                    >
                      Test Your Understanding
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Quiz Popup */}
          <Dialog open={quizOpen} onClose={handleQuizClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white", textAlign: "center", fontWeight: 600 }}>
              Test Your Understanding - Chapter 1
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              {chapters[0].quiz.map((q, index) => (
                <FormControl component="fieldset" key={index} sx={{ mb: 3 }}>
                  <FormLabel component="legend" sx={{ color: "text.primary", fontWeight: 500, mb: 1 }}>
                    {q.question}
                  </FormLabel>
                  <RadioGroup
                    value={quizAnswers[index] || ""}
                    onChange={(e) => handleQuizChange(index, e.target.value)}
                  >
                    {q.options.map((option, i) => (
                      <FormControlLabel
                        key={i}
                        value={option.charAt(0)}
                        control={<Radio color="primary" />}
                        label={option}
                        sx={{ color: "text.secondary" }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
              {quizScore !== null && (
                <Typography sx={{ mt: 2, color: "primary.main" }}>
                  Your Score: {quizScore.toFixed(2)}% (Stored: {scores[1]?.toFixed(2) || "N/A"}%)
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleQuizClose}
                sx={{ borderRadius: 20, px: 3 }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleQuizSubmit(1)}
                sx={{ borderRadius: 20, px: 3 }}
              >
                Submit Quiz
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default LearningModules;