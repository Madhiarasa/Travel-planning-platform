const axios = require("axios");
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// 1️⃣ Get coordinates (Geocoding API)
async function getCoordinates(address) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: GOOGLE_API_KEY
        }
      }
    );

    if (
      response.data.status === "OK" &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      return response.data.results[0].geometry.location; // { lat, lng }
    } else {
      console.error("Geocoding error:", response.data);
      return null;
    }
  } catch (err) {
    console.error("Geocoding failed:", err.response?.data || err.message);
    return null;
  }
}

// 2️⃣ Get route (Directions API)
async function getRoute(origin, destination, mode = "driving") {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin,
          destination,
          mode,
          key: GOOGLE_API_KEY
        }
      }
    );

    if (
      response.data.status === "OK" &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      return response.data.routes[0]; // first route
    } else {
      console.error("Directions error:", response.data);
      return null;
    }
  } catch (err) {
    console.error("Directions failed:", err.response?.data || err.message);
    return null;
  }
}

// 3️⃣ Get nearby places (Places API)
async function getNearbyPlaces(location, type) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 5000,
          type,
          key: GOOGLE_API_KEY
        }
      }
    );

    if (response.data.results) {
      return response.data.results;
    } else {
      console.error("Places error:", response.data);
      return [];
    }
  } catch (err) {
    console.error("Places failed:", err.response?.data || err.message);
    return [];
  }
}

module.exports = {
  getCoordinates,
  getRoute,
  getNearbyPlaces
};
