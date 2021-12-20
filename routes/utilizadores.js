const express = require("express");
const router = express.Router();
const Utilizador = require("../models/Utilizador");

//endpoint de login

//endpoint criar user
router.post("/createUtilizador", async (req, res) => {
  //encriptar User PW

  const utilizador = new Utilizador({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const createdUtilizador = await utilizador.save();
    res.json(createdUtilizador);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
