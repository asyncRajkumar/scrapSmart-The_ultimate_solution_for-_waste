const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/pickups", require("./routes/pickupRoutes"));
app.use(
  "/api/community",
  require("./routes/communityRoutes")
);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ScrapSmart Backend is running 🚀",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});