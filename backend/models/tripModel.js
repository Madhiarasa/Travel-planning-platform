const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    travelMode: {
      type: String,
      enum: ["car", "bus", "train", "flight", "walk"],
      required: true,
    },
    preferences: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    itinerary: { type: Array, default: [] }, // for storing generated itinerary
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
