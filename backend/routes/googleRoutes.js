const express = require("express");
const axios = require("axios");

const router = express.Router();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const categoryMap = {
  Restaurants: "restaurant",
  Museums: "museum",
  Temples: "hindu_temple",
  Churches: "church",
  Mosques: "mosque",
  Parks: "park",
  Mountains: undefined // use keyword instead of type
};

router.get("/places", async (req, res) => {
  try {
    const { destination, preferences } = req.query;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    // 1️⃣ Geocode destination
    const geoRes = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      { params: { address: destination, key: GOOGLE_API_KEY } }
    );

    if (!geoRes.data.results.length) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const location = geoRes.data.results[0].geometry.location;

    // 2️⃣ Preferences
    const categories = preferences ? preferences.split(",") : ["Restaurants"];
    const placesByCategory = [];

    // 3️⃣ Query Places API
    for (const category of categories) {
      const type = categoryMap[category] || category.toLowerCase();

      // 🎯 Radius handling
      const radius = category === "Mountains" ? 50000 : 5000;

      const params = {
        location: `${location.lat},${location.lng}`,
        radius,
        key: GOOGLE_API_KEY
      };

      if (type) {
        params.type = type;
      } else if (category === "Mountains") {
        params.keyword = "mountain";
      }

      const placesRes = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        { params }
      );

      const sorted = (placesRes.data.results || [])
        .filter(p => p.rating)
        .sort((a, b) => b.rating - a.rating)

      placesByCategory.push({
        category,
        places: sorted.map(p => ({
          name: p.name,
          rating: p.rating,
          address: p.vicinity
        }))
      });
    }

    res.json(placesByCategory);
  } catch (err) {
    console.error("Google API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

module.exports = router;
