const express = require("express");
const router = express.Router();
const Utilizador = require("../models/Utilizador");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
//endpoint de login

//endpoint criar user
router.post("/createUtilizador", async (req, res) => {
  let email = req.body.email;

  //encriptar User PW
  let hashedPassword = crypto
    .createHash("sha512")
    .update(req.body.password)
    .digest("hex");

  //jwt tokens
  const token = jwt.sign({ email: email }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });

  console.log(token);

  const newUtilizador = new Utilizador({
    email: email,
    password: hashedPassword,
    token: token,
  });

  try {
    const createdUtilizador = await newUtilizador.save();
    res.json(createdUtilizador);
  } catch (err) {
    if (
      typeof err.keyPattern.email !== "undefined" &&
      err.keyPattern.email === 1
    ) {
      res.json("Insira um email válido, esse email já foi usado!");
    } else {
      res.json(err);
    }
  }
});

module.exports = router;
