const express = require("express");
const router = express.Router();

router.get("/localizacoes", (req, res) => {
  res.send("Aqui serão as localizações");
});

module.exports = router;
