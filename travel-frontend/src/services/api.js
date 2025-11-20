import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // http://localhost:5000/api

export const getTrips = async () => {
  const res = await axios.get(`${API_URL}/trips`);
  return res.data;
};

export const createTrip = async (tripData) => {
  const res = await axios.post(`${API_URL}/trips`, tripData);
  return res.data;
};

export const generateItinerary = async (tripData) => {
  const res = await axios.post(`${API_URL}/itinerary`, tripData);
  return res.data;
};

export const getHighRatedPlaces = async (destination, preferences) => {
  const res = await axios.get(`${API_URL}/google/places`, {
    params: {
      destination,
      preferences: preferences.join(","),
    },
  });
  return res.data;
};
