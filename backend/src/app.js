const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mealRoutes = require("./routes/meal.routes");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Logging
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per window
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://uzzibites.vercel.app",
  "https://uzzi-bites.vercel.app",
  "https://uzzi-bites-admin.vercel.app",
  "https://uzzibites-admin.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow local development and any vercel deployment
    if (!origin || 
        origin.startsWith("http://localhost") || 
        origin.endsWith(".vercel.app") || 
        origin.includes("uzzibites")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON format. Please use double quotes and check for trailing commas." });
  }
  next();
});

//Middleware for routes
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;