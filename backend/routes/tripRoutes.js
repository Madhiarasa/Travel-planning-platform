const express = require("express");
const {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
} = require("../controllers/tripController");

const router = express.Router();

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:id", getTripById);
router.delete("/:id", deleteTrip);

module.exports = router;
