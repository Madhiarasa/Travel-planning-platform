const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");

const tripRoutes = require("./routes/tripRoutes");
const googleRoutes = require("./routes/googleRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes"); // your Google API routes

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/test", (req, res) => res.send("Test route working!"));

// API routes
app.use("/api/trips", tripRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/itinerary", itineraryRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
