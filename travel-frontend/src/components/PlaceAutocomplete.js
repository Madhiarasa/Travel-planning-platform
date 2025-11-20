import { useState } from "react";

export default function PlaceAutocomplete({ value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    onChange(input);

    if (!input || !window.google) {
      setSuggestions([]);
      return;
    }

    // Google Places AutocompleteService
    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input, 
        types: ["geocode"], // restrict to addresses
        componentRestrictions: { country: "in" } // optional, restrict to India
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Only suggestions that START with the input
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
