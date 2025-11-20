import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createItinerary = async (tripData) => {
  const response = await axios.post(`${API_URL}/itinerary`, tripData);
  return response.data;
};
