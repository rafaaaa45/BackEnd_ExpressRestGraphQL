const express = require("express");
const router = express.Router();
const Utilizador = require("../models/Utilizador");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

//get all users
router.get("/", auth.verifyToken, auth.verifyAdmin, async (req, res) => {
  await Utilizador.find()
    .then((result) => {
      res.json({ isSuccess: true, data: result });
    })
    .catch((err) => {
      res.json({ isSuccess: false, data: "Ocorreu um erro" });
    });
});

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
    } catch (error) {
      let data = error.message;
      res.json({ isSuccess: false, data });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Todos os campos são obrigatórios");
    }

    const user = await Utilizador.findOne({ email: email });

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

//change Password(Insert old and new password)
router.put(
  "/updateUser",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;
    const { oldPassword, newPassword } = req.body;

    if (!newPassword) {
      res.json({
        isSuccess: false,
        data: "Nova Password não pode ser null",
      });
    }

    let utilizador = await Utilizador.findById(id);

    if (!utilizador) {
      res.json({
        isSuccess: false,
        data: "Utilizador que procurou não existe",
      });
    }

    if (utilizador.password === utils.encryptSha512(oldPassword)) {
      newPasswordEncrypted = utils.encryptSha512(newPassword);
      utilizador.password = newPasswordEncrypted;

      utilizador
        .save()
        .then(() => {
          res.json({ isSuccess: true, data: "Password alterada com sucesso!" });
        })
        .catch((error) => {
          let data = error.message;
          res.json({ isSuccess: false, data });
        });
    }
  }
);

router.delete(
  "/deleteUser",
  auth.verifyToken,
  auth.verifyAdmin_Edit,
  async (req, res) => {
    const id = req.query.id;

    await Utilizador.deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.json({ isSuccess: true, data: "Apagado Com Sucesso" });
        } else {
          res.json({ isSuccess: false, data: "Utilizador não existe" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ isSuccess: false, data: "Ocorreu um erro" });
      });
  }
);

module.exports = router;
