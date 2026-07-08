require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Define allowed origins (include preview deploys to avoid cross-origin blocks)
const allowedOrigins = [
  'https://naye-pankh-intern-portal.vercel.app',  // Main frontend
  'https://naye-pankh-intern-portal-ox93.vercel.app',  // Preview/backend
  'http://localhost:3000'  // Local dev (adjust port if needed)
];

// Global CORS pre-handler (runs before any middleware, handles all methods/paths)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers for all responses
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Fallback for non-matching origins
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight OPTIONS requests immediately (critical for /api/auth/signup POST)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Optional: Use cors package as fallback (after manual headers)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse JSON request bodies

// Connect to DB (use the updated async connectDB from previous response)
connectDB().catch(err => {
  console.error("Initial DB connection failed:", err.message);
  // Don't exit; log and continue (serverless will retry per invocation)
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/donate", require("./routes/donateRoutes"));
app.use("/api/donations", require("./routes/donationsRoutes"));
app.use("/api/campaign", require("./routes/campaignRoutes"));

// Error handling middleware (ensure CORS headers on errors)
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.get("/", (req, res) => {
  res.send("Server is healthy");
});

// For Vercel serverless, export as module (required for proper invocation)
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening locally on port ${PORT}`);
  });
}
