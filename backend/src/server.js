/*Starts server
Connects Socket.io

👉 Used for:

Real-time order updates (VERY IMPORTANT)*/

require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// create server
const server = http.createServer(app);

// attach socket.io
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://uzzibites.vercel.app",
        "https://uzzi-bites.vercel.app",
        "https://uzzi-bites-admin.vercel.app",
        "https://uzzibites-admin.vercel.app"
      ];

      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith(".vercel.app") || 
                        origin.startsWith("http://localhost");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// make io accessible everywhere
app.set("io", io);

// socket connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

connectDB();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});