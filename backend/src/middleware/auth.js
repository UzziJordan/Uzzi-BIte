/*Controls who can access what

verifyToken → checks if user is logged in
isAdmin → only admin can access
isTable → only table users (customers) */

const jwt = require("jsonwebtoken");

// VERIFY TOKEN
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(401).json({ message: "Invalid token" });
  }
};

// ADMIN CHECK
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// TABLE CHECK
exports.isTable = (req, res, next) => {
  if (!req.user || req.user.role !== "table") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};