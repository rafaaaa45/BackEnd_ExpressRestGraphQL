const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/createLocation", async (req, res) => {
  const location = new Location({
    location: req.body.location,
  });

  try {
    const createdLocation = await location.save();
    res.json(createdLocation);
  } catch (err) {
    res.json(err);
  }
});
module.exports = router;
