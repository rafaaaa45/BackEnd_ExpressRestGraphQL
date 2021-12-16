const express = require("express");
const router = express.Router();

router.get("/tags", (req, res) => {
  res.send("Aqui serão as tags");
});

module.exports = router;
