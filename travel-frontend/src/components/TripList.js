export default function TripList({ trips }) {
  return (
    <div className="mt-6 space-y-8">
      {trips
        .filter(trip => trip.itinerary && trip.itinerary.length > 0)
        .map(trip => (
          <div key={trip._id} className="border p-6 rounded-xl shadow bg-white">
            <h2 className="text-xl font-bold text-blue-700 mb-2">{trip.origin} → {trip.destination}</h2>
            <p className="text-gray-500 mb-6">Mode: {trip.travelMode}</p>

            {trip.itinerary.map(day => (
              <div key={day.date} className="mb-8">
                <p className="font-semibold text-gray-600 mb-4">{new Date(day.date).toLocaleDateString()}</p>
                <div className="space-y-6">
                  {day.schedule.map((s, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-2 text-right pr-2">
                        <p className="text-sm font-medium text-gray-600">{s.time}</p>
                      </div>
                      <div className="col-span-10 p-4 border rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition">
                        <p className="font-bold text-gray-800">{s.name}</p>
                        <p className="text-sm text-gray-600">{s.address}</p>
                        <p className="text-xs text-yellow-600 mt-1">⭐ {s.rating || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
