const express = require("express");
const router = express.Router();
const Tag = require("../models/Tags");

router.get("/", (req, res) => {
  res.send("Aqui serão as tags");
});

router.post("/createTag", (req, res) => {
  console.log(req.body);
});

module.exports = router;
