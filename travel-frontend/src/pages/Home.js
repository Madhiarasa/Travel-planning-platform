import { useEffect, useState } from "react";
import TripForm from "../components/TripForm";
import { getTrips } from "../services/api";

export default function Home() {
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    const data = await getTrips();
    setTrips(data);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Get only the last trip
  const currentTrip = trips.length > 0 ? trips[trips.length - 1] : null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Trip Planner</h1>
      <TripForm onTripAdded={(newTrip) => setTrips([...trips, newTrip])} />

      <div className="mt-8">
        {currentTrip ? (
          <div className="border p-4 rounded shadow">
            <p>
              <strong>{currentTrip.origin}</strong> →{" "}
              <strong>{currentTrip.destination}</strong>
            </p>
            <p>Mode: {currentTrip.travelMode}</p>

            {currentTrip.itinerary && currentTrip.itinerary.length > 0 ? (
              currentTrip.itinerary.map((day) => (
                <div key={day.date} className="mt-2">
                  <p className="font-semibold">{day.date}</p>
                  {day.slots.map((slot, index) => (
                    <p key={index}>
                      {slot.time}: {slot.name} ({slot.type}) - {slot.address} [Rating: {slot.rating}]
                    </p>
                  ))}
                </div>
              ))
            ) : (
              <p>No itinerary generated yet.</p>
            )}
          </div>
        ) : (
          <p>No trips yet.</p>
        )}
      </div>
    </div>
  );
}
