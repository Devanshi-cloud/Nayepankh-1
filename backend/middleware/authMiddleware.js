const jwt = require("jsonwebtoken");

// Authentication Middleware
const authMiddleware = function (req, res, next) {
  let token = req.header("Authorization");
  
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Remove 'Bearer ' prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Super Admin Middleware
const superAdminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "Super Admin") {
    return res.status(403).json({ msg: "Access denied: Super Admin only" });
  }
  next();
};

// Moderator Admin Middleware
const ModeratorAdminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Access denied: Moderator Admin only" });
  }
  next();
};

// Moderator View Middleware (allows Super Admin and Admin for view-only routes)
const moderatorViewMiddleware = (req, res, next) => {
  if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
    return res.status(403).json({ msg: "Access denied: Super Admin or Moderator only" });
  }
  next();
};

module.exports = {
  authMiddleware,
  superAdminMiddleware,
  ModeratorAdminMiddleware,
  moderatorViewMiddleware
};
