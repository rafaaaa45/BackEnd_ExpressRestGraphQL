const express = require("express");
const router = express.Router();
const Utilizador = require("../models/Utilizador");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

//endpoint de login

//endpoint criar user
router.post(
  "/createUtilizador",
  auth.verifyToken,
  auth.verifyAdmin,
  async (req, res) => {
    const { email, tipo } = req.body;

    //encriptar User PW
    let hashedPassword = utils.encryptSha512(req.body.password);

    const newUtilizador = new Utilizador({
      email: email,
      password: hashedPassword,
      tipo: tipo,
    });

    if (utils.isValidTipo(tipo) === false) {
      return res.send("Insira um tipo Válido ( user | edit | admin )!");
    }

    try {
      const createdUtilizador = await newUtilizador.save();

      //jwt tokens(criar aqui para ter acesso ao id)
      createdUtilizador.token = utils.createJWT(
        createdUtilizador._id,
        email,
        tipo
      );

      res.json(createdUtilizador);
    } catch (err) {
      if (err.code === 11000) {
        res.json("Insira um email válido, esse email já foi usado!");
      } else {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      }
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Todos os campos são obrigatórios");
    }

    const user = await Utilizador.findOne({ email });

    if (user && utils.encryptSha512(password) === user.password) {
      // Create token
      const token = utils.createJWT(user._id, user.email, user.tipo);

      // save user token
      user.token = token;

      const updatedUser = await user.save();
      // user
      res.json(updatedUser);
    } else {
      res.send("Email ou Password incorreta!");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
