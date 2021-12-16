const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

router.get("/", (req, res) => {
  res.send("Aqui serão as localizações");
});

module.exports = router;
