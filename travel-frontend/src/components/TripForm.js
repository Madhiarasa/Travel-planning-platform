import { useState } from "react";
import { createTrip, getHighRatedPlaces } from "../services/api";

// ✅ PlaceAutocomplete component for Google Places search (type-ahead)
function PlaceAutocomplete({ value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    onChange(input);

    if (!input || !window.google) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input,
        types: ["geocode"],          // only addresses
        componentRestrictions: { country: "in" } // optional: restrict to India
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Only suggestions that START with the typed input
          const filtered = predictions.filter(p =>
            p.description.toLowerCase().startsWith(input.toLowerCase())
          );
          setSuggestions(filtered);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handleSelect = (place) => {
    onChange(place.description);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border p-2 w-full"
        required
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 z-10 max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onClick={() => handleSelect(s)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TripForm({ onTripAdded }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelMode, setTravelMode] = useState("");
  const [preference, setPreference] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itinerary, setItinerary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tripData = {
      origin,
      destination,
      travelMode,
      preferences: preference ? [preference] : [],
      startDate,
      endDate,
    };

    const newTrip = await createTrip(tripData);
    onTripAdded(newTrip);

    if (destination && preference) {
      const highRated = await getHighRatedPlaces(destination, [preference]);
      const allPlaces = highRated.flatMap(cat => cat.places);

      const start = new Date(startDate);
      const end = new Date(endDate);
      const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      let itineraryDays = [];

      for (let d = 0; d < dayCount; d++) {
        const dayDate = new Date(start);
        dayDate.setDate(start.getDate() + d);

        let slots = [];
        for (let s = 0; s < 3; s++) {
          const place = allPlaces[(d * 3 + s) % allPlaces.length];
          slots.push({
            time: s === 0 ? "Morning" : s === 1 ? "Afternoon" : "Evening",
            name: place.name,
            address: Array.isArray(place.address)
              ? place.address.join(", ")
              : place.address,
            rating: place.rating,
          });
        }

        itineraryDays.push({
          date: dayDate.toISOString().split("T")[0],
          schedule: slots,
        });
      }

      setItinerary({
        origin,
        destination,
        travelMode,
        itinerary: itineraryDays,
      });
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Google Autocomplete Inputs */}
        <PlaceAutocomplete value={origin} onChange={setOrigin} placeholder="Origin" />
        <PlaceAutocomplete value={destination} onChange={setDestination} placeholder="Destination" />

        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Mode of Travel</option>
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="walking">Walking</option>
        </select>

        <select
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Preference</option>
          <option value="Restaurants">Restaurants</option>
          <option value="Museums">Museums</option>
          <option value="Parks">Parks</option>
          <option value="Temples">Temples</option>
          <option value="Mountains">Mountains</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Trip & Generate Itinerary
        </button>
      </form>

      {/* Display Generated Itinerary */}
      {itinerary && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold">Generated Itinerary</h2>
          <p>{itinerary.origin} → {itinerary.destination}</p>
          <p>Mode: {itinerary.travelMode}</p>

          {itinerary.itinerary.map((day, idx) => (
            <div key={idx} className="mt-4">
              <h3 className="font-semibold">{new Date(day.date).toLocaleDateString()}</h3>
              <div className="space-y-6 mt-2">
                {day.schedule.map((s, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-2 text-right pr-2">
                      <p className="text-sm font-medium text-gray-600">{s.time}</p>
                    </div>
                    <div className="col-span-10 p-4 border rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition">
                      <p className="font-bold text-gray-800">{s.name}</p>
                      <p className="text-sm text-gray-600 break-words">{s.address}</p>
                      <p className="text-xs text-yellow-600 mt-1">⭐ {s.rating || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
