require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test route
app.get("/", (req, res) => {
  res.send("Smash Score Server!");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const matchRoutes = require("./routes/matchRoutes");
const userRoutes = require("./routes/UserRoutes");

app.use("/auth", authRoutes);
app.use("/matches", matchRoutes);
app.use("/users", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
