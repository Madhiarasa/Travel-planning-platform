const { getCoordinates, getNearbyPlaces, getRoute } = require("../services/googleService");

exports.generateItinerary = async (req, res) => {
  try {
    let { origin, destination, travelMode, preferences, startDate, endDate } = req.body;

    // Normalize travel mode
    if (travelMode.toLowerCase() === "car") {
      travelMode = "driving";
    }

    // 1️⃣ Get coordinates
    const originCoords = await getCoordinates(origin);
    const destCoords = await getCoordinates(destination);

    if (!originCoords || !destCoords) {
      return res.status(400).json({ error: "Invalid origin or destination" });
    }

    // 2️⃣ Get route details safely
    let route = null;
    try {
      route = await getRoute(origin, destination, travelMode);
    } catch (e) {
      console.error("Route fetch failed:", e.response?.data || e.message);
    }

    // 3️⃣ Collect itinerary items
    const originPlans = [];
    const destPlans = [];

    if (Array.isArray(preferences)) {
      for (let pref of preferences) {
        const type = pref.toLowerCase();

        let placesNearOrigin = [];
        let placesNearDest = [];

        try {
          placesNearOrigin = await getNearbyPlaces(originCoords, type);
          placesNearDest = await getNearbyPlaces(destCoords, type);
        } catch (e) {
          console.error(`Places fetch failed for ${pref}:`, e.response?.data || e.message);
        }

        if (placesNearOrigin.length > 0) {
          originPlans.push(
            `${pref}: ${placesNearOrigin[0].name} - ${placesNearOrigin[0].vicinity} [Rating: ${placesNearOrigin[0].rating || "N/A"}]`
          );
        }
        if (placesNearDest.length > 0) {
          destPlans.push(
            `${pref}: ${placesNearDest[0].name} - ${placesNearDest[0].vicinity} [Rating: ${placesNearDest[0].rating || "N/A"}]`
          );
        }
      }
    }

    // 4️⃣ Build itinerary
    const itinerary = [
      { date: startDate, plan: originPlans },
      { date: endDate, plan: destPlans }
    ];

    res.json({
      origin,
      destination,
      travelMode,
      routeSummary: route?.summary || "No route available",
      itinerary
    });

  } catch (err) {
    console.error("Itinerary Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
};
